/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand"

interface FileMeta {
    file: File // Store the actual File object
    name: string
    size: number
    type: string
}

interface UploadState {
    uploadedFiles: FileMeta[]
    uploadProgress: Record<string, number>
    setUploadedFiles: (files: FileMeta[]) => void
    addUploadedFiles: (files: File[]) => void
    setUploadProgress: (progress: Record<string, number>) => void
    updateFileProgress: (fileName: string, progress: number) => void
    removeFile: (fileName: string) => void
    clearFiles: () => void
}

// Create store WITHOUT persistence to avoid File object serialization issues
export const useUploadStore = create<UploadState>()((set, get) => ({
    uploadedFiles: [],
    uploadProgress: {},

    setUploadedFiles: (files) => set({ uploadedFiles: files }),

    addUploadedFiles: (files) => {
        const existing = get().uploadedFiles
        const newFileMeta = files.map((file) => ({
            file, // Store the actual File object
            name: file.name,
            size: file.size,
            type: file.type,
        }))
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
            return {
                uploadedFiles: updatedFiles,
                uploadProgress: updatedProgress,
            }
        })
    },

    clearFiles: () => set({ uploadedFiles: [], uploadProgress: {} }),
}))
