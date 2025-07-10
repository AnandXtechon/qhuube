"use client"
import { useState } from 'react';
import { Play, Pause, ExternalLink, Shield, CheckCircle, Globe } from 'lucide-react';

const VideoSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="relative py-20 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side - Video Preview */}
                    <div className="relative">
                        <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900 group">
                            {/* Video Container */}
                            <div className="relative aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/LbNkkKJ5WO0?autoplay=${isPlaying ? 1 : 0}&mute=1&controls=1&rel=0&modestbranding=1`}
                                    title="Qhuube EU Tax Compliance Demo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>

                                {/* Play Button Overlay */}
                                {!isPlaying && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                        <button
                                            onClick={() => setIsPlaying(true)}
                                            className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200"
                                        >
                                            <Play className="w-6 h-6 text-gray-800 ml-1" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isPlaying ? 'Pause' : 'Play'} Demo
                                </button>
                            </div>
                            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                Watch Full Video
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="space-y-8">
                        {/* Brand Header */}
                        <div className="space-y-4">
                            {/* <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">Q</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Qhuube</h3>
                                    <p className="text-sm text-gray-600">EU Tax Compliance Platform</p>
                                </div>
                            </div> */}

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Simplify Your EU Tax Compliance
                            </h2>

                            <p className="text-lg text-gray-600 leading-relaxed">
                                Automate VAT reporting, manage cross-border transactions, and ensure full compliance
                                with EU tax regulations through our intelligent platform.
                            </p>
                        </div>

                        {/* Key Features */}
                        <div className="space-y-4">
                            {[
                                {
                                    icon: Shield,
                                    title: "Automated VAT Compliance",
                                    description: "Real-time VAT calculation and reporting across all EU member states"
                                },
                                {
                                    icon: Globe,
                                    title: "Cross-Border Management",
                                    description: "Seamless handling of international transactions and tax obligations"
                                },
                                {
                                    icon: CheckCircle,
                                    title: "Regulatory Updates",
                                    description: "Automatic updates for changing EU tax laws and regulations"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>



                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;