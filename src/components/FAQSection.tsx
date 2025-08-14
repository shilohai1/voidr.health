
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
      answer: "Voidr Health is an AI-powered platform built by med students, for med students. It offers 3 tools: ClinicBot, AskVoidr and Case Wise which simplify your studies, sharpen clinical reasoning, and save hours of revision time. Whether you're analyzing symptoms, summarizing lecture notes, or simulating real-world patient cases, Voidr makes learning faster, smarter, and more realistic."
    },
    {
      id: 2,
      question: "Is Voidr a replacement for seeing a doctor?",
      answer: "No. Voidr is strictly an educational tool designed for medical students. It helps users learn diagnostic reasoning and clinical decision-making. but it is not meant to diagnose or replace professional medical advice."
    },
    {
      id: 3,
      question: "Can I trust the accuracy of the medical content?",
      answer: "Yes. Voidr's AI is trained on peer-reviewed medical sources, textbooks, and verified clinical frameworks. All outputs are designed to be medically accurate, realistic, and aligned with how real-world cases are handled. We also continuosuly update the system with feedback from med students and professionals."
    },
    {
      id: 4,
      question: "I have no medical background. Will I still understand the results?",
      answer: "Voidr is designed primarily for medical students and healthcare learners. However, the results are simplified and structured to be understandable with basic medical knowledge. ClinicBot even allows you to ask for simplified summaries if you're struggling with heavy material."
    },
    {
      id: 5,
      question: "What makes Voidr different from just Googling my symptoms?",
      answer: "Great question — Google gives scattered, generic results. AskVoidr, our AI symptom analyzer, uses real clinical logic to walk through your input just like a doctor would during a case. It prioritizes reasoning, context and differential diagnoses rather than keyword matching."
    },
    {
      id: 6,
      question: "How is Case Wise different from just reading case books?",
      answer: "Case Wise simulates realistic, time-presuured clinical environmetns with AI-generated patient scenarios, Instead of passively reading cases, you actively work through them, improving your critical thinking, diagnostic accuracy, and decision-making in real time."
    },
    {
      id: 7,
      question: "What file type does ClinicBot accept for summarizing",
      answer: "ClinicBot works best with PDF's, DOCX, and plain text files. You can upload clinical guidelines, lecture slides, or even your own notes (the text form only not the document itself) and it will condense the content into short, structured key points instantly."
    },
    {
      id: 8,
      question: "How detailed should my symptom input be for AskVoidr",
      answer: "The more detailed, the better. Include the symptom, duration, associated signs, relevant history, and any previous diagnoses. AskVoidr uses clinical algorithms that mimic real-life diagnostic pathways, so detail helps it perform more accurately."
    },
    {
      id: 9,
      question: "Is Voidr free to use?",
      answer: "Voidr offers a free trial with limited access to each tool so you can test the experience. Premium plans unlock unlimited summaries, cases, and advanced analysis features tailored for serious med students and professionals."
    },
    {
      id: 10,
      question: "Can I use Voidr on Mobile?",
      answer: "Yes! Voidr is fully responsive and works on all modern browsers, including mobile. We're also working on an app version to make it even easier to learn on the go."
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
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
