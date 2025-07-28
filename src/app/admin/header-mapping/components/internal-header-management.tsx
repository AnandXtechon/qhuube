"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Plus, Trash2, Settings, Tag } from "lucide-react"
import { useState } from "react"

export interface InternalHeader {
    _id?: string
    value: string
    label: string
    aliases?: string[]
    type: string
}

interface InternalHeaderManagementProps {
    internalHeaders: InternalHeader[]
    onAddHeader: (newHeader: InternalHeader) => void
    onEditHeader: (headerId: string, updateHeader: InternalHeader) => void
    onDeleteHeader: (headerId: string) => Promise<void>
}

const HEADER_TYPES = [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "boolean", label: "Boolean" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "url", label: "URL" },
    { value: "text", label: "Text" },
    { value: "json", label: "JSON" },
]

const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
        string: "bg-blue-100 text-blue-800",
        number: "bg-green-100 text-green-800",
        date: "bg-purple-100 text-purple-800",
        boolean: "bg-orange-100 text-orange-800",
        email: "bg-pink-100 text-pink-800",
        phone: "bg-indigo-100 text-indigo-800",
        url: "bg-cyan-100 text-cyan-800",
        text: "bg-gray-100 text-gray-800",
        json: "bg-yellow-100 text-yellow-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
}

