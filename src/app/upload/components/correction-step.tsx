"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, FileText, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CorrectionStepProps, TaxIssue } from "@/app/types"

export default function CorrectionStep({ onNext, onPrevious }: CorrectionStepProps) {
    const [issues, setIssues] = useState<TaxIssue[]>([
        {
            id: 1,
            invoiceNumber: "INV-2024-001",
            invoiceDate: "2024-01-15",
            taxCode: "A2",
            vatAmount: 245.5,
            currency: "EUR",
            issueType: "WRONG TAX NUMBER",
            originalValue: "20%",
            suggestedValue: "12%",
            status: "pending",
            severity: "high",
        },
        {
            id: 2,
            invoiceNumber: "INV-2024-002",
            invoiceDate: "2024-01-16",
            taxCode: "B1",
            vatAmount: 156.75,
            currency: "EUR",
            issueType: "MISSING VAT CODE",
            originalValue: "",
            suggestedValue: "DE123456789",
            status: "pending",
            severity: "high",
        },
        {
            id: 3,
            invoiceNumber: "INV-2024-003",
            invoiceDate: "2024-01-17",
            taxCode: "C3",
            vatAmount: 89.2,
            currency: "EUR",
            issueType: "INCORRECT DATE FORMAT",
            originalValue: "15/01/2024",
            suggestedValue: "2024-01-15",
            status: "pending",
            severity: "medium",
        },
        {
            id: 4,
            invoiceNumber: "INV-2024-004",
            invoiceDate: "2024-01-18",
            taxCode: "A1",
            vatAmount: 312.4,
            currency: "EUR",
            issueType: "INVALID CURRENCY CODE",
            originalValue: "EURO",
            suggestedValue: "EUR",
            status: "corrected",
            severity: "low",
        },
        {
            id: 5,
            invoiceNumber: "INV-2024-005",
            invoiceDate: "2024-01-19",
            taxCode: "B2",
            vatAmount: 198.6,
            currency: "EUR",
            issueType: "WRONG TAX RATE",
            originalValue: "25%",
            suggestedValue: "19%",
            status: "pending",
            severity: "high",
        },
        {
            id: 6,
            invoiceNumber: "INV-2024-001",
            invoiceDate: "2024-01-15",
            taxCode: "A2",
            vatAmount: 245.5,
            currency: "EUR",
            issueType: "WRONG TAX NUMBER",
            originalValue: "20%",
            suggestedValue: "12%",
            status: "pending",
            severity: "high",
        },
        {
            id: 7,
            invoiceNumber: "INV-2024-002",
            invoiceDate: "2024-01-16",
            taxCode: "B1",
            vatAmount: 156.75,
            currency: "EUR",
            issueType: "MISSING VAT CODE",
            originalValue: "",
            suggestedValue: "DE123456789",
            status: "pending",
            severity: "high",
        },
        {
            id: 8,
            invoiceNumber: "INV-2024-003",
            invoiceDate: "2024-01-17",
            taxCode: "C3",
            vatAmount: 89.2,
            currency: "EUR",
            issueType: "INCORRECT DATE FORMAT",
            originalValue: "15/01/2024",
            suggestedValue: "2024-01-15",
            status: "pending",
            severity: "medium",
        },
        {
            id: 9,
            invoiceNumber: "INV-2024-004",
            invoiceDate: "2024-01-18",
            taxCode: "A1",
            vatAmount: 312.4,
            currency: "EUR",
            issueType: "INVALID CURRENCY CODE",
            originalValue: "EURO",
            suggestedValue: "EUR",
            status: "corrected",
            severity: "low",
        },
        {
            id: 10,
            invoiceNumber: "INV-2024-005",
            invoiceDate: "2024-01-19",
            taxCode: "B2",
            vatAmount: 198.6,
            currency: "EUR",
            issueType: "WRONG TAX RATE",
            originalValue: "25%",
            suggestedValue: "19%",
            status: "pending",
            severity: "high",
        },
        
    ])

    const handleCorrectIssue = (id: number) => {
        setIssues((prev) => prev.map((issue) => (issue.id === id ? { ...issue, status: "corrected" as const } : issue)))
    }

    const handleIgnoreIssue = (id: number) => {
        setIssues((prev) => prev.map((issue) => (issue.id === id ? { ...issue, status: "ignored" as const } : issue)))
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-100 text-red-700 border-red-200"
            case "medium":
                return "bg-orange-100 text-orange-700 border-orange-200"
            case "low":
                return "bg-yellow-100 text-yellow-700 border-yellow-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "corrected":
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case "ignored":
                return <div className="w-4 h-4 rounded-full bg-gray-400" />
            default:
                return <AlertTriangle className="w-4 h-4 text-red-500" />
        }
    }

    const totalFiles = 125
    const correctedIssues = issues.filter((issue) => issue.status === "corrected").length
    const pendingIssues = issues.filter((issue) => issue.status === "pending").length
    const allIssuesResolved = issues.every((issue) => issue.status !== "pending")

    return (
        <div className="min-h-screen  py-4 sm:py-6 lg:py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl  mx-auto mt-16">
                    {/* Header */}
                    <div className="text-center mb-6 lg:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Tax Correction Review</h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Review and correct the identified tax issues in your uploaded files
                        </p>
                    </div> 

                    {/* Header Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-8">
                        <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xl lg:text-2xl font-semibold text-gray-900">{totalFiles}</div>
                                    <div className="text-sm text-gray-600">Files Processed</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                                </div>
                                <div>
                                    <div className="text-xl lg:text-2xl font-semibold text-red-600">{pendingIssues}</div>
                                    <div className="text-sm text-gray-600">Issues Found</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-xl lg:text-2xl font-semibold text-green-600">{correctedIssues}</div>
                                    <div className="text-sm text-gray-600">Corrected</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden space-y-3 mb-6">
                        {issues.map((issue) => (
                            <motion.div
                                key={issue.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                            >
                                <div className="space-y-3">
                                    {/* Issue Header */}
                                    <div className="flex items-start gap-3">
                                        {getStatusIcon(issue.status)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900 text-sm">{issue.issueType}</h4>
                                                <Badge className={`text-xs px-2 py-0.5 ${getSeverityColor(issue.severity)}`}>
                                                    {issue.severity}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-gray-600 space-y-1">
                                                <div>
                                                    {issue.invoiceNumber} • {issue.invoiceDate}
                                                </div>
                                                <div>
                                                    Tax Code: {issue.taxCode} • VAT: {issue.currency} {issue.vatAmount.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Correction */}
                                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-lg">
                                        <span className="text-red-600 line-through font-mono bg-red-50 px-2 py-1 rounded text-xs">
                                            {issue.originalValue || "—"}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                        <span className="text-green-600 font-mono bg-green-50 px-2 py-1 rounded text-xs">
                                            {issue.suggestedValue}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {issue.status === "corrected" ? (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">Corrected</Badge>
                                        ) : issue.status === "ignored" ? (
                                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">Ignored</Badge>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleCorrectIssue(issue.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white h-8 px-4 text-sm flex-1"
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleIgnoreIssue(issue.id)}
                                                    className="h-8 px-4 text-sm flex-1"
                                                >
                                                    Ignore
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden md:block bg-white border border-gray-200 shadow-sm mb-6 overflow-hidden">
                        <div className={`${issues.length > 5 ? "max-h-[300px] md:max-h-[400px] overflow-y-auto" : ""}`}>
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                    <TableRow className="border-b border-gray-200">
                                        <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Issue Type</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Invoice Details</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Tax Info</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Correction</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Severity</TableHead>
                                        <TableHead className="font-semibold text-gray-900 text-xs md:text-sm text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issues.map((issue) => (
                                        <TableRow key={issue.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <TableCell className="py-2 md:py-4">
                                                <div className="font-medium text-gray-900 text-xs md:text-sm">{issue.issueType}</div>
                                            </TableCell>
                                            <TableCell className="py-2 md:py-4">
                                                <div className="text-xs md:text-sm text-gray-900">{issue.invoiceNumber}</div>
                                                <div className="text-xs text-gray-500">{issue.invoiceDate}</div>
                                            </TableCell>
                                            <TableCell className="py-2 md:py-4">
                                                <div className="text-xs md:text-sm text-gray-900">Code: {issue.taxCode}</div>
                                                <div className="text-xs text-gray-500">
                                                    VAT: {issue.currency} {issue.vatAmount.toFixed(2)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2 md:py-4">
                                                <div className="flex items-center gap-1 md:gap-2">
                                                    <span className="text-red-600 line-through font-mono bg-red-50 px-1 md:px-2 py-1 rounded text-xs">
                                                        {issue.originalValue || "—"}
                                                    </span>
                                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                                    <span className="text-green-600 font-mono bg-green-50 px-1 md:px-2 py-1 rounded text-xs">
                                                        {issue.suggestedValue}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2 md:py-4">
                                                <Badge className={`text-xs px-1 md:px-2 py-1 ${getSeverityColor(issue.severity)}`}>
                                                    {issue.severity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-2 md:py-4 text-right">
                                                <div className="flex gap-1 md:gap-2 justify-end">
                                                    {issue.status === "corrected" ? (
                                                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Corrected</Badge>
                                                    ) : issue.status === "ignored" ? (
                                                        <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">Ignored</Badge>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleCorrectIssue(issue.id)}
                                                                className="bg-green-500 hover:bg-green-600 text-white h-6 md:h-7 px-2 md:px-3 text-xs"
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleIgnoreIssue(issue.id)}
                                                                className="h-6 md:h-7 px-2 md:px-3 text-xs"
                                                            >
                                                                Ignore
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Progress Summary */}
                    {/* {correctedIssues > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 lg:p-6 mb-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="font-medium text-green-900 text-sm lg:text-base">
                                        {correctedIssues} of {issues.length} issues resolved
                                    </div>
                                    <div className="text-green-700 text-xs lg:text-sm">
                                        {allIssuesResolved ? "All issues have been addressed" : `${pendingIssues} issues remaining`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={onPrevious}
                            className="w-full sm:w-auto h-10 bg-transparent flex items-center justify-center px-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <Button
                            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white h-10 px-6"
                            disabled={!allIssuesResolved}
                            onClick={onNext}
                        >
                            {allIssuesResolved ? "Continue to Payment" : `Resolve ${pendingIssues} Issues`}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
