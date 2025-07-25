/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, FileText, ArrowRight, ArrowLeft, Download, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CorrectionStepProps, TaxIssue } from "@/app/types"
import { useUploadStore } from "@/store/uploadStore"
import axios from "axios"

export default function CorrectionStep({ onNext, onPrevious }: CorrectionStepProps) {
  const [issues, setIssues] = useState<TaxIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const { uploadedFiles } = useUploadStore()

  const totalFiles = uploadedFiles.length
  const correctedIssues = issues.filter((issue) => issue.status === "corrected").length
  const pendingIssues = issues.filter((issue) => issue.status === "pending").length
  const allIssuesResolved = issues.every((issue) => issue.status !== "pending")

  const handleDownloadCorrectedFiles = async () => {
    try {
      // Create a simple validation report
      const report = {
        summary: {
          totalFiles: totalFiles,
          totalIssues: issues.length,
          correctedIssues: correctedIssues,
          pendingIssues: pendingIssues,
          validationDate: new Date().toISOString(),
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
        })),
      }

      // Create and download the validation report
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

      // Debug: Log what we're about to send
      console.log("Files to upload:", uploadedFiles)

      // Validate that we have actual File objects
      const validFiles = uploadedFiles.filter((fileMeta) => {
        console.log(`File ${fileMeta.name}:`, {
          name: fileMeta.name,
          size: fileMeta.size,
          type: fileMeta.type,
          isFile: fileMeta.file instanceof File,
          fileExists: !!fileMeta.file,
        })

        if (!(fileMeta.file instanceof File)) {
          console.error("Not a File object:", fileMeta.file)
          return false
        }
        return true
      })

      if (validFiles.length === 0) {
        throw new Error("No valid files found. Please re-upload your files.")
      }

      // Append valid files to FormData
      validFiles.forEach((fileMeta) => {
        formData.append("files", fileMeta.file, fileMeta.name)
      })

      // Debug: Log FormData contents
      console.log("FormData contents:")
      for (const [key, value] of formData.entries()) {
        console.log(key, value, typeof value, value instanceof File)
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/validate-file`, formData, {
        headers: {
          // Don't set Content-Type manually - let the browser set it with boundary
          Accept: "application/json",
        },
        timeout: 30000, // 30 second timeout
      })

      console.log("Validation Result:", response.data)

      // Transform backend response to TaxIssue format
      const transformedIssues: TaxIssue[] = []
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
              details: undefined
            })
          })

          // Handle data quality issues with detailed information
          validation_result.data_issues?.forEach((dataIssue: any) => {
            const rowInfo =
              dataIssue.missing_rows?.length > 0
                ? `Rows: ${dataIssue.missing_rows.join(", ")}${dataIssue.has_more_rows ? "..." : ""}`
                : "Multiple rows"

            transformedIssues.push({
              id: issueId++,
              invoiceNumber: fileResult.file_name,
              invoiceDate: new Date().toISOString().split("T")[0],
              taxCode: "N/A",
              vatAmount: 0,
              currency: "EUR",
              issueType: `Missing Data: ${dataIssue.column_name}`,
              originalValue: `${dataIssue.total_missing} empty values (${dataIssue.percentage}%)`,
              suggestedValue: `Fill missing data in ${dataIssue.column_name} (${dataIssue.data_type})`,
              status: "pending",
              severity: dataIssue.percentage > 50 ? "high" : dataIssue.percentage > 20 ? "medium" : "low",
              // Add additional details for display
              details: {
                columnName: dataIssue.column_name,
                dataType: dataIssue.data_type,
                missingRows: dataIssue.missing_rows,
                hasMoreRows: dataIssue.has_more_rows,
                totalMissing: dataIssue.total_missing,
                totalRows: dataIssue.total_rows,
                description: dataIssue.issue_description,
              },
            })
          })
        }
      })

      setIssues(transformedIssues)
    } catch (err: any) {
      console.error("Validation error:", err.response?.data || err.message)

      // Handle different error response formats
      let errorMessage = "Validation failed"

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data
        } else if (err.response.data.detail) {
          if (Array.isArray(err.response.data.detail)) {
            // Handle FastAPI validation errors (array format)
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

  if (isLoading) {
    return (
      <div className="min-h-screen mt-12 lg:mt-16 py-4 sm:py-6 lg:py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-full mx-auto mt-16 xl:mt-4">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Validating Files...</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-8">
                Please wait while we analyze your uploaded files
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
              </div>
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-red-700 text-left break-words">{validationError}</div>
                </div>
              </div>
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

          {/* Download Section */}
          {/* {(issues.length > 0 || totalFiles > 0) && (
            <div className="bg-white rounded-lg p-4 lg:p-6 border border-gray-200 shadow-sm mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Download Results</h3>
                  <p className="text-sm text-gray-600">
                    {issues.length === 0
                      ? "Download your validated files and report"
                      : allIssuesResolved
                        ? "Download your corrected files and validation report"
                        : "Resolve all issues to download corrected files"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadCorrectedFiles}
                    className="flex items-center gap-2 bg-transparent"
                    disabled={!allIssuesResolved && issues.length > 0}
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                  {allIssuesResolved && issues.length > 0 && (
                    <Button
                      onClick={handleDownloadCorrectedFiles}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      Download Corrected Files
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )} */}

          {/* No Issues Found */}
          {issues.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">No Issues Found!</h3>
              <p className="text-green-700">
                All your files have been validated successfully. You can proceed to the next step.
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
                      {getStatusIcon(issue.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">{issue.issueType}</h4>
                          <Badge className={`text-xs px-2 py-0.5 ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>File: {issue.invoiceNumber}</div>
                          {issue.details && (
                            <div className="bg-blue-50 p-2 rounded text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <Info className="w-3 h-3 text-blue-600" />
                                <span className="font-medium text-blue-900">Details:</span>
                              </div>
                              <div>Data Type: {issue.details.dataType}</div>
                              {issue.details.missingRows && (
                                <div>
                                  Affected Rows: {issue.details.missingRows.join(", ")}
                                  {issue.details.hasMoreRows ? "..." : ""}
                                </div>
                              )}
                            </div>
                          )}
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
                    {/* <div className="flex gap-2">
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
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Desktop Table Layout */}
          {issues.length > 0 && (
            <div className="hidden md:block bg-white border border-gray-200 shadow-sm mb-6 overflow-hidden">
              <div className={`${issues.length > 5 ? "max-h-[300px] md:max-h-[400px] overflow-y-auto" : ""}`}>
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Issue Type</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">File Details</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Issue Info</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Correction</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-xs md:text-sm">Severity</TableHead>
                      {/* <TableHead className="font-semibold text-gray-900 text-xs md:text-sm text-right">
                        Actions
                      </TableHead> */}
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
                          {issue.details ? (
                            <div className="text-xs space-y-1">
                              <div className="text-gray-900">Type: {issue.details.dataType}</div>
                              {issue.details.missingRows && (
                                <div className="text-gray-500">
                                  Rows: {issue.details.missingRows.slice(0, 3).join(", ")}
                                  {issue.details.hasMoreRows ? "..." : ""}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">Column missing</div>
                          )}
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
                        {/* <TableCell className="py-2 md:py-4 text-right">
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
                        </TableCell> */}
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
                  : `Resolve ${pendingIssues} Issues`}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
