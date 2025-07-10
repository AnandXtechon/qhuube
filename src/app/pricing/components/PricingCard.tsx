"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check, Shield, Zap } from "lucide-react"

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
}

const PricingCard = () => {
    const handleStripePayment = async () => {
        try {
            const response = await fetch("http://localhost:3000/pricing/stripe/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: 20,
                    description: "Tax Compliance File Processing",
                }),
            })
            const data = await response.json()
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            } else {
                alert(data.error || "Payment failed")
            }
        } catch (error) {
            console.error(error)
            alert("An unexpected error occurred")
        }
    }

    const features = [
        "Instant tax compliance checking",
        "Automated error correction",
        "Professional formatting",
        "Multiple file format support",
        "Secure file processing",
        "Download corrected file immediately",
    ]

    return (
        <motion.div
            className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-0"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="relative bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-center text-white">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                        Tax Compliance Service
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm">
                        Upload your file, get it tax-compliant instantly
                    </p>
                </div>

                <div className="p-6 sm:p-8">
                    {/* Pricing */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="flex items-baseline justify-center mb-2">
                            <span className="text-3xl sm:text-4xl font-bold text-gray-900">€20</span>
                            <span className="text-gray-500 ml-2 text-sm">Pay per use</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>No subscription • No hidden fees</span>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6 sm:mb-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="flex items-start gap-3"
                                variants={featureVariants}
                                custom={idx}
                            >
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                    <Check className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                        onClick={handleStripePayment}
                        className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 sm:py-4 sm:px-6 rounded-xl transition-all duration-200 flex items-center justify-center group shadow-lg text-sm sm:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Start Processing File
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.button>

                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
                        <Shield className="w-4 h-4" />
                        <span>Secure payment & file processing</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default PricingCard
