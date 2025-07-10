"use client";
import React from "react";
import { PlayCircle, BarChart3, FileCheck } from "lucide-react";

const ActionPreviewSection = () => {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-72 h-72 bg-sky-200/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-sky-200/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="text-center max-w-4xl z-10 mb-14 px-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    See the Platform in <span className="text-sky-600">Action</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Experience how our platform streamlines financial operations with intelligent automation and real-time insights.
                </p>
            </div>

            {/* Video Preview Section */}
            <div className="relative max-w-6xl w-full z-10">
                <div className="relative rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden bg-white">
                    {/* Browser-like header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-3 sm:p-4 flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 ml-4 text-sm text-gray-500 truncate">
                            https://qhuube.com/dashboard
                        </div>
                    </div>

                    {/* Video */}
                    <div className="relative w-full h-64 sm:h-[450px] lg:h-[500px] bg-gradient-to-br from-sky-50/50 to-white">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/LbNkkKJ5WO0?autoplay=1&mute=1&loop=1&playlist=LbNkkKJ5WO0&controls=0&showinfo=0&rel=0&modestbranding=1"
                            title="Platform Demo"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>

                        {/* Callout 1 */}
                        <div className="absolute top-6 left-4 sm:left-8 bg-white/95 backdrop-blur-sm border border-sky-100 shadow-md rounded-xl p-4 w-[90%] sm:max-w-xs animate-slide-in-left">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                    <h4 className="text-sky-600 font-semibold text-sm">Real-time Analytics</h4>
                                    <p className="text-gray-500 text-xs">Live insights & tracking</p>
                                </div>
                            </div>
                        </div>

                        {/* Callout 2 */}
                        <div className="absolute bottom-6 right-4 sm:right-8 bg-white/95 backdrop-blur-sm border border-sky-100 shadow-md rounded-xl p-4 w-[90%] sm:max-w-xs animate-slide-in-up">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                                    <FileCheck className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                    <h4 className="text-sky-600 font-semibold text-sm">Smart Automation</h4>
                                    <p className="text-gray-500 text-xs">Automated processing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 text-center z-10 px-4">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
                    <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-md hover:shadow-xl transition-all flex items-center gap-2 group">
                        <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                        Watch Full Demo
                    </button>
                    <button className="border-2 border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300 bg-white px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all">
                        Start Free Trial
                    </button>
                </div>
                <p className="text-sm text-gray-500">No signup required • 3-minute overview • See all features</p>
            </div>
        </section>
    );
};

export default ActionPreviewSection;
