import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileMeta {
    name: string;
    size: number;
    type: string;
}

interface UploadState {
    uploadedFiles: FileMeta[];
    uploadProgress: Record<string, number>;
    setUploadedFiles: (files: FileMeta[]) => void;
    addUploadedFiles: (files: FileMeta[]) => void;
    setUploadProgress: (progress: Record<string, number>) => void;
    updateFileProgress: (fileName: string, progress: number) => void;
    removeFile: (fileName: string) => void;
}

export const useUploadStore = create<UploadState>()(
    persist(
        (set, get) => ({
            uploadedFiles: [],
            uploadProgress: {},

            setUploadedFiles: (files) => set({ uploadedFiles: files }),

            addUploadedFiles: (files) => {
                const existing = get().uploadedFiles;
                const newMeta = files.map((f) => ({
                    name: f.name,
                    size: f.size,
                    type: f.type,
                }));
                set({ uploadedFiles: [...existing, ...newMeta] });
            },

            setUploadProgress: (progress) => set({ uploadProgress: progress }),

            updateFileProgress: (fileName, progress) => {
                set((state) => ({
                    uploadProgress: {
                        ...state.uploadProgress,
                        [fileName]: progress,
                    },
                }));
            },

            removeFile: (fileName) => {
                set((state) => {
                    const updatedFiles = state.uploadedFiles.filter(
                        (f) => f.name !== fileName
                    );
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [fileName]: _, ...updatedProgress } = state.uploadProgress;
                    return {
                        uploadedFiles: updatedFiles,
                        uploadProgress: updatedProgress,
                    };
                });
            },
        }),
        {
            name: "upload-storage",
        }
    )
);
  



// "use client"

// import { motion, useScroll, useTransform } from "framer-motion"
// import {
//     ArrowRight,
//     FileText,
//     Calculator,
//     Globe,
//     Shield,
//     TrendingUp,
//     CheckCircle,
//     Users,
//     Zap,
//     Award,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useRef } from "react"

// const ConversionSection = () => {
//     const containerRef = useRef<HTMLDivElement>(null)
//     const { scrollYProgress } = useScroll({
//         target: containerRef,
//         offset: ["start start", "end start"],
//     })

//     const transforms = [0, 0.2, 0.4, 0.6, 0.8].map((start) => ({
//         y: useTransform(scrollYProgress, [start, start + 0.2], ["0%", "-100%"]),
//         opacity: useTransform(scrollYProgress, [start, start + 0.18], [1, 0]),
//         scale: useTransform(scrollYProgress, [start, start + 0.2], [1, 0.95]),
//     }))


//     const sections = [
//         {
//             id: 1,
//             title: "VAT Registration Made Simple",
//             subtitle: "Register across all 27 EU countries with one click",
//             description:
//                 "Our automated system handles VAT registration across the entire European Union, saving you time and ensuring compliance from day one.",
//             icon: FileText,
//             color: "from-blue-600 to-cyan-500",
//             bgColor: "from-blue-50 to-cyan-50",
//             features: [
//                 "One-click registration across 27 EU countries",
//                 "Real-time status tracking and updates",
//                 "Automated document generation",
//                 "Multi-language support for all jurisdictions",
//             ],
//             stats: { value: "27", label: "EU Countries" },
//         },
//         {
//             id: 2,
//             title: "Automated Tax Calculations",
//             subtitle: "Precise calculations for every jurisdiction",
//             description:
//                 "Never worry about tax calculation errors again. Our system automatically calculates taxes based on the latest rates and regulations for each EU country.",
//             icon: Calculator,
//             color: "from-green-600 to-emerald-500",
//             bgColor: "from-green-50 to-emerald-50",
//             features: [
//                 "Real-time tax rate updates",
//                 "Multi-currency support",
//                 "Automated rounding rules",
//                 "Historical rate tracking",
//             ],
//             stats: { value: "99.9%", label: "Accuracy Rate" },
//         },
//         {
//             id: 3,
//             title: "Cross-Border Compliance",
//             subtitle: "Seamless operations across European borders",
//             description:
//                 "Handle complex cross-border transactions with confidence. Our platform ensures you're compliant with regulations in every EU member state.",
//             icon: Globe,
//             color: "from-purple-600 to-violet-500",
//             bgColor: "from-purple-50 to-violet-50",
//             features: [
//                 "GDPR compliant data handling",
//                 "Local regulation compliance",
//                 "Multi-language documentation",
//                 "Country-specific reporting",
//             ],
//             stats: { value: "100%", label: "GDPR Compliant" },
//         },
//         {
//             id: 4,
//             title: "Enterprise Security",
//             subtitle: "Bank-grade security for your tax data",
//             description:
//                 "Your sensitive tax information is protected with enterprise-level security measures, ensuring complete data privacy and compliance.",
//             icon: Shield,
//             color: "from-orange-600 to-red-500",
//             bgColor: "from-orange-50 to-red-50",
//             features: [
//                 "256-bit AES encryption",
//                 "SOC 2 Type II certified",
//                 "Regular security audits",
//                 "Secure data centers in EU",
//             ],
//             stats: { value: "256-bit", label: "Encryption" },
//         },
//         {
//             id: 5,
//             title: "Advanced Analytics",
//             subtitle: "Insights that drive better decisions",
//             description:
//                 "Get comprehensive insights into your tax obligations with our advanced analytics dashboard. Make informed decisions with real-time data.",
//             icon: TrendingUp,
//             color: "from-indigo-600 to-blue-500",
//             bgColor: "from-indigo-50 to-blue-50",
//             features: [
//                 "Real-time tax analytics",
//                 "Custom report generation",
//                 "Trend analysis and forecasting",
//                 "Export to popular formats",
//             ],
//             stats: { value: "10k+", label: "Reports Generated" },
//         }
//     ]
       


