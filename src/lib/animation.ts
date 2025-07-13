"use client"

import type { Variants } from "framer-motion"

// Basic fade animations
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
}

// Fade in and slide up
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "anticipate",
        },
    },
}

// Fade in and slide down
export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "anticipate",
        },
    },
}

// Fade in and slide left
export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "anticipate",
        },
    },
}

// Fade in and slide right
export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "anticipate",
        },
    },
}

// Simple scale + fade
export const scaleFadeIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
}

// Staggered container for children
export const staggerContainer: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
        },
    },
}

// Advanced Animations

// Bounce in effect
export const bounceIn: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 10,
            stiffness: 100,
            duration: 0.8,
        },
    },
}

// Elastic scale animation
export const elasticScale: Variants = {
    hidden: { opacity: 0, scale: 0 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            damping: 8,
            stiffness: 200,
            mass: 0.8,
        },
    },
}

// Rotate and fade in
export const rotateIn: Variants = {
    hidden: { opacity: 0, rotate: -180 },
    show: {
        opacity: 1,
        rotate: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
}

// Flip in X axis
export const flipInX: Variants = {
    hidden: { opacity: 0, rotateX: -90 },
    show: {
        opacity: 1,
        rotateX: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
}

// Flip in Y axis
export const flipInY: Variants = {
    hidden: { opacity: 0, rotateY: -90 },
    show: {
        opacity: 1,
        rotateY: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
}

// Zoom in from center
export const zoomIn: Variants = {
    hidden: { opacity: 0, scale: 0 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
}

// Zoom out effect
export const zoomOut: Variants = {
    hidden: { opacity: 0, scale: 1.2 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
}

// Slide in from bottom with bounce
export const slideInBottom: Variants = {
    hidden: { opacity: 0, y: 100 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 15,
            stiffness: 100,
        },
    },
}

// Slide in from top with bounce
export const slideInTop: Variants = {
    hidden: { opacity: 0, y: -100 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 15,
            stiffness: 100,
        },
    },
}

// Slide in from left with overshoot
export const slideInLeftBounce: Variants = {
    hidden: { opacity: 0, x: -100 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 120,
        },
    },
}

// Slide in from right with overshoot
export const slideInRightBounce: Variants = {
    hidden: { opacity: 0, x: 100 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 120,
        },
    },
}

// Typewriter effect (for text)
export const typewriter: Variants = {
    hidden: { width: 0 },
    show: {
        width: "auto",
        transition: {
            duration: 2,
            ease: "linear",
        },
    },
}

// Pulse animation
export const pulse: Variants = {
    hidden: { scale: 1 },
    show: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
        },
    },
}

// Shake animation
export const shake: Variants = {
    hidden: { x: 0 },
    show: {
        x: [-10, 10, -10, 10, 0],
        transition: {
            duration: 0.5,
            ease: "easeInOut",
        },
    },
}

// Wobble animation
export const wobble: Variants = {
    hidden: { rotate: 0 },
    show: {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
            duration: 0.8,
            ease: "easeInOut",
        },
    },
}

