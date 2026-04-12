import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

function item(delay: number, shouldReduce: boolean) {
  return {
    initial: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 5.0, delay, ease: [0.16, 1, 0.3, 1] },
  };
}

export default function HeroSection() {
  const shouldReduce = useReducedMotion();
  const [primaryHover, setPrimaryHover] = useState(false);
  const [ghostHover, setGhostHover] = useState(false);

  return (
    <section
      aria-label="Hero"
      className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-5rem)] text-center px-4"
    >
      {/* Radial indigo glow */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="glow-pulse absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Name */}
      <motion.h1
        {...item(0, shouldReduce ?? false)}
        className="font-bold"
        style={{ fontSize: "var(--font-size-display)", lineHeight: 1.1 }}
      >
        Dragos Macsim
      </motion.h1>

      {/* Professional title */}
      <motion.p
        {...item(0.15, shouldReduce ?? false)}
        className="mt-4"
        style={{
          fontSize: "var(--font-size-heading)",
          color: "var(--color-text-muted)",
        }}
      >
        AI Data Specialist
      </motion.p>

      {/* Tagline */}
      <motion.p
        {...item(0.3, shouldReduce ?? false)}
        className="mt-4 max-w-prose"
        style={{ fontSize: "var(--font-size-body)" }}
      >
        Building intelligent tools at the intersection of AI and product
        thinking.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        {...item(0.45, shouldReduce ?? false)}
        className="flex gap-4 mt-8 flex-wrap justify-center"
      >
        <a
          href="#projects"
          onClick={(e) => {
            const target = document.getElementById("projects");
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold transition-all duration-150 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            fontSize: "var(--font-size-label)",
            color: "#ffffff",
            backgroundColor: primaryHover
              ? "var(--color-accent-primary-press)"
              : "var(--color-accent-primary-solid)",
            minWidth: 160,
            outlineColor: "var(--color-accent-primary)",
          }}
          onMouseEnter={() => setPrimaryHover(true)}
          onMouseLeave={() => setPrimaryHover(false)}
        >
          View my work
        </a>
        <a
          href="/Dragos Macsim CV 2026.pdf"
          download
          className="inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold transition-all duration-150 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            fontSize: "var(--font-size-label)",
            color: "var(--color-accent-secondary)",
            border: "1px solid var(--color-accent-secondary)",
            backgroundColor: ghostHover
              ? "rgba(245,158,11,0.08)"
              : "transparent",
            minWidth: 160,
            outlineColor: "var(--color-accent-primary)",
          }}
          onMouseEnter={() => setGhostHover(true)}
          onMouseLeave={() => setGhostHover(false)}
        >
          Download CV
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        {...item(0.6, shouldReduce ?? false)}
        className="mt-12"
        role="img"
        aria-label="Scroll to explore"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-50"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  );
}
