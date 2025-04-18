import React from 'react'
import { Leaf } from 'lucide-react'

function Footer() {
  return (
    <div>
      <footer className="bg-green-900 pb-8 pt-16 text-green-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center">
                <Leaf className="size-8 text-green-400" />
                <span className="ml-2 text-2xl font-bold text-white">Plantomart</span>
              </div>
              <p className="mb-6 text-green-200">
                Making sustainable living accessible and enjoyable for everyone in Hyderabad and beyond.
              </p>
              <div className="flex space-x-4">
                {["facebook", "instagram", "twitter", "youtube"].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700"
                  >
                    <svg className="size-5 text-green-100" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-6 text-lg font-bold text-white">Quick Links</h3>
              <ul className="space-y-4">
                {["Home", "Shop", "About Us", "Blog", "Contact"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-green-200 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-lg font-bold text-white">Categories</h3>
              <ul className="space-y-4">
                {["Indoor Plants", "Outdoor Plants", "Planters", "Plant Care", "Gifts"].map((category) => (
                  <li key={category}>
                    <a href="#" className="text-green-200 transition-colors hover:text-white">
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-lg font-bold text-white">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">📍</span>
                  <span>Jubilee Hills, Hyderabad, Telangana, India</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">📞</span>
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">✉️</span>
                  <span>hello@plantomart.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-t border-green-800 pt-8 md:flex-row">
            <p className="mb-4 text-green-300 md:mb-0">
              &copy; {new Date().getFullYear()} Plantomart. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-green-300 transition-colors hover:text-white">Privacy Policy</a>
              <a href="#" className="text-green-300 transition-colors hover:text-white">Terms of Service</a>
              <a href="#" className="text-green-300 transition-colors hover:text-white">Shipping Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
