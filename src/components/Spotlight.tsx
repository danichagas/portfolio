import { useEffect, useRef } from 'react';

export function Spotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = spotlightRef.current;
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      element.style.setProperty('--spotlight-x', `${event.clientX}px`);
      element.style.setProperty('--spotlight-y', `${event.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background:
          'radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 15%), rgba(29, 78, 216, 0.15), transparent 80%)',
      }}
    />
  );
}
