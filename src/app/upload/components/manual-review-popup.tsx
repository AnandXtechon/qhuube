"use client"

import { useState } from "react"
import { Mail, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ManualReviewPopupProps {
    isOpen: boolean
    fileName: string
    manualReviewCount: number
    onClose: () => void
    onEmailSubmit: (email: string) => Promise<void>
}

export default function ManualReviewPopup({
    isOpen,
    fileName,
    manualReviewCount,
    onClose,
    onEmailSubmit,
}: ManualReviewPopupProps) {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isValidEmail = (email: string): boolean => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
    };


    const handleSubmitEmail = async () => {
        if (!isValidEmail(email)) {
            toast.error("Please enter a valid email address")
            return
        }

        setIsSubmitting(true)
        try {
            await onEmailSubmit(email)
            setEmail("")
        } catch (error) {
            toast.error("Failed to submit email. Please try again.")
            console.error("Email submission error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setEmail("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                        <AlertTriangle className="w-5 h-5 text-blue-600" />
                        Manual Review Required
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        The file {fileName} requires manual VAT lookup processing.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert className="border-blue-200 bg-blue-50">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            <strong>
                                {manualReviewCount} record{manualReviewCount > 1 ? "s" : ""}
                            </strong>{" "}
                            in this file could not be processed automatically due to missing VAT information. Our team will manually
                            review and process these records.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="popup-email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-600" />
                                Email Address for Report Delivery
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                                We&apos;ll send you the complete VAT report for this file within 24 hours
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Input
                                id="popup-email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                disabled={isSubmitting}
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitEmail}
                                    disabled={!isValidEmail(email) || isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1 shadow-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Submit Email
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-blue-800">
                                <p className="font-medium mb-1">What happens next?</p>
                                <ul className="space-y-1 text-blue-700">
                                    <li>
                                        • Our team will manually review the {manualReviewCount} record{manualReviewCount > 1 ? "s" : ""}
                                    </li>
                                    <li>• We&apos;ll look up the correct VAT rates for missing entries</li>
                                    <li>• You&apos;ll receive the complete report via email within 24 hours</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
