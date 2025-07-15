import Link from "next/link"
import { Shield, Globe, FileText, Calculator, CheckCircle, ArrowRight, Users, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


export default function CompliancePage() {
    const services = [
        {
            icon: Shield,
            title: "VAT Compliance",
            description: "Complete VAT registration, filing, and management across all EU member states",
            features: [
                "VAT registration in all 27 EU countries",
                "Automated VAT return filing",
                "Real-time compliance monitoring",
                "Multi-language support",
                "Penalty avoidance system"
            ],
            href: "/compliance/vat"
        },
        {
            icon: Globe,
            title: "OSS (One Stop Shop)",
            description: "Simplified EU-wide VAT reporting for digital services and distance sales",
            features: [
                "Single point VAT registration",
                "Automated OSS return filing",
                "Cross-border transaction management",
                "Currency conversion handling",
                "Quarterly reporting automation"
            ],
            href: "/compliance/oss"
        },
        {
            icon: FileText,
            title: "Tax Reporting",
            description: "Automated tax reporting and documentation for European markets",
            features: [
                "Automated report generation",
                "Multi-format export options",
                "Audit trail maintenance",
                "Regulatory change notifications",
                "Historical data archiving"
            ],
            href: "/compliance/reporting"
        },
        {
            icon: Calculator,
            title: "Tax Calculation",
            description: "Real-time VAT calculation engine for all EU jurisdictions",
            features: [
                "Real-time rate updates",
                "Product classification support",
                "Exception handling",
                "API integration ready",
                "Bulk calculation processing"
            ],
            href: "/compliance/calculation"
        }
    ]

    const benefits = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Process thousands of transactions in seconds with our optimized calculation engine"
        },
        {
            icon: Shield,
            title: "100% Compliant",
            description: "Stay compliant with ever-changing EU tax regulations automatically"
        },
        {
            icon: Clock,
            title: "24/7 Monitoring",
            description: "Continuous monitoring ensures you never miss a filing deadline"
        },
        {
            icon: Users,
            title: "Expert Support",
            description: "Dedicated European tax experts available when you need them"
        }
    ]

    const countries = [
        "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
        "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
        "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
        "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
        "Slovenia", "Spain", "Sweden"
    ]

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-sky-50 via-white to-blue-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge className="mb-4 bg-sky-100 text-sky-800 hover:bg-sky-200">
                            European Tax Compliance
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Simplify Your
                            <span className="text-sky-600 block">European Tax Compliance</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            QHUUBE provides comprehensive VAT and OSS compliance solutions for businesses
                            operating across the European Union. Automate your tax processes and stay compliant
                            with confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3">
                                <Link href="/upload" className="flex items-center gap-2">
                                    Get Started Free
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-50 px-8 py-3">
                                <Link href="/contact">Schedule Demo</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Complete Compliance Solutions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to manage European tax compliance from a single platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((service) => {
                            const IconComponent = service.icon
                            return (
                                <Card key={service.title} className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-sky-200">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                                                <IconComponent className="h-6 w-6 text-sky-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl text-gray-900 group-hover:text-sky-600 transition-colors">
                                                    {service.title}
                                                </CardTitle>
                                            </div>
                                        </div>
                                        <CardDescription className="text-gray-600 text-base leading-relaxed">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-6">
                                            {service.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-3">
                                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button asChild variant="outline" className="w-full group-hover:bg-sky-50 group-hover:border-sky-300">
                                            <Link href={service.href} className="flex items-center justify-center gap-2">
                                                Learn More
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose QHUUBE?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built by tax experts for modern businesses operating in Europe
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit) => {
                            const IconComponent = benefit.icon
                            return (
                                <div key={benefit.title} className="text-center group">
                                    <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-200 transition-colors">
                                        <IconComponent className="h-8 w-8 text-sky-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Coverage Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Complete EU Coverage
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Full compliance support across all 27 European Union member states
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {countries.map((country) => (
                                <div key={country} className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                                    <span className="text-gray-700 text-sm font-medium">{country}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Badge className="bg-green-100 text-green-800">
                                27 Countries • Full Coverage • Always Updated
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-sky-600 to-sky-700">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Simplify Your Tax Compliance?
                    </h2>
                    <p className="text-xl text-sky-100 mb-8 leading-relaxed">
                        Join hundreds of businesses already using QHUUBE for their European tax compliance needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-50 px-8 py-3">
                            <Link href="/upload" className="flex items-center gap-2">
                                Start Free Trial
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sky-600 px-8 py-3">
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}