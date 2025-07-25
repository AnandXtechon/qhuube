/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react';
import { CheckCircle, ReceiptText, Globe, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const ConversionSection = () => {
	const sections = [
		{
			id: 1,
			title: "Effortless OSS VAT Compliance",
			subtitle: "Compliant with EU-wide OSS rules",
			icon: ReceiptText,
			color: "from-sky-500 to-sky-600",
			bgColor: "from-sky-50 to-blue-50",
			features: [
				"EU OSS compliance out of the box",
				"Zero manual calculations",
				"Ready-to-file VAT summaries",
				"Built-in validation & correction",
			],
			stats: { value: "100%", label: "EU OSS Compliance" },
			description:
				"Take the complexity out of VAT. We handle OSS reporting across all EU member states with full accuracy, so you don’t have to.",
			imageSrc: "/images/img1.jpg",
			overlayContent: {
				badge: "VAT READY",
				title: "EU OSS Report",
				subtitle: "Compliant & clean",
				status: "complete",
			},
		},
		{
			id: 2,
			title: "Automatic VAT Rates & Currency Handling",
			subtitle: "Accurate rates and EUR conversion",
			icon: Globe,
			color: "from-sky-500 to-sky-600",
			bgColor: "from-sky-50 to-blue-50",
			features: [
				"Supports any EU VAT rate configuration",
				"Automatic currency conversion to EUR",
				"Transaction-level export included",
				"Accurate rounding and country mapping",
			],
			stats: { value: "27", label: "Countries Covered" },
			description:
				"No matter the rate or currency, we process and convert everything for you. Download ready-to-file summaries and transaction-level detail instantly.",
			imageSrc: "/images/img3.jpeg",
			overlayContent: {
				badge: "MULTI-RATE",
				title: "Converted & Summarized",
				subtitle: "EUR-compliant output",
				status: "automated",
			},
		},
		{
			id: 3,
			title: "Made for Sellers, BookKeepers & Accountants",
			subtitle: "No integrations, just upload data",
			icon: ShieldCheck,
			color: "from-sky-500 to-sky-600",
			bgColor: "from-sky-50 to-blue-50",
			features: [
				"Upload CSV or spreadsheet data directly",
				"No software setup or API keys needed",
				"Simple, audit-friendly interface",
				"Export corrected data anytime",
			],
			stats: { value: "0", label: "Integrations Needed" },
			description:
				"Our system is designed for real workflows. No tech setup, no platform lock-in—just upload your sales data and receive clean OSS-ready output.",
			imageSrc: "/images/img4.jpg",
			overlayContent: {
				badge: "NO SETUP",
				title: "Upload. Done.",
				subtitle: "No API keys, no code",
				status: "ready",
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
								<div className={`text-xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
									{section.stats.value}
								</div>
								<div className="text-xs text-gray-600 font-medium">{section.stats.label}</div>
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
									width={800}
									height={500}
									className="w-full h-76 object-cover transition-transform duration-500 group-hover:scale-105"
								/>

								{/* Soft Gradient Overlay */}
								<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/30 pointer-events-none" />

								{/* Top Badge */}
								<div className="absolute top-4 left-4 z-10 animate-slide-in-left">
									<div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-white/30">
										<div className="w-2 h-2 bg-sky-500 rounded-full"></div>
										<span className="text-xs font-semibold text-gray-800">
											{section.overlayContent.badge}
										</span>
									</div>
								</div>

								{/* Bottom Content Card */}
								<div className="absolute bottom-4 left-4 right-4 z-10 animate-slide-in-up">
									<div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
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
												className={`w-3 h-3 rounded-full ${section.overlayContent.status === "paid" ||
														section.overlayContent.status === "success"
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

							{/* Soft Background Glow */}
							<div
								className={`absolute -z-10 -top-2 -right-2 w-full h-full rounded-2xl bg-gradient-to-r ${section.color} opacity-10`}
							></div>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}

export default ConversionSection;