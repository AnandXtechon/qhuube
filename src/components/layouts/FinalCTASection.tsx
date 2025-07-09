"use client"

import { Button } from "@/components/ui/button"

const FinalCTASection = () => {
    return (
        <section className="relative py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
                <h3 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in-up">
                    Ready to Simplify Your
                    <br />
                    <span className="text-sky-400">European Tax Compliance?</span>
                </h3>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                    Join thousands of businesses who trust Qhuube for seamless tax management across Europe
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up animation-delay-400">
                    <Button
                        size="lg"
                        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Get Started Today
                        {/* <ArrowRight className="ml-2 w-5 h-5" /> */}
                    </Button>
                    {/* <Button
                        size="lg"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white font-semibold px-8 py-4 text-lg bg-transparent hover:scale-105 transition-all duration-300"
                    >
                        Schedule Demo
                    </Button> */}
                </div>
{/* 
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    {[
                        { icon: Clock, value: "14-day", label: "Free Trial" },
                        { icon: Star, value: "No", label: "Setup Fees" },
                        { icon: Users, value: "24/7", label: "Support" },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300"
                            style={{ animationDelay: `${600 + idx * 150}ms` }}
                        >
                            <item.icon className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                            <div className="text-2xl font-bold text-sky-400 mb-1">{item.value}</div>
                            <div className="text-gray-400">{item.label}</div>
                        </div>
                    ))}
                </div> */}
            </div>
        </section>
    )
}

export default FinalCTASection
