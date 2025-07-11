
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import HeroSection from "@/components/HeroSection";
import PainSolutionSection from "@/components/PainSolutionSection";
import ClinicBotSection from "@/components/ClinicBotSection";
import CaseWisePromoSection from "@/components/CaseWisePromoSection";
import AskVoidrPromoSection from "@/components/AskVoidrPromoSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <TubelightNavbar />
      <HeroSection />
      <PainSolutionSection />
      <ClinicBotSection />
      <CaseWisePromoSection />
      <AskVoidrPromoSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
