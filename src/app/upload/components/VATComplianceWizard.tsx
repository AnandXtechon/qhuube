"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import UploadStep from "./upload-step"
import OverviewStep from "./overview-step"
import CorrectionStep from "./correction-step"
import StepIndicator from "./step-indicator"
import { useUploadStore } from "@/store/uploadStore"
import PaymentStep from "./payment-step"
import { useSearchParams, useRouter } from "next/navigation"

const VATComplianceWizard = () => {
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState(1)

    useEffect(() => {
        const stepParam = Number(searchParams.get("step"))
        if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= 4) {
            setCurrentStep(stepParam)
        }
    }, [searchParams])

    const { uploadedFiles, setUploadedFiles } = useUploadStore()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [correctedData, setCorrectedData] = useState<any[]>([])

    const steps = [
        { id: 1, name: "Upload", component: UploadStep },
        { id: 2, name: "Correction", component: CorrectionStep },
        { id: 3, name: "Payment", component: PaymentStep },
        { id: 4, name: "Overview", component: OverviewStep },
    ]

    const router = useRouter()

    const handleNext = () => {
        if (currentStep < steps.length) {
            const nextStep = currentStep + 1
            setCurrentStep(nextStep)
            router.push(`/upload?step=${nextStep}`)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            const prevStep = currentStep - 1
            setCurrentStep(prevStep)
            router.push(`/upload?step=${prevStep}`)
        }
    }

    const handleStepClick = (stepId: number) => {
        if (stepId <= currentStep || stepId === currentStep + 1) {
            setCurrentStep(stepId)
            router.push(`/upload?step=${stepId}`)
        }
    }

    const CurrentStepComponent = steps[currentStep - 1].component

    return (
        <div className="min-h-screen">
            <StepIndicator steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />

            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={currentStep === 2 ? "" : "pt-20"}
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
    )
}

export default VATComplianceWizard
