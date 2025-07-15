/* eslint-disable @next/next/no-img-element */
"use client"

import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react" // Added new icons
import Link from "next/link"
import Image from "next/image"
import { fadeInUp, staggerContainer, floatingCard } from "@/lib/animation"

const HeroSectionDashboard = () => {
    return (
        <section className="relative bg-white min-h-[70vh] md:min-h-screen flex items-center overflow-hidden py-20 lg:pt-20 xl:pb-0">

            {/* Decorative Background Blurs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* <div className="absolute top-40 left-1/3 w-96 h-96 bg-blue-50/80 rounded-full blur-3xl animate-blob" /> */}
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 hidden md:block"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12  relative z-10 w-full">
                {/* Heading & CTA */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="text-center space-y-10 mb-20"
                >
                    {/* Badge */}
                    {/* <motion.p
                        variants={fadeInUp}
                        className="inline-flex px-4 py-2 text-base text-gray-900 border border-gray-200 rounded-full"
                    >
                        Built for EU businesses. Trusted by professionals.
                    </motion.p> */}

                    <motion.div variants={fadeInUp} className="space-y-6">
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-2xl xl:max-w-3xl mx-auto lg:mt-20">
                            <span className="block text-gray-900">Effortless Europe VAT Compliance</span>
                            {/* <span className="block">Track, calculate & file across 27+ countries</span> */}
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            Real-time logic, threshold tracking, and effortless filings. Navigate EU VAT like a pro from one powerful
                            dashboard.
                            <br />
                            {/* <span className="font-semibold text-gray-800">Fully compliant. Always current.</span> */}
                        </p>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="">
                        <Link href="/upload" passHref>
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

                {/* Dashboard + Cards + Testimonials */}
                <motion.div variants={floatingCard} initial="hidden" animate="float" className="relative max-w-6xl mx-auto lg:mb-20">
                    <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8">
                        {/* Left Testimonial Card */}
                        <div className="w-full max-w-xs lg:max-w-none lg:w-56 xl:w-64 order-2 hidden xl:block lg:order-1">
                            <div className="bg-white p-4 xl:p-6 rounded-2xl shadow-lg border border-gray-200 h-fit w-64 flex flex-col justify-between">
                                <p className="text-xs xl:text-sm text-gray-800 leading-relaxed font-medium">
                                    {
                                        '"Qhuube simplified our EU VAT compliance completely. No more manual calculations or missed deadlines."'
                                    }
                                </p>
                                <div className="flex items-center gap-3 mt-4">
                                    <Image
                                        src="/images/testimonial-5.webp"
                                        alt="Marcus Weber"
                                        width="32"
                                        height="32"
                                        className="rounded-full object-cover xl:w-10 xl:h-10"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-xs xl:text-sm">Marcus Weber</p>
                                        <p className="text-xs text-gray-500">CEO, TechFlow GmbH</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center Column (Dashboard Image with floating cards) */}
                        <div className="relative w-full lg:w-auto flex-shrink-0 order-1 lg:order-2">
                            <Image
                                src="/images/dashboard.png"
                                alt="Tax management dashboard"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-2xl"
                                priority
                            />
                            {/* Floating Compliance Card */}
                            <div
                                className="absolute -top-20 -right-6 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 px-2 backdrop-blur-md w-64 hidden md:block"
                            >
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-1 border-b pb-2">100%</div>
                                    <div className="text-sm font-medium text-gray-700 mb-3">EU Tax Compliance Coverage</div>
                                    <div className="flex justify-center gap-2 flex-wrap">
                                        {["DE", "FR", "IT", "NL", "PL", "BE"].map((code) => (
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
                            <div
                               
                                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-gray-200 p-4 backdrop-blur-sm hidden md:block"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Check className="text-white w-5 h-5"/>
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

                            {/* New: Floating Upcoming Deadlines Card */}
                            {/* <div
                                className="absolute -top-20 -left-30 bg-white rounded-xl shadow-xl border border-gray-200 p-4 backdrop-blur-sm hidden md:block"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                        <CalendarDays className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Upcoming Deadlines</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-600">Q3 2024 VAT Return</span>
                                            <span className="text-lg font-bold text-orange-600">Oct 31st</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* New: Floating Refund Status Card */}
                            <div
                                className="absolute -bottom-18 -right-8 bg-white rounded-xl shadow-xl border border-gray-200 p-4 backdrop-blur-sm hidden md:block"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Report Sent</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-600">Sent you report via email</span>
                                            {/* <span className="text-lg font-bold text-green-600">€1,250.00</span> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Stats Card & Testimonial) */}
                        <div className="w-full max-w-xs lg:max-w-none lg:w-56 xl:w-64 space-y-8 order-3 hidden xl:block lg:order-3">
                            {/* Stats Card */}
                            <div className="bg-gray-900 p-4 xl:p-6 rounded-2xl shadow-lg border border-gray-700 h-44 xl:h-48 flex items-center justify-center text-center">
                                <div className="text-white">
                                    <p className="text-3xl xl:text-4xl font-bold">400+</p>
                                    <p className="text-sm xl:text-base opacity-90">Businesses</p>
                                    <p className="text-sm xl:text-base opacity-90">Trust Qhuube</p>
                                </div>
                            </div>
                            {/* Right Testimonial Card */}
                            <div className="bg-white p-4 xl:p-6 rounded-2xl shadow-lg border border-gray-200 h-fit w-72 flex flex-col justify-between">
                                <p className="text-xs xl:text-sm text-gray-800 leading-relaxed font-medium">
                                    {"\"Thanks to Qhuube, managing EU VAT across markets feels effortless. It just works.\""}
                                </p>

                                <div className="flex items-center gap-3 mt-4">
                                    <Image
                                        src="/images/womne.jpg"
                                        alt="Floyd Miles"
                                        width="32"
                                        height="32"
                                        className="rounded-full object-cover xl:w-10 xl:h-10"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-xs xl:text-sm">Floyd Miles</p>
                                        <p className="text-xs text-gray-500">Finance Director, Innovate Corp</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSectionDashboard
