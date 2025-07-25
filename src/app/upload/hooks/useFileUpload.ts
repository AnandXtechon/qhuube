"use client"

import { useCallback } from "react"
import { useUploadStore } from "@/store/uploadStore"

export const useFileUpload = () => {
    const { uploadedFiles, uploadProgress, addUploadedFiles, updateFileProgress, removeFile } = useUploadStore()

    const simulateUpload = useCallback(
        (fileName: string) => {
            let progress = 0
            const interval = setInterval(() => {
                progress += Math.random() * 30
                if (progress >= 100) {
                    progress = 100
                    clearInterval(interval)
                }
                updateFileProgress(fileName, progress)
            }, 200)
        },
        [updateFileProgress],
    )

    const handleFiles = useCallback(
        (files: File[]) => {
            const validFiles = files.filter((file) => {
                const extension = file.name.split(".").pop()?.toLowerCase()
                const isValidType = ["csv", "txt", "xls", "xlsx"].includes(extension || "")
                const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
                return isValidType && isValidSize
            })

            if (validFiles.length > 0) {
                addUploadedFiles(validFiles)
                validFiles.forEach((file) => simulateUpload(file.name))
            }
        },
        [addUploadedFiles, simulateUpload],
    )

    return {
        uploadedFiles,
        uploadProgress,
        handleFiles,
        removeFile,
    }
}
