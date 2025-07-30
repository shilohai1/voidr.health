
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "What is Voidr and how can it help me?",
      answer: "Voidr is your AI-powered health assistant, built to guide you through symptoms, help you understand possible conditions, and get personalized insights fast. Whether you’re unsure about a weird symptom or need help before seeing a doctor, Voidr is here to simplify healthcare for you."
    },
    {
      id: 2,
      question: "Is Voidr a replacement for seeing a doctor?",
      answer: "No — Voidr is here to support, not replace, professional care. Think of it as a super-smart pre-check tool that gives you clarity before your appointment, or helps you decide if it’s time to see a doctor urgently."
    },
    {
      id: 3,
      question: "Can I trust the accuracy of the medical content?",
      answer: "Yes. Our AI is trained with reliable, up-to-date medical sources and reviewed with clinical logic in mind. You still need to cross-check, but it's made to be your smart study partner."
    },
    {
      id: 4,
      question: "I have no medical background. Will I still understand the results?",
      answer: "That’s exactly what Voidr is for! Everything is written in plain language, without confusing jargon. ClinicBot and AskVoidr explain things like a friend who happens to know a lot about medicine — not like a textbook."
    },
    {
      id: 5,
      question: "What makes Voidr different from just Googling my symptoms?",
      answer: "Great question — Googling symptoms often leads to anxiety and worst-case scenarios. Voidr uses AI trained on real clinical data to guide you through a smart, structured process (via AskVoidr) instead of dumping you into a sea of random articles. It’s focused, personalized, and way less stressful."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Get answers to common questions about Voidr.Health
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors min-h-[60px]"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <span className="flex-shrink-0 text-primary">
                  {openItem === faq.id ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </span>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openItem === faq.id ? "auto" : 0,
                  opacity: openItem === faq.id ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-6 pb-4">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
