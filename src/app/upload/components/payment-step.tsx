import { motion } from "framer-motion";
import PricingCard from "@/app/pricing/components/PricingCard";
import { cardsContainerVariants, fadeInLeft } from "@/lib/animation";
// import { Button } from "@/components/ui/button";
import { PaymentStepProps } from "@/app/types";

const PaymentStep = ({
    // onPrevious
}: PaymentStepProps) => {
    return (
        <>
            <motion.div
                className="pb-20 px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardsContainerVariants}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Matching Header */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        animate="show"
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Secure <span className="text-sky-600">Your Compliance</span>
                        </h2>
                        <p className="text-lg font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Final step — complete a one-time payment to process and download your tax-compliant files.
                        </p>
                    </motion.div>

                    {/* Pricing Card */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-md">
                            <PricingCard />
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* <motion.div
                variants={fadeInLeft}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between mx-auto"
            >
                <Button variant="outline" onClick={onPrevious}>
                    Previous
                </Button>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white">Continue</Button>
            </motion.div> */}
        </>


    );
};

export default PaymentStep;
