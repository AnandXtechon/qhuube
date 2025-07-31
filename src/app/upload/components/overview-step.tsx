/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
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
    Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useUploadStore } from "@/store/uploadStore"

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
    const [isDownloadingAll, setIsDownloadingAll] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)

    const totalAmount = correctedData?.reduce((sum, row) => sum + row.amount, 0) || 15420.75
    const totalVAT = correctedData?.reduce((sum, row) => sum + (row.amount * row.vatRate) / 100, 0) || 2456.32
    const processedRecords = correctedData?.length || 125
    const router = useRouter()

    // Single file download function
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

    // Download all files function
    const handleDownloadAllReports = async () => {
        if (uploadedFiles.length === 0) {
            toast.error("No files available for download")
            return
        }

        setIsDownloadingAll(true)
        setDownloadProgress(0)
        toast.info(`Starting download of ${uploadedFiles.length} VAT reports...`)

        const downloadPromises = uploadedFiles.map(async (fileMeta, index) => {
            if (!(fileMeta.file instanceof File)) {
                console.warn(`Skipping ${fileMeta.name} - not a valid File object`)
                return { success: false, filename: fileMeta.name, error: "Invalid file object" }
            }

            try {
                const formData = new FormData()
                formData.append("file", fileMeta.file, fileMeta.name)

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/download-vat-report`, {
                    method: "POST",
                    body: formData,
                })

                if (!response.ok) throw new Error(`Failed to download VAT report for ${fileMeta.name}`)

                const blob = await response.blob()
                const cd = response.headers.get("Content-Disposition")
                let filename = "vat_report.xlsx"

                if (cd) {
                    const match = cd.match(/filename="?([^";]+)"?/)
                    if (match) filename = match[1]
                } else {
                    filename = fileMeta.name.replace(/\.[^.]+$/, "") + "_vat_report.xlsx"
                }

                // Create download link
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = filename
                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(url)

                // Update progress
                setDownloadProgress(((index + 1) / uploadedFiles.length) * 100)

                return { success: true, filename: fileMeta.name }
            } catch (error) {
                console.error(`Download failed for ${fileMeta.name}:`, error)
                return { success: false, filename: fileMeta.name, error }
            }
        })

        try {
            const results = await Promise.all(downloadPromises)
            const successful = results.filter((r) => r?.success).length
            const failed = results.filter((r) => r && !r.success).length

            if (successful === uploadedFiles.length) {
                toast.success(`Successfully downloaded all ${successful} VAT reports!`)
            } else if (successful > 0) {
                toast.warning(`Downloaded ${successful} reports successfully, ${failed} failed`)
            } else {
                toast.error("Failed to download any reports")
            }
        } catch (error) {
            console.error("Bulk download error:", error)
            toast.error("An error occurred during bulk download")
        } finally {
            setIsDownloadingAll(false)
            setDownloadProgress(0)
        }
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
                                <div className="space-y-4 mb-6">
                                    {/* Download All Reports Button */}
                                    {uploadedFiles.length > 0 && (
                                        <div className="space-y-3">
                                            <Button
                                                onClick={handleDownloadAllReports}
                                                disabled={isDownloadingAll}
                                                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white justify-center h-12 text-base font-semibold shadow-lg"
                                            >
                                                {isDownloadingAll ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        Downloading All Reports...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Package className="w-5 h-5 mr-2" />
                                                        Download All VAT Reports ({uploadedFiles.length})
                                                    </>
                                                )}
                                            </Button>

                                            {/* Progress indicator when downloading all */}
                                            {isDownloadingAll && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between text-sm text-blue-800 mb-2">
                                                        <span className="font-medium">Download Progress</span>
                                                        <span>{Math.round(downloadProgress)}%</span>
                                                    </div>
                                                    <div className="bg-blue-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                                            style={{ width: `${downloadProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-blue-700 mt-2">
                                                        Processing {uploadedFiles.length} files... Please wait.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Divider */}
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-200" />
                                                </div>
                                                <div className="relative flex justify-center text-xs uppercase">
                                                    <span className="bg-white px-2 text-gray-500">Or download individually</span>
                                                </div>
                                            </div>

                                            {/* Individual File Downloads */}
                                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Individual Reports:</p>
                                                {uploadedFiles.map((fileMeta, index) => (
                                                    <Button
                                                        key={index}
                                                        onClick={() => downloadVatReportForFile(fileMeta.name)}
                                                        disabled={downloadingFiles.has(fileMeta.name) || isDownloadingAll}
                                                        variant="outline"
                                                        className="w-full justify-start h-10 text-sm bg-white hover:bg-gray-50"
                                                    >
                                                        {downloadingFiles.has(fileMeta.name) ? (
                                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                                                        ) : (
                                                            <FileText className="w-4 h-4 mr-2" />
                                                        )}
                                                        {fileMeta.name.length > 30 ? `${fileMeta.name.substring(0, 30)}...` : fileMeta.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
