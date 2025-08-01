
import React, { useEffect } from 'react';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';
import Footer from '@/components/Footer';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <TubelightNavbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions for Voidr Health</h1>
            <p className="text-lg text-gray-600 mb-8">Effective Date: 11th July 2025</p>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                Welcome to Voidr Health. By accessing or using our services — including ClinicBot, AskVoidr, and Case Wise, you agree to be bound by these Terms and Conditions. These Terms comply with applicable laws in India and the United Arab Emirates (UAE) and incorporate fair use of third-party AI tools such as OpenAI and ElevenLabs.
              </p>
              
              <p>
                If you do not agree to these Terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Services Offered</h2>
              <p>Voidr Health offers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>ClinicBot:</strong> Converts long medical scripts and documents into concise and elaborate medical notes.</li>
                <li><strong>AskVoidr:</strong> A symptom analyzer for educational and informational use, not for diagnosis or treatment.</li>
                <li><strong>Case Wise:</strong> A clinically accurate medical simulator designed to enhance medical education for students and professionals.</li>
              </ul>
              <p>All services are provided as-is, without warranties, and are not substitutes for professional medical advice, diagnosis, or treatment.</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Eligibility</h2>
              <p>
                You must be at least 18 years old and capable of entering into a legally binding agreement under the laws of India or the UAE, depending on your jurisdiction.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
              <p>By using Voidr Health, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information</li>
                <li>Use services only for lawful, educational, and ethical purposes</li>
                <li>Not misuse, reverse engineer, copy, or exploit the services for unauthorized commercial purposes</li>
                <li>Not upload sensitive patient-identifying data unless explicitly anonymized</li>
              </ul>
              <p>You are responsible for maintaining the confidentiality of your account and password.</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Use of AI Technologies</h2>
              <p>Voidr Health uses APIs from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>OpenAI:</strong> To power natural language processing, summarization, and analysis</li>
                <li><strong>ElevenLabs:</strong> To generate voice/audio content where applicable</li>
              </ul>
              <p>By using our services, you acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Outputs may be generated by third-party AI systems</li>
                <li>We do not control or guarantee the accuracy, tone, or output of these third-party AI tools</li>
                <li>You shall not use the services to generate harmful, unethical, or medically misleading content</li>
              </ul>
              <p>These third-party services are subject to their own terms and limitations.</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Educational Disclaimer</h2>
              <p>AskVoidr and Case Wise are strictly for educational and training purposes.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No content should be treated as a substitute for licensed medical advice, diagnosis, or treatment.</li>
                <li>Clinical decisions should always be made by certified medical professionals.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
              <p>
                All content, tools, branding, and technology used in Voidr Health (excluding user-uploaded content and third-party APIs) are the intellectual property of Voidr Health and its licensors.
              </p>
              <p>
                You are granted a non-exclusive, non-transferable, limited license to use the services for personal or institutional educational use.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Data Privacy and Processing</h2>
              <p>Your use of our services is governed by our Privacy Policy, which outlines how your data is collected, used, and stored in compliance with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>India's Digital Personal Data Protection Act, 2023</li>
                <li>UAE's Federal Decree Law No. 45 of 2021 on the Protection of Personal Data</li>
              </ul>
              <p>
                You agree to our use of anonymized or aggregated data for product improvement and AI accuracy enhancement, where legally permitted.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitations of Liability</h2>
              <p>Voidr Health, its affiliates, and partners (including OpenAI and ElevenLabs) are not liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any direct or indirect medical consequences from using or misinterpreting our services</li>
                <li>Data loss, delays, or inaccuracies caused by technical issues, including AI-related outputs</li>
                <li>Actions taken by users based on suggestions, simulations, or analyses produced by our tools</li>
              </ul>
              <p>Use of the platform is at your own risk.</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Termination</h2>
              <p>We may suspend or terminate your access at any time, with or without notice, if:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You breach these Terms</li>
                <li>You misuse the platform or violate applicable laws</li>
                <li>Continued use poses risk to our platform, users, or partners</li>
              </ul>
              <p>You may stop using our services at any time. Upon termination, access to your data may be restricted or deleted.</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Governing Law & Jurisdiction</h2>
              <p>These Terms shall be governed by the laws of:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>India, if you are accessing the service primarily from India</li>
                <li>United Arab Emirates, if you are accessing the service primarily from the UAE</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Modifications to the Terms</h2>
              <p>
                Voidr Health reserves the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after such updates indicates your acceptance.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
              <p>For questions, feedback, or legal inquiries:</p>
              <p><strong>Email:</strong> voidrhealth@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;
