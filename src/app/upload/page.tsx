"use client"
<<<<<<< HEAD
import { useState, useCallback } from "react"
import type React from "react"

import { motion, Variants } from "framer-motion"
import { Upload, FileText, FileSpreadsheet, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const UploadStep = () => {
    const [dragActive, setDragActive] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

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

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase()
        if (extension === "csv" || extension === "txt") {
            return <FileText className="w-8 h-8 text-blue-600" />
        }
        return <FileSpreadsheet className="w-8 h-8 text-green-600" />
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter((file) => {
            const extension = file.name.split(".").pop()?.toLowerCase()
            const isValidType = ["csv", "txt", "xls", "xlsx"].includes(extension || "")
            const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
            return isValidType && isValidSize
        })

        if (validFiles.length > 0) {
            setUploadedFiles((prev) => [...prev, ...validFiles])

            // Simulate upload progress
            validFiles.forEach((file) => {
                simulateUpload(file.name)
            })
        }
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files))
        }
    }, [])

    const simulateUpload = (fileName: string) => {
        let progress = 0
        const interval = setInterval(() => {
            progress += Math.random() * 30
            if (progress >= 100) {
                progress = 100
                clearInterval(interval)
            }
            setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
        }, 200)
    }

    const removeFile = (fileName: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName))
        setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[fileName]
            return newProgress
        })
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">

            <div className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div variants={fadeInUp} initial="hidden" animate="show" className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Upload className="w-4 h-4" />
                            Step 1 of 4
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Upload Your <span className="text-blue-600">Sales Data</span>
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Upload your transaction files to begin VAT compliance processing. We support CSV, TXT, XLS, and XLSX
                            formats.
                        </p>
                    </motion.div>

                    {/* Upload Area */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
                    >
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                multiple
                                accept=".csv,.txt,.xls,.xlsx"
                                onChange={handleFileInput}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            <div className="space-y-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <Upload className="w-8 h-8 text-blue-600" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag and drop your files here</h3>
                                    <p className="text-gray-600 mb-4">or click to browse from your computer</p>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Choose Files</Button>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        CSV, TXT
                                    </span>
                                    <span className="flex items-center gap-1 text-xs">
                                        <FileSpreadsheet className="w-4 h-4" />
                                        XLS, XLSX
                                    </span>
                                    <span className="font-medium text-blue-600 text-xs">Max file size: 5MB</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="show"
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Uploaded Files</h3>
                            <div className="space-y-4">
                                {uploadedFiles.map((file, index) => {
                                    const progress = uploadProgress[file.name] || 0
                                    const isComplete = progress >= 100

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex-shrink-0">{getFileIcon(file.name)}</div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        {isComplete ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                                                        )}
                                                        <button
                                                            onClick={() => removeFile(file.name)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                                    <span>{formatFileSize(file.size)}</span>
                                                    <span>{isComplete ? "Upload complete" : "Uploading..."}</span>
                                                </div>

                                                {!isComplete && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Sample File Download */}
                    {/* <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.6 }}
                        className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mb-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-blue-900 mb-2">Need help formatting your data?</h4>
                                <p className="text-blue-700 mb-4">
                                    Download our sample template to ensure your data is properly formatted for VAT compliance processing.
                                </p>
                                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Sample Template
                                </Button>
                            </div>
                        </div>
                    </motion.div> */}

                    {/* Navigation */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.8 }}
                        className="flex justify-between items-center"
                    >
                        <Button variant="outline" disabled className="text-gray-400 bg-transparent">
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
                            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={uploadedFiles.length === 0 || !uploadedFiles.every((file) => uploadProgress[file.name] >= 100)}
                        >
                            Continue to Review
                        </Button>
                    </motion.div>
                </div>
=======

import { useState } from "react"
import { motion } from "framer-motion"
import UploadStep from "./components/upload-step"
import OverviewStep from "./components/overview-step"
import CorrectionStep from "./components/correction-step"
import StepIndicator from "./components/step-indicator"
import { useUploadStore } from "@/store/uploadStore"

const VATComplianceWizard = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const { uploadedFiles, setUploadedFiles } = useUploadStore()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [correctedData, setCorrectedData] = useState<any[]>([])

    const steps = [
        { id: 1, name: "Data upload", component: UploadStep },
        { id: 2, name: "Correction", component: CorrectionStep },
        { id: 3, name: "Overview", component: OverviewStep },
    ]

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleStepClick = (stepId: number) => {
        if (stepId <= currentStep || stepId === currentStep + 1) {
            setCurrentStep(stepId)
        }
    }

    const CurrentStepComponent = steps[currentStep - 1].component

    // ✅ Conditional wrapper width
    const wrapperMaxWidth = currentStep === 1 ? "max-w-4xl" : "max-w-6xl"

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-6">
            <div className={`mx-auto w-full ${wrapperMaxWidth}`}>
                <StepIndicator
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={handleStepClick}
                />

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                >
                    <CurrentStepComponent
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        correctedData={correctedData}
                        setCorrectedData={setCorrectedData}
                    />
                </motion.div>
>>>>>>> 5a48112 (TAX)
            </div>
        </div>
    )
}

<<<<<<< HEAD
export default UploadStep
=======
export default VATComplianceWizard
>>>>>>> 5a48112 (TAX)
