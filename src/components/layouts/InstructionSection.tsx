"use client"
import { motion, type Variants } from "framer-motion"
import { CheckCircle } from "lucide-react"

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
}

const InstructionSection = () => {
    return (
        <section className="relative flex flex-col items-center justify-center py-20 px-6 bg-white overflow-hidden">
            {/* Badge */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
                <h2 className="text-sky-600 text-sm font-medium">TaxTrack simplifies EU VAT compliance</h2>
            </motion.div>

            {/* Header */}
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className="flex flex-col items-center justify-center max-w-4xl mt-6 mb-16 relative z-10 text-center"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Simplifying EU VAT Compliance, One Step at a Time
                </h2>
                <p className="text-gray-600 text-lg mt-6 max-w-2xl">
                    TaxTrack helps businesses selling across the EU stay compliant with VAT laws—without the hassle.
                </p>
            </motion.div>

            {/* Steps */}
            {[
                {
                    title: "Effortlessly import your sales data",
                    tag: "STEP — 01.",
                    description:
                        "Sync your EU sales transactions into TaxTrack using CSV, Excel, or TXT files. Automate imports via ecommerce integrations like Amazon, Shopify, and Stripe to save time and reduce errors.",
                    highlights: [
                        "Seamless integration with major ecommerce and accounting platforms",
                        "Supports all common file formats for maximum flexibility",
                        "Custom mapping support for files without direct integrations",
                    ],
                },
                {
                    title: "Automatically validate your VAT data",
                    tag: "STEP — 02.",
                    description:
                        "Ensure your data is accurate and VAT-ready with TaxTrack’s built-in validation engine. Our system checks your sales records for EU VAT rules, country thresholds, and regulatory compliance.",
                    highlights: [
                        "Detects common VAT issues like missing VAT IDs, rate mismatches, or invalid entries",
                        "Country-specific logic built-in for all 27 EU member states",
                        "Real-time feedback to fix issues before submission",
                    ],
                },
                {
                    title: "Generate VAT reports for every country",
                    tag: "STEP — 03.",
                    description:
                        "With just a few clicks, TaxTrack transforms your sales data into compliant VAT reports—tailored for each EU country where you sell.",
                    highlights: [
                        "One-click generation of OSS, IOSS, and local country reports",
                        "Multi-country support with local currencies, rates, and rules",
                        "Export-ready files for submission or accounting handoff",
                    ],
                },
                {
                    title: "File VAT returns directly or with your advisor",
                    tag: "STEP — 04.",
                    description:
                        "Submit returns through our partner network or generate ready-to-file documents for your tax agent. TaxTrack ensures your filings are always audit-proof.",
                    highlights: [
                        "Supports manual and direct submissions across the EU",
                        "Clear audit trail with downloadable filing records",
                        "Optional filing support via TaxTrack’s local filing partners",
                    ],
                },
                {
                    title: "Stay compliant with proactive monitoring",
                    tag: "STEP — 05.",
                    description:
                        "Track thresholds, deadlines, and tax rate changes automatically. TaxTrack keeps you ahead of compliance risks, with alerts and dashboards built for sellers.",
                    highlights: [
                        "Threshold tracking for EU distance selling limits",
                        "Automatic updates on VAT rate and rule changes",
                        "Compliance alerts to avoid penalties or late filings",
                    ],
                },
            ].map((step, index) => {
                const isReversed = index % 2 === 1
                return (
                    <motion.div
                        key={index}
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.7 }}
                        className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"
                            } items-center justify-center gap-12 max-w-7xl w-full relative z-10 my-16`}
                    >
                        {/* Image Placeholder */}
                        <div className="flex-1 max-w-lg">
                            <div className="bg-sky-50 border border-sky-100 rounded-xl p-8 h-[400px] flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium">Image Placeholder</p>
                                    <p className="text-xs mt-1">{step.tag}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 max-w-lg">
                            <div className="mb-4">
                                <span className="text-sky-600 text-sm font-medium tracking-wide">{step.tag}</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{step.title}</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">{step.description}</p>
                            <div className="space-y-4">
                                {step.highlights.map((highlight, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <p className="text-gray-700 font-medium leading-relaxed">{highlight}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </section>
    )
}

export default InstructionSection
