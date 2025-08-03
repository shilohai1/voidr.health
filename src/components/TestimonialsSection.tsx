
import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns';

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "I had a chance to explore the platform, and I'm genuinely impressed. The interface is intuitive and thoughtfully designed, and the concept addresses a real gap in medical education. It's clear you've put serious thought into both function and utility",
      name: "Dr. Steven Spitz",
      role: "Neurosurgeon"
    },
    {
      text: "ClinicBot honestly saved me hours and hours last week. The automated documentation is a game-changer. The other cool feature is the part where they can shorten documents to just mere prescriptions",
      name: "Dr. Aisha",
      role: "Intern"
    },
    {
      text: "Few days ago I was on clinical rounds and a patient approached with few symptoms that I couldn't even understand. I just put it all into AskVoidr and it gave me 3 likely causes with the level of seriousness. It saved my day and my honor lol",
      name: "Omar",
      role: "4th year Med student"
    },
    {
      text: "I'm an Indian medical student and come from a curriculum where it is solely based on books and rote learning. Atleast Voidr helped me find a different approach to learning new concepts",
      name: "Divya Naik",
      role: "1st year Med student"
    },
    {
      text: "I'm usually a visual learner. Medical school would've been a nightmare without Voidr",
      name: "Asher",
      role: "2nd year Med student"
    },
    {
      text: "Case Wise is just so real ong. I tbh got chills when I saw how accurate the cases, vitals, questions, lab reports all are. Everyone needs to use it NOW!",
      name: "Riya",
      role: "OSCE prep student"
    },
    {
      text: "I was initially very skeptical about Clinicbot cause who even uses AI during ward rounds? But I just wanted to give it a shot and tried summarizing a patient case file into just one sheet of paper using ClinicBot. Tbh, it just saved me like 2 hours of work per day?",
      name: "Dr. Leya",
      role: "Intern"
    }
  ];

  // For mobile, show all testimonials in a single column
  const allTestimonials = testimonials;
  const firstColumn = testimonials.slice(0, 2);
  const secondColumn = testimonials.slice(2, 4);
  const thirdColumn = testimonials.slice(4, 6);

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 relative px-4 sm:px-6 md:px-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-2 px-4 rounded-lg bg-primary/10 text-primary font-semibold text-sm sm:text-base">
              Testimonials
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4 sm:mt-6 text-center">
            What Our Users Are Saying
          </h2>
          <p className="text-center mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
            Real feedback from med students, residents, and doctors.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-12 sm:mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[600px] sm:max-h-[740px] overflow-hidden">
          {/* Mobile: show all testimonials in one column */}
          <div className="sm:hidden">
            <TestimonialsColumn testimonials={allTestimonials} duration={15} />
          </div>
          {/* Desktop: split into columns */}
          <TestimonialsColumn testimonials={firstColumn} className="hidden sm:block" duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden sm:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
