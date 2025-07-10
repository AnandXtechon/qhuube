"use client"

import { fadeInDown, slideInTop } from "@/lib/animation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertTriangle, FileText, Check, ArrowRight, X } from "lucide-react"
import { useState, useEffect } from "react"

const StepTwo = () => {
    const [showValidation, setShowValidation] = useState(false)
    const [showCorrection, setShowCorrection] = useState(false)

    const stepData = {
        title: "Automatically validate your VAT data",
        tag: "STEP — 02.",
        description:
            "Ensure your data is accurate and VAT-ready with TaxTrack's built-in validation engine. Our system checks your sales records for EU VAT rules, country thresholds, and regulatory compliance.",
        highlights: [
            "Detects common VAT issues like missing VAT IDs, rate mismatches, or invalid entries",
            "Country-specific logic built-in for all 27 EU member states",
            "Real-time feedback to fix issues before submission",
            "Eliminates manual errors to speed up compliance workflows", 
        ],
    }
    

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setShowValidation(true)
        }, 1000)

        const timer2 = setTimeout(() => {
            setShowCorrection(true)
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
            className="flex flex-col md:flex-row-reverse items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-7xl w-full relative z-10 my-8 sm:my-12 lg:my-16"
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

            {/* Simplified Validation Preview */}
            <motion.div
                variants={slideInTop}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="flex-1 w-full max-w-lg order-1 lg:order-2 lg:bg-blue-50 rounded-md lg:px-3 xl:px-5 lg:py-3 xl:py-5"
            >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-5 lg:p-6">
                        {/* Files Uploaded Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 tracking-wide">FILES UPLOADED</h4>
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-blue-50 rounded-xl p-2 flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-blue-600">125</div>
                                        <div className="text-xs text-gray-600">uploaded and processed</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-orange-50 rounded-xl p-2 flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-orange-600">261</div>
                                        <div className="text-xs text-gray-600">issues found</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Simplified Table Preview */}
                        <AnimatePresence>
                            {showValidation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-6"
                                >
                                    {/* Table Headers */}
                                    <div className="grid grid-cols-6 gap-2 text-xs text-gray-500 font-medium mb-3 px-2">
                                        <div>Issue</div>
                                        <div>Invoice number</div>
                                        <div>Invoice date</div>
                                        <div>Tax code</div>
                                        <div>VAT amount</div>
                                        <div>Currency</div>
                                    </div>

                                    {/* Sample Rows */}
                                    <div className="space-y-2">
                                        {/* Row 1 - Corrected */}
                                        <div className="grid grid-cols-6 gap-2 items-center py-2 px-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-green-600" />
                                                </div>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                            <div className="text-xs font-medium">A2</div>
                                            <div className="text-xs font-medium">€400</div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                        </div>

                                        {/* Row 2 - Issue */}
                                        <div className="grid grid-cols-6 gap-2 items-center py-2 px-2 bg-red-50 rounded-lg border border-red-100">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                                                    <X className="w-3 h-3 text-red-600" />
                                                </div>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                        </div>

                                        {/* Featured Issue Row */}
                                        <div className="bg-white border border-orange-200 rounded-lg p-3">
                                            <div className="grid grid-cols-6 gap-2 items-center mb-2">
                                                <div className="flex items-center">
                                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded"></div>
                                                <div className="h-2 bg-gray-200 rounded"></div>
                                                <div className="h-2 bg-gray-200 rounded"></div>
                                                <div className="h-2 bg-gray-200 rounded"></div>
                                                <div className="h-2 bg-gray-200 rounded"></div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="text-xs font-semibold text-gray-900 mb-2">WRONG TAX NUMBER</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-red-600 font-bold text-lg line-through">20%</span>
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                    <span className="text-blue-600 font-bold text-lg">12%</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Correction Summary */}
                        <AnimatePresence>
                            {showCorrection && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-green-50 rounded-xl p-2 border border-green-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900 mb-1">CORRECTION</div>
                                            <div className="flex items-center gap-2">
                                                
                                                <span className="text-xl font-bold text-green-600">261</span>
                                                <span className="text-green-600 font-medium">issues corrected</span>
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

export default StepTwo