const HeaderManagement = ({
    internalHeaders,
    onAddHeader,
    onEditHeader,
    onDeleteHeader,
}: InternalHeaderManagementProps) => {
    const [newHeaderLabel, setNewHeaderLabel] = useState("")
    const [newHeaderValue, setNewHeaderValue] = useState("")
    const [newHeaderAliases, setNewHeaderAliases] = useState("")
    const [newHeaderType, setNewHeaderType] = useState("")
    const [editingHeader, setEditingHeader] = useState<InternalHeader | null>(null)
    const [editLabel, setEditLabel] = useState("")
    const [editValue, setEditValue] = useState("")
    const [editAliases, setEditAliases] = useState("")
    const [editType, setEditType] = useState("")
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const handleAddHeader = () => {
        if (newHeaderLabel.trim() && newHeaderValue.trim() && newHeaderType) {
            const aliasesArray = newHeaderAliases
                .split(",")
                .map((alias) => alias.trim())
                .filter(Boolean)
            onAddHeader({
                label: newHeaderLabel.trim(),
                value: newHeaderValue.trim(),
                aliases: aliasesArray.length > 0 ? aliasesArray : undefined,
                type: newHeaderType,
            })
            setNewHeaderLabel("")
            setNewHeaderValue("")
            setNewHeaderAliases("")
            setNewHeaderType("")
            setIsAddDialogOpen(false)
        }
    }

    const startEditing = (header: InternalHeader) => {
        setEditingHeader(header)
        setEditLabel(header.label)
        setEditValue(header.value)
        setEditAliases(header.aliases ? header.aliases.join(", ") : "")
        setEditType(header.type)
        setIsEditDialogOpen(true)
    }

    const handleEditSave = () => {
        if (editingHeader && editingHeader._id && editLabel.trim() && editValue.trim() && editType) {
            const aliasesArray = editAliases
                .split(",")
                .map((alias) => alias.trim())
                .filter(Boolean)
            onEditHeader(editingHeader._id, {
                label: editLabel.trim(),
                value: editValue.trim(),
                aliases: aliasesArray.length > 0 ? aliasesArray : undefined,
                type: editType,
            })
            setIsEditDialogOpen(false)
            setEditingHeader(null)
        }
    }

    const handleDelete = async (header: InternalHeader) => {
        if (header._id) {
            await onDeleteHeader(header._id)
        }
    }

    const canAddHeader = newHeaderLabel.trim() && newHeaderValue.trim() && newHeaderType
    const canSaveEdit = editLabel.trim() && editValue.trim() && editType

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
                            <h1 className="text-3xl font-bold tracking-tight">Internal Headers</h1>
                            <p className="text-muted-foreground text-lg">Manage system fields available for data mapping</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="px-6 hover:bg-sky-700">
                        <Plus className="h-4 w-4" />
                        Add Header
                    </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        {internalHeaders.length} headers configured
                    </span>
                </div>
            </div>

            {/* Current Headers Section */}
            <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-muted/20 rounded-t-lg">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Current Headers
                    </CardTitle>
                    <CardDescription>Existing internal headers that can be mapped to external data sources</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {internalHeaders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Tag className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No headers configured</h3>
                            <p className="text-muted-foreground mb-4 max-w-md">
                                {'Get started by adding your first internal header. Click the "Add Header" button above to begin.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {internalHeaders.map((header) => (
                                <Card
                                    key={header._id || header.value}
                                    className="group hover:shadow-md transition-all duration-200 border-border/50"
                                >
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-sm leading-tight">{header.label}</h4>
                                                    <Badge className={`text-xs ${getTypeColor(header.type)}`}>{header.type}</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                                                    {header.value}
                                                </p>
                                            </div>
                                            {header.aliases && header.aliases.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-xs font-medium text-muted-foreground">Aliases:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {header.aliases.map((alias, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {alias}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex justify-end gap-2 pt-2 border-t">
                                                <Button variant="outline" size="sm" onClick={() => startEditing(header)} className="h-8 px-3">
                                                    <Pencil className="w-3 h-3" />
                                                    <span className="sr-only">Edit {header.label}</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(header)}
                                                    className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    <span className="sr-only">Delete {header.label}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Header Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Add New Header</DialogTitle>
                        <DialogDescription className="text-base">
                            Create a new internal header field for data mapping.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-header-label" className="text-sm font-medium">
                                Display Label
                            </Label>
                            <Input
                                id="new-header-label"
                                placeholder="e.g., Customer Name"
                                value={newHeaderLabel}
                                onChange={(e) => setNewHeaderLabel(e.target.value)}
                                className="h-11"
                            />
                            <p className="text-xs text-muted-foreground">Human-readable name shown in the interface</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-header-value" className="text-sm font-medium">
                                System Value
                            </Label>
                            <Input
                                id="new-header-value"
                                placeholder="e.g., customer_name"
                                value={newHeaderValue}
                                onChange={(e) => setNewHeaderValue(e.target.value)}
                                className="h-11 font-mono"
                            />
                            <p className="text-xs text-muted-foreground">Technical identifier used internally</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-header-type" className="text-sm font-medium">
                                Data Type
                            </Label>
                            <Select value={newHeaderType} onValueChange={setNewHeaderType}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select data type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {HEADER_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Choose the data type that best represents this field</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-header-aliases" className="text-sm font-medium">
                                Aliases <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="new-header-aliases"
                                placeholder="e.g., Client Name, Account Holder, Full Name"
                                value={newHeaderAliases}
                                onChange={(e) => setNewHeaderAliases(e.target.value)}
                                className="h-11"
                            />
                            <p className="text-xs text-muted-foreground">
                                Alternative names separated by commas. Helpful for automatic field matching.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="min-w-[100px]">
                            Cancel
                        </Button>
                        <Button onClick={handleAddHeader} disabled={!canAddHeader} className="min-w-[120px] hover:bg-sky-700">
                            <Plus className="h-4 w-4" />
                            Add Header
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Edit Header</DialogTitle>
                        <DialogDescription className="text-base">
                            Update the header information. Changes will be applied immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-label" className="text-sm font-medium">
                                Display Label
                            </Label>
                            <Input
                                id="edit-label"
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-value" className="text-sm font-medium">
                                System Value
                            </Label>
                            <Input
                                id="edit-value"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-11 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-type" className="text-sm font-medium">
                                Data Type
                            </Label>
                            <Select value={editType} onValueChange={setEditType}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select data type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {HEADER_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-aliases" className="text-sm font-medium">
                                Aliases <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="edit-aliases"
                                placeholder="comma-separated values"
                                value={editAliases}
                                onChange={(e) => setEditAliases(e.target.value)}
                                className="h-11"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="min-w-[100px]">
                            Cancel
                        </Button>
                        <Button onClick={handleEditSave} disabled={!canSaveEdit} className="min-w-[120px] hover:bg-sky-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default HeaderManagement
