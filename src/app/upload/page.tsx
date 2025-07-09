"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import UploadStep from "./components/upload-step"
import OverviewStep from "./components/overview-step"
import CorrectionStep from "./components/correction-step"
import StepIndicator from "./components/step-indicator"
import { useUploadStore } from "@/store/uploadStore"
import PaymentStep from "./components/payment-step"

const VATComplianceWizard = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const { uploadedFiles, setUploadedFiles } = useUploadStore()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [correctedData, setCorrectedData] = useState<any[]>([])

    const steps = [
        { id: 1, name: "Data upload", component: UploadStep },
        { id: 2, name: "Correction", component: CorrectionStep },
        { id: 3, name: "Payment", component: PaymentStep },
        { id: 4, name: "Overview", component: OverviewStep },

    ]

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleStepClick = (stepId: number) => {
        if (stepId <= currentStep || stepId === currentStep + 1) {
            setCurrentStep(stepId)
        }
    }

    const CurrentStepComponent = steps[currentStep - 1].component


    return (
        <div className="min-h-screen bg-gradient-to-br from-white-50 to-blue-50 py-8 px-6">
            <div className={`mx-auto w-full max-w-6xl`}>
                <StepIndicator
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={handleStepClick}
                />

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                >
                    <CurrentStepComponent
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        correctedData={correctedData}
                        setCorrectedData={setCorrectedData}
                    />
                </motion.div>
            </div>
        </div>
    )
}

export default VATComplianceWizard
