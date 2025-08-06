"use client"
import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { FileText, FileSpreadsheet, X, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { fadeInLeft } from "@/lib/animation"
import { useFileUpload } from "../hooks/useFileUpload"
import type { UploadStepProps } from "@/app/types"
import { useRouter } from "next/navigation"

const UploadStep = ({ onNext }: UploadStepProps) => {
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()
  const { uploadedFiles, uploadProgress, handleFiles, removeFile } = useFileUpload()

  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase()
    return ext === "csv" || ext === "txt" ? (
      <FileText className="w-4 h-4 text-sky-600" />
    ) : (
      <FileSpreadsheet className="w-4 h-4 text-green-600" />
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

  // Check if all files are uploaded (no validation here)
  const allFilesUploaded = uploadedFiles.length > 0 && uploadedFiles.every((file) => uploadProgress[file.name] >= 100)

  return (
    <>
      <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-2xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            {uploadedFiles.length === 0 && (
              <motion.div variants={fadeInLeft} className="text-center px-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Upload Your Files
                </h1>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Drag and drop your files or click to browse. We support CSV, TXT, XLS, and XLSX formats.
                </p>
              </motion.div>
            )}

            {/* Upload Area */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              animate="show"
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <div
                className={`relative border-2 border-dashed rounded-lg text-center transition-all duration-300 ${
                  dragActive ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-gray-50"
                } h-40 sm:h-48 md:h-52 lg:h-44 p-4 sm:p-6`}
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
                <div className="h-full flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 text-sky-600"
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
                  <div className="text-center px-2">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">
                      <span className="hidden sm:inline">Drag & drop files or </span>
                      <span className="text-sky-600 cursor-pointer hover:underline">
                        {uploadedFiles.length === 0 ? "Choose files" : "Add more files"}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      CSV, TXT, XLS, XLSX
                    </p>
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
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Uploading - {uploadedFiles.filter((file) => uploadProgress[file.name] < 100).length} files
                </h3>
                <div className="space-y-3">
                  {uploadedFiles
                    .filter((file) => uploadProgress[file.name] < 100)
                    .map((file, index) => {
                      const progress = uploadProgress[file.name] || 0
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                              {file.name}
                            </span>
                            <span className="text-sm text-gray-500 flex-shrink-0">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </motion.div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.filter((file) => uploadProgress[file.name] >= 100).length > 0 && (
              <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Uploaded Files ({uploadedFiles.filter((file) => uploadProgress[file.name] >= 100).length})
                </h3>
                <div className="max-h-48 sm:max-h-60 lg:max-h-72 overflow-y-auto space-y-2 pr-1">
                  {uploadedFiles
                    .filter((file) => uploadProgress[file.name] >= 100)
                    .map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate pr-2">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-md transition-colors ml-2"
                          aria-label={`Remove ${file.name}`}
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
              className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-between pt-2"
            >
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                className={`w-full sm:w-auto sm:min-w-[140px] px-6 py-2.5 text-white transition-all ${
                  allFilesUploaded
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!allFilesUploaded}
                onClick={onNext}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadStep
