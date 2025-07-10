"use client"

import { XCircle, ArrowLeft, CreditCard, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const CancelPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-2">
                {/* Main Cancel Card */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-md">
                    <CardContent className="px-8 py-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-1 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                        <p className="text-gray-600 text-sm mb-6">
                            No payment was processed. If this was a mistake or you changed your mind, you can try again or contact support.
                        </p>

                        <div className="space-y-3">

                            <Button onClick={() => (window.location.href = "/upload?step=3")} className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm py-3 rounded-lg">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Try Payment Again
                            </Button>


                            <Link href="/" className="block">
                                <Button variant="outline" className="w-full border-sky-200 text-sky-700 hover:bg-sky-50 text-sm py-3 rounded-lg">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="shadow-md border-0 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-5 flex gap-4">
                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                            <HelpCircle className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Our support team is here if you encountered issues or have questions about the process.
                            </p>
                            <Link href="/contact" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                                Contact Support →
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                {/* Footer Notice */}
                <div className="text-center text-xs text-gray-500 mt-4">
                    <p>Your data is secure. No payment details were stored.</p>
                </div>
            </div>
        </div>
    )
}

export default CancelPage
