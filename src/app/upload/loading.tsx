// app/upload/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-sky-50 px-4">
            <div className="flex items-center space-x-4 animate-pulse">
                {/* Logo Placeholder */}
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xl font-bold text-sky-600">Q</span>
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Loading Wizard</h1>
                    <p className="text-sm text-gray-500">Please wait while we prepare your workspace...</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-10 w-full max-w-sm">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-sky-500 h-full w-1/2 animate-loading-bar" />
                </div>
            </div>
        </div>
    )
}
