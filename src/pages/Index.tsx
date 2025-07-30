
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";

const FEEDBACK_ENDPOINT = "https://script.google.com/macros/s/AKfycbxxQMt0o-45J8UfwU0lXeWh2RaFmhSNHlj61WaDWja8MjI4szfEWxusNjSg8qrIs1Mt/exec";

function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('email', email);

      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setStatus("success");
        setMessage("");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white/10 rounded-xl p-8 shadow-lg flex flex-col items-center"
    >
      <label htmlFor="feedback-message" className="text-white text-lg mb-2 w-full text-left">
        Your Feedback <span className="text-red-400">*</span>
      </label>
      <textarea
        id="feedback-message"
        required
        rows={4}
        className="w-full mb-4 rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        placeholder="Type your feedback here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={status === "sending"}
      />
      <label htmlFor="feedback-email" className="text-white text-lg mb-2 w-full text-left">
        Email (optional)
      </label>
      <input
        id="feedback-email"
        type="email"
        className="w-full mb-4 rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "sending"}
      />
      <button
        type="submit"
        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full"
        disabled={status === "sending" || !message.trim()}
      >
        {status === "sending" ? "Sending..." : "Submit"}
      </button>
      {status === "success" && (
        <p className="mt-4 text-green-400 text-center">Thank you for your feedback!</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-400 text-center">Failed to send. Please try again.</p>
      )}
    </form>
  );
}

const FeedbackSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#1a1a2e] to-[#0f3460] flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center">Drop your Feedback</h2>
      <p className="text-lg md:text-xl text-white/80 mb-8 text-center max-w-2xl">Tell us how Voidr Health served you and where we can improve</p>
      <FeedbackForm />
    </section>
  );
};

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
      <FeedbackSection />
      <Footer />
    </div>
  );
};

export default Index;
