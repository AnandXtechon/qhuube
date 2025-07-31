/* eslint-disable @typescript-eslint/no-explicit-any */


interface FileMeta {
    name: string;
    size: number;
    type: string;
    file: File;
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
    correctedData: any[]
    setCorrectedData: (data: any[]) => void
}

export interface TaxIssue {
    details?: {
        columnName: string;
        dataType: string;
        missingRows: number[];
        hasMoreRows: boolean;
        totalMissing: number;
        totalRows: number;
        description: string;
    } | undefined;
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
    severity: "High" | "Medium" | "Low"
}

// Enhanced issue type for better type safety
export interface ValidationIssue {
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
    severity: "High" | "Medium" | "Low"
    details?: {
        columnName?: string
        dataType?: string
        missingRows?: string[]
        invalidRows?: string[]
        hasMoreRows?: boolean
        totalMissing?: number
        totalRows?: number
        invalidCount?: number
        percentage?: number
        description?: string
        expectedType?: string
    }
}



export interface OverviewStepProps {
    onNext: () => void
    onPrevious: () => void
    currentStep: number
    totalSteps: number
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


export interface TaxRule {
    id?: string
    _id?: string // Optional for edit operations
    product_type: string
    country: string
    vat_rate: number
    vat_category: string
    shipping_vat_rate: number
}

export interface Filters {
    search: string
    country: string
    vatCategory: string
    vatRateMin: string
    vatRateMax: string
}