// Rubber band effect
export const rubberBand: Variants = {
    hidden: { scale: 1 },
    show: {
        scale: [1, 1.25, 0.75, 1.15, 0.95, 1],
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

// Jello effect
export const jello: Variants = {
    hidden: { skewX: 0, skewY: 0 },
    show: {
        skewX: [0, -12.5, 6.25, -3.125, 1.5625, 0],
        skewY: [0, -12.5, 6.25, -3.125, 1.5625, 0],
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

// Heartbeat animation
export const heartbeat: Variants = {
    hidden: { scale: 1 },
    show: {
        scale: [1, 1.3, 1, 1.3, 1],
        transition: {
            duration: 1.3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
        },
    },
}

// Flash animation
export const flash: Variants = {
    hidden: { opacity: 1 },
    show: {
        opacity: [1, 0, 1, 0, 1],
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

// Swing animation
export const swing: Variants = {
    hidden: { rotate: 0, transformOrigin: "top center" },
    show: {
        rotate: [0, 15, -10, 5, -5, 0],
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

// Tada animation
export const tada: Variants = {
    hidden: { scale: 1, rotate: 0 },
    show: {
        scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
        rotate: [0, -3, -3, 3, -3, 3, -3, 3, -3, 0],
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
}

// Roll in animation
export const rollIn: Variants = {
    hidden: { opacity: 0, x: -100, rotate: -120 },
    show: {
        opacity: 1,
        x: 0,
        rotate: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
}

// Roll out animation
export const rollOut: Variants = {
    hidden: { opacity: 1, x: 0, rotate: 0 },
    show: {
        opacity: 0,
        x: 100,
        rotate: 120,
        transition: {
            duration: 0.8,
            ease: "easeIn",
        },
    },
}

// Light speed in
export const lightSpeedIn: Variants = {
    hidden: { opacity: 0, x: 100, skewX: -30 },
    show: {
        opacity: 1,
        x: 0,
        skewX: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
}

// Hinge animation
export const hinge: Variants = {
    hidden: { rotate: 0, transformOrigin: "top left" },
    show: {
        rotate: [0, 80, 60, 80, 60, 60],
        opacity: [1, 1, 1, 1, 1, 0],
        y: [0, 0, 0, 0, 0, 700],
        transition: {
            duration: 2,
            ease: "easeInOut",
        },
    },
}

// Jack in the box
export const jackInTheBox: Variants = {
    hidden: { opacity: 0, scale: 0.1, rotate: 30 },
    show: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            damping: 10,
            stiffness: 100,
        },
    },
}

// Advanced stagger containers
export const staggerFast: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.05,
        },
    },
}

export const staggerSlow: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.3,
        },
    },
}

export const staggerReverse: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            staggerDirection: -1,
        },
    },
}

// Complex combined animations
export const morphIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        rotate: -10,
        y: 20,
    },
    show: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        y: 0,
        transition: {
            type: "spring",
            damping: 15,
            stiffness: 100,
            duration: 0.8,
        },
    },
}

export const glideIn: Variants = {
    hidden: {
        opacity: 0,
        x: -50,
        scale: 0.9,
        filter: "blur(4px)",
    },
    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
}

export const popIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0,
        rotate: -180,
    },
    show: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            damping: 8,
            stiffness: 200,
            mass: 0.5,
        },
    },
}

// Hover animations (for interactive elements)
export const hoverScale: Variants = {
    hidden: { scale: 1 },
    show: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
}

export const hoverLift: Variants = {
    hidden: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
    show: { y: 0, boxShadow: "0 0 0 rgba(0,0,0,0)" },
    hover: {
        y: -5,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
}

export const hoverGlow: Variants = {
    hidden: { boxShadow: "0 0 0 rgba(59, 130, 246, 0)" },
    show: { boxShadow: "0 0 0 rgba(59, 130, 246, 0)" },
    hover: {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
}

// Loading animations
export const spinner: Variants = {
    hidden: { rotate: 0 },
    show: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
        },
    },
}

export const dots: Variants = {
    hidden: { opacity: 0.3 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
        },
    },
}

// Page transition animations
export const pageSlideIn: Variants = {
    hidden: { opacity: 0, x: "100%" },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        x: "-100%",
        transition: {
            duration: 0.5,
            ease: "easeIn",
        },
    },
}

export const pageFade: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeIn",
        },
    },
}


// Animation Variants
export const heroVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            staggerChildren: 0.2,
        },
    },
}

export const logoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
}

export const titleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3,
        },
    },
}

export const cardsContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.2,
        },
    },
}

export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
            delay: index * 0.1,
        },
    }),
}

export const popularBadgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 15,
            delay: 0.3,
        },
    },
}

export const cardHeaderVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const featuresVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
}

export const featureVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            delay: index * 0.05,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
}

export const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2,
        },
    },
}

export const trustVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            staggerChildren: 0.1,
        },
    },
}

export const trustTitleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

export const trustItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
}


export const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.4,
        },
    },
};

export const floatingVariants: Variants = {
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const floatingCard: Variants = {
    float: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
    pulse: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};


export const pulseAnimation: Variants = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export const slideInLeft: Variants = {
    hidden: {
        x: -100,
        opacity: 0,
    },
    show: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: 0.8,
        },
    },
};

export const slideInRight: Variants = {
    hidden: {
        x: 100,
        opacity: 0,
    },
    show: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: 0.8,
        },
    },
};