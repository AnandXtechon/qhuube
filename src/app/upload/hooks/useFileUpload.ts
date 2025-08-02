"use client"

import { useCallback } from "react"
import { useUploadStore } from "@/store/uploadStore"

export const useFileUpload = () => {
    const { uploadedFiles, uploadProgress, sessionIds, addUploadedFiles, updateFileProgress, removeFile, setSessionId } =
        useUploadStore()

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
        async (files: File[]) => {
            const validFiles = files.filter((file) => {
                const extension = file.name.split(".").pop()?.toLowerCase()
                const isValidType = ["csv", "txt", "xls", "xlsx"].includes(extension || "")
                const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
                return isValidType && isValidSize
            })

            if (validFiles.length > 0) {
                addUploadedFiles(validFiles)

                // Simulate upload progress for each file
                validFiles.forEach((file) => simulateUpload(file.name))

                // After upload simulation is complete, we would normally get session IDs
                // For now, we'll generate mock session IDs
                // In real implementation, this would come from the validation API response
                setTimeout(() => {
                    validFiles.forEach((file) => {
                        const mockSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                        setSessionId(file.name, mockSessionId)
                    })
                }, 2000) // Wait for upload simulation to complete
            }
        },
        [addUploadedFiles, simulateUpload, setSessionId],
    )

    return {
        uploadedFiles,
        uploadProgress,
        sessionIds,
        handleFiles,
        removeFile,
    }
}
