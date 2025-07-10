

interface FileMeta {
    name: string;
    size: number;
    type: string;
}


export interface UploadStepProps {
    onNext: () => void;
    onPrevious: () => void;
    currentStep: number;
    totalSteps: number;
}


export interface UploadState {
    uploadedFiles: FileMeta[];
    uploadProgress: Record<string, number>;
    setUploadedFiles: (files: FileMeta[]) => void;
    addUploadedFiles: (files: FileMeta[]) => void;
    setUploadProgress: (progress: Record<string, number>) => void;
    updateFileProgress: (fileName: string, progress: number) => void;
    removeFile: (fileName: string) => void;
}


export interface CorrectionStepProps {
    onNext: () => void
    onPrevious: () => void
    currentStep: number
    totalSteps: number
    uploadedFiles: FileMeta[]
    setUploadedFiles: (files: FileMeta[]) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    correctedData: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCorrectedData: (data: any[]) => void
}

export interface TaxIssue {
    id: number
    invoiceNumber: string
    invoiceDate: string
    taxCode: string
    vatAmount: number
    currency: string
    issueType: string
    originalValue: string
    suggestedValue: string
    status: "pending" | "corrected" | "ignored"
    severity: "high" | "medium" | "low"
}



export interface OverviewStepProps {
    onNext: () => void
    onPrevious: () => void
    currentStep: number
    totalSteps: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    correctedData: any[]
}

export interface PaymentStepProps {
    onNext: () => void
    onPrevious: () => void
}


export interface PricingCardProps {
    plan: {
        id: string
        name: string
        price: string
        amount: number
        period: string
        originalPrice?: string
        description: string
        features: string[]
        popular: boolean
        buttonText: string
        color: string
        bgColor: string
    }
}


