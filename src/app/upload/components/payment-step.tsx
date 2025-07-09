import { motion } from "framer-motion"
import PricingCard from "@/app/pricing/components/PricingCard"
import { cardsContainerVariants } from "@/lib/animation"

const PaymentStep = () => {
  return (
        <motion.div
            className="pb-20 px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardsContainerVariants}
        >
            <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {plans.map((plan, index) => (
                        <PricingCard key={plan.id} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

const plans = [
    {
        id: "monthly",
        name: "Monthly Plan",
        price: "€20",
        amount: 20,
        period: "/month",
        description: "Perfect for getting started with EU tax compliance",
        features: [
            "VAT registration in 27 EU countries",
            "Real-time tax calculations",
            "Automated compliance reporting",
            "Multi-currency support",
            "Email support",
            "Basic analytics dashboard",
            "Monthly compliance updates",
        ],
        popular: false,
        buttonText: "Start Monthly Plan",
        color: "from-sky-500 to-sky-600",
        bgColor: "from-sky-50 to-blue-50",
    },
    {
        id: "yearly",
        name: "Yearly Plan",
        price: "€199",
        amount: 199,
        period: "/year",
        originalPrice: "€240",
        description: "Best value for serious businesses - Save $41 annually",
        features: [
            "Everything in Monthly Plan",
            "Priority customer support",
            "Advanced analytics & insights",
            "Custom compliance workflows",
            "Early access to new features",
            "White-label reporting",
        ],
        popular: true,
        buttonText: "Start Yearly Plan",
        color: "from-sky-600 to-blue-600",
        bgColor: "from-sky-50 to-blue-50",
    },
]

export default PaymentStep