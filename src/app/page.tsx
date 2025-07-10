import ActionPreviewSection from "@/components/layouts/ActionPreviewSection";
// import ComplianceSection from "@/components/layouts/ComplianceSection";
import ConversionSection from "@/components/layouts/ConversionSection";
import FinalCTASection from "@/components/layouts/FinalCTASection";
import Footer from "@/components/layouts/Footer";
import Herosection from "@/components/layouts/Herosection";
import InstructionSection from "@/components/layouts/InstructionSection";
import Navbar from "@/components/layouts/Navbar";
import TaxComplianceSection from "@/components/layouts/TaxComplianceSection";
import VideoSection from "@/components/layouts/VideoSection";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <Herosection />
      <TaxComplianceSection />
      <InstructionSection />
      <ActionPreviewSection />
      {/* <ComplianceSection /> */}
      <ConversionSection />
      <VideoSection />
      <FinalCTASection />
      <Footer />
   </div>
  );
}
