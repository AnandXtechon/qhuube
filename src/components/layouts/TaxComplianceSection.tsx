import { ArrowRight, Clock, Settings, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"

const TaxComplianceSection = () => {
    return (
        <section className="bg-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column */}
                    <div className="space-y-10">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            Say goodbye to <span className="text-sky-600">tax chaos</span> — we’ll handle compliance, so you don’t have to.
                        </h2>

                        <p className="text-lg text-gray-700 leading-relaxed font-medium">
                            Automate VAT compliance, registrations, and filings across all EU countries in one place — with no manual paperwork, ever.
                        </p>

                        <div>
                            <Button
                                variant="default"
                                size="lg"
                                className="bg-sky-600 hover:bg-gray-800 text-white px-8 py-4 text-base font-medium group rounded-md"
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8 lg:pt-4">
                        <div>
                            <h3 className="text-sky-500 font-bold text-xs uppercase tracking-wider mb-6 leading-tight">
                                Built for modern European businesses
                            </h3>
                            <p className="text-lg text-gray-800 leading-relaxed font-medium mb-8">
                                From navigating VAT thresholds to filing country-specific reports, Qhuube helps you stay compliant without the headaches — no matter where you sell.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-sky-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium leading-relaxed">
                                        Wasting hours on manual VAT registrations and filings in multiple EU countries?
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-sky-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium leading-relaxed">
                                        Struggling to track changing EU VAT rules, thresholds, and filing schedules?
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center">
                                        <Scale className="w-5 h-5 text-sky-500" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium leading-relaxed">
                                        Making VAT mistakes that cost you time and money? Qhuube simplifies it all — no more guesswork.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TaxComplianceSection
