import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, ChevronRight } from 'lucide-react'

function BigFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-green-800 to-green-950 text-green-50">
      {/* Decorative Elements */}
      <div className="absolute left-0 top-0 h-8 w-full bg-[url('/assets/footer/leaf-pattern.png')] opacity-10"></div>
      <div className="absolute bottom-0 right-0 size-48 opacity-5 md:size-64">
        <Image 
          src="/assets/footer/plant-illustration.png" 
          alt="Decorative plant"
          fill
          className="object-contain"
          priority={false}
        />
      </div>
      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 md:px-6">
        {/* Top Section with Logo and Newsletter */}
        <div className="mb-12 flex flex-col items-center justify-between border-b border-green-700 pb-12 lg:flex-row">
          <div className="mb-8 flex items-center lg:mb-0">
            <div className="relative mr-3 size-12">
              <Image 
                src="/assets/logo_Without_Text.png" 
                alt="Plantomart Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-3xl font-bold text-transparent">plantomart</span>
          </div>
          <div className="w-full max-w-md">
            <h3 className="mb-3 text-center text-lg font-semibold lg:text-left">Join our green community</h3>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="grow rounded-l-md border border-green-700 bg-green-900/50 px-4 py-2 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button className="rounded-r-md bg-gradient-to-r from-green-500 to-green-400 px-4 py-2 font-medium text-green-950 transition-all hover:from-green-400 hover:to-green-500">
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-center text-sm text-green-400 lg:text-left">Get exclusive offers and gardening tips</p>
          </div>
        </div>
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div>
            <h3 className="mb-6 flex items-center text-xl font-bold">
              <Leaf className="mr-2 size-5 text-green-400" />
              About Us
            </h3>
            <p className="mb-6 leading-relaxed text-green-300">
              Plantomart connects plant lovers with sustainable vendors across India. 
              We're dedicated to making green living accessible and enjoyable for everyone.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700">
                <Facebook className="size-5 text-green-200" />
              </Link>
              <Link href="#" className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700">
                <Instagram className="size-5 text-green-200" />
              </Link>
              <Link href="#" className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700">
                <Twitter className="size-5 text-green-200" />
              </Link>
              <Link href="#" className="rounded-full bg-green-800 p-2 transition-colors hover:bg-green-700">
                <Youtube className="size-5 text-green-200" />
              </Link>
            </div>
          </div>
          {/* Quick Links Column */}
          <div>
            <h3 className="mb-6 border-l-4 border-green-400 pl-3 text-xl font-bold">Explore</h3>
            <ul className="space-y-3">
              {["Home", "Shop", "About Us", "Blog", "Vendors", "Contact"].map((link) => (
                <li key={link} className="transition-transform hover:translate-x-2">
                  <Link href="#" className="flex items-center text-green-200 transition-colors hover:text-white">
                    <ChevronRight className="mr-2 size-4 text-green-400" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Categories Column */}
          <div>
            <h3 className="mb-6 border-l-4 border-green-400 pl-3 text-xl font-bold">Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Indoor Plants", 
                "Outdoor Plants", 
                "Succulents", 
                "Planters", 
                "Plant Care", 
                "Gardening Tools", 
                "Seeds", 
                "Gift Plants"
              ].map((category) => (
                <Link 
                  href="#" 
                  key={category}
                  className="text-green-200 decoration-green-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          {/* Contact Column */}
          <div className="rounded-lg bg-green-900/30 p-5 backdrop-blur-sm">
            <h3 className="mb-6 text-center text-xl font-bold">Get In Touch</h3>
            <ul className="space-y-5">
              <li className="flex items-start">
                <div className="mr-3 mt-1 rounded-full bg-green-700/30 p-2">
                  <MapPin className="size-5 text-green-300" />
                </div>
                <div>
                  <p className="font-medium text-white">ShowBio Pvt.Ltd.,</p>
                  <p className="text-green-300">Tolichowki, Hyderabad,</p>
                  <p className="text-green-300">Telangana 500008</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="mr-3 rounded-full bg-green-700/30 p-2">
                  <Phone className="size-5 text-green-300" />
                </div>
                <Link href="tel:+919876543210" className="text-green-200 hover:text-white">
                  +91 833 180 1000
                </Link>
              </li>
              <li className="flex items-center">
                <div className="mr-3 rounded-full bg-green-700/30 p-2">
                  <Mail className="size-5 text-green-300" />
                </div>
                <Link href="mailto:hello@plantomart.com" className="text-green-200 hover:text-white">
                  hello@plantomart.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Hours and Support Section */}
        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-green-700/50 pt-8 md:grid-cols-2">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-4 rounded-full bg-green-800/50 p-3 md:mb-0 md:mr-5">
              <svg className="size-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h4 className="mb-1 text-lg font-semibold">Opening Hours</h4>
              <p className="text-green-300">Monday – Friday: 8am – 4pm</p>
              <p className="text-green-300">Saturday: 9am – 5pm</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-4 rounded-full bg-green-800/50 p-3 md:mb-0 md:mr-5">
              <svg className="size-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.88 9.88a3 3 0 105.657 1.657" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h4 className="mb-1 text-lg font-semibold">Customer Support</h4>
              <p className="text-green-300">We're here to help with any questions</p>
              <Link href="#" className="text-green-200 underline decoration-green-400 underline-offset-4 hover:text-white">
                Support Center
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-green-950 py-4">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row md:px-6">
          <p className="mb-4 text-sm text-green-400 md:mb-0">
            &copy; {new Date().getFullYear()} Plantomart. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="#" className="text-sm text-green-400 transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-green-400 transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-green-400 transition-colors hover:text-white">
              Shipping Policy
            </Link>
            <Link href="#" className="text-sm text-green-400 transition-colors hover:text-white">
              Refund Policy
            </Link>
          </div>
        </div>
        {/* Developer Attribution with HR */}
        <hr className="mx-auto my-3 w-full max-w-6xl border-t border-green-800/50" />
        <div className="container mx-auto px-4 pb-2 text-center">
          <p className="text-sm text-green-400">
            Developed by <Link href="https://adnanthecoder.com" target="_blank" rel="noopener noreferrer" className="font-medium text-green-300 underline decoration-green-500 underline-offset-2 hover:text-white">Adnan</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default BigFooter;