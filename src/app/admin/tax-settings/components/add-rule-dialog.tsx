/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { EU_COUNTRIES, VAT_CATEGORIES } from "@/lib/countries"
import { toast } from "sonner"
import type { TaxRule } from "@/app/types"
import axiosInstance from "@/lib/axiosInstance"
import Spinner from "@/components/ui/spinner"

interface AddRuleDialogProps {
    onAddRule: (rule: Omit<TaxRule, "id">) => void
}

const AddRuleDialog = ({ onAddRule }: AddRuleDialogProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newRule, setNewRule] = useState<Omit<TaxRule, "id">>({
        product_type: "",
        country: "",
        vat_rate: 0,
        vat_category: "",
        shipping_vat_rate: 0,
    })

    const handleAdd = async () => {
        if (newRule.product_type && newRule.country && newRule.vat_category) {
            try {
                setLoading(true)
                const response = await axiosInstance.post("/create/product", {
                    product_type: newRule.product_type,
                    country: newRule.country,
                    vat_rate: newRule.vat_rate,
                    vat_category: newRule.vat_category,
                    shipping_vat_rate: newRule.shipping_vat_rate,
                })

                onAddRule(response.data)

                setNewRule({
                    product_type: "",
                    country: "",
                    vat_rate: 0,
                    vat_category: "",
                    shipping_vat_rate: 0,
                })
                setOpen(false)
                toast.success(`New tax rule for ${newRule.product_type} in ${newRule.country} has been added.`)
            } catch (error: any) {
                toast.error(error?.response?.data?.detail || "Failed to create product.")
            } finally {
                setLoading(false)
            }
        } else {
            toast.error("Please fill in all required fields (Product Type, Country, and VAT Category).")
        }
    }

    const handleCancel = () => {
        setNewRule({
            product_type: "",
            country: "",
            vat_rate: 0,
            vat_category: "",
            shipping_vat_rate: 0,
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="px-6 hover:bg-sky-700">
                    <Plus className="h-4 w-4" />
                    Add Tax Rule
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {/* <Plus className="h-5 w-5" /> */}
                        Add New Tax Rule
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Product Type */}
                    <div className="space-y-2">
                        <Label htmlFor="product-type">Product Type *</Label>
                        <Input
                            id="product-type"
                            placeholder="Enter product type"
                            value={newRule.product_type}
                            onChange={(e) => setNewRule((prev) => ({ ...prev, product_type: e.target.value }))}
                        />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                            value={newRule.country}
                            onValueChange={(value) => setNewRule((prev) => ({ ...prev, country: value }))}
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
                        <Label htmlFor="vat-rate">VAT Rate (%)</Label>
                        <Input
                            id="vat-rate"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={newRule.vat_rate}
                            onChange={(e) => setNewRule((prev) => ({ ...prev, vat_rate: Number(e.target.value) }))}
                        />
                    </div>

                    {/* VAT Category */}
                    <div className="space-y-2">
                        <Label htmlFor="vat-category">VAT Category *</Label>
                        <Select
                            value={newRule.vat_category}
                            onValueChange={(value) => setNewRule((prev) => ({ ...prev, vat_category: value }))}
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
                        <Label htmlFor="shipping-vat-rate">Shipping VAT Rate (%)</Label>
                        <Input
                            id="shipping-vat-rate"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            value={newRule.shipping_vat_rate}
                            onChange={(e) => setNewRule((prev) => ({ ...prev, shipping_vat_rate: Number(e.target.value) }))}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner />
                                    <span className="ml-2">Adding...</span>
                                </>
                            ) : (
                                "Add Rule"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddRuleDialog
