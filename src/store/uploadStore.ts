import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileMeta {
    name: string;
    size: number;
    type: string;
}

interface UploadState {
    uploadedFiles: FileMeta[];
    uploadProgress: Record<string, number>;
    setUploadedFiles: (files: FileMeta[]) => void;
    addUploadedFiles: (files: FileMeta[]) => void;
    setUploadProgress: (progress: Record<string, number>) => void;
    updateFileProgress: (fileName: string, progress: number) => void;
    removeFile: (fileName: string) => void;
}

export const useUploadStore = create<UploadState>()(
    persist(
        (set, get) => ({
            uploadedFiles: [],
            uploadProgress: {},

            setUploadedFiles: (files) => set({ uploadedFiles: files }),

            addUploadedFiles: (files) => {
                const existing = get().uploadedFiles;
                const newMeta = files.map((f) => ({
                    name: f.name,
                    size: f.size,
                    type: f.type,
                }));
                set({ uploadedFiles: [...existing, ...newMeta] });
            },

            setUploadProgress: (progress) => set({ uploadProgress: progress }),

            updateFileProgress: (fileName, progress) => {
                set((state) => ({
                    uploadProgress: {
                        ...state.uploadProgress,
                        [fileName]: progress,
                    },
                }));
            },

            removeFile: (fileName) => {
                set((state) => {
                    const updatedFiles = state.uploadedFiles.filter(
                        (f) => f.name !== fileName
                    );
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [fileName]: _, ...updatedProgress } = state.uploadProgress;
                    return {
                        uploadedFiles: updatedFiles,
                        uploadProgress: updatedProgress,
                    };
                });
            },
        }),
        {
            name: "upload-storage",
        }
    )
);
  

