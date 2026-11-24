import React from "react";
import { motion } from "motion/react";

/**
 * Reusable scroll-reveal animation wrapper.
 * Smoothly animates into view as the user scrolls down the page.
 */
const ScrollReveal = ({
  children,
  delay = 0,
  duration = 0.65,
  direction = "up",
  distance = 32,
  className = "",
  threshold = 0.1,
  once = true,
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, x: 0 };
      case "down":
        return { opacity: 0, y: -distance, x: 0 };
      case "left":
        return { opacity: 0, x: distance, y: 0 };
      case "right":
        return { opacity: 0, x: -distance, y: 0 };
      case "none":
      default:
        return { opacity: 0, y: 0, x: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-50px", amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom smooth cubic bezier
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
