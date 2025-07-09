"use client"
import * as motion from "motion/react-client"
import type React from "react"
import type { Variants } from "motion/react"
import { FileText, Calculator, Globe } from "lucide-react"
import VATCard from "./VATCard"

const ConversionSection = () => {
    const sections = [
        {
            id: 1,
            title: "VAT Registration Made Simple",
            subtitle: "Streamline your EU VAT registration process",
            icon: FileText,
            color: "from-blue-600 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50",
            features: [
                "One-click registration across 27 EU countries",
                "Real-time status tracking and updates",
                "Automated document generation",
                "Multi-language support for all jurisdictions",
            ],
            stats: { value: "27", label: "EU Countries" },
            description:
                "Our automated system handles VAT registration across the entire European Union, saving you time and ensuring compliance from day one.",
        },
        {
            id: 2,
            title: "Automated Tax Calculations",
            subtitle: "Precise calculations every time",
            icon: Calculator,
            color: "from-green-600 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            features: [
                "Real-time tax rate updates",
                "Multi-currency support",
                "Automated rounding rules",
                "Historical rate tracking",
            ],
            stats: { value: "99.9%", label: "Accuracy Rate" },
            description:
                "Never worry about tax calculation errors again. Our system automatically calculates taxes based on the latest rates and regulations for each EU country.",
        },
        {
            id: 3,
            title: "Cross-Border Compliance",
            subtitle: "Navigate complex regulations with ease",
            icon: Globe,
            color: "from-purple-600 to-violet-500",
            bgColor: "from-purple-50 to-violet-50",
            features: [
                "GDPR compliant data handling",
                "Local regulation compliance",
                "Multi-language documentation",
                "Country-specific reporting",
            ],
            stats: { value: "100%", label: "GDPR Compliant" },
            description:
                "Handle complex cross-border transactions with confidence. Our platform ensures you're compliant with regulations in every EU member state.",
        },
    ]

    return (
        <section style={containerStyle}>
            {/* Enhanced Title Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                    once: true,
                    amount: 0.2,
                    margin: "0px 0px -100px 0px", // Start animation earlier
                }}
                variants={titleVariants}
                style={titleStyle}
            >
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-2"
                        variants={titleTextVariants}
                    >
                        The all in one <span className="bg-clip-text text-sky-600">finance platform</span>{" "}
                        {`you've been looking for`}
                    </motion.h1>
                    <motion.p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto" variants={subtitleVariants}>
                        Streamline your financial operations with our comprehensive suite of tools designed for modern businesses
                    </motion.p>
                </div>
            </motion.div>

            {/* Optimized Stacked Cards */}
            {sections.map((data, i) => (
                <CardContainer key={data.id} data={data} index={i} />
            ))}
        </section>
    )
}

interface CardContainerProps {
    data: {
        id: number
        title: string
        subtitle: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon: any
        color: string
        bgColor: string
        features: string[]
        stats: { value: string; label: string }
        description: string
    }
    index: number
}

function CardContainer({ data, index }: CardContainerProps) {
    return (
        <motion.div
            className={`card-container-${index}`}
            style={cardContainerStyle}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{
                amount: 0.15, // Reduced for earlier trigger
                once: false,
                margin: "0px 0px -300px 0px", // Much earlier trigger for smoother experience
            }}
        >
            {/* Simplified background effect */}
            <div
                style={{
                    ...splashStyle,
                    background: `linear-gradient(120deg, hsl(${200 + index * 40}, 60%, 90%), hsl(${220 + index * 40}, 70%, 95%))`,
                }}
            />

            {/* Optimized Card Animation */}
            <motion.div style={cardStyle} variants={cardVariants} custom={index}>
                <VATCard
                    title={data.title}
                    subtitle={data.subtitle}
                    description={data.description}
                    icon={<data.icon className="w-8 h-8 text-white" />}
                    color={data.color}
                    bgColor={data.bgColor}
                    features={data.features}
                    stats={data.stats}
                    imageSrc="/images/template-1.png"
                />
            </motion.div>
        </motion.div>
    )
}

// Ultra-smooth Animation Variants
const titleVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1.0,
            ease: [0.25, 0.1, 0.25, 1], // Custom easing for ultra-smooth feel
            staggerChildren: 0.2,
        },
    },
}

const titleTextVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier
        },
    },
}

const subtitleVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.0,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

const cardVariants: Variants = {
    offscreen: {
        y: 120, // Reduced distance for smoother animation
        opacity: 0,
        scale: 0.95,
    },
    onscreen: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 60, // Reduced for smoother feel
            damping: 25, // Increased for less bounce
            mass: 1, // Balanced mass
            duration: 1.2,
        },
    },
}

// Performance-optimized Styles
const containerStyle: React.CSSProperties = {
    margin: "0 auto",
    maxWidth: "100%",
    paddingBottom: 200,
    width: "100%",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    contain: "layout style paint", // Performance optimization
}

const titleStyle: React.CSSProperties = {
    padding: "80px 20px 10px",
    position: "relative",
    zIndex: 10,
    contain: "layout style", // Performance hint
}

const cardContainerStyle: React.CSSProperties = {
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 0,
    marginBottom: -140, // Slightly reduced for smoother stacking
    minHeight: "100vh",
    contain: "layout style", // Performance optimization
    willChange: "transform", // Hint for GPU acceleration
}

const splashStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    clipPath: `polygon(0% 25%, 100% 0%, 100% 75%, 0% 100%)`,
    opacity: 0.3, // Slightly reduced for better performance
    pointerEvents: "none", // Prevent interaction issues
}

const cardStyle: React.CSSProperties = {
    width: "90%",
    maxWidth: 1200,
    height: 700,
    borderRadius: 24,
    transformOrigin: "center center",
    position: "relative",
    zIndex: 5,
    transform: "translate3d(0, 0, 0)", // Hardware acceleration
    backfaceVisibility: "hidden", // Prevent flickering
    contain: "layout style paint", // Performance optimization
    willChange: "transform, opacity", // GPU acceleration hint
}

export default ConversionSection
