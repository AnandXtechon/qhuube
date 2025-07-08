"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    // Upload,
    FileText,
    FileSpreadsheet,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInLeft } from "@/lib/animation";
import { useFileUpload } from "../hooks/useFileUpload"
import Image from "next/image";
import { UploadStepProps } from "@/app/types";


const UploadStep = ({
    onNext,
    // currentStep,
    // totalSteps,
}: UploadStepProps) => {
    const [dragActive, setDragActive] = useState(false);

    const {
        uploadedFiles,
        uploadProgress,
        handleFiles,
        removeFile,
    } = useFileUpload();

    const getFileIcon = (fileName: string) => {
        const ext = fileName?.split(".").pop()?.toLowerCase();
        return ext === "csv" || ext === "txt" ? (
            <FileText className="w-8 h-8 text-sky-600" />
        ) : (
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
        );
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files?.length) {
                handleFiles(Array.from(e.dataTransfer.files));
            }
        },
        [handleFiles]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const allFilesUploaded =
        uploadedFiles.length > 0 &&
        uploadedFiles.every((file) => uploadProgress[file.name] >= 100);

    return (
        <div>
            {/* Header */}
            <motion.div variants={fadeInLeft} initial="hidden" animate="show" className="text-center mb-12">
                {/* <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Upload className="w-4 h-4" />
                    Step {currentStep} of {totalSteps}
                </div> */}
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Upload Your <span className="text-sky-600">Sales Data</span>
                </h2>
                <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                    Upload your transaction files to begin VAT compliance. We support CSV, TXT, XLS, and XLSX formats.
                </p>
            </motion.div>

            {/* Upload Area */}
            <motion.div variants={fadeInLeft} initial="hidden" animate="show" className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                <div
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center ${dragActive ? "border-sky-500 bg-sky-50" : "border-gray-300 hover:border-sky-400 hover:bg-gray-50"}`}
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
                        className="absolute inset-0 w-full- h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-6">
                        <div className="flex items-center justify-center mx-auto">
                            <Image
                                src="/icons/document.png"
                                alt="document-icon"
                                width={100}
                                height={100}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag and drop your files here</h3>
                            <p className="text-gray-600 mb-4">or click to browse from your computer</p>
                            <Button className="bg-sky-600 hover:bg-sky-700 text-white">Choose Files</Button>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> CSV, TXT</span>
                            <span className="flex items-center gap-1"><FileSpreadsheet className="w-4 h-4" /> XLS, XLSX</span>
                            <span className="font-medium text-sky-600">Max file size: 5MB</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <motion.div variants={fadeInLeft} initial="hidden" animate="show" className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Uploaded Files</h3>
                    <div className="space-y-4">
                        {uploadedFiles.map((file, index) => {
                            const progress = uploadProgress[file.name] || 0;
                            const isComplete = progress >= 100;
                            return (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                            <div className="flex items-center gap-2">
                                                {isComplete ? (
                                                    <Image
                                                        src="/icons/check.svg"
                                                        alt="Check"
                                                        width={20}
                                                        height={20}
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-500">
                                                        {file.name ? `${Math.round(progress)}%` : "Loading..."}
                                                    </span>
                                                )}
                                                {file.name && (
                                                    <button
                                                        onClick={() => removeFile(file.name)}
                                                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                            <span>{formatFileSize(file.size)}</span>
                                            <span>{isComplete ? "Upload complete" : "Uploading..."}</span>
                                        </div>
                                        {!isComplete && (
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-sky-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Navigation */}
            <motion.div variants={fadeInLeft} initial="hidden" animate="show" className="flex justify-between items-center">
                <Button variant="outline" disabled className="text-gray-400 bg-transparent">Previous</Button>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white" disabled={!allFilesUploaded} onClick={onNext}>
                    Continue
                </Button>
            </motion.div>
        </div>
    );
};

export default UploadStep;
