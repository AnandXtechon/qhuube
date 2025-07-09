import * as motion from "motion/react-client"
import { CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import type { ReactNode } from "react"
import type { Variants } from "motion/react"

interface VATCardProps {
    title: string
    subtitle: string
    description: string
    icon: ReactNode
    color: string
    bgColor: string
    features: string[]
    stats: {
        value: string
        label: string
    }
    imageSrc?: string
}

const VATCard = ({ title, subtitle, description, icon, color, bgColor, features, imageSrc }: VATCardProps) => {
    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <motion.div
                className={`relative w-full h-full bg-gradient-to-br ${bgColor} rounded-3xl overflow-hidden shadow-xl border border-white/20`}
                initial="hidden"
                whileInView="visible"
                viewport={{
                    once: false,
                    amount: 0.1,
                    margin: "0px 0px -200px 0px", // Earlier trigger
                }}
                variants={cardContentVariants}
                style={{
                    transform: "translate3d(0, 0, 0)",
                    contain: "layout style paint",
                    willChange: "transform, opacity",
                }}
            >
                {/* Optimized background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
                    <div className="absolute top-20 right-20 w-40 h-40 bg-white/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/20 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 h-full max-w-6xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8">
                    {/* Left Content - Ultra-smooth animations */}
                    <motion.div className="space-y-6" variants={contentVariants}>
                        <motion.div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
                            variants={iconVariants}
                        >
                            {icon}
                        </motion.div>

                        <motion.div variants={textVariants}>
                            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 leading-tight">{title}</h2>
                            <p className="text-lg lg:text-xl text-gray-600 mb-6">{subtitle}</p>
                            <p className="text-base lg:text-lg text-gray-700 leading-relaxed mb-6">{description}</p>
                        </motion.div>

                        <motion.div className="space-y-4" variants={featuresVariants}>
                            {features.map((feature, idx) => (
                                <motion.div key={idx} className="flex items-start space-x-3" variants={featureItemVariants}>
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.button
                            className={`bg-gradient-to-r ${color} text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center`}
                            variants={buttonVariants}
                            whileHover={{ scale: 1.02 }} // Reduced for smoother feel
                            whileTap={{ scale: 0.98 }}
                        >
                            Learn More
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </motion.button>
                    </motion.div>

                    {/* Right Content - Image Container */}
                    <motion.div className="relative flex items-center justify-center" variants={imageContainerVariants}>
                        {imageSrc && (
                            <motion.div
                                className="w-full max-w-md h-80 lg:h-96 rounded-3xl shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm flex items-center justify-center border border-white/50"
                                variants={imageVariants}
                                whileHover={{ scale: 1.02, rotate: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src={imageSrc || "/placeholder.svg"}
                                    alt="Finance Illustration"
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-fit rounded-3xl"
                                />
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

// Ultra-smooth Animation Variants
const cardContentVariants: Variants = {
    hidden: {
        opacity: 1,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: [0.25, 0.1, 0.25, 1], // Ultra-smooth easing
            staggerChildren: 0.1, // Reduced stagger for smoother feel
        },
    },
}

const contentVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.09, // Very smooth stagger
        },
    },
}

const iconVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8,
        },
    },
}

const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 }, // Reduced distance
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

const featuresVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 5, // Very smooth stagger
        },
    },
}

const featureItemVariants: Variants = {
    hidden: { opacity: 0, x: -10 }, // Reduced distance
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 10 }, // Reduced distance
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

const imageContainerVariants: Variants = {
    hidden: { opacity: 0, x: 30 }, // Slide in from right
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
}

const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -5 },
    visible: {
        opacity: 2,
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.1,
        },
    },
}

export default VATCard
