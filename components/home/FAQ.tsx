"use client";
import React,{useState} from 'react'
import { ChevronDown,ChevronUp } from 'lucide-react'

function FAQ() {
      const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
   
      const toggleAccordion = (index: number) => {
        setActiveAccordion(activeAccordion === index ? null : index);
      };

  return (
    <div>
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Find answers to common questions about our products and services
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            {[
              {
                question: "Do you offer plant care guidance?",
                answer: "Yes! Each plant comes with detailed care instructions. We also offer free plant care consultations via email or phone for any specific questions you might have."
              },
              {
                question: "What is your shipping policy?",
                answer: "We offer free shipping on orders above ₹999 within Hyderabad. For locations outside Hyderabad but within Telangana, a nominal fee applies. All plants are carefully packaged to ensure they reach you in perfect condition."
              },
              {
                question: "Can I return plants if they arrive damaged?",
                answer: "Absolutely! If your plants arrive damaged, please contact us within 24 hours with photos, and we'll arrange for a replacement or refund. Your satisfaction is our priority."
              },
              {
                question: "How do I join the loyalty program?",
                answer: "You're automatically enrolled in our loyalty program when you make your first purchase. With each order, you earn points that can be redeemed for discounts on future purchases."
              },
              {
                question: "Do you support local artisans and vendors?",
                answer: "Yes, supporting local businesses is core to our mission. Many of our products are sourced from local artisans and vendors in Hyderabad and across Telangana."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-gray-200 py-6"
              >
                <button 
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="text-xl font-medium text-gray-900">{faq.question}</span>
                  {activeAccordion === index ? 
                    <ChevronUp className="size-5 text-green-600" /> : 
                    <ChevronDown className="size-5 text-green-600" />
                  }
                </button>
                {activeAccordion === index && (
                  <div className="mt-4 pr-8 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQ
