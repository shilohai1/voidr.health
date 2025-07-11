
import React from 'react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import Footer from '@/components/Footer';
import { User } from 'lucide-react';

const PrivacyPolicy = () => {
  const navItems = [
    { 
      name: 'Services', 
      url: '#services',
      hasDropdown: true,
      dropdownItems: [
        { name: 'AskVoidr', url: '#askvoidr' },
        { name: 'Case Wise', url: '#casewise' },
        { name: 'ClinicBot', url: '#clinicbot' }
      ]
    },
    { name: 'Pricing', url: '#pricing' },
    { name: 'Affiliates', url: '/affiliates' },
    { 
      name: 'About Us', 
      url: '#about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Who We Are', url: '/about' },
        { name: 'Instagram', url: 'https://www.instagram.com/voidr.health/' },
        { name: 'Twitter', url: 'https://x.com/voidrhealth' }
      ]
    },
    { name: 'Login', url: '/auth', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#f3fceb]">
      <NavBar items={navItems} />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy for Voidr Health
            </h1>
            
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> 11th July 2025
            </p>

            <div className="prose prose-gray max-w-none">
              <p className="mb-6">
                Voidr Health respects and protects your privacy in compliance with the Digital Personal Data Protection Act, 2023 (India) and the UAE Federal Decree Law No. 45 of 2021 on the Protection of Personal Data.
              </p>

              <p className="mb-8">
                By using ClinicBot, AskVoidr, or Case Wise, you consent to the collection, use, storage, and transfer of your information in accordance with this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Information We Collect</h2>
              <p className="mb-4">We collect and process only the minimum necessary personal data:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Identifiable Information:</strong> Name, email, account credentials, device ID.</li>
                <li><strong>Health-Related Inputs:</strong> User-provided symptom descriptions, case uploads, and document text (used solely to power our services).</li>
                <li><strong>Technical Data:</strong> IP address, browser, OS, geolocation (if applicable), session logs, usage metrics.</li>
              </ul>
              <p className="mb-8">We collect data directly from you with your informed consent.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Lawful Purpose of Processing</h2>
              <p className="mb-4">Your data is collected only for:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Providing and improving our AI-based services (ClinicBot, AskVoidr, Case Wise)</li>
                <li>Internal diagnostics, accuracy tuning, and performance monitoring</li>
                <li>Ensuring legal and regulatory compliance</li>
                <li>User account support and communications</li>
              </ul>
              <p className="mb-8">We will not process your data beyond these stated purposes.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Consent and Control</h2>
              <p className="mb-4">By using our services, you voluntarily grant explicit consent to collect and process your data.</p>
              <p className="mb-8">You may withdraw consent at any time by contacting us at voidrhealth@gmail.com. Withdrawal of consent does not affect processing already done prior to the withdrawal.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Localization and Cross-Border Transfers</h2>
              <p className="mb-4">Your data may be securely processed and stored in servers located outside India and the UAE, including jurisdictions such as the EU or USA. We ensure:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Data is transferred with appropriate safeguards (such as Standard Contractual Clauses or equivalent)</li>
                <li>Transfers are lawful and respect user rights</li>
              </ul>
              <p className="mb-8">If local storage becomes mandatory in either country, we will comply fully.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Minimization and Retention</h2>
              <p className="mb-4">We only collect the data required to perform our services.</p>
              <p className="mb-4">We retain personal data:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>For the duration of service usage</li>
                <li>Or as long as legally necessary</li>
              </ul>
              <p className="mb-8">You may request deletion by writing to voidrhealth@gmail.com.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Children's Data</h2>
              <p className="mb-8">Our services are not directed at users under the age of 13. If we become aware that a child's personal data has been collected without verified parental consent, we will delete it.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="mb-4">Under Indian and UAE data protection laws, you have the right to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccuracies</li>
                <li>Request deletion ("right to be forgotten")</li>
                <li>Withdraw consent</li>
                <li>File complaints with the respective data protection authorities</li>
              </ul>
              <p className="mb-8">To exercise any of these rights, contact voidrhealth@gmail.com.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Security Measures</h2>
              <p className="mb-4">We use strict administrative, technical, and physical security safeguards to protect your data, including:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Encryption of sensitive inputs</li>
                <li>Role-based access controls</li>
                <li>Regular audits and threat monitoring</li>
              </ul>
              <p className="mb-8">No system is 100% secure, but we take all reasonable precautions as required under both Indian and UAE laws.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Processors</h2>
              <p className="mb-4">We may share limited data with:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Hosting providers</li>
                <li>AI model processors (e.g., for NLP or symptom analysis)</li>
                <li>Analytics or crash reporting tools</li>
              </ul>
              <p className="mb-8">Each third-party is bound by strict contractual obligations under data protection agreements to safeguard your data.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Policy Updates</h2>
              <p className="mb-8">We may amend this policy to comply with legal changes or improve clarity. You will be notified of major changes via email or a notice on our website. Continued use of our services indicates your acceptance of the updated policy.</p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="mb-4">If you have questions or wish to exercise your rights:</p>
              <p><strong>Email:</strong> voidrhealth@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
