import { CardSpotlight } from "@/components/ui/card-spotlight";

export function VoidrProductCard() {
  return (
    <div className="flex justify-center">
      <CardSpotlight className="relative h-auto w-[24rem] p-6 overflow-hidden">
        {/* Glow Behind Text */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="w-80 h-80 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 blur-3xl opacity-40 rounded-full" />
        </div>

        {/* VOIDR Logo */}
        <div className="flex items-center justify-center mb-6 relative z-10">
          <img 
            src="/public/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" 
            alt="VOIDR Logo" 
            className="h-20 w-20 object-contain filter brightness-0 invert"
          />
        </div>

        {/* Title */}
        <p className="text-2xl font-bold text-white text-center mb-2 relative z-10">
          VOIDR Health Platform
        </p>

        {/* Description & Steps */}
        <div className="text-neutral-200 text-sm mb-4 relative z-10">
          Discover our AI-powered medical education tools:
          <ul className="list-none mt-2 space-y-1">
            <Step title="ClinicBot - Document Analysis & Summarization" />
            <Step title="CaseWise - Interactive Medical Case Simulations" />
            <Step title="SymptomChecker - AI-Powered Diagnostic Support" />
            <Step title="Video Generation - Educational Content Creation" />
          </ul>
        </div>

        {/* Footer Description */}
        <p className="text-neutral-400 text-xs text-center mb-4 relative z-10">
          Enhance your medical education with cutting-edge AI technology designed for healthcare professionals.
        </p>

        {/* CTA Button */}
        <button 
          onClick={() => window.open('https://voidrhealth.com', '_blank')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all relative z-10"
        >
          Explore VOIDR Health
        </button>
      </CardSpotlight>
    </div>
  );
}

const Step = ({ title }: { title: string }) => {
  return (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-white text-sm">{title}</p>
    </li>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.29 7.29a1 1 0 0 1 0 1.42l-4 4a1 1 0 0 1-1.42 0l-2-2a1 1 0 0 1 1.42-1.42L11 12.17l3.29-3.3a1 1 0 0 1 1.42 0z"
        fill="currentColor"
      />
    </svg>
  );
};
