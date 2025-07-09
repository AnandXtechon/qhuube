"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
    onStepClick,
}: StepIndicatorProps) {
    return (
        <div className="mb-12 px-4">
            <div className="">
                <h2 className="text-2xl font-semibold"><span className="text-blue text-sky-600 text-3xl">Q</span>HUUBE</h2>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-4 -mt-5">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        {/* Circle + Label container */}
                        <div className="flex flex-col items-center md:flex-row md:items-center">
                            <motion.div
                                className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 cursor-pointer transition-all duration-300
                ${step.id < currentStep
                                        ? "bg-green-500 border-green-500 text-white"
                                        : step.id === currentStep
                                            ? "bg-sky-500 border-sky-500 text-white"
                                            : "bg-white border-gray-300 text-gray-400"
                                    }`}
                                onClick={() => onStepClick(step.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {step.id < currentStep ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    <span className="font-semibold">{step.id}</span>
                                )}
                            </motion.div>

                            <p
                                className={`mt-2 md:mt-0 md:ml-2 text-sm text-center md:text-left font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-500"
                                    }`}
                            >
                                {step.name}
                            </p>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className="w-6 md:w-16 h-0.5 bg-gray-300 mx-2">
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
