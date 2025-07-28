/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import {
    FileText,
    Download,
    CheckCircle,
    TrendingUp,
    Calendar,
    Mail,
    FileSpreadsheet,
    FileTextIcon,
    RotateCcw,
    ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useUploadStore } from "@/store/uploadStore"


interface ValidationIssue {
    id: number
    invoiceNumber: string
    invoiceDate: string
    taxCode: string
    vatAmount: number
    currency: string
    issueType: string
    originalValue: string
    suggestedValue: string
    status: "pending" | "corrected"
    severity: "high" | "medium" | "low"
    details: any
}

interface OverviewStepProps {
    onPrevious: () => void
    correctedData?: any[]
}

export default function OverviewStep({ onPrevious, correctedData }: OverviewStepProps) {
    const { uploadedFiles, setUploadedFiles } = useUploadStore()
    const [email, setEmail] = useState("")
    const [isEmailSending, setIsEmailSending] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
    const [showFileRestoration, setShowFileRestoration] = useState(false)

    const totalAmount = correctedData?.reduce((sum, row) => sum + row.amount, 0) || 15420.75
    const totalVAT = correctedData?.reduce((sum, row) => sum + (row.amount * row.vatRate) / 100, 0) || 2456.32
    const processedRecords = correctedData?.length || 125
    const router = useRouter()

    const [issues, setIssues] = useState<ValidationIssue[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [validationError, setValidationError] = useState<string | null>(null)
    const [validationSummary, setValidationSummary] = useState<any>(null)

    // Check if files are available and have valid File objects
    const hasValidFiles = uploadedFiles.length > 0 && uploadedFiles.every((f) => f.file instanceof File)

    useEffect(() => {
        // Check if we have files but they're missing File objects
        if (uploadedFiles.length > 0 && !hasValidFiles) {
            console.log("Files found but File objects are missing, showing restoration UI")
            setShowFileRestoration(true)
        } else if (uploadedFiles.length === 0) {
            console.log("No files found at all")
            setShowFileRestoration(true)
        } else {
            setShowFileRestoration(false)
        }
    }, [uploadedFiles, hasValidFiles])

    const validationIssues = useCallback(async () => {
        if (!hasValidFiles) {
            console.log("No valid files to validate")
            return
        }

        setIsLoading(true)
        setValidationError(null)

        try {
            const formData = new FormData()

            // Add files to FormData
            uploadedFiles.forEach((fileMeta) => {
                if (fileMeta.file instanceof File) {
                    formData.append("files", fileMeta.file, fileMeta.name)
                }
            })

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/validate-file`, formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
                timeout: 30000,
            })

            console.log("Validation Result:", response.data)
            setValidationSummary(response.data)

            // Transform backend response to ValidationIssue format
            const transformedIssues: ValidationIssue[] = []
            let issueId = 1

            response.data.files?.forEach((fileResult: any) => {
                if (fileResult.has_issues && fileResult.validation_result) {
                    const { validation_result } = fileResult

                    // Handle missing headers with detailed information
                    validation_result.missing_headers_detailed?.forEach((headerIssue: any) => {
                        transformedIssues.push({
                            id: issueId++,
                            invoiceNumber: fileResult.file_name,
                            invoiceDate: new Date().toISOString().split("T")[0],
                            taxCode: "N/A",
                            vatAmount: 0,
                            currency: "EUR",
                            issueType: `Missing Column: ${headerIssue.header_label}`,
                            originalValue: "Column not found",
                            suggestedValue: `Add '${headerIssue.header_label}' column`,
                            status: "pending",
                            severity: "high",
                            details: {
                                columnName: headerIssue.header_label,
                                description: headerIssue.description,
                                expectedType: "column",
                            },
                        })
                    })

                    // Handle data quality issues with detailed information
                    validation_result.data_issues?.forEach((dataIssue: any) => {
                        const isInvalidType = dataIssue.issue_type === "INVALID_TYPE"
                        const isMissingData = dataIssue.issue_type === "MISSING_DATA"
                        let issueTypeLabel = ""
                        let originalValue = ""
                        let suggestedValue = ""
                        let severity: "high" | "medium" | "low" = "low"

                        if (isInvalidType) {
                            issueTypeLabel = `Invalid Data Type: ${dataIssue.column_name}`
                            originalValue = `${dataIssue.invalid_count} invalid ${dataIssue.expected_type} values (${dataIssue.percentage}%)`
                            suggestedValue = `Fix data format in ${dataIssue.column_name} to match ${dataIssue.expected_type} type`
                            severity = dataIssue.percentage > 50 ? "high" : dataIssue.percentage > 20 ? "medium" : "low"
                        } else if (isMissingData) {
                            issueTypeLabel = `Missing Data: ${dataIssue.column_name}`
                            originalValue = `${dataIssue.total_missing} empty values (${dataIssue.percentage}%)`
                            suggestedValue = `Fill missing data in ${dataIssue.column_name}`
                            severity = dataIssue.percentage > 50 ? "high" : dataIssue.percentage > 20 ? "medium" : "low"
                        }

                        transformedIssues.push({
                            id: issueId++,
                            invoiceNumber: fileResult.file_name,
                            invoiceDate: new Date().toISOString().split("T")[0],
                            taxCode: "N/A",
                            vatAmount: 0,
                            currency: "EUR",
                            issueType: issueTypeLabel,
                            originalValue: originalValue,
                            suggestedValue: suggestedValue,
                            status: "pending",
                            severity: severity,
                            details: {
                                columnName: dataIssue.column_name,
                                dataType: dataIssue.data_type,
                                missingRows: dataIssue.missing_rows,
                                invalidRows: dataIssue.invalid_rows,
                                hasMoreRows: dataIssue.has_more_rows,
                                totalMissing: dataIssue.total_missing,
                                totalRows: dataIssue.total_rows,
                                invalidCount: dataIssue.invalid_count,
                                percentage: dataIssue.percentage,
                                description: dataIssue.issue_description,
                                expectedType: dataIssue.expected_type,
                            },
                        })
                    })
                }
            })

            setIssues(transformedIssues)
        } catch (err: any) {
            console.error("Validation error:", err.response?.data || err.message)
            let errorMessage = "Validation failed"

            if (err.response?.data) {
                if (typeof err.response.data === "string") {
                    errorMessage = err.response.data
                } else if (err.response.data.detail) {
                    if (Array.isArray(err.response.data.detail)) {
                        errorMessage = err.response.data.detail
                            .map((error: any) => {
                                if (typeof error === "string") return error
                                if (error.msg) return `${error.loc?.join(".") || "Field"}: ${error.msg}`
                                return JSON.stringify(error)
                            })
                            .join(", ")
                    } else {
                        errorMessage = err.response.data.detail
                    }
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message
                } else {
                    errorMessage = JSON.stringify(err.response.data)
                }
            } else if (err.message) {
                errorMessage = err.message
            }

            setValidationError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [uploadedFiles, hasValidFiles])

    useEffect(() => {
        if (hasValidFiles) {
            validationIssues()
        }
    }, [validationIssues, hasValidFiles])

    const handleFilesRestored = () => {
        setShowFileRestoration(false)
        toast.success("Files restored successfully!")
    }

    async function downloadVatReportForFile(invoiceNumberOrFileName: string) {
        setDownloadingFiles((prev) => new Set(prev).add(invoiceNumberOrFileName))

        try {
            const fileMeta = uploadedFiles.find((f) => f.name === invoiceNumberOrFileName)
            if (!fileMeta || !(fileMeta.file instanceof File)) {
                toast.error("Original file not found for download")
                return
            }

            const formData = new FormData()
            formData.append("file", fileMeta.file, fileMeta.name)

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/download-vat-report`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to download VAT report")

            const blob = await response.blob()
            const cd = response.headers.get("Content-Disposition")
            let filename = "vat_report.xlsx"

            if (cd) {
                const match = cd.match(/filename="?([^";]+)"?/)
                if (match) filename = match[1]
            } else {
                filename = fileMeta.name.replace(/\.[^.]+$/, "") + "_vat_report.xlsx"
            }

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.success("VAT report downloaded successfully")
        } catch (err) {
            console.error("Download failed", err)
            toast.error("Failed to download VAT report")
        } finally {
            setDownloadingFiles((prev) => {
                const newSet = new Set(prev)
                newSet.delete(invoiceNumberOrFileName)
                return newSet
            })
        }
    }

    const handleDownloadCorrectedData = () => {
        const blob = new Blob(["Corrected Transaction Data"], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "corrected-transactions.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Data downloaded successfully")
    }

    const handleSendEmail = async () => {
        if (!email) return
        setIsEmailSending(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsEmailSending(false)
        setEmailSent(true)
        toast.success("Email sent successfully")
        setTimeout(() => {
            setEmailSent(false)
            setEmail("")
        }, 3000)
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const getFileIcon = (fileName: string) => {
        const ext = fileName?.split(".").pop()?.toLowerCase()
        return ext === "csv" || ext === "txt" ? (
            <FileTextIcon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
        ) : (
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        )
    }

    const handleStartNewProcess = () => {
        setUploadedFiles([])
        router.push("/upload?step=1")
    }

    // Show validation error if exists
    if (validationError) {
        return (
            <div className="min-h-screen py-4 sm:py-6 lg:py-8 mt-16 xl:mt-4">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Validation Error</h2>
                            <p className="text-red-600 mb-4">{validationError}</p>
                            <div className="flex gap-4 justify-center">
                                <Button variant="outline" onClick={onPrevious} className="bg-white border-gray-300">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Go Back
                                </Button>
                                <Button onClick={handleStartNewProcess} className="bg-sky-600 hover:bg-sky-700 text-white">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Start Over
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen py-4 sm:py-6 lg:py-8 mt-16 xl:mt-4">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-blue-800 mb-2">Processing Files</h2>
                            <p className="text-blue-600">Validating your uploaded files...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-4 sm:py-6 lg:py-8 mt-16 xl:mt-4">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-full mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 lg:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Processing Complete</h1>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Your VAT compliance processing has been completed successfully. Review the results and download your
                            reports.
                        </p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
                        {/* Records Processed */}
                        <Card className="border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
                                <div className="rounded-full bg-blue-100 p-2 sm:p-3 flex-shrink-0">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Records Processed</div>
                                    <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{processedRecords}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Amount */}
                        <Card className="border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
                                <div className="rounded-full bg-green-100 p-2 sm:p-3 flex-shrink-0">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Amount</div>
                                    <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                                        €{totalAmount.toFixed(0)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total VAT */}
                        <Card className="border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
                                <div className="rounded-full bg-red-100 p-2 sm:p-3 flex-shrink-0">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Total VAT</div>
                                    <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                                        €{totalVAT.toFixed(0)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Processed Date */}
                        <Card className="border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6">
                                <div className="rounded-full bg-purple-100 p-2 sm:p-3 flex-shrink-0">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Processed Date</div>
                                    <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                        {/* Files Processed */}
                        <Card className="border border-gray-200 shadow-sm rounded-xl">
                            <CardContent className="p-4 sm:p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Files Processed ({uploadedFiles.length})
                                </h3>
                                {uploadedFiles.length > 0 ? (
                                    <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                                        {uploadedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                {getFileIcon(file.name)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{file.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        {(file.size / 1024).toFixed(1)} KB • Processed ✓
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm sm:text-base">No files found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Download & Email */}
                        <Card className="border border-gray-200 shadow-sm rounded-xl">
                            <CardContent className="p-4 sm:p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg">
                                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Download Reports
                                </h3>

                                {/* Download Buttons */}
                                <div className="space-y-3 mb-6">
                                    {/* VAT Reports for each file */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700 mb-2">VAT Reports by File:</p>
                                            {uploadedFiles.map((fileMeta, index) => (
                                                <Button
                                                    key={index}
                                                    onClick={() => downloadVatReportForFile(fileMeta.name)}
                                                    disabled={downloadingFiles.has(fileMeta.name)}
                                                    className="w-full bg-sky-600 hover:bg-sky-700 text-white justify-start h-10 sm:h-12 text-sm sm:text-base"
                                                >
                                                    {downloadingFiles.has(fileMeta.name) ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 mr-2" />
                                                    )}
                                                    {fileMeta.name.length > 25 ? `${fileMeta.name.substring(0, 25)}...` : fileMeta.name}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Corrected Data Download */}
                                    <Button
                                        onClick={handleDownloadCorrectedData}
                                        className="w-full justify-center h-10 sm:h-12 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                                        Corrected Transaction Data
                                    </Button>
                                </div>

                                {/* Email Section */}
                                <div className="border-t pt-4 sm:pt-6">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2 mb-3"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email Reports
                                    </Label>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
                                        />
                                        <Button
                                            onClick={handleSendEmail}
                                            disabled={!isValidEmail(email) || isEmailSending}
                                            className="bg-purple-600 hover:bg-purple-700 text-white h-10 sm:h-12 px-4 sm:px-6 w-full sm:w-auto"
                                        >
                                            {isEmailSending ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : emailSent ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <>
                                                    <Mail className="w-4 h-4" />
                                                    <span className="hidden sm:inline ml-2">Send</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={onPrevious}
                            className="w-full sm:w-auto bg-white border-gray-300 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 px-4 sm:px-6 order-2 sm:order-1"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous Step
                        </Button>
                        <Button
                            className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 cursor-pointer sm:px-6 w-full sm:w-auto order-1 sm:order-2"
                            onClick={handleStartNewProcess}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Start New Process
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
