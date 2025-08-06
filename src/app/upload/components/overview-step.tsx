/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  CheckCircle,
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
import ManualReviewPopup from "./manual-review-popup"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import axios from "axios"

interface OverviewStepProps {
  onPrevious: () => void
}

export default function OverviewStep({ onPrevious }: OverviewStepProps) {
  const { uploadedFiles, setUploadedFiles, sessionIds, setPaymentCompleted } = useUploadStore()

  // Email for sending reports to users
  const [reportEmail, setReportEmail] = useState("")
  const [isReportEmailSending, setIsReportEmailSending] = useState(false)
  const [reportEmailSent, setReportEmailSent] = useState(false)

  // Download states
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  // Manual review popup state
  const [showManualReviewPopup, setShowManualReviewPopup] = useState(false)
  const [currentManualReviewFile, setCurrentManualReviewFile] = useState<string>("")
  const [manualReviewCount, setManualReviewCount] = useState(0)

  const router = useRouter()

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  const handleManualReviewEmailSubmit = async (adminEmail: string) => {
    if (!adminEmail) {
      toast.error("Please enter a valid email address");
      return;
    }

    const sessionId = sessionIds[currentManualReviewFile];
    if (!sessionId) {
      toast.error("Session not found for this file");
      return;
    }

    const formData = new FormData();
    formData.append("user_email", adminEmail);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/download-vat-report/${sessionId}`,
        formData,
        {
          responseType: "blob",
        }
      );

      const contentType = response.headers["content-type"];

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected response format from server");
      }

      const text = await response.data.text(); // read blob as text
      const jsonResponse = JSON.parse(text);

      if (jsonResponse.status === "manual_review_required") {
        setReportEmailSent(true);
        toast.success(
          `Manual review request submitted! You'll receive the VAT report for ${currentManualReviewFile} within 24 hours.`
        );
      } else {
        toast.warning("Unexpected response from server.");
      }

      setShowManualReviewPopup(false);
      setCurrentManualReviewFile("");
      setManualReviewCount(0);
    } catch (error: any) {
      console.error("Failed to submit manual review email:", error);

      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Please try again.";

      toast.error(`Failed to submit manual review request: ${errorMessage}`);
      throw error;
    }
  };

  const downloadVatReportForFile = async (fileName: string) => {
    setDownloadingFiles((prev) => new Set(prev).add(fileName));

    try {
      const sessionId = sessionIds[fileName];
      if (!sessionId) {
        toast.error("Session not found for this file");
        return;
      }

      const formData = new FormData();
      formData.append("user_email", "");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/download-vat-report/${sessionId}`,
        formData,
        {
          responseType: "blob",
        }
      );

      const contentType = response.headers["content-type"];

      // Handle manual review response (JSON inside blob)
      if (contentType?.includes("application/json")) {
        const text = await response.data.text();
        const json = JSON.parse(text);

        if (json.status === "manual_review_required") {
          setCurrentManualReviewFile(fileName);
          setManualReviewCount(json.manual_review_count || 1);
          setShowManualReviewPopup(true);
          return;
        } else if (json.status === "manual_review_initiated") {
          toast.success(json.message);
          return;
        } else {
          console.warn("Unexpected JSON response:", json);
          toast.error("Received unexpected response from server.");
          return;
        }
      }

      // Handle ZIP download
      if (contentType?.includes("application/zip")) {
        const zip = await JSZip.loadAsync(response.data);
        const zipFiles = Object.keys(zip.files);

        for (const file of zipFiles) {
          const fileData = await zip.file(file)?.async("blob");
          if (fileData) {
            saveAs(fileData, file);
          }
        }

        toast.success("VAT reports extracted and downloaded successfully");
        return;
      }

      // Handle regular Excel file
      const cd = response.headers["content-disposition"];
      let filename = fileName.replace(/\.[^.]+$/, "") + "_vat_report.xlsx";

      if (cd) {
        const match = cd.match(/filename="?([^";]+)"?/i);
        if (match) filename = match[1];
      }

      saveAs(response.data, filename);
      toast.success("VAT report downloaded successfully");
    } catch (err: any) {
      console.error("Download failed", err);
      const errorMessage =
        err?.response?.data?.detail || err.message || "Please try again.";
      toast.error(`Failed to download VAT report: ${errorMessage}`);
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileName);
        return newSet;
      });
    }
  };

  const handleDownloadAllReports = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("No files available for download");
      return;
    }

    setIsDownloadingAll(true);
    setDownloadProgress(0);
    toast.info(`Starting download of ${uploadedFiles.length} VAT reports...`);

    const totalFiles = uploadedFiles.length;
    let completedCount = 0;

    const downloadPromises = uploadedFiles.map(async (fileMeta) => {
      const fileName = fileMeta.name;
      const sessionId = sessionIds[fileName];

      if (!sessionId) {
        console.warn(`Skipping ${fileName} - no session ID found`);
        completedCount++;
        setDownloadProgress(Math.round((completedCount / totalFiles) * 100));
        return {
          success: false,
          filename: fileName,
          error: "No session ID",
          requiresManualReview: false,
        };
      }

      try {
        const formData = new FormData();
        formData.append("user_email", "");

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/download-vat-report/${sessionId}`,
          formData,
          {
            responseType: "blob", // must for file downloads
          }
        );

        const contentType = response.headers["content-type"];

        // Handle manual review JSON response
        if (contentType?.includes("application/json")) {
          const text = await response.data.text();
          const json = JSON.parse(text);

          if (json.status === "manual_review_required") {
            completedCount++;
            setDownloadProgress(Math.round((completedCount / totalFiles) * 100));
            return {
              success: false,
              filename: fileName,
              requiresManualReview: true,
              manualReviewCount: json.manual_review_count || 1,
            };
          }

          completedCount++;
          setDownloadProgress(Math.round((completedCount / totalFiles) * 100));
          return {
            success: false,
            filename: fileName,
            error: "Unexpected JSON response",
            requiresManualReview: false,
          };
        }

        // Handle ZIP response
        if (contentType?.includes("application/zip")) {
          const zip = await JSZip.loadAsync(response.data);
          const zipFiles = Object.keys(zip.files);

          for (const zipFile of zipFiles) {
            const fileData = await zip.file(zipFile)?.async("blob");
            if (fileData) saveAs(fileData, zipFile);
          }

          completedCount++;
          setDownloadProgress(Math.round((completedCount / totalFiles) * 100));
          return { success: true, filename: fileName, requiresManualReview: false };
        }

        // Handle Excel (xlsx or other single file)
        const cd = response.headers["content-disposition"];
        let downloadName = "vat_report.xlsx";

        if (cd) {
          const match = cd.match(/filename="?([^";]+)"?/i);
          if (match) downloadName = match[1];
        } else {
          downloadName = fileName.replace(/\.[^.]+$/, "") + "_vat_report.xlsx";
        }

        saveAs(response.data, downloadName);

        completedCount++;
        setDownloadProgress(Math.round((completedCount / totalFiles) * 100));
        return { success: true, filename: fileName, requiresManualReview: false };
      } catch (error: any) {
        console.error(`Download failed for ${fileName}:`, error);
        completedCount++;
        setDownloadProgress(Math.round((completedCount / totalFiles) * 100));

        return {
          success: false,
          filename: fileName,
          error: error?.response?.data || error.message || "Unknown error",
          requiresManualReview: false,
        };
      }
    });

    const results = await Promise.all(downloadPromises);

    const successful = results.filter((r) => r?.success).length;
    const failed = results.filter((r) => r && !r.success && !r.requiresManualReview).length;
    const manualReview = results.filter((r) => r?.requiresManualReview).length;

    // Final toast messages
    if (successful === uploadedFiles.length) {
      toast.success(`Successfully downloaded all ${successful} VAT reports!`);
    } else if (successful > 0) {
      let message = `Downloaded ${successful} reports successfully`;
      if (failed > 0) message += `, ${failed} failed`;
      if (manualReview > 0) message += `, ${manualReview} require manual review`;
      toast.warning(message);
    } else if (manualReview > 0) {
      toast.info(`${manualReview} file(s) require manual review. You'll be contacted within 24 hours.`);
    } else {
      toast.error("Failed to download any reports");
    }

    setIsDownloadingAll(false);
    setDownloadProgress(0);
  };

  const handleSendReportEmail = async () => {
    if (!reportEmail || !isValidEmail(reportEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsReportEmailSending(true);

    try {
      const fileSessions = uploadedFiles
        .map(file => ({
          fileName: file.name,
          sessionId: sessionIds[file.name],
        }))
        .filter(session => session.sessionId);

      if (fileSessions.length === 0) {
        toast.error("No valid sessions found for the uploaded files");
        return;
      }

      const results = await Promise.all(
        fileSessions.map(async ({ fileName, sessionId }) => {
          try {
            const formData = new FormData();
            formData.append("user_email", reportEmail);
            formData.append("file_name", fileName);

            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/send-vat-report-email/${sessionId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            return { success: true, fileName };
          } catch (error: any) {
            console.error(`Failed to send ${fileName}:`, error);

            const errorMsg =
              error?.response?.data?.detail ||
              error?.message ||
              `Unknown error sending ${fileName}`;

            return { success: false, fileName, error: errorMsg };
          }
        })
      );

      const successful = results.filter(r => r.success).length;
      const failed = results.length - successful;

      if (successful > 0) {
        toast.success(`Successfully sent ${successful} report(s) to ${reportEmail}`);
      }

      if (failed > 0) {
        toast.warning(`Failed to send ${failed} report(s). Please try downloading them instead.`);
      }
    } catch (error: any) {
      console.error("Failed to send email:", error);
      toast.error(`Failed to send email: ${error?.message || "Please try again later"}`);
    } finally {
      setIsReportEmailSending(false);
    }
  };

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
    setReportEmail("")
    setPaymentCompleted(false)
    router.push("/upload?step=1")
  }

  // If email is sent successfully, show only confirmation message and navigation
  if (reportEmailSent) {
    return (
      <div className="flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-md p-8 text-center">

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Email Sent Successfully!</h2>
          <p className="text-gray-700 mb-1">
            Your VAT compliance reports will be sent to{" "}
            <span className="font-medium text-gray-900">{reportEmail}</span> shortly.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your inbox and spam folder for the confirmation.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Step
            </Button>
            <Button
              className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white"
              onClick={handleStartNewProcess}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New Process
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-6 lg:py-8 mt-12 xl:mt-4">
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8 lg:px-10">
            {/* Files Processed */}
            <Card className="border border-gray-200 shadow-md rounded-xl">
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
            <Card className="border border-gray-200 shadow-md rounded-xl">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Reports
                </h3>

                {/* Download Buttons */}
                <div className="space-y-4 mb-6">
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <Button
                        onClick={handleDownloadAllReports}
                        disabled={isDownloadingAll}
                        className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white justify-center h-12 text-base font-semibold shadow-lg"
                      >
                        {isDownloadingAll ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Downloading All Reports...
                          </>
                        ) : (
                          <>
                            <Package className="w-5 h-5" />
                            Download All VAT Reports ({uploadedFiles.length})
                          </>
                        )}
                      </Button>

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
                            className="w-full h-10 px-4 py-2 flex items-center justify-start text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
                            title={fileMeta.name}
                          >
                            {downloadingFiles.has(fileMeta.name) ? (
                              <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileText className="w-4 h-4 mr-2 text-gray-600" />
                            )}
                            <span className="truncate max-w-[80%]">
                              {fileMeta.name.length > 30 ? `${fileMeta.name.slice(0, 30)}...` : fileMeta.name}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Section */}
                <div className="border-t pt-4 sm:pt-6">
                  <Label
                    htmlFor="report-email"
                    className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2 mb-3"
                  >
                    <Mail className="w-4 h-4" />
                    Email Reports to User
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Send the processed VAT reports to a specific email address
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      id="report-email"
                      type="email"
                      placeholder="user@company.com"
                      value={reportEmail}
                      onChange={(e) => setReportEmail(e.target.value)}
                      className="flex-1 py-2 lg:h-10 text-sm sm:text-base"
                    />
                    <Button
                      onClick={handleSendReportEmail}
                      disabled={!isValidEmail(reportEmail) || isReportEmailSending}
                      className="bg-purple-600 hover:bg-purple-700 text-white h-10 px-4 sm:px-6 w-full sm:w-auto"
                    >
                      {isReportEmailSending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 lg:px-10">
            <Button
              variant="outline"
              onClick={onPrevious}
              className="w-full sm:w-auto bg-white border-gray-300 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 px-4 sm:px-6 order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Step
            </Button>
            <Button
              className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 cursor-pointer sm:px-6 w-full sm:w-auto order-1 sm:order-2"
              onClick={handleStartNewProcess}
            >
              <RotateCcw className="w-4 h-4" />
              Start New Process
            </Button>
          </div>
        </div>
      </div>

      {/* Manual Review Popup */}
      <ManualReviewPopup
        isOpen={showManualReviewPopup}
        fileName={currentManualReviewFile}
        manualReviewCount={manualReviewCount}
        onClose={() => {
          setShowManualReviewPopup(false)
          setCurrentManualReviewFile("")
          setManualReviewCount(0)
        }}
        onEmailSubmit={handleManualReviewEmailSubmit}
      />
    </div>
  )
}
