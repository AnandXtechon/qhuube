import { Suspense } from "react"
import VATComplianceWizard from "./components/VATComplianceWizard"


export default function UploadPage() {
    return (
        <Suspense fallback={<div className="text-center p-10 text-gray-500">Loading wizard...</div>}>
            <VATComplianceWizard />
            
        </Suspense>
    )
}
