import Image from 'next/image'
import React from 'react'

function Testimonials() {
  return (
    <div>
      <section className="bg-green-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">What Our Customers Say</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Hear from our community of plant enthusiasts and eco-conscious shoppers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Priya Sharma",
                role: "Plant Enthusiast",
                image: "/api/placeholder/100/100",
                quote: "Plantomart transformed my apartment into a green sanctuary. Their curated selection and expert advice helped me choose the perfect plants for my space."
              },
              {
                name: "Rahul Mehra",
                role: "First-time Plant Parent",
                image: "/api/placeholder/100/100",
                quote: "As someone new to plant care, I appreciated the detailed care instructions and responsive customer service. My plants are thriving thanks to Plantomart!"
              },
              {
                name: "Anjali Reddy",
                role: "Interior Designer",
                image: "/api/placeholder/100/100",
                quote: "I recommend Plantomart to all my clients. Their products elevate any interior space with a touch of nature while supporting sustainable practices."
              }
            ].map((testimonial, index) => (
              <div key={index} className="rounded-xl bg-white p-8 shadow-md">
                <div className="mb-6 flex items-center">
                  <Image
                    width={500}
                    height={500} 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="mr-4 size-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-gray-700">"{testimonial.quote}"</p>
                <div className="mt-6 flex">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="size-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Testimonials
