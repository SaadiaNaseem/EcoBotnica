import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export function RevealOnScroll({ children, idx = 0, className }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition duration-500 ease-out transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className
      )}
      style={{ transitionDelay: `${Math.min(idx * 75, 400)}ms` }}
    >
      {children}
    </div>
  );
}
