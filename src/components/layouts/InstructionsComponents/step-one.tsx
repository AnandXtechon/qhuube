/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { fadeInDown, slideInTop } from "@/lib/animation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Upload, FileText, FileSpreadsheet, File, Check, Zap } from "lucide-react"
import { useState, useEffect } from "react"

const StepOne = () => {
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const [showAnimation, setShowAnimation] = useState(false)

    const stepData = {
        title: "Effortlessly import your sales data",
        tag: "STEP — 01.",
        description:
            "Sync your EU sales transactions into TaxTrack using CSV, Excel, or TXT files. Automate imports via ecommerce integrations like Amazon, Shopify, and Stripe to save time and reduce errors.",
        highlights: [
            "Seamless integration with major ecommerce and accounting platforms",
            "Supports all common file formats for maximum flexibility",
            "Custom mapping support for files without direct integrations",
            "Bulk upload support to handle high-volume transaction data", 
        ],
    }
    

    const sampleFiles = [
        { name: "Q4_sales_data.csv", size: "2.4 MB", type: "csv", status: "completed", progress: 100 },
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimation(true)
            setUploadedFiles(sampleFiles)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    const getFileIcon = (type: string) => {
        switch (type) {
            case "csv":
                return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            case "excel":
                return <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            case "txt":
                return <File className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            default:
                return <File className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        }
    }

    return (
        <motion.div
            variants={fadeInDown}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-7xl w-full relative z-10 my-2 sm:my-12 lg:my-16"
        >
            {/* Content - Mobile First */}
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

            {/* Enhanced File Upload Interface */}
            <motion.div
                variants={slideInTop}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="flex-1 w-full max-w-lg order-1 lg:order-2 lg:bg-blue-50 rounded-md lg:px-3 xl:px-5 lg:py-3 xl:py-5"
            >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-3 sm:p-4 lg:p-6">
                        {/* Drop Zone */}
                        <motion.div
                            className={`relative border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isDragOver
                                    ? "border-sky-400 bg-sky-50 scale-105"
                                    : "border-gray-300 bg-gray-50 hover:border-sky-300 hover:bg-sky-25"
                                }`}
                            whileHover={{ scale: 1.02 }}
                            onDragOver={(e) => {
                                e.preventDefault()
                                setIsDragOver(true)
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{
                                        y: isDragOver ? -10 : [0, -5, 0],
                                        rotate: isDragOver ? 0 : [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: isDragOver ? 0.2 : 2,
                                        repeat: isDragOver ? 0 : Number.POSITIVE_INFINITY,
                                        repeatType: "reverse",
                                    }}
                                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
                                >
                                    <Upload className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-sky-600" />
                                </motion.div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    {isDragOver ? "Release to upload!" : "Drop files here"}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-2">
                                    Support for CSV, Excel, and TXT files up to 10MB
                                </p>
                                <button className="bg-sky-600 hover:bg-sky-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors">
                                    Browse Files
                                </button>
                            </div>

                            {/* Floating Files Animation */}
                            <AnimatePresence>
                                {showAnimation && (
                                    <>
                                        {[1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: -50, x: Math.random() * 100 - 50 }}
                                                animate={{
                                                    opacity: [0, 1, 1, 0],
                                                    y: [0, -20, -40, -60],
                                                    x: [0, Math.random() * 20 - 10, Math.random() * 30 - 15, Math.random() * 40 - 20],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    delay: i * 0.5,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    repeatDelay: 2,
                                                }}
                                                className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2"
                                            >
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md sm:rounded-lg shadow-lg flex items-center justify-center border border-gray-200">
                                                    {i === 1 && <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />}
                                                    {i === 2 && <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />}
                                                    {i === 3 && <File className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* File List */}
                        <div className="mt-4 sm:mt-6">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h5 className="text-xs sm:text-sm font-semibold text-gray-700">Uploaded Files</h5>
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <Zap className="w-3 h-3" />
                                    <span className="hidden sm:inline">Auto-sync</span>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-40 lg:max-h-none overflow-y-auto">
                                <AnimatePresence>
                                    {uploadedFiles.map((file, index) => (
                                        <motion.div
                                            key={file.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.2 }}
                                            className="group flex items-center justify-between p-2 sm:p-3 lg:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl border border-gray-100 transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-sky-600 transition-colors truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{file.size}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                                                {file.status === "uploading" ? (
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="w-6 sm:w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full bg-sky-500 rounded-full"
                                                                initial={{ width: "0%" }}
                                                                animate={{ width: `${file.progress}%` }}
                                                                transition={{ duration: 1 }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-sky-600 font-medium hidden sm:inline">{file.progress}%</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                        </div>
                                                        <span className="text-xs text-green-600 font-medium hidden sm:inline">Complete</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default StepOne
