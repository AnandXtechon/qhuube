"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fadeInLeft } from "@/lib/animation"
import { CorrectionStepProps, TaxIssue } from "@/app/types"



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CorrectionStep({ onNext, onPrevious, currentStep, totalSteps }: CorrectionStepProps) {
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
                return "text-red-600 bg-red-50"
            case "medium":
                return "text-orange-600 bg-orange-50"
            case "low":
                return "text-yellow-600 bg-yellow-50"
            default:
                return "text-gray-600 bg-gray-50"
        }
    }

    const totalFiles = 125
    const totalIssues = issues.length
    const correctedIssues = issues.filter((issue) => issue.status === "corrected").length
    const pendingIssues = issues.filter((issue) => issue.status === "pending").length
    const allIssuesResolved = issues.every((issue) => issue.status !== "pending")

    return (
        <div>
            {/* Header */}
            <motion.div variants={fadeInLeft} initial="hidden" animate="show" className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Review & <span className="text-sky-600">Correct Issues</span>
                </h2>
                <p className="text-lg font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Review the issues found in your uploaded tax documents and apply corrections before proceeding.
                </p>
            </motion.div>

            {/* Files Summary */}
            <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{totalFiles}</div>
                            <div className="text-sm text-gray-600">Files Processed</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-red-600">{pendingIssues}</div>
                            <div className="text-sm text-gray-600">Issues Found</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">{correctedIssues}</div>
                            <div className="text-sm text-gray-600">Issues Corrected</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Issues Table */}
            <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8"
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Tax Compliance Issues</h3>
                    <p className="text-gray-600 mt-1">Review and correct the issues found in your tax documents</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tax Code</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">VAT Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Correction</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {issues.map((issue) => (
                                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                            <div>
                                                <div className="font-medium text-gray-900">{issue.issueType}</div>
                                                <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                                                    {issue.severity.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{issue.invoiceNumber}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{issue.invoiceDate}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{issue.taxCode}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {issue.currency} {issue.vatAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-600 font-medium line-through">{issue.originalValue}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className="text-green-600 font-medium">{issue.suggestedValue}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {issue.status === "corrected" ? (
                                            <Badge className="bg-green-100 text-green-800">Corrected</Badge>
                                        ) : issue.status === "ignored" ? (
                                            <Badge className="bg-gray-100 text-gray-800">Ignored</Badge>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleCorrectIssue(issue.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white h-8 px-3 text-xs"
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleIgnoreIssue(issue.id)}
                                                    className="h-8 px-3 text-xs"
                                                >
                                                    Ignore
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Progress Summary */}
            {correctedIssues > 0 && (
                <motion.div
                    variants={fadeInLeft}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.4 }}
                    className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-900">Correction Progress</h4>
                            <p className="text-green-700">
                                {correctedIssues} of {totalIssues} issues have been resolved
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

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
                <Button className="bg-sky-600 hover:bg-sky-700 text-white" disabled={!allIssuesResolved} onClick={onNext}>
                    {allIssuesResolved ? "Continue to Payment" : `Resolve ${pendingIssues} Issues`}
                </Button>
            </motion.div>
        </div>
    )
}
