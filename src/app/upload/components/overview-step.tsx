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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useUploadStore } from "@/store/uploadStore"
import type { OverviewStepProps } from "@/app/types"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function OverviewStep({ onPrevious, correctedData }: OverviewStepProps) {
    const { uploadedFiles } = useUploadStore()
    const [email, setEmail] = useState("")
    const [isEmailSending, setIsEmailSending] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const totalAmount = correctedData?.reduce((sum, row) => sum + row.amount, 0) || 15420.75
    const totalVAT = correctedData?.reduce((sum, row) => sum + (row.amount * row.vatRate) / 100, 0) || 2456.32
    const processedRecords = correctedData?.length || 125

    const router = useRouter()

    const handleDownloadReport = () => {
        const blob = new Blob(["VAT Compliance Report"], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "vat-compliance-report.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Report downloaded successfully")
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

    const setUploadedFiles = useUploadStore((state) => state.setUploadedFiles)

    const handleStartNewProcess = () => {
        setUploadedFiles([])
        router.push("/upload?step=1")
    }

    return (
        <div className="min-h-screenpy-4 sm:py-6 lg:py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
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
                                    <Button
                                        onClick={handleDownloadReport}
                                        className="w-full bg-sky-600 hover:bg-sky-700 text-white justify-center h-10 sm:h-12 text-sm sm:text-base"
                                    >
                                        <FileText className="w-4 h-4" />
                                        VAT Compliance Report
                                    </Button>
                                    <Button
                                        onClick={handleDownloadCorrectedData}
                                        className="w-full justify-center h-10 sm:h-12 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
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
                                                    <span className="hidden sm:inline">Send</span>
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
                            className="w-full sm:w-auto h-10 sm:h-12 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-4 sm:px-6 order-2 sm:order-1"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous Step
                        </Button>
                        <Button
                            className="bg-sky-600 hover:bg-sky-700 text-white h-10 sm:h-12 px-4 sm:px-6 w-full sm:w-auto order-1 sm:order-2"
                            onClick={handleStartNewProcess}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Start New Process
                        </Button>
                    </div>

                    {/* Success Message */}
                    {/* <div className="mt-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-green-900 text-sm sm:text-base">Processing Complete!</h4>
                                <p className="text-xs sm:text-sm text-green-700 mt-1">
                                    All your files have been successfully processed and are ready for download.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
