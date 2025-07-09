"use client"
import { fadeInUp, staggerContainer } from "@/lib/animation"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

const ComplianceSection = () => {
    
    const complianceFeatures = [
        {
            icon: '/icons/shield.svg',
            title: "Enterprise Security",
            description: "Bank-level encryption and security protocols protect your sensitive financial data.",
            details: ["256-bit SSL encryption", "SOC 2 Type II certified", "Regular security audits"],
        },
        {
            icon: '/icons/verified.svg',
            title: "GDPR Compliant",
            description: "Fully compliant with European data protection regulations and privacy laws.",
            details: ["Data minimization", "Right to be forgotten", "Privacy by design"],
        },
        {
            icon: '/icons/earth.svg',
            title: "Multi-Jurisdiction Ready",
            description: "Built to handle complex tax regulations across all 27 EU member states.",
            details: ["Real-time regulation updates", "Local tax expertise", "Automated compliance checks"],
        },
        {
            icon: "/icons/certified.svg",
            title: "Certified & Audited",
            description: "Independently verified by leading accounting firms and regulatory bodies.",
            details: ["ISO 27001 certified", "Annual compliance audits", "Third-party validated"],
        },
    ]


    return (
        <section className="relative py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    {/* <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        Enterprise Grade Security
                    </div> */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Built for Compliance & <span className="text-blue-600">Peace of Mind</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        {`Your business deserves a platform that's as serious about compliance as you are. TaxTrack is built with
                        enterprise-grade security, full regulatory compliance, and the trust of thousands of businesses.`}
                    </p>
                </motion.div>

                {/* Compliance Features Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid md:grid-cols-2 gap-8 mb-20"
                >
                    {complianceFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Image
                                            className="text-sky-400"
                                            src={feature.icon}
                                            alt={feature.title}
                                            width={30}
                                            height={30}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                                    <div className="space-y-2">
                                        {feature.details.map((detail, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <span className="text-sm text-gray-700">{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}

export default ComplianceSection
