/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react';
import { FileText, Calculator, BarChart3, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const ConversionSection = () => {
    const sections = [
        {
            id: 1,
            title: "Automated Invoice Processing",
            subtitle: "Faster billing, zero manual errors",
            icon: FileText,
            color: "from-sky-500 to-sky-600",
            bgColor: "from-sky-50 to-blue-50",
            features: [
                "One-click invoice generation",
                "Automated payment reminders",
                "Multi-currency & tax-compliant formats",
                "Live payment tracking with Stripe sync",
            ],
            stats: { value: "98%", label: "Faster Processing" },
            description:
                "Accelerate your billing workflow with Stripe-powered automation—from invoice creation to secure collection—all in real time.",
            imageSrc: "/images/img3.jpeg",
            overlayContent: {
                badge: "PROCESSING",
                title: "Invoice #2024-001",
                subtitle: "€2,450.00",
                status: "paid",
            },
        },
        {
            id: 2,
            title: "Real-Time Financial Analytics",
            subtitle: "Smarter decisions, faster growth",
            icon: Calculator,
            color: "from-sky-500 to-sky-600",
            bgColor: "from-sky-50 to-blue-50",
            features: [
                "Instant dashboards with live metrics",
                "AI-powered cash flow forecasting",
                "Smart expense classification",
                "Custom reports & KPI tracking",
            ],
            stats: { value: "24/7", label: "Live Monitoring" },
            description:
                "Gain always-on visibility into your financial health. Our real-time analytics help you identify trends, control costs, and fuel strategic growth.",
            imageSrc: "/images/img2.webp",
            overlayContent: {
                badge: "ANALYTICS",
                title: "Revenue Growth",
                subtitle: "+23.5% this month",
                status: "trending",
            },
        },
        {
            id: 3,
            title: "Stripe-Powered Payment Gateway",
            subtitle: "Built for scale, secured for trust",
            icon: BarChart3,
            color: "from-sky-500 to-sky-600",
            bgColor: "from-sky-50 to-blue-50",
            features: [
                "Stripe-integrated checkout experience",
                "Bank-level encryption & fraud detection",
                "PCI DSS Level 1 compliant infrastructure",
                "Supports cards, wallets, bank transfers, and more",
            ],
            stats: { value: "99.9%", label: "Uptime SLA" },
            description:
                "Accept payments globally with Stripe's enterprise-grade infrastructure—secure, reliable, and optimized for conversions.",
            imageSrc: "/images/img1.jpeg",
            overlayContent: {
                badge: "SECURE",
                title: "Transaction Complete",
                subtitle: "€1,250.00 processed",
                status: "success",
            },
        },
    ];
      

    return (
        <div className="relative bg-white">
            {/* Header Section */}
            <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            The modern{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-600">
                                finance platform
                            </span>{" "}
                            for growing businesses
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Streamline your financial operations with powerful tools designed for efficiency and growth
                        </p>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-24 pb-24">
                {sections.map((section, index) => (
                    <SectionCard key={section.id} section={section} index={index} />
                ))}
            </div>
        </div>
    );
};

interface SectionCardProps {
    section: any;
    index: number;
}

function SectionCard({ section, index }: SectionCardProps) {
    const isEven = index % 2 === 0;

    return (
        <div className="relative animate-fade-in-up">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? "" : "lg:grid-flow-col-dense"}`}>

                    {/* Content Side */}
                    <div className={`space-y-6 ${isEven ? "lg:pr-8" : "lg:pl-8 lg:col-start-2"}`}>

                        {/* Icon and Badge */}
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} p-3 shadow-sm`}>
                                <section.icon className="w-full h-full text-white" />
                            </div>
                            <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${section.bgColor} border border-sky-100`}>
                                <span className="text-sm font-medium text-sky-700">{section.subtitle}</span>
                            </div>
                        </div>

                        {/* Title and Description */}
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                {section.title}
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {section.description}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3">
                            {section.features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 group">
                                    <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors">
                                        <CheckCircle className="w-3 h-3 text-sky-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="text-center">
                                <div className={`text-3xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                                    {section.stats.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">{section.stats.label}</div>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div className="text-sm text-gray-600">
                                Trusted by 10,000+ businesses
                            </div>
                        </div>
                    </div>

                    {/* Image Side with Overlay */}
                    <div className={`relative ${isEven ? "lg:pl-8" : "lg:pr-8 lg:col-start-1 lg:row-start-1"}`}>
                        <div className="relative group">

                            {/* Main Image Container */}
                            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                                <Image
                                    src={section.imageSrc}
                                    alt={section.title}
                                    width={200}
                                    height={100}
                                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent">

                                    {/* Top Badge */}
                                    <div className="absolute top-4 left-4 animate-slide-in-left">
                                        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-white/20">
                                            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                                            <span className="text-xs font-semibold text-gray-800">
                                                {section.overlayContent.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Content Card */}
                                    <div className="absolute bottom-4 left-4 right-4 animate-slide-in-up">
                                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                                            <div className="space-y-2">

                                                {/* Title Section */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-base font-bold text-gray-900">
                                                            {section.overlayContent.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {section.overlayContent.subtitle}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${section.overlayContent.status === "paid" || section.overlayContent.status === "success"
                                                                ? "bg-green-500"
                                                                : section.overlayContent.status === "trending"
                                                                    ? "bg-sky-500 animate-pulse"
                                                                    : "bg-gray-400"
                                                            }`}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className={`absolute -z-10 -top-2 -right-2 w-full h-full rounded-2xl bg-gradient-to-r ${section.color} opacity-10`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversionSection;