import { PricingCardProps } from "@/app/types"
import {
    buttonVariants,
    cardHeaderVariants,
    cardVariants,
    featuresVariants,
    featureVariants,
    popularBadgeVariants
} from "@/lib/animation"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

const PricingCard = ({ plan, index }: PricingCardProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMolliePayment = async (amount: number, description: string) => {
        try {
            const response = await fetch("http://localhost:3000/create-payment/mollie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, description })
            })
            const data = await response.json()
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            } else {
                alert(data.error || "Mollie payment failed")
            }
        } catch (error) {
            console.error(error)
            alert("An unexpected error occurred (Mollie)")
        }
    }

    const handleStripePayment = async (amount: number, description: string) => {
        try {
            const response = await fetch("http://localhost:3000/pricing/stripe/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, description })
            })
            const data = await response.json()
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            } else {
                alert(data.error || "Stripe payment failed")
            }
        } catch (error) {
            console.error(error)
            alert("An unexpected error occurred (Stripe)")
        }
    }

    return (
        <motion.div
            className={`relative bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-xl`}
            variants={cardVariants}
            custom={index}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
            {/* Popular Badge */}
            {plan.popular && (
                <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                    variants={popularBadgeVariants}
                >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                        Most Popular
                    </div>
                </motion.div>
            )}

            <div className="p-10">
                {/* Header */}
                <motion.div className="text-center mb-10" variants={cardHeaderVariants}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-base leading-relaxed mb-6">{plan.description}</p>

                    {/* Pricing */}
                    <div className="mb-4">
                        <div className="flex items-baseline justify-center mb-2">
                            <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                            {plan.period && <span className="text-gray-500 ml-1 text-lg">{plan.period}</span>}
                        </div>

                        {plan.originalPrice && (
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <span className="text-gray-400 line-through">{plan.originalPrice}</span>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium text-xs">
                                    Save €41
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div className="space-y-4 mb-10" variants={featuresVariants}>
                    {plan.features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-start gap-3"
                            variants={featureVariants}
                            custom={idx}
                        >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-gray-700 text-base leading-relaxed">{feature}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    onClick={() => handleStripePayment(plan.amount, plan.name)}
                    className={`w-full cursor-pointer font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center group 
            ${plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                            : "bg-gray-900 hover:bg-gray-800 text-white"
                        }`}
                    variants={buttonVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {plan.buttonText}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>

                {/* Additional Info */}
                {plan.popular && (
                    <div className="mt-5 text-center">
                        <p className="text-sm text-gray-500">Most chosen by growing businesses</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default PricingCard
