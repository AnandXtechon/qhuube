"use client"

import { CreditCard, ShieldCheck, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PaymentStepProps } from "@/app/types"

const PaymentStep = ({ onPrevious, onNext }: PaymentStepProps) => {
    return (
        <div className="flex items-center justify-center px-4 py-4 sm:py-6 lg:py-8">
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

                        {/* Pricing Section */}
                        <div className="bg-gray-50 border border-gray-200 rounded-sm p-5 mb-6 space-y-1">
                            <div className="flex justify-between items-center text-base font-medium text-gray-700">
                                <span>VAT Compliance Package</span>
                                <span className="text-xl font-bold text-gray-900">€20</span>
                            </div>
                            <p className="text-sm text-gray-500">Includes 125 documents • 5 corrections</p>
                        </div>

                        {/* CTA */}
                        <Button
                            onClick={onNext}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-sm shadow-md"
                        >
                            <CreditCard className="w-5 h-5" />
                            Pay €20 Securely
                        </Button>

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
                        className="w-full sm:w-auto h-10 bg-transparent flex items-center justify-center px-6"
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
