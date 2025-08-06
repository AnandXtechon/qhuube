"use client"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// import Link from "next/link"

interface Step {
    id: number
    name: string
}

interface StepIndicatorProps {
    steps: Step[]
    currentStep: number
    onStepClick: (stepId: number) => void
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white">
            <div className="absolute top-5 left-5 lg:left-20">
                <div className="flex items-center">
                    <Link href="/" className="">
                        <Image
                            src="/icons/Logo-2.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="w-full h-auto"
                        />
                        {/* <span className="text-2xl font-bold text-sky-600">Q</span>

                        <span className="text-xl font-bold text-gray-900">HUUBE</span> */}
                    </Link>
                </div>

            </div>
            <div className="max-w-6xl mx-auto px-4 py-4">
                {/* Steps */}
                <div className="flex justify-center items-center gap-4 md:gap-2 mt-20 xl:mt-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            {/* Step Circle & Label */}
                            <div className="flex items-center">
                                <motion.div
                                    className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 text-sm font-semibold transition-all duration-300
                      ${step.id < currentStep
                                            ? "bg-green-500 border-green-500 text-white"
                                            : step.id === currentStep
                                                ? "bg-sky-500 border-sky-500 text-white"
                                                : "bg-white border-gray-300 text-gray-400"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {step.id < currentStep ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <span>{step.id}</span>}
                                </motion.div>
                                <span
                                    className={`ml-2 text-sm md:text-base font-medium hidden sm:block ${step.id <= currentStep ? "text-gray-900" : "text-gray-500"
                                        }`}
                                >
                                    {step.name}
                                </span>
                            </div>
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="w-8 md:w-16 h-0.5 bg-gray-300 mx-2 md:mx-4">
                                    <div
                                        className={`h-full transition-all duration-300 ${step.id < currentStep ? "bg-green-500 w-full" : "w-0"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
