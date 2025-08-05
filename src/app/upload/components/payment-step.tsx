"use client"

import { CreditCard, ShieldCheck, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PaymentStepProps } from "@/app/types"
import { useUploadStore } from "@/store/uploadStore"
import { useEffect } from "react"

const PaymentStep = ({ onPrevious, onNext }: PaymentStepProps) => {
    const { uploadedFiles, sessionIds, paymentCompleted, setPaymentCompleted } = useUploadStore()

    // Check if payment was already completed (useful for page refreshes)
    useEffect(() => {
        // Check URL parameters for payment success
        const urlParams = new URLSearchParams(window.location.search)
        const paymentSuccess = urlParams.get("payment_success")
        const sessionId = urlParams.get("session_id")

        if (paymentSuccess === "true" && sessionId) {
            setPaymentCompleted(true)
            // Auto-advance to next step after successful payment
            setTimeout(() => {
                onNext?.()
            }, 1000)
        }
    }, [setPaymentCompleted, onNext])

    const handleStripePayment = async () => {
        try {
            // Include session information in payment request
            const paymentData = {
                amount: 18.28,
                description: "Tax Compliance File Processing",
                metadata: {
                    fileCount: uploadedFiles.length,
                    sessionIds: JSON.stringify(sessionIds),
                    // Add current URL for return
                    returnUrl: window.location.origin + window.location.pathname + "?step=3&payment_success=true",
                },
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing/stripe/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            })

            const data = await response.json()
            if (data.checkoutUrl) {
                // Store current state before redirect
                localStorage.setItem("pre-payment-step", "3")
                localStorage.setItem("payment-initiated", Date.now().toString())

                window.location.href = data.checkoutUrl
            } else {
                alert(data.error || "Payment failed")
            }
        } catch (error) {
            console.error(error)
            alert("An unexpected error occurred")
        }
    }

    // If payment is completed, show success state
    if (paymentCompleted) {
        return (
            <div className="flex items-center justify-center px-4 py-4 sm:py-6 lg:py-8 mt-16 md:mt-10 lg:mt-5">
                <div className="w-full max-w-xl">
                    <div className="text-center mb-6 lg:mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Your payment has been processed successfully. You can now access your VAT reports.
                        </p>
                    </div>

                    <Card className="shadow-xl border border-gray-100 bg-white">
                        <CardContent className="p-8 sm:p-10 text-center">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Download</h2>
                            <p className="text-gray-600 mb-6">
                                Your {uploadedFiles.length} files have been processed and are ready for download.
                            </p>
                            <Button
                                onClick={onNext}
                                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-sm shadow-md"
                            >
                                Continue to Downloads
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center px-4 py-4 sm:py-6 lg:py-8 mt-16 md:mt-10 lg:mt-5">
            <div className="w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Secure Your Compliance</h1>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                        Final step — complete a one-time payment to process and download your tax-compliant files.
                    </p>
                </div>

                {/* Payment Card */}
                <Card className="shadow-xl border border-gray-100 bg-white">
                    <CardContent className="p-8 sm:p-10">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-[1.75rem] font-semibold text-gray-900">Secure Checkout</h2>
                            <p className="text-sm text-gray-500 mt-1">Access your full VAT reports immediately</p>
                        </div>

                        {/* File Summary */}
                        {/* <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-4">
                            <h3 className="font-medium text-blue-900 mb-2">Processing Summary</h3>
                            <div className="text-sm text-blue-800 space-y-1">
                                <div className="flex justify-between">
                                    <span>Files to process:</span>
                                    <span className="font-medium">{uploadedFiles.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sessions ready:</span>
                                    <span className="font-medium">{Object.keys(sessionIds).length}</span>
                                </div>
                            </div>
                        </div> */}

                        {/* Pricing Section */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-5 mb-6 space-y-1">
                            <div className="flex justify-between items-center text-base font-medium text-gray-700">
                                <span>VAT Compliance Package</span>
                                <span className="text-xl font-bold text-gray-900">€18.28</span>
                            </div>
                            <p className="text-sm text-gray-500">Includes {uploadedFiles.length} documents • Full VAT processing</p>
                        </div>

                        {/* CTA */}
                        <Button
                            onClick={handleStripePayment}
                            disabled={uploadedFiles.length === 0 || Object.keys(sessionIds).length === 0}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CreditCard className="w-5 h-5" />
                            Pay €18.28 Securely
                        </Button>

                        {/* Validation Message */}
                        {uploadedFiles.length === 0 && (
                            <p className="text-sm text-red-600 text-center mt-3">Please upload files before proceeding to payment.</p>
                        )}

                        {/* Security Info */}
                        <div className="flex justify-center mt-5">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span>Secured by Stripe • SSL Encrypted</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Back Navigation */}
                <div className="flex justify-start mt-6">
                    <Button
                        variant="outline"
                        onClick={onPrevious}
                        className="w-full sm:w-auto cursor-pointer h-10 bg-transparent flex items-center justify-center px-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PaymentStep