//     return (
        
//         <div ref={containerRef} className="sticky h-[100vh] overflow-y-scroll">
//             {sections.map((section, index) => {
//                 const { y, opacity, scale } = transforms[index]

//                 return (
//                     <motion.div
//                         key={section.id}
//                         style={{ y, opacity, scale }}
//                         className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
//                     >
//                         <div className={`absolute inset-0 bg-gradient-to-br ${section.bgColor}`}>
//                             {/* Background decorations */}
//                             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                                 <div className="absolute top-20 right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
//                                 <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/30 rounded-full blur-3xl"></div>
//                                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
//                             </div>
//                         </div>

//                         <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
//                             {/* Left Content */}
//                             <motion.div
//                                 initial={{ opacity: 0, x: -50 }}
//                                 whileInView={{ opacity: 1, x: 0 }}
//                                 viewport={{ once: true }}
//                                 transition={{ duration: 0.8, delay: 0.2 }}
//                                 className="space-y-8"
//                             >
//                                 <div
//                                     className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} flex items-center justify-center shadow-lg`}
//                                 >
//                                     <section.icon className="w-8 h-8 text-white" />
//                                 </div>

//                                 <div>
//                                     <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">{section.title}</h2>
//                                     <p className="text-xl text-gray-600 mb-6">{section.subtitle}</p>
//                                     <p className="text-lg text-gray-700 leading-relaxed">{section.description}</p>
//                                 </div>

//                                 <div className="space-y-4">
//                                     {section.features.map((feature, idx) => (
//                                         <motion.div
//                                             key={idx}
//                                             initial={{ opacity: 0, x: -20 }}
//                                             whileInView={{ opacity: 1, x: 0 }}
//                                             viewport={{ once: true }}
//                                             transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
//                                             className="flex items-center space-x-3"
//                                         >
//                                             <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//                                             <span className="text-gray-700">{feature}</span>
//                                         </motion.div>
//                                     ))}
//                                 </div>

//                                 <motion.div
//                                     initial={{ opacity: 0, y: 20 }}
//                                     whileInView={{ opacity: 1, y: 0 }}
//                                     viewport={{ once: true }}
//                                     transition={{ duration: 0.6, delay: 0.8 }}
//                                 >
//                                     <Button
//                                         size="lg"
//                                         className={`bg-gradient-to-r ${section.color} hover:opacity-90 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300`}
//                                     >
//                                         Learn More
//                                         <ArrowRight className="ml-2 w-5 h-5" />
//                                     </Button>
//                                 </motion.div>
//                             </motion.div>

//                             {/* Right Content */}
//                             <motion.div
//                                 initial={{ opacity: 0, x: 50 }}
//                                 whileInView={{ opacity: 1, x: 0 }}
//                                 viewport={{ once: true }}
//                                 transition={{ duration: 0.8, delay: 0.4 }}
//                                 className="relative"
//                             >
//                                 {/* Stats Card */}
//                                 <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
//                                     <div className="text-center mb-8">
//                                         <div
//                                             className={`text-6xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent mb-2`}
//                                         >
//                                             {section.stats.value}
//                                         </div>
//                                         <div className="text-gray-600 font-medium text-lg">{section.stats.label}</div>
//                                     </div>

//                                     {/* Feature Grid */}
//                                     <div className="grid grid-cols-2 gap-4">
//                                         {[
//                                             { icon: Users, label: "Trusted by 10k+ businesses" },
//                                             { icon: Zap, label: "Lightning fast processing" },
//                                             { icon: Award, label: "Industry leading accuracy" },
//                                             { icon: Shield, label: "Enterprise security" },
//                                         ].map((item, idx) => (
//                                             <motion.div
//                                                 key={idx}
//                                                 initial={{ opacity: 0, scale: 0.8 }}
//                                                 whileInView={{ opacity: 1, scale: 1 }}
//                                                 viewport={{ once: true }}
//                                                 transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
//                                                 className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
//                                             >
//                                                 <item.icon className="w-6 h-6 text-gray-600 mb-2" />
//                                                 <span className="text-sm text-gray-600 font-medium">{item.label}</span>
//                                             </motion.div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Floating Elements */}
//                                 <motion.div
//                                     animate={{ y: [0, -10, 0] }}
//                                     transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
//                                     className="absolute -top-4 -right-4 w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center"
//                                 >
//                                     <section.icon className={`w-8 h-8 text-transparent bg-gradient-to-r ${section.color} bg-clip-text`} />
//                                 </motion.div>
//                             </motion.div>
//                         </div>
//                     </motion.div>
//                 )
//             })}


//         </div>
//     )
// }

// export default ConversionSection
