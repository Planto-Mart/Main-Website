import React from 'react'
import { Truck, Leaf, UserPlus } from 'lucide-react'
import Image from 'next/image'

function About() {
  return (
    <div>
      <section className="bg-gradient-to-b from-white to-green-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute left-0 top-0 -z-10 size-64 rounded-full bg-green-200"></div>
                <Image
                  width={500}
                  height={500} 
                  src="/api/placeholder/600/500" 
                  alt="About Plantomart" 
                  className="relative z-10 h-auto max-w-full rounded-2xl shadow-xl"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                Promoting Sustainable Living in Hyderabad
              </h2>
              <p className="mb-6 text-lg text-gray-600">
                Plantomart collaborates with local horticulturists, nurseries, and eco-enthusiasts 
                to offer a diverse range of sustainable products. We believe in supporting local 
                businesses while making green living accessible to everyone.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 rounded-lg bg-green-100 p-2">
                    <Leaf className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-gray-900">Sustainability First</h3>
                    <p className="text-gray-600">All our products are eco-friendly and sustainably sourced</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 rounded-lg bg-green-100 p-2">
                    <UserPlus className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-gray-900">Community Support</h3>
                    <p className="text-gray-600">Empowering local vendors and fostering a green community</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 rounded-lg bg-green-100 p-2">
                    <Truck className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-gray-900">Easy Delivery</h3>
                    <p className="text-gray-600">Carbon-neutral delivery options throughout Telangana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
