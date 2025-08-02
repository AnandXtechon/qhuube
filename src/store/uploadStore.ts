/* eslint-disable @typescript-eslint/no-unused-vars */
import { FileMeta, UploadState } from "@/app/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"


// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })
}

// Helper function to convert base64 back to File
const base64ToFile = (base64: string, filename: string, type: string): File => {
    const arr = base64.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || type
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}

// Create store WITH persistence for session management
export const useUploadStore = create<UploadState>()(
    persist(
        (set, get) => ({
            uploadedFiles: [],
            uploadProgress: {},
            sessionIds: {},
            paymentCompleted: false,

            setUploadedFiles: (files) => set({ uploadedFiles: files }),

            addUploadedFiles: async (files) => {
                const existing = get().uploadedFiles
                const newFileMeta: FileMeta[] = []

                // Convert files to serializable format
                for (const file of files) {
                    try {
                        const fileData = await fileToBase64(file)
                        newFileMeta.push({
                            file, // Keep original File object for immediate use
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            fileData, // Store base64 for persistence
                        })
                    } catch (error) {
                        console.error("Error converting file to base64:", error)
                        // Fallback without file data
                        newFileMeta.push({
                            name: file.name,
                            size: file.size,
                            type: file.type,
                        })
                    }
                }

                set({ uploadedFiles: [...existing, ...newFileMeta] })
            },

            setUploadProgress: (progress) => set({ uploadProgress: progress }),

            updateFileProgress: (fileName, progress) => {
                set((state) => ({
                    uploadProgress: {
                        ...state.uploadProgress,
                        [fileName]: progress,
                    },
                }))
            },

            removeFile: (fileName) => {
                set((state) => {
                    const updatedFiles = state.uploadedFiles.filter((f) => f.name !== fileName)
                    const { [fileName]: _, ...updatedProgress } = state.uploadProgress
                    const { [fileName]: __, ...updatedSessionIds } = state.sessionIds
                    return {
                        uploadedFiles: updatedFiles,
                        uploadProgress: updatedProgress,
                        sessionIds: updatedSessionIds,
                    }
                })
            },

            clearFiles: () =>
                set({
                    uploadedFiles: [],
                    uploadProgress: {},
                    sessionIds: {},
                    paymentCompleted: false,
                }),

            setSessionId: (fileName, sessionId) => {
                set((state) => ({
                    sessionIds: {
                        ...state.sessionIds,
                        [fileName]: sessionId,
                    },
                }))
            },

            setSessionIds: (sessionIds) => set({ sessionIds }),

            setPaymentCompleted: (completed) => set({ paymentCompleted: completed }),

            // Restore File objects from persisted base64 data
            restoreFileObjects: () => {
                const state = get()
                const restoredFiles = state.uploadedFiles.map((fileMeta) => {
                    if (!fileMeta.file && fileMeta.fileData) {
                        try {
                            const restoredFile = base64ToFile(fileMeta.fileData, fileMeta.name, fileMeta.type)
                            return {
                                ...fileMeta,
                                file: restoredFile,
                            }
                        } catch (error) {
                            console.error("Error restoring file from base64:", error)
                            return fileMeta
                        }
                    }
                    return fileMeta
                })

                if (restoredFiles.some((f) => f.file !== state.uploadedFiles.find((sf) => sf.name === f.name)?.file)) {
                    set({ uploadedFiles: restoredFiles })
                }
            },
        }),
        {
            name: "vat-upload-storage",
            // Only persist essential data, not File objects
            partialize: (state) => ({
                uploadedFiles: state.uploadedFiles.map((f) => ({
                    name: f.name,
                    size: f.size,
                    type: f.type,
                    fileData: f.fileData,
                    // Don't persist the File object
                })),
                uploadProgress: state.uploadProgress,
                sessionIds: state.sessionIds,
                paymentCompleted: state.paymentCompleted,
            }),
        },
    ),
)
