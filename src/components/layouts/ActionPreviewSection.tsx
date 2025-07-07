"use client"
import { motion } from "framer-motion"
import { PlayCircle, Monitor, BarChart3, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const ActionPreviewSection = () => {
    return (
        <section className="relative py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center max-w-4xl relative z-10"
            >
                {/* <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Monitor className="w-4 h-4" />
                    Platform Demo
                </div> */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    See the Platform in <span className="text-blue-600">Action</span>
                </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                    A quick look at how TaxTrack makes EU VAT compliance effortless and reliable for thousands of businesses.
                </p>
            </motion.div>

            {/* Enhanced Screenshot with callouts */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative max-w-6xl w-full"
            >
                <div className="relative rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
                    {/* Browser header */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 p-4 flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white rounded-md px-4 py-2 text-sm text-gray-500 border">
                            https://app.taxtrack.com/dashboard
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50">
                        {/* Placeholder for actual screenshot/video */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <div className="w-24 h-24 bg-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                    <Monitor className="w-12 h-12 text-gray-400" />
                                </div>
                                <p className="text-lg font-medium mb-2">Dashboard Preview</p>
                                <p className="text-sm">Interactive platform demonstration</p>
                            </div>
                        </div>

                        {/* Enhanced Callouts */}
                        <motion.div
                            className="absolute top-8 left-6 bg-white/95 backdrop-blur-sm border border-blue-100 shadow-lg rounded-xl px-5 py-4 max-w-xs"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-blue-600" />
                                </div>
                                <h4 className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Auto Tax Calculation</h4>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Real-time, regulation-compliant VAT logic built-in with 99.9% accuracy.
                            </p>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-20 left-8 bg-white/95 backdrop-blur-sm border border-blue-100 shadow-lg rounded-xl px-5 py-4 max-w-xs"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Monitor className="w-4 h-4 text-green-600" />
                                </div>
                                <h4 className="text-green-600 font-semibold text-sm uppercase tracking-wide">Country Breakdown</h4>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Instant visibility into your EU VAT liabilities across 27+ countries.
                            </p>
                        </motion.div>

                        <motion.div
                            className="absolute top-16 right-8 bg-white/95 backdrop-blur-sm border border-blue-100 shadow-lg rounded-xl px-5 py-4 max-w-xs"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FileCheck className="w-4 h-4 text-purple-600" />
                                </div>
                                <h4 className="text-purple-600 font-semibold text-sm uppercase tracking-wide">Filing Dashboard</h4>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                One-click VAT return filing, status tracking, and automated alerts.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
                className="mt-16 text-center relative z-10"
            >
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold group shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Watch Platform Demo
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold bg-transparent"
                    >
                        Try Interactive Tour
                    </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">No signup required • 3-minute overview</p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full relative z-10"
            >
                {[
                    { icon: BarChart3, title: "Real-time Analytics", desc: "Live VAT calculations and reporting" },
                    { icon: FileCheck, title: "Automated Filing", desc: "One-click submissions to tax authorities" },
                    { icon: Monitor, title: "Multi-country Support", desc: "Complete EU coverage in one platform" },
                ].map((feature, index) => (
                    <div
                        key={index}
                        className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <feature.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                ))}
            </motion.div>
        </section>
    )
}

export default ActionPreviewSection
