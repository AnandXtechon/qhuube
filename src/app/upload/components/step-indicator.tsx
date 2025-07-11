"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

interface Step {
    id: number;
    name: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick: (stepId: number) => void;
}

export default function StepIndicator({
    steps,
    currentStep,
    // onStepClick,
}: StepIndicatorProps) {
    return (
        <div className="mb-10 px-4">
            {/* Logo */}
            <div className="hidden lg:flex items-center ">
                <Link href="/" className="">
                    <span className="text-2xl font-bold text-sky-600">Q</span>
                    <span className="text-xl font-bold text-gray-900">HUUBE</span>
                </Link>
            </div>

            {/* Steps */}
            <div className="flex flex-wrap justify-center md:gap-6">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        {/* Step Circle & Label */}
                        <div className="flex flex-col items-center lg:flex-row md:items-center">
                            <motion.div
                                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 text-sm sm:text-base cursor-pointer transition-all duration-300
                  ${step.id < currentStep
                                        ? "bg-green-500 border-green-500 text-white"
                                        : step.id === currentStep
                                            ? "bg-sky-500 border-sky-500 text-white"
                                            : "bg-white border-gray-300 text-gray-400"
                                    }`}
                                // onClick={() => onStepClick(step.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {step.id < currentStep ? (
                                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                                ) : (
                                    <span className="font-semibold">{step.id}</span>
                                )}
                            </motion.div>

                            <p
                                className={`mt-1 md:mt-0 md:ml-2 text-xs sm:text-sm md:text-base text-center md:text-left font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-500"
                                    }`}
                            >
                                {step.name}
                            </p>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="w-6 sm:w-10 md:w-16 h-0.5 bg-gray-300 mx-1 sm:mx-2">
                                <div
                                    className={`h-full ${step.id < currentStep ? "bg-green-500 w-full" : ""
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
