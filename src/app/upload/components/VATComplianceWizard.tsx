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
import Footer from "./footer"

const VATComplianceWizard = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const { uploadedFiles, setUploadedFiles, restoreFileObjects, paymentCompleted } = useUploadStore()

    // Restore file objects on component mount (after page refresh)
    useEffect(() => {
        restoreFileObjects()
    }, [restoreFileObjects])

    // Handle step navigation from URL params
    useEffect(() => {
        const stepParam = Number(searchParams.get("step"))
        const paymentSuccess = searchParams.get("payment_success")
    
        const noFilesUploaded = uploadedFiles.length === 0
    
        // Redirect to step 1 if there are no uploaded files and step is beyond 1
        if (stepParam > 1 && noFilesUploaded) {
            setCurrentStep(1)
            router.push("/upload?step=1")
            return
        }
    
        // Guard: prevent access to Overview step without payment
        if (stepParam === 4 && !paymentCompleted) {
            setCurrentStep(3)
            router.push("/upload?step=3")
            return
        }
    
        // If valid step, allow navigation
        if (!isNaN(stepParam) && stepParam >= 1 && stepParam <= 4) {
            setCurrentStep(stepParam)
        }
    
        // Handle payment return
        if (paymentSuccess === "true") {
            localStorage.removeItem("pre-payment-step")
            localStorage.removeItem("payment-initiated")
        }
    }, [searchParams, paymentCompleted, uploadedFiles, router])
    

    // Check for interrupted payment flow
    useEffect(() => {
        const prePaymentStep = localStorage.getItem("pre-payment-step")
        const paymentInitiated = localStorage.getItem("payment-initiated")

        if (prePaymentStep && paymentInitiated) {
            const initiatedTime = Number.parseInt(paymentInitiated)
            const now = Date.now()

            // If more than 30 minutes have passed, assume payment was abandoned
            if (now - initiatedTime > 30 * 60 * 1000) {
                localStorage.removeItem("pre-payment-step")
                localStorage.removeItem("payment-initiated")
            }
        }
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [correctedData, setCorrectedData] = useState<any[]>([])

    const steps = [
        { id: 1, name: "Upload", component: UploadStep },
        { id: 2, name: "Correction", component: CorrectionStep },
        { id: 3, name: "Payment", component: PaymentStep },
        { id: 4, name: "Overview", component: OverviewStep },
    ]

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
        // Allow navigation to previous steps or next step
        // For payment step, only allow if files are uploaded
        // For overview step, only allow if payment is completed
        if (stepId <= currentStep || stepId === currentStep + 1 || (stepId === 4 && paymentCompleted)) {
            setCurrentStep(stepId)
            router.push(`/upload?step=${stepId}`)
        }
    }

    const CurrentStepComponent = steps[currentStep - 1].component

    return (
        <div className="min-h-screen flex flex-col justify-between">
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
            <Footer />
        </div>
    )
}

export default VATComplianceWizard
