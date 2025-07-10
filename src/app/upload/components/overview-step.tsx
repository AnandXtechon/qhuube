"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Download, CheckCircle, AlertCircle, TrendingUp, Calendar, Mail, FileSpreadsheet, FileTextIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { fadeInLeft } from "@/lib/animation"
import { useUploadStore } from "@/store/uploadStore"
import { OverviewStepProps } from "@/app/types"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"


export default function OverviewStep({
    // onNext,
    onPrevious,
    // currentStep,
    // totalSteps,
    correctedData,
}: OverviewStepProps) {
    const { uploadedFiles } = useUploadStore()
    const [email, setEmail] = useState("")
    const [isEmailSending, setIsEmailSending] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const totalAmount = correctedData.reduce((sum, row) => sum + row.amount, 0)
    const totalVAT = correctedData.reduce((sum, row) => sum + (row.amount * row.vatRate) / 100, 0)
    const processedRecords = correctedData.length
    const correctedRecords = correctedData.filter((row) => row.corrected).length

    const handleDownloadReport = () => {
        // Mock download functionality
        const blob = new Blob(["VAT Compliance Report"], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "vat-compliance-report.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const handleDownloadCorrectedData = () => {
        // Mock download functionality
        const blob = new Blob(["Corrected Transaction Data"], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "corrected-transactions.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const handleSendEmail = async () => {
        if (!email) return

        setIsEmailSending(true)

        // Mock email sending - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsEmailSending(false)
        setEmailSent(true)

        toast.success("Email sent successfully")

        // Reset after 3 seconds
        setTimeout(() => {
            setEmailSent(false)
            setEmail("")
        }, 3000)
    }

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const getFileIcon = (fileName: string) => {
        const ext = fileName?.split(".").pop()?.toLowerCase();
        return ext === "csv" || ext === "txt" ? (
            <FileTextIcon className="w-8 h-8 text-sky-600" />
        ) : (
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
        );
    };

    return (
        <div className="px-2">
            {/* Header */}
            <motion.div variants={fadeInLeft} initial="hidden" animate="show" className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    VAT Compliance <span className="text-sky-600">Overview</span>
                </h2>
                <p className="text-lg font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Your data has been processed and is now VAT compliant. Review the summary and download your reports.
                </p>
            </motion.div>

            {/* Success Banner */}
            <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.2 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-green-900">Processing Complete!</h3>
                        <p className="text-green-700">
                            All {processedRecords} records have been processed and are now VAT compliant.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{processedRecords}</div>
                        <p className="text-xs text-muted-foreground">{correctedRecords} corrected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">£{totalAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Gross transaction value</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total VAT</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">£{totalVAT.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">VAT amount calculated</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                        <p className="text-xs text-muted-foreground">Compliance verified</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Files Processed */}
            <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Files Processed</h3>
                {uploadedFiles.length > 0 ? (
                    <div className="space-y-4">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl">{getFileIcon(file.type)}</div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {(file.size / 1024).toFixed(1)} KB • {file.type} • Processed successfully
                                    </p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No files found in storage</p>
                    </div>
                )}
            </motion.div>

            {/* Download Reports Section */}
            <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
            >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Download Reports</h3>

                {/* Download Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-sky-50 rounded-xl border border-sky-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">VAT Compliance Report</h4>
                                <p className="text-sm text-gray-600">Detailed compliance analysis</p>
                            </div>
                        </div>
                        <Button onClick={handleDownloadReport} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Download Report
                        </Button>
                    </div>

                    <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Corrected Data</h4>
                                <p className="text-sm text-gray-600">Clean transaction data</p>
                            </div>
                        </div>
                        <Button onClick={handleDownloadCorrectedData} className="w-full bg-green-600 hover:bg-green-700 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Download Data
                        </Button>
                    </div>
                </div>

                {/* Email Section */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Send Reports by Email</h4>
                            <p className="text-sm text-gray-600">Email both reports directly to your inbox</p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                        </Label>
                        <div className="flex gap-3 mt-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendEmail}
                                disabled={!isValidEmail(email) || isEmailSending}
                                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 px-6"
                            >
                                {isEmailSending ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : emailSent ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Sent!
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send
                                    </>
                                )}
                            </Button>
                        </div>
                        {/* {emailSent && <p className="text-sm text-green-600 mt-2">Reports sent successfully to {email}</p>} */}
                    </div>
                </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.6 }}
                className="flex justify-between items-center"
            >
                <Button variant="outline" onClick={onPrevious}>
                    Previous
                </Button>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white">Start New Process</Button>
            </motion.div>
        </div>
    )
}
