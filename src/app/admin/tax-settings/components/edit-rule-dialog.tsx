/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { EU_COUNTRIES, VAT_CATEGORIES } from "@/lib/countries"
import { toast } from "sonner"
import type { TaxRule } from "@/app/types"
import axiosInstance from "@/lib/axiosInstance"
import Spinner from "@/components/ui/spinner"

interface EditRuleDialogProps {
    rule: TaxRule | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSaveRule: (id: string, updatedRule: Partial<TaxRule>) => void
}

const EditRuleDialog = ({ rule, open, onOpenChange, onSaveRule }: EditRuleDialogProps) => {
    const [editRule, setEditRule] = useState<TaxRule | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (rule) {
            // Normalize the ID field - use _id if available, otherwise use id
            const normalizedRule = {
                ...rule,
                _id: rule._id || rule.id,
                id: rule.id || rule._id,
            }
            setEditRule(normalizedRule)
        }
    }, [rule])

    const handleSave = async () => {
        if (editRule && editRule.product_type && editRule.country && editRule.vat_category) {
            // Get the ID to use for the API call
            const ruleId = editRule._id || editRule.id

            if (!ruleId) {
                toast.error("Rule ID is missing. Cannot update rule.")
                return
            }

            try {
                setLoading(true)

                const response = await axiosInstance.put(`/update/product/${ruleId}`, {
                    product_type: editRule.product_type,
                    country: editRule.country,
                    vat_rate: editRule.vat_rate,
                    vat_category: editRule.vat_category,
                    shipping_vat_rate: editRule.shipping_vat_rate,
                })

                // Use the ID that exists in the original rule
                const updateId = editRule.id || editRule._id
                if (updateId) {
                    onSaveRule(updateId, response.data)
                    onOpenChange(false)
                    toast.success(`Tax rule for ${editRule.product_type} in ${editRule.country} has been updated.`)
                } else {
                    toast.error("Rule ID is missing. Cannot update rule.")
                }
            } catch (error: any) {
                console.error("Update failed:", error)
                toast.error(error?.response?.data?.detail || "Failed to update rule.")
            } finally {
                setLoading(false)
            }
        } else {
            toast.error("Please fill in all required fields (Product Type, Country, and VAT Category).")
        }
    }

    const handleCancel = () => {
        setEditRule(rule)
        onOpenChange(false)
    }

    if (!editRule) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">Edit Tax Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Product Type */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-product-type">Product Type *</Label>
                        <Input
                            id="edit-product-type"
                            placeholder="Enter product type"
                            value={editRule.product_type}
                            onChange={(e) => setEditRule((prev) => (prev ? { ...prev, product_type: e.target.value } : null))}
                        />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-country">Country *</Label>
                        <Select
                            value={editRule.country}
                            onValueChange={(value) => setEditRule((prev) => (prev ? { ...prev, country: value } : null))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                {EU_COUNTRIES.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* VAT Rate */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-vat-rate">VAT Rate (%)</Label>
                        <Input
                            id="edit-vat-rate"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={editRule.vat_rate}
                            onChange={(e) => setEditRule((prev) => (prev ? { ...prev, vat_rate: Number(e.target.value) } : null))}
                        />
                    </div>

                    {/* VAT Category */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-vat-category">VAT Category *</Label>
                        <Select
                            value={editRule.vat_category}
                            onValueChange={(value) => setEditRule((prev) => (prev ? { ...prev, vat_category: value } : null))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {VAT_CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Shipping VAT Rate */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-shipping-vat-rate">Shipping VAT Rate (%)</Label>
                        <Input
                            id="edit-shipping-vat-rate"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={editRule.shipping_vat_rate}
                            onChange={(e) =>
                                setEditRule((prev) => (prev ? { ...prev, shipping_vat_rate: Number(e.target.value) } : null))
                            }
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner /> <span>Saving...</span>
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditRuleDialog
