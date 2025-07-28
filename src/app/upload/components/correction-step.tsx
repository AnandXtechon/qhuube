/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Download,
  Info,
  XCircle,
  AlertCircle,
  Database,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CorrectionStepProps, ValidationIssue } from "@/app/types"
import { useUploadStore } from "@/store/uploadStore"
import axios from "axios"


export default function CorrectionStep({ onNext, onPrevious }: CorrectionStepProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validationSummary, setValidationSummary] = useState<any>(null)
  const { uploadedFiles } = useUploadStore()

  const totalFiles = uploadedFiles.length
  const correctedIssues = issues.filter((issue) => issue.status === "corrected").length
  const pendingIssues = issues.filter((issue) => issue.status === "pending").length
  const allIssuesResolved = issues.every((issue) => issue.status !== "pending")

  // Group issues by type for better organization
  const groupedIssues = issues.reduce(
    (acc, issue) => {
      const type = issue.issueType.includes("Missing Column")
        ? "missing_headers"
        : issue.issueType.includes("Missing Data")
          ? "missing_data"
          : issue.issueType.includes("Invalid")
            ? "invalid_data"
            : "other"

      if (!acc[type]) acc[type] = []
      acc[type].push(issue)
      return acc
    },
    {} as Record<string, ValidationIssue[]>,
  )

  const handleDownloadCorrectedFiles = async () => {
    try {
      const report = {
        summary: {
          totalFiles: totalFiles,
          totalIssues: issues.length,
          correctedIssues: correctedIssues,
          pendingIssues: pendingIssues,
          validationDate: new Date().toISOString(),
          issueBreakdown: {
            missingHeaders: groupedIssues.missing_headers?.length || 0,
            missingData: groupedIssues.missing_data?.length || 0,
            invalidData: groupedIssues.invalid_data?.length || 0,
            other: groupedIssues.other?.length || 0,
          },
        },
        files: uploadedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        issues: issues.map((issue) => ({
          id: issue.id,
          file: issue.invoiceNumber,
          type: issue.issueType,
          severity: issue.severity,
          status: issue.status,
          originalValue: issue.originalValue,
          suggestedValue: issue.suggestedValue,
          details: issue.details,
        })),
        validationSummary,
      }

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `validation-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading report:", error)
    }
  }

  const validationIssues = useCallback(async () => {
    if (uploadedFiles.length === 0) {
      console.log("No files to validate")
      return
    }

    setIsLoading(true)
    setValidationError(null)

    try {
      const formData = new FormData()

      const validFiles = uploadedFiles.filter((fileMeta) => {
        if (!(fileMeta.file instanceof File)) {
          console.error("Not a File object:", fileMeta.file)
          return false
        }
        return true
      })

      if (validFiles.length === 0) {
        throw new Error("No valid files found. Please re-upload your files.")
      }

      validFiles.forEach((fileMeta) => {
        formData.append("files", fileMeta.file, fileMeta.name)
      })

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/validate-file`, formData, {
        headers: { Accept: "application/json" },
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
  }, [uploadedFiles])

  useEffect(() => {
    validationIssues()
  }, [validationIssues])


  async function downloadVatReportForFile(invoiceNumberOrFileName: string) {
    try {
      const fileMeta = uploadedFiles.find((f) => f.name === invoiceNumberOrFileName)
      if (!fileMeta || !(fileMeta.file instanceof File)) {
        alert("Original file not found for download")
        return
      }

      const formData = new FormData()
      formData.append("file", fileMeta.file, fileMeta.name)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/download-vat-issues`, {
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
    } catch (err) {
      console.error("Download failed", err)
      alert("Failed to download VAT report")
    }
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

  const getIssueTypeIcon = (issueType: string) => {
    if (issueType.includes("Missing Column")) {
      return <Database className="w-4 h-4 text-red-500" />
    } else if (issueType.includes("Missing Data")) {
      return <XCircle className="w-4 h-4 text-orange-500" />
    } else if (issueType.includes("Invalid Data Type")) {
      return <Type className="w-4 h-4 text-purple-500" />
    }
    return <AlertCircle className="w-4 h-4 text-gray-500" />
  }


  if (isLoading) {
    return (
      <div className="min-h-screen mt-12 lg:mt-16 py-4 sm:py-6 lg:py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-full mx-auto mt-16 xl:mt-4">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Validating Files...</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-8">
                Please wait while we analyze your uploaded files for data quality issues
              </p>
             </div>
          </div>
        </div>
      </div>
    )
  }

  if (validationError) {
    return (
      <div className="min-h-screen mt-12 lg:mt-16 py-4 sm:py-6 lg:py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-full mx-auto mt-16 xl:mt-4">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Validation Error</h1>
              <Alert className="max-w-2xl mx-auto mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-left break-words">{validationError}</AlertDescription>
              </Alert>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={onPrevious}>
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
                <Button onClick={validationIssues}>Try Again</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-12 lg:mt-16 py-4 sm:py-6 lg:py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-full mx-auto mt-16 xl:mt-4">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Data Validation Results</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Review and address the data quality issues found in your uploaded files
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
                  <div className="text-xl lg:text-2xl font-semibold text-red-600">{issues.length}</div>
                  <div className="text-sm text-gray-600">Total Issues</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-semibold text-orange-600">{pendingIssues}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Type Breakdown */}
          {/* {issues.length > 0 && (
            <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Database className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-900">Missing Columns</div>
                    <div className="text-sm text-red-700">{groupedIssues.missing_headers?.length || 0} issues</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-orange-900">Missing Data</div>
                    <div className="text-sm text-orange-700">{groupedIssues.missing_data?.length || 0} issues</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Type className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-purple-900">Invalid Data Types</div>
                    <div className="text-sm text-purple-700">{groupedIssues.invalid_data?.length || 0} issues</div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Download Section */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Download Highlighted Issues</h3>
                  <p className="text-sm text-gray-600">
                    {issues.length === 0
                      ? "Download your validated files and report"
                      : !allIssuesResolved
                        ? "Download your highlighted issues and validation report"
                        : "Resolve all issues to download corrected files"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {uploadedFiles.map((fileMeta) => (
                    <Button
                      key={fileMeta.name}
                      variant="outline"
                      onClick={() => downloadVatReportForFile(fileMeta.name)}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Report: {fileMeta.name.substring(0, 15)}...
                    </Button>
                  ))}
                  {allIssuesResolved && issues.length > 0 && (
                    <Button
                      onClick={handleDownloadCorrectedFiles}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      Download Full Report
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No Issues Found */}
          {issues.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">Validation Successful!</h3>
              <p className="text-green-700 mb-4">
                All your files have been validated successfully with no data quality issues found.
              </p>

            </div>
          )}

          {/* Mobile Card Layout */}
          {issues.length > 0 && (
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
                      <div className="flex items-center gap-2">
                        {getIssueTypeIcon(issue.issueType)}
                        {getStatusIcon(issue.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium text-gray-900 text-sm">{issue.issueType}</h4>
                          <Badge className={`text-xs px-2 py-0.5 ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>File: {issue.invoiceNumber}</div>
                        </div>
                      </div>
                    </div>

                    {/* Issue Details */}
                    {issue.details && (
                      <div className="bg-blue-50 p-3 rounded-lg text-xs">
                        <div className="flex items-center gap-1 mb-2">
                          <Info className="w-3 h-3 text-blue-600" />
                          <span className="font-medium text-blue-900">Issue Details:</span>
                        </div>
                        <div className="space-y-1 text-blue-800">
                          {issue.details.dataType && <div>Data Type: {issue.details.dataType}</div>}
                          {issue.details.expectedType && <div>Expected: {issue.details.expectedType}</div>}
                          {issue.details.percentage && <div>Affected: {issue.details.percentage}% of data</div>}
                          {issue.details.missingRows && (
                            <div>
                              Rows: {issue.details.missingRows.slice(0, 5).join(", ")}
                              {issue.details.hasMoreRows ? "..." : ""}
                            </div>
                          )}
                          {issue.details.invalidRows && (
                            <div>
                              Invalid Rows: {issue.details.invalidRows.slice(0, 5).join(", ")}
                              {issue.details.hasMoreRows ? "..." : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Correction */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-2">Suggested Fix:</div>
                      <div className="flex items-start gap-2 text-sm">
                        <div className="flex-1">
                          <div className="text-red-600 font-mono bg-red-50 px-2 py-1 rounded text-xs mb-1">
                            Issue: {issue.originalValue || "—"}
                          </div>
                          <div className="text-green-600 font-mono bg-green-50 px-2 py-1 rounded text-xs">
                            Fix: {issue.suggestedValue}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Desktop Table Layout */}
          {issues.length > 0 && (
            <div className="hidden md:block bg-white border border-gray-200 shadow-sm mb-6 overflow-hidden rounded-lg">
              <div className={`${issues.length > 5 ? "max-h-[400px] overflow-y-auto" : ""}`}>
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-900 text-sm">Issue Type</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-sm">File & Details</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-sm">Problem</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-sm">Suggested Fix</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-sm">Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            {getIssueTypeIcon(issue.issueType)}
                            <div className="font-medium text-gray-900 text-sm">{issue.issueType}</div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="text-sm text-gray-900 font-medium mb-1">{issue.invoiceNumber}</div>
                          {issue.details && (
                            <div className="text-xs space-y-1">
                              {issue.details.dataType && (
                                <div className="text-gray-600">Type: {issue.details.dataType}</div>
                              )}
                              {issue.details.expectedType && (
                                <div className="text-gray-600">Expected: {issue.details.expectedType}</div>
                              )}
                              {issue.details.percentage && (
                                <div className="text-gray-600">Affected: {issue.details.percentage}%</div>
                              )}
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="text-sm">
                            <div className="text-red-600 font-mono bg-red-50 w-fit px-2 py-1 rounded text-xs mb-1">
                              {issue.originalValue || "—"}
                            </div>
                            {issue.details && (issue.details.missingRows || issue.details.invalidRows) && (
                              <div className="text-xs text-gray-500 mt-1">
                                Rows: {(issue.details.missingRows || issue.details.invalidRows)?.slice(0, 3).join(", ")}
                                {issue.details.hasMoreRows ? "..." : ""}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="text-green-600 font-mono bg-green-50 w-fit px-2 py-1 rounded text-xs">
                            {issue.suggestedValue}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <Badge className={`text-xs px-2 py-1 ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              className="w-full cursor-pointer sm:w-auto h-10 bg-transparent flex items-center justify-center px-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white h-10 px-6"
              disabled={!allIssuesResolved && issues.length > 0}
              onClick={onNext}
            >
              {issues.length === 0
                ? "Continue to Payment"
                : allIssuesResolved
                  ? "Continue to Payment"
                  : `Resolve ${pendingIssues} Issues First`}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
