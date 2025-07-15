"use client"
import HeaderManagement, { InternalHeader } from './components/internal-header-management'
import { useState } from 'react'

const Page  = () => {

    const [internalHeaders, setInternalHeaders] = useState<InternalHeader[]>([
        {
            value: "customer_name",
            label: "Customer Name",
            aliases: ["Client Name", "Account Holder", "Full Name"]
        },
        {
            value: "email_address",
            label: "Email Address",
            aliases: ["Email", "Contact Email"]
        },
        {
            value: "phone_number",
            label: "Phone Number",
            aliases: ["Phone", "Contact Number", "Mobile"]
        }
    ])

    const handleAddHeader = (newHeader: InternalHeader) => {
        setInternalHeaders(prev => [...prev, newHeader])
    }

    const handleEditHeader = (oldValue: string, updatedHeader: InternalHeader) => {
        setInternalHeaders(prev =>
            prev.map(header =>
                header.value === oldValue ? updatedHeader : header
            )
        )
    }

    const handleDeleteHeader = (valueToDelete: string) => {
        setInternalHeaders(prev =>
            prev.filter(header => header.value !== valueToDelete)
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="px-4">
                <HeaderManagement
                    internalHeaders={internalHeaders}
                    onAddHeader={handleAddHeader}
                    onEditHeader={handleEditHeader}
                    onDeleteHeader={handleDeleteHeader}
                />
            </div>
        </div>
    )
}

export default Page