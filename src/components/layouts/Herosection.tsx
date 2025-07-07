"use client"

import { motion, Variants } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Herosection = () => {
    const features = ["EU-wide compliance", "Automated calculations", "Real-time reporting"]
    const stats = [
        { value: "27+", label: "EU Countries" },
        { value: "99.9%", label: "Accuracy Rate" },
        { value: "10k+", label: "Businesses Trust Us" },
    ]

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    }

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    }

    return (
        <main className="bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 min-h-[80vh] flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                className="max-w-5xl mx-auto text-center space-y-10 mt-20"
            >
                {/* Main Heading */}
                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                >
                    Effortless VAT Compliance
                    <br />
                    <span className="text-sky-600">Across Europe</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={fadeInUp}
                    className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                >
                    Automate tax calculations, filings, and reporting across the EU from a single, trusted platform.
                </motion.p>

                {/* CTA Button */}
                <motion.div variants={fadeInUp} className="pt-6">
                    <Button
                        variant="default"
                        size="lg"
                        className="text-lg transition-all hover:bg-blue-700"
                    >
                        <Link href="/upload">Get Started</Link>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    variants={staggerContainer}
                    className="flex flex-wrap justify-center gap-4 pt-4"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-white/50 rounded-full px-5 py-3 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">{feature}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust Indicators */}
                <motion.div variants={fadeInUp} className="pt-12">
                    <p className="text-sm text-gray-500 mb-8 font-medium">
                        Trusted by businesses across Europe
                    </p>
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center bg-white/80 backdrop-blur-sm py-6 px-6 rounded-xl shadow-sm border border-white/50 hover:shadow-md transition-all duration-200"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-sky-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </main>
    )
}

export default Herosection
