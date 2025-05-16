import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight, Clock, HeartHandshake } from 'lucide-react'

function UpgradedFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-green-900 via-green-950 to-green-950 text-white">
      {/* Decorative Leaf Pattern Top Border */}
      <div className="h-2 w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
      {/* Wave Separator */}
      <div className="absolute left-0 top-2 w-full overflow-hidden leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-12 w-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-green-900"></path>
        </svg>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12 pt-20">
        {/* Top Row with Logo and Newsletter */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-green-700/40 pb-10 lg:flex-row">
          {/* Logo and Tagline */}
          <div className="max-w-sm text-center lg:text-left">
            <div className="mb-3 flex items-center justify-center lg:justify-start">
              <div className="relative mr-3 size-12">
                <Image 
                  src="/assets/logo_Without_Text.png" 
                  alt="Plantomart Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="bg-gradient-to-r from-green-200 to-green-100 bg-clip-text text-2xl font-bold text-transparent">
                plantomart
              </h2>
            </div>
            <p className="text-green-200">
              India's premier multi-vendor marketplace connecting plant enthusiasts with sustainable vendors nationwide.
            </p>
          </div>
          {/* Newsletter */}
          <div className="w-full max-w-md">
            <div className="rounded-xl bg-gradient-to-br from-green-800 to-green-900 p-6 shadow-lg shadow-green-900/30">
              <h3 className="mb-2 text-center text-lg font-semibold text-green-100">Join Our Green Community</h3>
              <div className="flex overflow-hidden rounded-lg">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="grow rounded-l-lg border-y border-l border-green-600 bg-green-950/80 px-4 py-3 text-sm placeholder:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button className="rounded-r-lg bg-gradient-to-r from-green-500 to-green-400 px-4 py-3 font-medium text-green-950 transition-all hover:from-green-400 hover:to-green-300">
                  Subscribe
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-green-400">
                Get exclusive offers, gardening tips, and early access to sales
              </p>
            </div>
          </div>
        </div>
        {/* Main Grid Section */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* About Column */}
          <div>
            <h3 className="mb-6 inline-flex items-center text-lg font-bold text-green-100">
              <span className="mr-2 flex size-8 items-center justify-center rounded-full bg-green-800">
                <Leaf className="size-4 text-green-300" />
              </span>
              About PlantoMart
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-green-300">
              PlantoMart is a premier multi-vendor platform empowering plant vendors across India while making green living accessible for everyone. Our mission is to connect plant lovers with sustainable vendors and make plant shopping a delightful experience.
            </p>
            <div className="mb-6 flex space-x-3">
              <Link href="#" className="group flex size-10 items-center justify-center rounded-full bg-green-800/50 transition-all hover:bg-green-700">
                <Facebook className="size-5 text-green-300 group-hover:text-white" />
              </Link>
              <Link href="#" className="group flex size-10 items-center justify-center rounded-full bg-green-800/50 transition-all hover:bg-green-700">
                <Instagram className="size-5 text-green-300 group-hover:text-white" />
              </Link>
              <Link href="#" className="group flex size-10 items-center justify-center rounded-full bg-green-800/50 transition-all hover:bg-green-700">
                <Twitter className="size-5 text-green-300 group-hover:text-white" />
              </Link>
            </div>
            {/* App Download Buttons */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-400">Download Our App</p>
              <div className="flex gap-3">
                <Link href="#" className="flex-1">
                  <div className="flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 transition-all hover:bg-gray-800">
                    <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.5234 12.0371C17.5234 9.35156 19.6406 8.15625 19.7109 8.10938C18.4688 6.21094 16.5117 5.95312 15.832 5.92969C14.2031 5.76562 12.6328 6.89062 11.8047 6.89062C10.9766 6.89062 9.64062 5.95312 8.25391 5.97656C6.46875 6.02344 4.79688 7.07812 3.875 8.69531C2.01172 11.9531 3.42578 16.7812 5.22266 19.4434C6.125 20.75 7.17969 22.2266 8.55469 22.1797C9.88281 22.1328 10.375 21.3281 11.9805 21.3281C13.5859 21.3281 14.0312 22.1797 15.4297 22.1562C16.8516 22.1328 17.7734 20.8047 18.6484 19.4961C19.6797 17.9844 20.1016 16.5156 20.125 16.4453C20.1016 16.4219 17.5469 15.5 17.5234 12.0371ZM14.5 4.28125C15.2578 3.35547 15.7734 2.08594 15.6328 0.8125C14.5703 0.859375 13.2188 1.54688 12.4375 2.44531C11.7266 3.25 11.1055 4.55469 11.2695 5.78125C12.4609 5.875 13.7422 5.20312 14.5 4.28125Z" />
                    </svg>
                    <div>
                      <div className="text-xs text-gray-400">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </div>
                </Link>
                <Link href="#" className="flex-1">
                  <div className="flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 transition-all hover:bg-gray-800">
                    <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.48438 2C3.21094 2 3 2.21094 3 2.48438V21.5156C3 21.7891 3.21094 22 3.48438 22H21.5156C21.7891 22 22 21.7891 22 21.5156V2.48438C22 2.21094 21.7891 2 21.5156 2H3.48438ZM9.89844 17.5C9.4375 18.1406 8.64844 18.5 7.84375 18.5C7.03906 18.5 6.30469 18.1641 5.85938 17.5313C5.375 16.8516 5.26562 15.9922 5.52344 15.2031L5.53125 15.1875L3.57031 12.0859L3.55469 12.1016C3.04688 13.2109 2.94531 14.4531 3.28125 15.6172C3.61719 16.7813 4.35938 17.7734 5.375 18.4063C6.39063 19.0391 7.60156 19.2734 8.78906 19.0625C9.97656 18.8516 11.0469 18.2109 11.8281 17.25L9.89844 17.5ZM16.4375 11L12.9922 7.54688L7 13.5391L9.89844 17.5L16.4375 11ZM18.8594 8.57812L17.1172 6.83594L16.4375 7.51562L18.1797 9.25781L18.8594 8.57812Z" />
                    </svg>
                    <div>
                      <div className="text-xs text-gray-400">GET IT ON</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Quick Links & Categories Combined */}
          <div>
            <h3 className="mb-6 inline-flex items-center text-lg font-bold text-green-100">
              <span className="mr-2 flex size-8 items-center justify-center rounded-full bg-green-800">
                <ArrowRight className="size-4 text-green-300" />
              </span>
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              {[
                "Home", "Shop", "About Us", "Blog", "Vendors", "Contact Us", 
                "Login", "Register", "Wishlist", "My Account"
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="group flex items-center border-b border-transparent py-2 text-green-300 transition-colors hover:border-green-500 hover:text-white"
                >
                  <ArrowRight className="mr-1 size-3 opacity-0 transition-all group-hover:opacity-100" />
                  <span className="text-sm">{link}</span>
                </Link>
              ))}
            </div>
            {/* Popular Categories */}
            <div className="mt-8">
              <h4 className="mb-4 text-base font-medium text-green-200">Shop By Category</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Indoor Plants", "Outdoor Plants", "Succulents", "Planters", 
                  "Plant Care", "Gardening Tools", "Seeds", "Gift Plants"
                ].map((category) => (
                  <Link 
                    href="#" 
                    key={category}
                    className="rounded-lg bg-green-900/40 p-2 text-center text-sm text-green-300 transition-all hover:bg-green-800 hover:text-white"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Support Column */}
          <div>
            <h3 className="mb-6 inline-flex items-center text-lg font-bold text-green-100">
              <span className="mr-2 flex size-8 items-center justify-center rounded-full bg-green-800">
                <HeartHandshake className="size-4 text-green-300" />
              </span>
              Customer Support
            </h3>
            {/* Customer Support Box */}
            <div className="mb-6 rounded-xl bg-green-800/20 p-5">
              <div className="mb-4 flex items-center">
                <div className="mr-3 rounded-full bg-green-700/30 p-2">
                  <Clock className="size-5 text-green-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-100">Opening Hours</h4>
                  <p className="text-xs text-green-300">Monday – Friday: 8am – 4pm</p>
                  <p className="text-xs text-green-300">Saturday: 9am – 5pm</p>
                  <p className="text-xs text-green-300">Sunday: Closed</p>
                </div>
              </div>
              <div className="rounded-lg bg-green-700/20 p-4 text-center">
                <p className="mb-2 text-sm font-medium text-green-100">Need Assistance?</p>
                <Link href="#" className="inline-block rounded-full bg-gradient-to-r from-green-500 to-green-400 px-5 py-2 text-sm font-medium text-green-950 transition-all hover:from-green-400 hover:to-green-300">
                  Contact Support
                </Link>
              </div>
            </div>
            {/* FAQ Links */}
            <div className="space-y-2">
              <h4 className="text-base font-medium text-green-200">Quick Help</h4>
              {[
                "How to Place an Order", 
                "Shipping & Delivery", 
                "Returns & Refunds",
                "Track Your Order",
                "Vendor Registration"
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="flex items-center border-b border-green-800/30 py-2 text-sm text-green-300 transition-colors hover:text-white"
                >
                  <ArrowRight className="mr-2 size-3 text-green-500" />
                  {item}
                </Link>
              ))}
            </div>
          </div>
          {/* Contact Information */}
          <div>
            <h3 className="mb-6 inline-flex items-center text-lg font-bold text-green-100">
              <span className="mr-2 flex size-8 items-center justify-center rounded-full bg-green-800">
                <Mail className="size-4 text-green-300" />
              </span>
              Get In Touch
            </h3>
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-green-800/40 to-green-900/70 backdrop-blur-sm">
              {/* Map Image */}
              <div className="relative h-40 overflow-hidden">
                <Image 
                  src="/api/placeholder/600/240" 
                  alt="Location Map"
                  fill
                  className="object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3">
                  <h4 className="text-sm font-semibold text-white">Visit Our Office</h4>
                  <p className="text-xs text-green-200">Tolichowki, Hyderabad</p>
                </div>
              </div>
              {/* Contact Details */}
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-3 mt-1 rounded-full bg-green-700/30 p-1.5">
                      <MapPin className="size-4 text-green-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">ShowBio Pvt.Ltd.,</p>
                      <p className="text-xs text-green-300">Tolichowki, Hyderabad,</p>
                      <p className="text-xs text-green-300">Telangana 500008</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 rounded-full bg-green-700/30 p-1.5">
                      <Phone className="size-4 text-green-300" />
                    </div>
                    <Link href="tel:+918331801000" className="text-sm text-green-200 hover:text-white">
                      +91 833 180 1000
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 rounded-full bg-green-700/30 p-1.5">
                      <Mail className="size-4 text-green-300" />
                    </div>
                    <Link href="mailto:hello@plantomart.com" className="text-sm text-green-200 hover:text-white">
                      hello@plantomart.com
                    </Link>
                  </li>
                </ul>
                {/* Contact Button */}
                <Link href="#" className="mt-4 flex w-full items-center justify-center rounded-lg bg-green-800/50 py-2 text-sm font-medium text-white transition-all hover:bg-green-700">
                  Send Us a Message
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-green-950 py-6">
        <div className="container mx-auto px-6">
          {/* Payment Methods */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 border-b border-green-800/30 pb-6">
            <span className="text-sm text-green-400">Secure Payment Methods:</span>
            <div className="flex flex-wrap justify-center gap-3">
              {['Visa', 'Mastercard', 'PayPal', 'Google Pay', 'Apple Pay', 'UPI'].map((method) => (
                <div key={method} className="rounded-md bg-green-900/50 px-3 py-1 text-xs text-green-300">
                  {method}
                </div>
              ))}
            </div>
          </div>
          {/* Footer Legal & Links */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-xs text-green-400 md:text-left">
              &copy; {new Date().getFullYear()} PlantoMart. All rights reserved. A product of ShowBio Pvt.Ltd.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Shipping Policy
              </Link>
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
        {/* Developer Attribution */}
        <div className="mt-4 border-t border-green-800/30 pt-4 text-center">
          <p className="text-xs text-green-400">
            Designed & Developed by <Link href="https://adnanthecoder.com" target="_blank" rel="noopener noreferrer" className="font-medium text-green-300 underline decoration-green-500 underline-offset-2 hover:text-white">Adnan</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default UpgradedFooter