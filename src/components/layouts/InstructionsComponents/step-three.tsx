"use client"

import { fadeInDown, slideInTop } from "@/lib/animation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, CreditCard, Shield, Check, Euro, Globe } from "lucide-react"
import { useState, useEffect } from "react"

const StepThree = () => {
    const [showPayment, setShowPayment] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const stepData = {
        title: "Secure payment for your compliance",
        tag: "STEP — 03.",
        description:
            "Complete your one-time payment to process and download your tax-compliant files. Pay only for what you use with our transparent pricing model powered by Stripe.",
        highlights: [
            "Pay-as-you-go model with no subscriptions or hidden fees",
            "Secure payment processing with full EU payment method support",
            "Instant access to corrected files after successful payment",
            "Powered by Stripe — trusted by millions globally for secure transactions", 
        ],
    }
    

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setShowPayment(true)
        }, 1000)

        const timer2 = setTimeout(() => {
            setShowSuccess(true)
        }, 2500)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [])

    return (
        <motion.div
            variants={fadeInDown}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-7xl w-full relative z-10 my-8 sm:my-12 lg:my-16"
        >
            {/* Content Section */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none order-2 lg:order-1">
                <div className="mb-3 sm:mb-4">
                    <span className="text-sky-600 text-xs sm:text-sm font-medium tracking-wide">{stepData.tag}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                    {stepData.title}
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">{stepData.description}</p>
                <div className="space-y-3 sm:space-y-4">
                    {stepData.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2 sm:gap-3">
                            <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-sky-600 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-gray-700 font-medium leading-relaxed text-sm sm:text-base">{highlight}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Preview Section */}
            <motion.div
                variants={slideInTop}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="flex-1 w-full max-w-lg order-1 lg:order-2 lg:bg-blue-50 rounded-md lg:px-3 xl:px-5 lg:py-3 xl:py-5"
            >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-5 lg:p-6">
                        {/* Payment Summary Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 tracking-wide">PAYMENT SUMMARY</h4>
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Euro className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* €20 Pay Per Use Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-blue-700">€20</div>
                                        <div className="text-sm text-gray-600">Pay per use</div>
                                    </div>
                                </motion.div>

                                {/* EU Payment Support Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-4 p-5 bg-green-50 border border-green-100 rounded-2xl shadow-sm"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
                                        <Globe className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-green-700">EU</div>
                                        <div className="text-sm text-gray-600">Payment support</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Payment Method Preview */}
                        <AnimatePresence>
                            {showPayment && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-6"
                                >
                                    {/* Payment Method Header */}
                                    <div className="text-sm font-semibold text-gray-700 mb-3">PAYMENT METHOD</div>

                                    {/* Card Option */}
                                    <div className="space-y-3">
                                        <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                <CreditCard className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm font-medium text-gray-900">Card</span>
                                            </div>

                                            {/* Card Information Preview */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                                    <span className="text-gray-400 text-sm">1234 1234 1234 1234</span>
                                                    {/* <div className="flex gap-1">
                                                        <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                                        <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                                                        <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
                                                        <div className="w-6 h-4 bg-green-600 rounded-sm"></div>
                                                    </div> */}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="p-2 bg-white rounded border border-gray-200">
                                                        <span className="text-gray-400 text-sm">MM / YY</span>
                                                    </div>
                                                    <div className="p-2 bg-white rounded border border-gray-200">
                                                        <span className="text-gray-400 text-sm">CVC</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* EU Payment Methods */}
                                        <div className="space-y-2">
                                            {/* iDEAL */}
                                            {/* <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                                <div className="w-6 h-4 bg-purple-600 rounded-sm"></div>
                                                <span className="text-sm text-gray-700">iDEAL</span>
                                            </div> */}

                                            {/* Bancontact */}
                                            {/* <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                                <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
                                                <span className="text-sm text-gray-700">Bancontact</span>
                                            </div> */}

                                            {/* EPS */}
                                            {/* <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                                <div className="w-6 h-4 bg-red-600 rounded-sm"></div>
                                                <span className="text-sm text-gray-700">EPS</span>
                                            </div> */}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Payment Success */}
                        <AnimatePresence>
                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-green-50 rounded-xl p-4 border border-green-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900 mb-1">PAYMENT SUCCESSFUL</div>
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-green-600 font-medium">Secured by Stripe</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default StepThree
