"use client"

// import { Eye, Heart, TrendingUp, Calculator, Building } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const HeroSectionDashboard = () => {
    return (
        <section className="relative py-12 sm:py-16 lg:pt-20 xl:pb-0">
            <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="inline-flex px-4 py-2 text-base text-gray-900 border border-gray-200 rounded-full font-pj">
                        Built for EU businesses. Trusted by professionals.
                    </p>
                    <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">
                        Effortless Europe VAT Compliance
                    </h1>
                    <p className="max-w-md mx-auto mt-6 text-base leading-7 text-gray-600 font-inter">
                        Real-time logic, threshold tracking, and effortless filings. Navigate EU VAT like a pro from one powerful dashboard.
                    </p>

                    <div className="relative inline-flex mt-10 group">
                        <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#E0F2FF] via-[#60A5FA] to-[#60A5FA] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                        <Link href="/upload" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" role="button">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-16 md:mt-20">
                <div className="py-12 px-4 sm:px-6 lg:px-8">
                    {/* Background blur effects */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Main Container - Responsive Grid Layout */}
                    <div className="relative max-w-7xl mx-auto">
                        {/* Desktop: Horizontal Layout (No Scroll) */}
                        <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-6">
                            {/* Left Testimonial Card */}
                            <div className="w-56 xl:w-64">
                                <div className="bg-white p-4 xl:p-6 rounded-2xl shadow-lg h-44 xl:h-48 flex flex-col justify-between">
                                    <p className="text-xs xl:text-sm text-gray-800 leading-relaxed font-medium">
                                        {`"Qhuube simplified our EU VAT compliance completely. No more manual calculations or missed deadlines."`}
                                    </p>
                                    <div className="flex items-center gap-3">
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


                            {/* Central Professional Image */}
                            <div className="flex-shrink-0">
                                <Image
                                    src="/images/women.jpg"
                                    alt="Professional businessman using Qhuube"
                                    width="180"
                                    height="240"
                                    className="rounded-2xl shadow-lg object-cover xl:w-60 xl:h-80"
                                />
                            </div>

                            {/* Compliance Dashboard Card */}
                            <div className="w-56 xl:w-64">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-auto">
                                    {/* Header with Demo Badge */}
                                    <div className="p-3 xl:p-4 border-b">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">COMPLIANCE DEMO</span>
                                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">LIVE</span>
                                        </div>
                                        <h3 className="text-sm xl:text-base font-semibold text-gray-900">EU Tax Compliance Kit</h3>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-3 xl:p-4">
                                        <div className="space-y-2 xl:space-y-3 mb-4">
                                            <div className="flex items-center text-xs xl:text-sm text-gray-600">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                                                <span>Focus Order Prototype</span>
                                            </div>
                                            <div className="flex items-center text-xs xl:text-sm text-gray-600">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                                                <span>and Focus Order</span>
                                            </div>
                                            <div className="flex items-center text-xs xl:text-sm text-gray-600">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                                                <span>Plugin from Microsoft</span>
                                            </div>
                                        </div>
{/* 
                                        <div className="flex items-center mb-4">
                                            <Image
                                                src="/images/testimonial-4.webp"
                                                alt="Elena Rossi"
                                                width="20"
                                                height="20"
                                                className="rounded-full mr-3 object-cover w-8 h-8 xl:w-10 xl:h-10"
                                            />
                                            <p className="text-xs xl:text-sm text-gray-700">Elena Rossi</p>
                                        </div> */}

                                        {/* <div className="flex items-center text-gray-500 text-xs xl:text-sm">
                                            <Heart className="h-3 w-3 xl:h-4 xl:w-4 mr-1" />
                                            <span>1052</span>
                                            <Eye className="h-3 w-3 xl:h-4 xl:w-4 ml-4 mr-1" />
                                            <span>33,492</span>
                                        </div> */}
                                    </div>  
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="w-40 xl:w-48">
                                <div className="bg-gray-900 p-4 xl:p-6 rounded-2xl shadow-lg h-44 xl:h-48 flex items-center justify-center text-center">
                                    <div className="text-white">
                                        <p className="text-3xl xl:text-4xl font-bold">400+</p>
                                        <p className="text-sm xl:text-base opacity-90">Businesses</p>
                                        <p className="text-sm xl:text-base opacity-90">Trust Qhuube</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Testimonial Card */}
                            <div className="w-56 xl:w-64">
                                <div className="bg-white p-4 xl:p-6 rounded-2xl shadow-lg h-44 xl:h-48 flex flex-col justify-between">
                                    <p className="text-xs xl:text-sm text-gray-800 leading-relaxed font-medium">
                                        {`"When you have lots of resources on your hand, it makes the development process easy!"`}
                                    </p>
                                    <div className="flex items-center gap-3">
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

                        {/* Floating Profile Picture - Top Right (Desktop Only) */}
                        <div className="absolute -top-14 right-0 hidden xl:block">
                            <Image
                                src="/images/man1.jpg"
                                alt="Business executive"
                                width={80}
                                height={200}
                                className="rounded-lg w-36 h-auto object-cover shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSectionDashboard