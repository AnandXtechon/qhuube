/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import axiosInstance from "@/lib/axiosInstance"
import HeaderManagement, { type InternalHeader } from "./components/internal-header-management"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const Page = () => {
    const [internalHeaders, setInternalHeaders] = useState<InternalHeader[]>([])

    // Fetch all headers from backend on mount
    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const response = await axiosInstance.get("/headers", { withCredentials: true })
                console.log("Fetched headers:", response.data.headers)
                setInternalHeaders(response.data.headers || [])
            } catch (err) {
                console.error("Failed to fetch headers:", err)
                toast.error("Failed to fetch headers")
            }
        }
        fetchHeaders()
    }, [])

    // Add header via API
    const handleAddHeader = async (newHeader: InternalHeader) => {
        try {
            const response = await axiosInstance.post("/create/header", newHeader, {
                withCredentials: true,
            })
            if (response.data) {
                toast.success("Header added successfully.")
                const added = response.data
                setInternalHeaders((prev) => [...prev, added])
            }
        } catch (err: any) {
            console.error("Failed to add header:", err)
            const errorMessage = err.response?.data?.detail || "Failed to add header"
            toast.error(errorMessage)
        }
    }

    // Edit header via API
    const handleEditHeader = async (headerId: string, updatedHeader: InternalHeader) => {
        try {
            const response = await axiosInstance.put(`update/header/${headerId}`, updatedHeader, {
                withCredentials: true,
            })
            if (response.data.success) {
                const edited = response.data.header
                setInternalHeaders((prev) => prev.map((h) => (h._id === headerId ? edited : h)))
                toast.success("Header updated successfully.")
            }
        } catch (err: any) {
            console.error("Failed to edit header:", err)
            const errorMessage = err.response?.data?.detail || "Failed to update header"
            toast.error(errorMessage)
        }
    }

    // Delete header via API
    const handleDeleteHeader = async (headerId: string) => {
        try {
            const response = await axiosInstance.delete(`/delete/header/${headerId}`, {
                withCredentials: true,
            })
            if (response.data.success) {
                toast.success("Header deleted successfully.")
                setInternalHeaders((prev) => prev.filter((h) => h._id !== headerId))
            }
        } catch (err: any) {
            console.error("Failed to delete header:", err)
            const errorMessage = err.response?.data?.detail || "Failed to delete header"
            toast.error(errorMessage)
        }
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
