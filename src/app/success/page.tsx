"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, CreditCard, User, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentDetails {
    customerName: string
    customerEmail: string
    paymentMethod: string
    status: string
    amount: number
    currency: string
    date: string
    sessionId: string
}

const SuccessPage = () => {
    const searchParams = useSearchParams()
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const sessionId = searchParams.get("session_id")

        const fetchPaymentDetails = async () => {
            if (!sessionId) return setLoading(false)

            try {
                const res = await fetch(`http://localhost:3000/pricing/stripe/session/${sessionId}`)
                const data = await res.json()

                if (res.ok) {
                    setPaymentDetails({
                        customerName: data.customer_details?.name ?? "N/A",
                        customerEmail: data.customer_details?.email ?? "N/A",
                        paymentMethod: data.payment_method_types?.[0] ?? "Unknown",
                        status: data.payment_status,
                        amount: (data.amount_total / 100) || 0,
                        currency: data.currency.toUpperCase(),
                        date: new Date(data.created * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }),
                        sessionId: data.id,
                    })
                } else {
                    console.error("Fetch failed:", data.error)
                }
            } catch (err) {
                console.error("Unexpected error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPaymentDetails()
    }, [searchParams])
    

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600">Thank you for your purchase. Your payment has been processed successfully.</p>
                </div>

                {/* Payment Details Card */}
                {paymentDetails && (
                    <Card className="border-sky-200 shadow-lg">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-sky-100 pb-2">Payment Details</h2>

                            <div className="space-y-4">
                                {/* Customer Name */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-sky-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium text-gray-900">{paymentDetails.customerName}</p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-sky-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="font-medium text-gray-900">{paymentDetails.paymentMethod}</p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-sky-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium text-gray-900">{paymentDetails.date}</p>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="bg-sky-50 rounded-lg p-4 mt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Amount</span>
                                        <span className="text-2xl font-bold text-sky-600">€{paymentDetails.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {paymentDetails.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Session ID */}
                                <div className="pt-4 border-t border-sky-100">
                                    <p className="text-xs text-gray-500">Transaction ID</p>
                                    <p className="text-xs font-mono text-gray-700 break-all">{paymentDetails.sessionId}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => (window.location.href = "/upload?step=4")}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                        Continue to Overview
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors cursor-pointer"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SuccessPage
