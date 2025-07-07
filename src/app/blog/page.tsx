"use client"

import Image from "next/image"
import { motion, Variants } from "framer-motion"
// import { Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const BlogPage = () => {
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

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const blogPosts = [
        {
            title: "Complete Guide to EU VAT Compliance in 2024",
            excerpt:
                "Everything you need to know about VAT regulations, filing requirements, and compliance strategies for businesses operating across European markets.",
            author: "Sarah Johnson",
            date: "March 15, 2024",
            readTime: "8 min read",
            category: "Compliance",
            imageUrl: "/images/image1.jpg",
        },
        {
            title: "Understanding OSS and IOSS: A Complete Breakdown",
            excerpt:
                "Learn the differences between One-Stop Shop (OSS) and Import One-Stop Shop (IOSS) systems and how they affect your business operations across EU member states.",
            author: "Michael Chen",
            date: "March 12, 2024",
            readTime: "6 min read",
            category: "Tax Strategy",
            imageUrl: "/images/image2.jpg",
        },
        {
            title: "5 Common VAT Filing Mistakes and How to Avoid Them",
            excerpt:
                "Discover the most frequent errors businesses make when filing VAT returns and practical tips to prevent costly mistakes.",
            author: "Emma Rodriguez",
            date: "March 10, 2024",
            readTime: "5 min read",
            category: "Best Practices",
            imageUrl: "/images/image3.jpg",
        },
        {
            title: "Digital Services Act: Impact on VAT for SaaS Companies",
            excerpt:
                "How the Digital Services Act affects VAT obligations for SaaS companies operating in the EU and what you need to know to stay compliant.",
            author: "David Thompson",
            date: "March 8, 2024",
            readTime: "7 min read",
            category: "Regulations",
            imageUrl: "/images/image4.jpg",
        },
        {
            title: "Automating Your VAT Processes: Complete ROI Guide",
            excerpt:
                "Calculate the ROI of automating VAT compliance and discover how to reduce time, cost, and human error in tax processes.",
            author: "Lisa Park",
            date: "March 5, 2024",
            readTime: "4 min read",
            category: "Automation",
            imageUrl: "/images/image1.jpg",
        },
        {
            title: "Brexit and VAT: What UK Businesses Need to Know",
            excerpt:
                "Navigate post-Brexit VAT requirements for UK businesses trading with the EU and understand the new compliance landscape.",
            author: "James Wilson",
            date: "March 3, 2024",
            readTime: "9 min read",
            category: "Brexit",
            imageUrl: "/images/image2.jpg",
        },
    ]

    const topics = [
        "VAT Compliance",
        "OSS & IOSS",
        "EU Tax Strategy",
        "Automation",
        "SaaS VAT",
        "Brexit",
    ]

    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.header
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        Latest <span className="text-blue-600">Insights</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Stay updated with expert insights, compliance strategies, and evolving tax laws that impact your global operations.
                    </p>
                </motion.header>

                {/* Popular Topics */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    className="flex flex-wrap justify-center gap-3 mb-14"
                >
                    {topics.map((topic, index) => (
                        <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-4 py-1 text-sm rounded-full font-medium shadow-sm hover:bg-blue-100 transition"
                        >
                            #{topic}
                        </span>
                    ))}
                </motion.div>

                {/* Blog Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={index}
                            variants={fadeInUp}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
                        >
                            {/* Image */}
                            <div className="h-44 relative">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <span className="inline-block mb-2 text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                    {post.category}
                                </span>
                                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                                {/* <div className="text-xs text-gray-500 flex flex-wrap items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {post.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1 mt-2 md:mt-0">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </span>
                                </div> */}
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.section
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.6 }}
                    className="bg-blue-50 mt-24 p-10 rounded-2xl text-center shadow-inner"
                >
                    <h3 className="text-3xl font-bold text-blue-800 mb-4">
                        Want more expert VAT content?
                    </h3>
                    <p className="text-blue-700 mb-6 text-lg">
                        Subscribe to our newsletter and never miss an update on EU compliance, automation, and tax strategies.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-medium">
                        Subscribe Now
                    </Button>
                </motion.section>
            </div>
        </section>
    )
}

export default BlogPage
