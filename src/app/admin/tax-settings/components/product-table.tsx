/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo, useEffect } from "react"
import { Settings, Pencil, Trash2, Upload, Search, ChevronLeft, ChevronRight, ListFilter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ImportDialog from "./import-dialog"
import AddRuleDialog from "./add-rule-dialog"
import EditRuleDialog from "./edit-rule-dialog"
import { EU_COUNTRIES, VAT_CATEGORIES } from "@/lib/countries"
import { toast } from "sonner"
import type { Filters, TaxRule } from "@/app/types"
import axiosInstance from "@/lib/axiosInstance"
import { fetchProducts } from "../services/fetch-products"
import Spinner from "@/components/ui/spinner"

const ProductTable = () => {
    const [taxRules, setTaxRules] = useState<TaxRule[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchProducts()
                // Normalize the data to ensure consistent ID fields
                const normalizedData = data.map((rule: any) => ({
                    ...rule,
                    id: rule.id || rule._id,
                    _id: rule._id || rule.id,
                }))
                setTaxRules(normalizedData)
            } catch (err) {
                console.error("Failed to fetch tax rules", err)
                toast.error("Failed to load tax rules")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const [showImportDialog, setShowImportDialog] = useState(false)
    const [editingRule, setEditingRule] = useState<TaxRule | null>(null)
    const [showEditDialog, setShowEditDialog] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Filter state
    const [filters, setFilters] = useState<Filters>({
        search: "",
        country: "all",
        vatCategory: "all",
        vatRateMin: "",
        vatRateMax: "",
    })

    // Filter and paginate data
    const filteredAndPaginatedData = useMemo(() => {
        const filtered = taxRules.filter((rule) => {
            const matchesSearch =
                filters.search === "" ||
                rule.product_type.toLowerCase().includes(filters.search.toLowerCase()) ||
                rule.country.toLowerCase().includes(filters.search.toLowerCase()) ||
                rule.vat_category.toLowerCase().includes(filters.search.toLowerCase())

            const matchesCountry = filters.country === "all" || rule.country === filters.country
            const matchesVatCategory = filters.vatCategory === "all" || rule.vat_category === filters.vatCategory
            const matchesVatRateMin = filters.vatRateMin === "" || rule.vat_rate >= Number.parseFloat(filters.vatRateMin)
            const matchesVatRateMax = filters.vatRateMax === "" || rule.vat_rate <= Number.parseFloat(filters.vatRateMax)

            return matchesSearch && matchesCountry && matchesVatCategory && matchesVatRateMin && matchesVatRateMax
        })

        const totalItems = filtered.length
        const totalPages = Math.ceil(totalItems / itemsPerPage)
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedData = filtered.slice(startIndex, endIndex)

        return {
            data: paginatedData,
            totalItems,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
        }
    }, [taxRules, filters, currentPage, itemsPerPage])

    // Reset to first page when filters change
    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setFilters({
            search: "",
            country: "all",
            vatCategory: "all",
            vatRateMin: "",
            vatRateMax: "",
        })
        setCurrentPage(1)
        toast.success("Filters cleared successfully.")
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number.parseInt(value))
        setCurrentPage(1)
    }

    const handleEdit = (rule: TaxRule) => {
        setEditingRule(rule)
        setShowEditDialog(true)
    }

    const handleSave = (id: string, updatedRule: Partial<TaxRule>) => {
        setTaxRules((prev) =>
            prev.map((rule) => {
                // Check both id and _id fields
                if (rule.id === id || rule._id === id) {
                    return { ...rule, ...updatedRule }
                }
                return rule
            }),
        )
        toast.success("Tax rule updated successfully.")
    }

    const handleDelete = async (rule: TaxRule) => {
        // Get the ID to use for deletion
        const ruleId = rule._id || rule.id

        if (!ruleId) {
            toast.error("Rule ID is missing. Cannot delete rule.")
            return
        }

        try {
            await axiosInstance.delete(`/delete/product/${ruleId}`)

            setTaxRules((prev) => prev.filter((r) => r.id !== rule.id && r._id !== rule._id))
            toast.success(`Tax rule for ${rule.product_type} in ${rule.country} has been deleted.`)
        } catch (error: any) {
            console.error("Delete failed:", error)
            toast.error(error?.response?.data?.detail || "Failed to delete tax rule.")
        }
    }

    const handleAddRule = (newRule: Omit<TaxRule, "id">) => {
        const id = Date.now().toString()
        setTaxRules((prev) => [...prev, { ...newRule, id }])
    }

    const handleImportSuccess = () => {
        // After import, fetch latest products from backend and update table
        const fetchLatest = async () => {
            try {
                const data = await fetchProducts();
                const normalizedData = data.map((rule: any) => ({
                    ...rule,
                    id: rule.id || rule._id,
                    _id: rule._id || rule.id,   
                }));
                setTaxRules(normalizedData);
                toast.success("Imported tax rules and refreshed table.");
            } catch (err: any) {
                console.error("Failed to refresh tax rules after import", err);
                toast.error("Failed to refresh tax rules after import.");
            }
        };
        fetchLatest();
    }

    const renderPaginationButtons = () => {
        const buttons = []
        const { totalPages, currentPage } = filteredAndPaginatedData

        // Previous button
        buttons.push(
            <Button
                key="prev"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!filteredAndPaginatedData.hasPrevPage}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>,
        )

        // Page numbers
        const startPage = Math.max(1, currentPage - 2)
        const endPage = Math.min(totalPages, currentPage + 2)

        if (startPage > 1) {
            buttons.push(
                <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Button>,
            )
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="px-2">
                        ...
                    </span>,
                )
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Button>,
            )
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="ellipsis2" className="px-2">
                        ...
                    </span>,
                )
            }
            buttons.push(
                <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Button>,
            )
        }

        // Next button
        buttons.push(
            <Button
                key="next"
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!filteredAndPaginatedData.hasNextPage}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>,
        )

        return buttons
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center my-auto gap-2">
                <Spinner />
                <span className="text-muted-foreground">Loading tax rules...</span>
            </div>
        )
    }

    return (
        <div className="w-full mx-auto space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                            <Settings className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tax Settings</h1>
                            <p className="text-muted-foreground text-lg">
                                Configure VAT rates and tax rules for EU compliance and product mapping.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <AddRuleDialog onAddRule={handleAddRule} />
                        <Button onClick={() => setShowImportDialog(true)} className="px-6 bg-slate-800 hover:bg-gray-800">
                            <Upload className="h-4 w-4" />
                            Import Rules
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        {filteredAndPaginatedData.totalItems} of {taxRules.length} tax rules
                    </span>
                </div>
            </div>

            {/* Search and Filters Section */}
            <Card>
                <CardContent className="px-4 py-2">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-1">
                            <ListFilter className="h-4 w-4" />
                            <Label className="text-base font-medium">Search & Filters</Label>
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                                Clear All
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            {/* Search */}
                            <div className="xl:col-span-2 mb-2">
                                <Label htmlFor="search" className="py-2">
                                    Search
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search products, countries..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Country Filter */}
                            <div>
                                <Label htmlFor="country-filter" className="py-2">
                                    Country
                                </Label>
                                <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All countries" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All countries</SelectItem>
                                        {EU_COUNTRIES.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* VAT Category Filter */}
                            <div>
                                <Label htmlFor="vat-category-filter" className="py-2">
                                    VAT Category
                                </Label>
                                <Select value={filters.vatCategory} onValueChange={(value) => handleFilterChange("vatCategory", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All categories</SelectItem>
                                        {VAT_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* VAT Rate Min */}
                            <div>
                                <Label htmlFor="vat-rate-min" className="py-2">
                                    Min VAT Rate (%)
                                </Label>
                                <Input
                                    id="vat-rate-min"
                                    type="number"
                                    placeholder="0"
                                    value={filters.vatRateMin}
                                    onChange={(e) => handleFilterChange("vatRateMin", e.target.value)}
                                />
                            </div>

                            {/* VAT Rate Max */}
                            <div>
                                <Label htmlFor="vat-rate-max" className="py-2">
                                    Max VAT Rate (%)
                                </Label>
                                <Input
                                    id="vat-rate-max"
                                    type="number"
                                    placeholder="100"
                                    value={filters.vatRateMax}
                                    onChange={(e) => handleFilterChange("vatRateMax", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Import Dialog */}
            <ImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} onImportSuccess={handleImportSuccess} />

            {/* Edit Dialog */}
            <EditRuleDialog
                rule={editingRule}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                onSaveRule={handleSave}
            />

            {/* Table Section */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Type</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>VAT Rate (%)</TableHead>
                            <TableHead>VAT Category</TableHead>
                            <TableHead>Shipping VAT Rate (%)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndPaginatedData.data.length > 0 ? (
                            filteredAndPaginatedData.data.map((rule) => (
                                <TableRow key={rule.id || rule._id}>
                                    <TableCell>{rule.product_type}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{rule.country}</Badge>
                                    </TableCell>
                                    <TableCell>{rule.vat_rate}%</TableCell>
                                    <TableCell>
                                        <Badge variant={rule.vat_category === "Standard" ? "default" : "secondary"}>
                                            {rule.vat_category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{rule.shipping_vat_rate}%</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(rule)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                                onClick={() => handleDelete(rule)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No tax rules found matching your filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            {filteredAndPaginatedData.totalPages > 1 && (
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="items-per-page">Items per page:</Label>
                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, filteredAndPaginatedData.totalItems)} of{" "}
                            {filteredAndPaginatedData.totalItems} results
                        </span>
                    </div>
                    <div className="flex items-center gap-1">{renderPaginationButtons()}</div>
                </div>
            )}
        </div>
    )
}

export default ProductTable
