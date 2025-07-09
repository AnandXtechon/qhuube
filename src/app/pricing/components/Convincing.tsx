/* eslint-disable react/no-unescaped-entities */
import { Shield, Zap, Users, Globe, Award, Clock, Star } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const features = [
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade encryption and SOC 2 compliance to protect your financial data.",
    },
    {
        icon: Zap,
        title: "Automated Processing",
        description: "Complete VAT registrations in minutes with intelligent automation.",
    },
    {
        icon: Globe,
        title: "EU-Wide Coverage",
        description: "Full compliance across all 27 EU countries with real-time updates.",
    },
    {
        icon: Users,
        title: "Expert Support",
        description: "24/7 access to certified tax professionals when you need help.",
    },
    {
        icon: Award,
        title: "99.9% Accuracy",
        description: "Precise calculations with built-in error checking and validation.",
    },
    {
        icon: Clock,
        title: "Time Savings",
        description: "Save 15+ hours per week on tax compliance and reporting.",
    },
]

const testimonials = [
    {
        quote: "Qhuube reduced our tax compliance workload by 80%. The automation is incredible and the support team is always there when we need them.",
        author: "Sarah Chen",
        role: "CFO",
        company: "TechStart GmbH",
        avatar: "/images/testimonial-1.jpeg",
    },
    {
        quote: "Finally, EU tax compliance that makes sense. The interface is intuitive and the results are always accurate. Game changer for our business.",
        author: "Marco Rossi",
        role: "Finance Director",
        company: "InnovateCorp",
        avatar: "/images/testimonial-2.webp",
    },
    {
        quote: "The ROI was immediate. What used to take our team days now happens automatically. Qhuube pays for itself many times over.",
        author: "Emma Thompson",
        role: "Head of Finance",
        company: "ScaleUp Ltd",
        avatar: "/images/testimonial-3.webp",
    },

    {
        quote: "Qhuube streamlined our entire tax workflow. It’s like having an extra team member that never makes mistakes.",
        author: "Daniel Weber",
        role: "Chief Accountant",
        company: "LedgerWise Inc.",
        avatar: "/images/testimonial-4.webp",
    },
    {
        quote: "We moved fast with Qhuube — setup was painless and results were instant. It's easily one of our best financial tools.",
        author: "Liam Novak",
        role: "VP of Finance",
        company: "EuroScale Technologies",
        avatar: "/images/testimonial-5.webp",
    },
    {
        quote: "I no longer worry about quarterly filings. Qhuube handles everything behind the scenes, and I finally feel in control.",
        author: "Isabelle Moreau",
        role: "Finance Lead",
        company: "BrightBridge Solutions",
        avatar: "/images/testimonial-6.webp",
    },    
]

const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "€2.5M", label: "Tax Savings" },
    { number: "99.9%", label: "Uptime" },
    { number: "27", label: "EU Countries" },
]

const Convincing = () => {
    return (
        <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Why choose Qhuube?
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-600 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Thousands of businesses trust Qhuube to handle their EU tax compliance.
                        Here's why they chose us over the competition.
                    </motion.p>
                </div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center bg-gray-50 p-5 rounded-xl">
                            <div className="text-4xl font-bold text-sky-900 mb-2">{stat.number}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <div className="mb-24">
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, staggerChildren: 0.1 }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                                            <feature.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Social Proof Section */}
                <div className="mb-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Trusted by finance teams across Europe
                        </h3>
                        <p className="text-xl text-gray-600">
                            See what our customers have to say about their experience
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, staggerChildren: 0.1 }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                                    "{testimonial.quote}"
                                </blockquote>

                                <div className="flex items-center">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        width={30}
                                        height={30}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {testimonial.author}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {testimonial.role}, {testimonial.company}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    )
}

export default Convincing