"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, TrendingUp } from 'lucide-react';
import { fadeInUp, floatingVariants, imageVariants, staggerContainer } from '@/lib/animation';
import Link from 'next/link';

const HeroSection = () => {


    const stats = [
        { value: "99.9%", label: "Accuracy Rate" },
        { value: "10k+", label: "Businesses" },
        { value: "€2.5M+", label: "Tax Savings" },
    ];


    return (
        <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center overflow-hidden">
            {/* Enhanced Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/3 left-1/3 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fill-rule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fill-opacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`}
                />

            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                    >
                        {/* Enhanced Badge */}
                        {/* <motion.div variants={fadeInUp}>
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-5 py-3 text-sm font-medium text-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>Trusted by 10,000+ European businesses</span>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                        </motion.div> */}

                        {/* Enhanced Main Heading */}
                        <motion.div variants={fadeInUp} className="space-y-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                <span className="block">Effortless</span>
                                <span className="block text-sky-600 bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                                    EU Tax Compliance
                                </span>
                                <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-600 mt-2">
                                    Made Simple
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                Automate VAT calculations, detect compliance issues, and streamline reporting across all 27 EU countries from one intelligent platform.
                                <span className="font-semibold text-blue-600"> Save 15+ hours weekly.</span>
                            </p>
                        </motion.div>


                        <motion.button
                            className="bg-sky-600 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/upload" className="relative z-10 flex items-center">
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </motion.button>
                    </motion.div>


                    {/* Enhanced Right Content - Product Mockup */}
                    <motion.div
                        variants={imageVariants}
                        initial="hidden"
                        animate="show"
                        className="relative"
                    >
                        <motion.div
                            className="relative"
                            variants={floatingVariants}
                            animate="animate"
                        >
                            {/* Main product mockup */}
                            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
                                {/* Mock browser header */}
                                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 ml-4">
                                        app.qhuube.com/dashboard
                                    </div>
                                </div>

                                {/* Mock dashboard content */}
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Tax Compliance Dashboard</h3>
                                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                All systems operational
                                            </div>
                                        </div>

                                        {/* Stats cards */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="text-2xl font-bold text-blue-600">€1,245</div>
                                                <div className="text-xs text-gray-600">Monthly Savings</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="text-2xl font-bold text-green-600">99.9%</div>
                                                <div className="text-xs text-gray-600">Accuracy Rate</div>
                                            </div>
                                        </div>

                                        {/* Progress bars */}
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>VAT Compliance</span>
                                                    <span>98%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>Report Generation</span>
                                                    <span>100%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Floating stats cards */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-gray-200/50 p-4 backdrop-blur-sm"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">€245.50</div>
                                        <div className="text-sm text-gray-600">Tax Savings Today</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl border border-gray-200/50 p-4 backdrop-blur-sm"
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">99.9%</div>
                                        <div className="text-sm text-gray-600">Accuracy Rate</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Enhanced Decorative elements */}
                            <div className="absolute -z-10 -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Enhanced Bottom Stats Section */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="mt-20 pt-12 border-t border-gray-200/50"
                >
                    <motion.div variants={fadeInUp} className="text-center mb-8">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Trusted by finance teams across Europe
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center bg-white/80 backdrop-blur-sm py-8 px-6 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 group"
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;