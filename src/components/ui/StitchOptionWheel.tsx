import { useRef, useState, useEffect } from 'react';

interface StitchOptionWheelProps {
  items: string[];
  defaultSelected?: number;
  onChange?: (index: number, item: string) => void;
  height?: number;
  itemHeight?: number;
}

export default function StitchOptionWheel({
  items,
  defaultSelected = 0,
  onChange,
  height = 300,
  itemHeight = 60,
}: StitchOptionWheelProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(defaultSelected);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const update3DEffect = () => {
      const scrollTop = viewport.scrollTop;
      const containerCenter = scrollTop + height / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const itemTop = index * itemHeight + (height - itemHeight) / 2;
        const itemCenter = itemTop + itemHeight / 2;
        const distance = itemCenter - containerCenter;
        const normalizedDistance = distance / (height / 2);

        if (Math.abs(distance) < minDistance) {
          minDistance = Math.abs(distance);
          closestIndex = index;
        }

        if (Math.abs(normalizedDistance) > 1.2) {
          item.style.opacity = '0';
          item.style.visibility = 'hidden';
          return;
        } else {
          item.style.visibility = 'visible';
        }

        const angle = normalizedDistance * 60;
        const zOffset = (1 - Math.cos((normalizedDistance * Math.PI) / 2.5)) * -200;
        const scale = Math.max(0, 1 - Math.abs(normalizedDistance) * 0.25);
        const opacity = Math.max(0, 1 - Math.abs(normalizedDistance) * 0.75);
        const blur = Math.abs(normalizedDistance) * 4;

        item.style.transform = `rotateX(${-angle}deg) translateZ(${zOffset}px) scale(${scale})`;
        item.style.opacity = opacity.toString();
        item.style.filter = `blur(${blur}px)`;
        
        if (Math.abs(normalizedDistance) < 0.25) {
          item.classList.add('text-teal-500');
          item.classList.remove('text-slate-500');
          item.style.textShadow = '0 0 15px rgba(20, 184, 166, 0.4)';
        } else {
          item.classList.remove('text-teal-500');
          item.classList.add('text-slate-500');
          item.style.textShadow = 'none';
        }
      });

      if (activeIndex !== closestIndex) {
        setActiveIndex(closestIndex);
        onChange?.(closestIndex, items[closestIndex]);
      }
    };

    viewport.addEventListener('scroll', update3DEffect);
    
    // Initial call
    update3DEffect();

    return () => {
      viewport.removeEventListener('scroll', update3DEffect);
    };
  }, [height, itemHeight, items, activeIndex, onChange]);

  useEffect(() => {
    // Scroll to default selected
    if (viewportRef.current) {
      viewportRef.current.scrollTop = defaultSelected * itemHeight;
    }
  }, [defaultSelected, itemHeight]);

  const handleItemClick = (index: number) => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        height: `${height}px`,
        perspective: '1200px',
        maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
      }}
    >
      {/* Center Indicator */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 border-y border-teal-500/20 pointer-events-none z-10"
        style={{
          height: `${itemHeight}px`,
          background: 'linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.03), transparent)',
        }}
      />

      <div
        ref={viewportRef}
        className="h-full w-full overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingTop: `calc((${height}px - ${itemHeight}px) / 2)`,
          paddingBottom: `calc((${height}px - ${itemHeight}px) / 2)`,
        }}
      >
        <style>{`
          .h-full::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div
          className="w-full flex flex-col items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              onClick={() => handleItemClick(index)}
              className="w-full flex items-center justify-center cursor-pointer select-none transition-colors duration-300 font-bold text-xl"
              style={{
                height: `${itemHeight}px`,
                scrollSnapAlign: 'center',
                transformStyle: 'preserve-3d',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
