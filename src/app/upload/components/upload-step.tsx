/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, FileSpreadsheet, X, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fadeInLeft } from "@/lib/animation"
import { useFileUpload } from "../hooks/useFileUpload"
import type { UploadStepProps } from "@/app/types"
import { useRouter } from "next/navigation"
import { useUploadStore } from "@/store/uploadStore"
import axios from "axios"

const UploadStep = ({ onNext }: UploadStepProps) => {
    const [dragActive, setDragActive] = useState(false)
    const [isValidating, setIsValidating] = useState(false)
    const router = useRouter()
    const { uploadedFiles, uploadProgress, handleFiles, removeFile } = useFileUpload()
    const { setSessionIds } = useUploadStore()

    const getFileIcon = (fileName: string) => {
        const ext = fileName?.split(".").pop()?.toLowerCase()
        return ext === "csv" || ext === "txt" ? (
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
        ) : (
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        )
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(e.type === "dragenter" || e.type === "dragover")
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
            if (e.dataTransfer.files?.length) {
                handleFiles(Array.from(e.dataTransfer.files))
            }
        },
        [handleFiles],
    )

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files))
        }
    }

    // Validate files and get session IDs when all files are uploaded
    const validateFiles = useCallback(async () => {
        if (uploadedFiles.length === 0) return

        const allFilesUploaded = uploadedFiles.every((file) => uploadProgress[file.name] >= 100)
        if (!allFilesUploaded) return

        setIsValidating(true)
        try {
            const formData = new FormData()
            uploadedFiles.forEach((fileMeta) => {
                if (fileMeta.file) {
                    formData.append("files", fileMeta.file, fileMeta.name)
                }
            })

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/validate-file`, formData, {
                headers: { Accept: "application/json" },
                timeout: 30000,
            })

            // Extract session IDs from response
            const sessionMapping: Record<string, string> = {}
            response.data.files?.forEach((fileResult: any) => {
                if (fileResult.session_id) {
                    sessionMapping[fileResult.file_name] = fileResult.session_id
                }
            })

            setSessionIds(sessionMapping)
            console.log("Session IDs set:", sessionMapping)
        } catch (error) {
            console.error("Validation failed:", error)
            // Continue anyway - validation will happen in the next step
        } finally {
            setIsValidating(false)
        }
    }, [uploadedFiles, uploadProgress, setSessionIds])

    // Auto-validate when all files are uploaded
    useEffect(() => {
        validateFiles()
    }, [validateFiles])

    const allFilesUploaded = uploadedFiles.length > 0 && uploadedFiles.every((file) => uploadProgress[file.name] >= 100)

    return (
        <>
            <div className="py-5 flex flex-col justify-center mt-10">
                <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="w-full max-w-full lg:max-w-xl xl:max-w-2xl mx-auto">
                        <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                            {/* Header */}
                            {uploadedFiles.length === 0 && (
                                <motion.div variants={fadeInLeft} className="text-center">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Upload Your Files</h1>
                                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                                        Drag and drop your files or click to browse. We support CSV, TXT, XLS, and XLSX formats.
                                    </p>
                                </motion.div>
                            )}

                            {/* Upload Area */}
                            <motion.div
                                variants={fadeInLeft}
                                initial="hidden"
                                animate="show"
                                className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md lg:shadow-lg border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-6"
                            >
                                <div
                                    className={`relative border-2 border-dashed rounded-md sm:rounded-lg lg:rounded-xl text-center transition-all duration-300 ${dragActive ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-gray-50"
                                        }
                                 h-52 md:h-52 lg:h-40 xl:h-44
                                p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8
                                `}
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
                                    <div className="h-full flex flex-col items-center justify-center space-y-1 sm:space-y-2 md:space-y-3">
                                        <div className="flex items-center justify-center">
                                            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-sky-100 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6  lg:w-7 lg:h-7 text-sky-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-sm  md:text-base lg:text-lg font-semibold text-gray-900 mb-1">
                                                Drag & drop files or <span className="text-sky-600 cursor-pointer hover:underline">Browse</span>
                                            </h3>
                                            <p className="text-sm  md:text-sm text-gray-500">Supported formats: CSV, TXT, XLS, XLSX</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Upload Progress */}
                            {uploadedFiles.length > 0 && uploadedFiles.some((file) => uploadProgress[file.name] < 100) && (
                                <motion.div
                                    variants={fadeInLeft}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md lg:shadow-lg border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-6"
                                >
                                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                        Uploading - {uploadedFiles.filter((file) => uploadProgress[file.name] < 100).length} files
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        {uploadedFiles
                                            .filter((file) => uploadProgress[file.name] < 100)
                                            .map((file, index) => {
                                                const progress = uploadProgress[file.name] || 0
                                                return (
                                                    <div key={index} className="space-y-1 sm:space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-900 truncate pr-2 flex-1">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-sm text-gray-500 flex-shrink-0 ml-2">{Math.round(progress)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                            <div
                                                                className="bg-sky-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Validation Progress */}
                            {isValidating && (
                                <motion.div
                                    variants={fadeInLeft}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md lg:shadow-lg border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-sky-600" />
                                        <div>
                                            <h3 className="text-sm md:text-lg font-semibold text-gray-900">Preparing files...</h3>
                                            <p className="text-sm text-gray-600">Setting up validation sessions</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Uploaded Files */}
                            {uploadedFiles.filter((file) => uploadProgress[file.name] >= 100).length > 0 && (
                                <motion.div
                                    variants={fadeInLeft}
                                    initial="hidden"
                                    animate="show"
                                    className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm sm:shadow-md lg:shadow-lg border border-gray-200 p-3 sm:p-4 md:p-5 lg:p-6"
                                >
                                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Uploaded</h3>
                                    <div className="max-h-52 sm:max-h-52 lg:max-h-52 xl:max-h-72  overflow-y-auto space-y-2 pr-1 sm:pr-2">
                                        {uploadedFiles
                                            .filter((file) => uploadProgress[file.name] >= 100)
                                            .map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md sm:rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                        <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFile(file.name)}
                                                        className="flex-shrink-0 text-gray-400 hover:text-red-500 cursor-pointer p-1 hover:bg-red-50 rounded transition-colors ml-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Navigation */}
                            <motion.div
                                variants={fadeInLeft}
                                initial="hidden"
                                animate="show"
                                className="flex flex-row-reverse max-w-2xl justify-between items-stretch"
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/")}
                                    className="w-full sm:w-auto cursor-pointer bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-4 sm:px-6 order-2 sm:order-1"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                                <Button
                                    className="w-full flex items-center justify-center sm:w-auto sm:min-w-[120px] bg-sky-600 hover:bg-sky-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5"
                                    disabled={!allFilesUploaded || isValidating}
                                    onClick={onNext}
                                >
                                    {isValidating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Preparing...
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadStep
