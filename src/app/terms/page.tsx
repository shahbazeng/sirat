"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Scale, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A2E2A] py-20 px-6">
      <article className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h1 className="text-6xl font-serif font-black mb-6 tracking-tight">Terms & Conditions</h1>
          <p className="text-lg opacity-60">By using Sirat AI, you agree to these foundational principles.</p>
        </motion.div>

        {/* Terms Grid */}
        <div className="grid gap-8">
          {[
            { 
              icon: <BookOpen />, 
              title: "Educational Purpose", 
              desc: "Sirat AI provides guidance and educational content based on scholarly consensus. It is not a substitute for formal, face-to-face legal/religious rulings (Fatwa) from local scholars." 
            },
            { 
              icon: <Scale />, 
              title: "Acceptable Use", 
              desc: "Users must interact with the platform respectfully. Any misuse, attempt to exploit the AI for malicious intent, or data scraping is strictly prohibited." 
            },
            { 
              icon: <CheckCircle />, 
              title: "Accuracy & Verification", 
              desc: "While we employ cutting-edge AI and human-verified datasets, we encourage users to verify critical information through official scholarly resources." 
            },
            { 
              icon: <AlertCircle />, 
              title: "Limitation of Liability", 
              desc: "Sirat AI, its founders, and employees are not liable for any actions taken based on interpretations provided by the AI engine." 
            },
            { 
              icon: <Gavel />, 
              title: "Governing Law", 
              desc: "These terms are governed by the applicable laws of our operational jurisdiction, ensuring fairness and integrity in all interactions." 
            }
          ].map((term, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-[#D4AF37]">{term.icon}</div>
                <h3 className="text-2xl font-serif">{term.title}</h3>
              </div>
              <p className="text-[#1A2E2A]/70 leading-relaxed text-lg">{term.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Agreement Footer */}
        <div className="mt-20 p-10 bg-[#1A2E2A] rounded-[2rem] text-white text-center">
          <h4 className="text-xl font-serif text-[#D4AF37] mb-4">Agreement</h4>
          <p className="opacity-80">By accessing Sirat AI, you acknowledge that you have read, understood, and agreed to be bound by these terms.</p>  
          
        </div>
      </article>

      {/* SEO Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Legislation",
          "name": "Sirat AI Terms and Conditions",
          "url": "https://sirat.ai/terms"
        })}
      </script>
    </div>
  );
};

export default TermsAndConditions;