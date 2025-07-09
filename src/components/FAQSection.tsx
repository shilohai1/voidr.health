
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "Who is Voidr.Health created for?",
      answer: "If you're a Medical student, Intern, Resident, or even a busy Doctor who needs quick refreshers or study tools — Voidr.Health is built for you."
    },
    {
      id: 2,
      question: "What exactly does Voidr.Health do?",
      answer: "Voidr.Health helps Medical students and Doctors save time by turning complex topics into short, high-quality explainer videos and notes using AI. Just type your topic, and we handle the rest."
    },
    {
      id: 3,
      question: "Can I trust the accuracy of the medical content?",
      answer: "Yes. Our AI is trained with reliable, up-to-date medical sources and reviewed with clinical logic in mind. You still need to cross-check, but it's made to be your smart study partner."
    },
    {
      id: 4,
      question: "How is this better than watching YouTube videos or reading books?",
      answer: "Voidr.Health gives you precise, tailored, and fast video explanations based on what you want to learn — no need to scroll through hours of unrelated content."
    },
    {
      id: 5,
      question: "Is it free to use?",
      answer: "You can try Voidr.Health for free with limited access. For full features like HD video downloads, premium voiceovers, and advanced AI tools, we offer student-friendly affordable subscription plans."
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
