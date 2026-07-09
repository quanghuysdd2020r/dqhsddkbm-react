import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: "none" | "short" | "medium";
  variant?: "up" | "left" | "right" | "pop";
};

const delayClasses = {
  none: "",
  short: "delay-150",
  medium: "delay-300",
};

const hiddenClasses = {
  up: "translate-y-8 scale-100",
  left: "-translate-x-8 translate-y-0 scale-100",
  right: "translate-x-8 translate-y-0 scale-100",
  pop: "translate-y-8 scale-[0.96]",
};

export default function ScrollReveal({
  children,
  className = "",
  delay = "none",
  variant = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.28,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`scroll-reveal transform-gpu transition-all duration-700 ease-out ${delayClasses[delay]} ${
        isVisible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : `${hiddenClasses[variant]} opacity-0`
      } ${className}`}
      data-visible={isVisible}
      ref={ref}
    >
      {children}
    </div>
  );
}
