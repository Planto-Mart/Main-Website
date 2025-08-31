"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import Link from "next/link";

function FAQ() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqs = [
    {
      question: "Do you offer plant care guidance?",
      answer:
        "Yes! Each plant comes with detailed care instructions. We also offer free plant care consultations via email or phone for any specific questions you might have.",
    },
    {
      question: "What is your shipping policy?",
      answer:
        "We offer free shipping on orders above ₹999 within Hyderabad. For locations outside Hyderabad but within Telangana, a nominal fee applies. All plants are carefully packaged to ensure they reach you in perfect condition.",
    },
    {
      question: "Can I return plants if they arrive damaged?",
      answer:
        "Absolutely! If your plants arrive damaged, please contact us within 24 hours with photos, and we'll arrange for a replacement or refund. Your satisfaction is our priority.",
    },
    {
      question: "How do I join the loyalty program?",
      answer:
        "You're automatically enrolled in our loyalty program when you make your first purchase. With each order, you earn points that can be redeemed for discounts on future purchases.",
    },
    {
      question: "Do you support local artisans and vendors?",
      answer:
        "Yes, supporting local businesses is core to our mission. Many of our products are sourced from local artisans and vendors in Hyderabad and across Telangana.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Find answers to the most common questions about our plants and
            services.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                {activeAccordion === index ? (
                  <ChevronUp className="size-5 text-green-600" />
                ) : (
                  <ChevronDown className="size-5 text-green-600" />
                )}
              </button>

              <div
                className={`px-6 pb-5 pr-10 text-gray-600 transition-all duration-300 ease-in-out ${
                  activeAccordion === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 overflow-hidden opacity-0"
                }`}
              >
                <p className="text-base leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link href="/faq">
            <button className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300">
              View All FAQs
              <ArrowRight className="size-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
