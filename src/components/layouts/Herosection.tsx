/* eslint-disable @next/next/no-img-element */
"use client"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { fadeInUp, imageVariants, staggerContainer } from "@/lib/animation"
import Link from "next/link"
import Image from "next/image"

const HeroSectionDashboard = () => {
    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center overflow-hidden">
            {/* Decorative Background Blurs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full">
                {/* Heading & CTA */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="text-center space-y-10 mb-20"
                >
                    <motion.div variants={fadeInUp} className="space-y-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-5xl mx-auto">
                            <span className="block text-sky-600">Effortless EU VAT Compliance</span>
                            <span className="block">Track, calculate & file across 27+ countries</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            Real-time logic, threshold tracking, and effortless filings. Navigate EU VAT like a pro from one powerful dashboard.
                            <br />
                            <span className="font-semibold text-gray-800">Fully compliant. Always current.</span>
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Link href="/upload">
                            <motion.button
                                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Started <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Dashboard + Cards */}
                <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate="show"
                    className="relative max-w-6xl mx-auto hidden md:block"
                >
                    <div className="relative">
                        {/* Dashboard Image */}
                        <Image
                            src="/images/dashboard.png"
                            alt="Tax management dashboard"
                            width={1200}
                            height={800}
                            className="w-full h-auto rounded-2xl shadow-2xl"
                            priority
                        />

                        <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 px-2 backdrop-blur-md w-72 animate-fade-in-up">
                            <div className="text-center">
                                {/* Stat number */}
                                <div className="text-3xl font-bold text-blue-600 mb-1 border-b pb-2">100%</div>

                                {/* Label */}
                                <div className="text-sm font-medium text-gray-700 mb-3">EU Tax Compliance Coverage</div>

                                {/* Subtext */}
                                {/* <p className="text-xs text-gray-500 mb-3">
                                    Fully compliant across all supported European jurisdictions.
                                </p> */}

                                {/* Countries (flags) */}
                                <div className="flex justify-center gap-2 flex-wrap">
                                    {["DE", "FR", "IT", "ES", "NL", "PL", "BE"].map((code) => (
                                        <img
                                            key={code}
                                            src={`https://flagsapi.com/${code}/flat/32.png`}
                                            alt={`${code} flag`}
                                            className="w-6 h-6 rounded"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>



                        {/* Floating Payable Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-gray-200 p-4 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">✓</span>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">Tax Payable</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <img src="https://flagsapi.com/DE/flat/32.png" alt="Germany" className="w-5 h-5 rounded-sm" />
                                        <span className="text-sm text-gray-600">Germany</span>
                                        <span className="text-lg font-bold text-blue-600">312.57€</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extra Decorative Blurs */}
                    <div className="absolute -z-10 -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-sky-400/30 to-indigo-400/30 rounded-full blur-2xl" />
                    <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-2xl" />
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSectionDashboard
