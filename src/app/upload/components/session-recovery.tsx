"use client"

import { useEffect, useState } from "react"
import { AlertCircle, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUploadStore } from "@/store/uploadStore"

interface SessionRecoveryProps {
    onRecover: () => void
    onClear: () => void
}

const SessionRecovery = ({ onRecover, onClear }: SessionRecoveryProps) => {
    const { uploadedFiles, sessionIds } = useUploadStore()
    const [showRecovery, setShowRecovery] = useState(false)

    useEffect(() => {
        // Show recovery if we have session data but no current files
        const hasSessionData = Object.keys(sessionIds).length > 0
        const hasFileData = uploadedFiles.length > 0

        if (hasSessionData && !hasFileData) {
            setShowRecovery(true)
        }
    }, [sessionIds, uploadedFiles])

    if (!showRecovery) return null

    return (
        <Card className="border-orange-200 bg-orange-50 mb-6">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-orange-900 mb-2">Previous Session Detected</h3>
                        <p className="text-orange-800 text-sm mb-4">
                            We found a previous session with {Object.keys(sessionIds).length} processed files. Would you like to
                            recover your session or start fresh?
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => {
                                    onRecover()
                                    setShowRecovery(false)
                                }}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                size="sm"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Recover Session
                            </Button>
                            <Button
                                onClick={() => {
                                    onClear()
                                    setShowRecovery(false)
                                }}
                                variant="outline"
                                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                                size="sm"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Start Fresh
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SessionRecovery
