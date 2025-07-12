"use client"

import { fadeInDown } from "@/lib/animation"
import { motion } from "framer-motion"
import StepOne from "./InstructionsComponents/step-one"
import StepTwo from "./InstructionsComponents/step-two"
import StepThree from "./InstructionsComponents/step-three"
import StepFour from "./InstructionsComponents/step-four"


const InstructionSection = () => {
    return (
        <section className="relative flex flex-col items-center justify-center py-5 px-6 bg-white overflow-hidden">
            {/* Badge */}
            <motion.div variants={fadeInDown} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }}>
                <h2 className="text-sky-600 text-[16px] font-medium">QHUUBE simplifies EU VAT compliance</h2>
            </motion.div>

            {/* Header */}
            <motion.div
                variants={fadeInDown}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className="flex flex-col items-center justify-center max-w-4xl mt-6 mb-16 relative z-10 text-center"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Simplifying EU VAT Compliance, One Step at a Time
                </h2>
                <p className="text-gray-600 text-lg mt-6 max-w-2xl">
                    Qhuube helps businesses selling across the EU stay compliant with VAT laws—without the hassle.
                </p>
            </motion.div>

            {/* Steps */}
            <StepOne />
            <StepTwo />
            <StepThree />
            <StepFour />
        </section>
    )
}

export default InstructionSection
