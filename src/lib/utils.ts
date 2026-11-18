import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { BookingStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getStatusBadgeClass(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    pending: "badge-pending",
    accepted: "badge-accepted",
    inProgress: "badge-inProgress",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
    rejected: "badge-rejected",
  };
  return map[status] ?? "badge-pending";
}

export function getStatusLabel(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    pending: "Pending",
    accepted: "Accepted",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };
  return map[status] ?? status;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const CATEGORY_COLORS: Record<string, string> = {
  Plumbing: "gradient-card-blue",
  Electrical: "gradient-card-yellow",
  Cleaning: "gradient-card-teal",
  Carpentry: "gradient-card-orange",
  Painting: "gradient-card-purple",
  "AC Repair": "gradient-card-cyan",
  "Appliance Repair": "gradient-card-indigo",
  "Salon at Home": "gradient-card-rose",
  "Pest Control": "gradient-card-green",
  "Security Cameras": "gradient-card-indigo",
};

export const CATEGORY_ICONS: Record<string, string> = {
  Plumbing: "🔧",
  Electrical: "⚡",
  Cleaning: "🧹",
  Carpentry: "🪵",
  Painting: "🎨",
  "AC Repair": "❄️",
  "Appliance Repair": "🔌",
  "Salon at Home": "💇",
  "Pest Control": "🦟",
  "Security Cameras": "📷",
};
