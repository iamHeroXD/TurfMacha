import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
const FAQS = [
{
  question: 'How do I book a turf?',
  answer:
  'Simply download the TurfMacha app, browse turfs in your area (currently live in Trivandrum), select your preferred date and time slot, and complete the payment to confirm your booking instantly.'
},
{
  question: 'Can I cancel my booking?',
  answer:
  'Yes, you can cancel your booking up to 4 hours before the scheduled slot time for a full refund. Cancellations made within 4 hours of the slot time are not eligible for a refund.'
},
{
  question: 'How does the split payment feature work?',
  answer:
  'When booking a turf, you can choose to split the payment. The app will generate a link that you can share with your teammates. Once everyone pays their share, the booking is confirmed.'
},
{
  question: 'Are the turfs verified?',
  answer:
  'Absolutely. Every turf listed on TurfMacha is physically verified by our team for quality, lighting, amenities, and safety before they are allowed on the platform.'
},
{
  question: 'When are you launching in other cities?',
  answer:
  'We are currently live in Trivandrum. We are actively working on launching in Kochi, Calicut, and Thrissur very soon. Stay tuned to our social media for updates!'
},
{
  question: 'I own a turf. How can I list it on TurfMacha?',
  answer:
  "Great! Head over to our 'For Owners' page and fill out the partnership request form. Our team will get in touch with you within 24 hours to set up your account."
}];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-turf-emerald mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about TurfMacha.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) =>
          <div
            key={index}
            className={`bg-white border rounded-2xl overflow-hidden transition-colors ${openIndex === index ? 'border-turf-lime' : 'border-gray-200'}`}>
            
              <button
              className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              
                <span className="font-bold text-lg text-gray-900">
                  {faq.question}
                </span>
                {openIndex === index ?
              <ChevronUp className="w-5 h-5 text-turf-emerald shrink-0" /> :

              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
              }
              </button>

              {openIndex === index &&
            <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
            }
            </div>
          )}
        </div>

        <div className="mt-16 bg-turf-cream rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            We're here to help. Contact our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-turf-emerald text-white px-6 py-3 rounded-xl font-medium hover:bg-turf-emerald/90 transition-colors">
            
            Contact Support
          </a>
        </div>
      </div>
    </div>);

}