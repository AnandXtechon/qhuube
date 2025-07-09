"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import {
    badgeVariants,
    cardsContainerVariants,
    heroVariants,
    subtitleVariants,
    titleVariants,
} from "@/lib/animation"
import PricingCard from "./components/PricingCard"
import Convincing from "./components/Convincing"

const page = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-sky-50">
            {/* Hero Section */}
            <motion.div
                className="pt-20 pb-16 px-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={heroVariants}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                        variants={titleVariants}
                    >
                        Simple, Transparent{" "}
                        <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                            Pricing
                        </span>
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                        variants={subtitleVariants}
                    >
                        Choose the perfect plan for your EU tax compliance needs. No hidden
                        fees, no surprises.
                    </motion.p>

                    <motion.div
                        className="inline-flex items-center bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium"
                        variants={badgeVariants}
                    >
                        <Star className="w-4 h-4 mr-2" />
                        Trusted by 10,000+ businesses across Europe
                    </motion.div>
                </div>
            </motion.div>

            {/* Pricing Card Section */}
            <motion.div
                className="pb-24 px-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardsContainerVariants}
            >
                <div className="max-w-2xl mx-auto">
                    <PricingCard
                        plan={{
                            id: "pay-as-you-go",
                            name: "Pay As You Go",
                            price: "€20",
                            amount: 20,
                            period: "",
                            description:
                                "Perfect for getting started with EU tax compliance",
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
                        }}
                        index={0}
                    />
                </div>
            </motion.div>

            {/* Trust Section */}
            <Convincing />
        </div>
    )
}

export default page
