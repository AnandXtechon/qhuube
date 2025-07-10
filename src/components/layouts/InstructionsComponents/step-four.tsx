"use client"

import { fadeInDown, slideInTop } from "@/lib/animation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Download, FileText, Mail, Check } from "lucide-react"
import { useState, useEffect } from "react"

const StepFour = () => {
    const [showDownloads, setShowDownloads] = useState(false)
    const [showEmail, setShowEmail] = useState(false)

    const stepData = {
        title: "Download your compliant files instantly",
        tag: "STEP — 04.",
        description:
            "Access your tax-compliant files immediately after processing. Download corrected data, compliance reports, and get everything you need for your VAT submissions.",
        highlights: [
            "Instant download of corrected transaction data and compliance reports",
            "Email delivery option to send reports directly to your inbox",
            "Audit-ready files formatted for tax authorities and advisors",
            "Files available in multiple formats: PDF, CSV, and Excel",
        ],
    }
    

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setShowDownloads(true)
        }, 1000)

        const timer2 = setTimeout(() => {
            setShowEmail(true)
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
            className="flex flex-col md:flex-row-reverse items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-7xl w-full relative z-10 my-8 sm:my-12 lg:my-16 lg:px-0"
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

            {/* Download Interface Preview */}
            <motion.div
                variants={slideInTop}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="flex-1 w-full max-w-lg order-1 lg:order-2 lg:bg-blue-50 rounded-md lg:px-3 xl:px-5 lg:py-3 xl:py-5"
            >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-5 lg:p-6">
                        {/* Files Processed Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 tracking-wide">FILES PROCESSED</h4>
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                            </div>

                            {/* Processed File */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">sample_vat_data.csv</div>
                                            <div className="text-xs text-gray-500">0.5 KB • text/csv • Processed successfully</div>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Download Reports Section */}
                        <AnimatePresence>
                            {showDownloads && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <div className="text-sm font-semibold text-gray-700 mb-4 tracking-wide">DOWNLOAD REPORTS</div>

                                    <div className="space-y-3">
                                        {/* VAT Compliance Report */}
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">VAT Compliance Report</div>
                                                    <div className="text-xs text-gray-600">Detailed compliance analysis</div>
                                                </div>
                                            </div>
                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Download Report
                                            </button>
                                        </div>

                                        {/* Corrected Data */}
                                        {/* <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">Corrected Data</div>
                                                    <div className="text-xs text-gray-600">Clean transaction data</div>
                                                </div>
                                            </div>
                                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Download Data
                                            </button>
                                        </div> */}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email Reports Section */}
                        <AnimatePresence>
                            {showEmail && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-purple-50 rounded-xl p-4 border border-purple-100"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Send Reports by Email</div>
                                            <div className="text-xs text-gray-600">Email both reports directly to your inbox</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            {/* <label className="block text-xs font-medium text-gray-700 mb-2">Email Address</label> */}
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-9 bg-white border border-gray-200 rounded-lg flex items-center px-3">
                                                    <span className="text-gray-400 text-sm">Enter email address</span>
                                                </div>
                                                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Send
                                                </button>
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

export default StepFour
