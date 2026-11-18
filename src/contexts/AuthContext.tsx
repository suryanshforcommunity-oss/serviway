import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserRole>;
  signInWithGoogle: (role?: UserRole) => Promise<UserRole>;
  loginAsDemo: (role?: UserRole) => User;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper to prevent Firestore from hanging indefinitely if it's not configured
const withTimeout = <T,>(promise: Promise<T>, ms: number = 3000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), ms))
  ]);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('serviway_demo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "provider") {
      localStorage.setItem('latestProviderName', user.name);
    }
  }, [user]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const docRef = doc(db, "users", fbUser.uid);
          const snap = await withTimeout(getDoc(docRef));
          if (snap.exists()) {
            setUser({ uid: fbUser.uid, ...snap.data() } as User);
          } else {
            const demo = localStorage.getItem('serviway_demo_user');
            if (demo) {
              setUser(JSON.parse(demo));
            } else {
              setUser({
                uid: fbUser.uid,
                name: fbUser.displayName || "User",
                email: fbUser.email || "",
                role: "seeker",
                createdAt: new Date()
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch user doc from Firestore:", error);
          const demo = localStorage.getItem('serviway_demo_user');
          if (demo) {
            setUser(JSON.parse(demo));
          } else {
            setUser({
              uid: fbUser.uid,
              name: fbUser.displayName || "User",
              email: fbUser.email || "",
              role: "seeker",
              createdAt: new Date()
            });
          }
        }
      } else {
        const demo = localStorage.getItem('serviway_demo_user');
        if (demo) {
          try {
            setUser(JSON.parse(demo));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const loginAsDemo = (role: UserRole = "provider"): User => {
    const demoData: User = role === "provider" ? {
      uid: "mock_p1",
      name: "Rajesh Kumar (Pro Master)",
      email: "rajesh.kumar@serviway.com",
      phone: "+91 98765 43210",
      role: "provider",
      createdAt: new Date(),
      photoUrl: ""
    } : role === "admin" ? {
      uid: "admin_demo_1",
      name: "Admin Officer",
      email: "admin@serviway.com",
      role: "admin",
      createdAt: new Date()
    } : {
      uid: "seeker_demo_1",
      name: "Priya Sharma",
      email: "priya@example.com",
      role: "seeker",
      createdAt: new Date()
    };
    setUser(demoData);
    localStorage.setItem('serviway_demo_user', JSON.stringify(demoData));
    if (role === "provider") {
      localStorage.setItem('latestProviderName', demoData.name);
    }
    return demoData;
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      await withTimeout((async () => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        const userData: Omit<User, "uid"> = {
          name,
          email,
          role,
          createdAt: new Date(),
        };
        try {
          await withTimeout(setDoc(doc(db, "users", cred.user.uid), {
            ...userData,
            createdAt: serverTimestamp(),
          }));
        } catch (e) {
          console.warn("Could not save to Firestore:", e);
        }
        setUser({ uid: cred.user.uid, ...userData });
      })(), 10000); // 10 second absolute timeout for everything
    } catch (error: any) {
      if (error.message === "Firestore timeout") {
        throw new Error("Firebase Authentication is hanging. Please try using a normal browser window (disable adblockers/strict privacy shields) or check your connection.");
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<UserRole> => {
    const cred = await withTimeout(signInWithEmailAndPassword(auth, email, password), 10000);
    try {
      const docRef = doc(db, "users", cred.user.uid);
      const snap = await withTimeout(getDoc(docRef), 3000);
      if (snap.exists()) {
        const u = { uid: cred.user.uid, ...snap.data() } as User;
        setUser(u);
        if (u.role === "provider") {
          localStorage.setItem('latestProviderName', u.name);
        }
        return u.role;
      }
    } catch (e) {
      console.warn("Could not fetch user doc in signIn", e);
    }
    return "seeker";
  };

  const signInWithGoogle = async (role: UserRole = "seeker"): Promise<UserRole> => {
    const provider = new GoogleAuthProvider();
    let detectedRole: UserRole = role;
    await withTimeout((async () => {
      const cred = await signInWithPopup(auth, provider);
      try {
        const docRef = doc(db, "users", cred.user.uid);
        const snap = await withTimeout(getDoc(docRef));
        if (!snap.exists()) {
          await withTimeout(setDoc(docRef, {
            name: cred.user.displayName ?? "User",
            email: cred.user.email ?? "",
            role,
            photoUrl: cred.user.photoURL ?? "",
            createdAt: serverTimestamp(),
          }));
          detectedRole = role;
        } else {
          detectedRole = (snap.data().role as UserRole) || role;
        }
      } catch (e) {
        console.warn("Could not sync Google user with Firestore:", e);
      }
    })(), 15000);
    return detectedRole;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error", e);
    }
    localStorage.removeItem('serviway_demo_user');
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signUp, signIn, signInWithGoogle, loginAsDemo, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
