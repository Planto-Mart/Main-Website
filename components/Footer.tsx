import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, HeartHandshake } from 'lucide-react'

function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-green-900 via-green-950 to-green-950 text-white">
      {/* Decorative Leaf Pattern Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Top Row with Logo and Newsletter */}
        <div className="flex flex-col items-center justify-between gap-6 border-b border-green-700/40 pb-6 lg:flex-row">
          {/* Logo and Tagline */}
          <div className="max-w-xs text-center lg:text-left">
            <div className="mb-2 flex items-center justify-center lg:justify-start">
              <div className="relative mr-2 size-10">
                <Image 
                  src="/assets/logo_Without_Text.png" 
                  alt="Plantomart Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="bg-gradient-to-r from-green-200 to-green-100 bg-clip-text text-xl font-bold text-transparent">
                plantomart
              </h2>
            </div>
            <p className="text-sm text-green-200">
              India's premier multi-vendor marketplace for plant enthusiasts.
            </p>
          </div>
          {/* Newsletter */}
          <div className="w-full max-w-sm">
            <div className="rounded-lg bg-green-800/30 p-4">
              <div className="flex overflow-hidden rounded-md">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="grow rounded-l-md border-y border-l border-green-600 bg-green-950/80 px-3 py-2 text-xs placeholder:text-green-500 focus:outline-none focus:ring-1 focus:ring-green-400"
                />
                <button type='button' className="rounded-r-md bg-gradient-to-r from-green-500 to-green-400 px-3 py-2 text-xs font-medium text-green-950 transition-all hover:from-green-400 hover:to-green-300">
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-green-400">
                Get exclusive offers and gardening tips
              </p>
            </div>
          </div>
        </div>
        {/* Main Grid Section */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* About Column */}
          <div>
            <h3 className="mb-3 flex items-center text-base font-bold text-green-100">
              <Leaf className="mr-2 size-4 text-green-400" />
              About PlantoMart
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-green-300">
              PlantoMart connects plant lovers with sustainable vendors across India. Our multi-vendor platform empowers plant vendors while making green living accessible and enjoyable for everyone.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="group flex size-8 items-center justify-center rounded-full bg-green-800/50 transition-all hover:bg-green-700">
                <Facebook className="size-4 text-green-300 group-hover:text-white" />
              </Link>
              <Link href="#" className="group flex size-8 items-center justify-center rounded-full bg-green-800/50 transition-all hover:bg-green-700">
                <Instagram className="size-4 text-green-300 group-hover:text-white" />
              </Link>
              <Link href="#" className="group flex size-8 items-center justify-center rounded-full bg-green-800/50 transition-all hover:bg-green-700">
                <Twitter className="size-4 text-green-300 group-hover:text-white" />
              </Link>
            </div>
          </div>
          {/* Support Column */}
          <div>
            <h3 className="mb-3 flex items-center text-base font-bold text-green-100">
              <HeartHandshake className="mr-2 size-4 text-green-400" />
              Customer Support
            </h3>
            {/* Customer Support Box */}
            <div className="rounded-lg bg-green-800/20 p-3">
              <div className="flex items-start">
                <div className="mr-2 rounded-full bg-green-700/30 p-1.5">
                  <Clock className="size-4 text-green-300" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-green-100">Opening Hours</h4>
                  <p className="text-xs text-green-300">Monday – Friday: 8am – 4pm</p>
                  <p className="text-xs text-green-300">Saturday: 9am – 5pm</p>
                </div>
              </div>
              <div className="mt-3 rounded-md bg-green-700/20 p-2 text-center">
                <Link href="#" className="inline-block rounded-full bg-gradient-to-r from-green-500 to-green-400 px-3 py-1 text-xs font-medium text-green-950 transition-all hover:from-green-400 hover:to-green-300">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
          {/* Contact Information */}
          <div>
            <h3 className="mb-3 flex items-center text-base font-bold text-green-100">
              <Mail className="mr-2 size-4 text-green-400" />
              Get In Touch
            </h3>
            <div className="rounded-lg bg-gradient-to-br from-green-800/30 to-green-900/60 p-3">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 rounded-full bg-green-700/30 p-1">
                    <MapPin className="size-3 text-green-300" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">ShowBio Pvt.Ltd.,</p>
                    <p className="text-xs text-green-300">Tolichowki, Hyderabad, 500008</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 rounded-full bg-green-700/30 p-1">
                    <Phone className="size-3 text-green-300" />
                  </div>
                  <Link href="tel:+918331801000" className="text-xs text-green-200 hover:text-white">
                    +91 833 180 1000
                  </Link>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 rounded-full bg-green-700/30 p-1">
                    <Mail className="size-3 text-green-300" />
                  </div>
                  <Link href="mailto:hello@plantomart.com" className="text-xs text-green-200 hover:text-white">
                    hello@plantomart.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-green-950 py-3">
        <div className="container mx-auto px-4">
          {/* Payment Methods */}
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 border-b border-green-800/30 pb-3">
            <span className="text-xs text-green-400">Secure Payment:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Visa', 'Mastercard', 'PayPal', 'UPI'].map((method) => (
                <div key={method} className="rounded-md bg-green-900/50 px-2 py-0.5 text-xs text-green-300">
                  {method}
                </div>
              ))}
            </div>
          </div>
          {/* Footer Legal & Links */}
          <div className="flex flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
            <p className="text-xs text-green-400">
              &copy; {new Date().getFullYear()} PlantoMart. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Shipping
              </Link>
              <Link href="#" className="text-xs text-green-400 transition-colors hover:text-white">
                Refunds
              </Link>
            </div>
          </div>
          {/* Developer Attribution */}
          <div className="mt-2 text-center">
            <p className="text-xs text-green-500">
              Developed by <Link href="https://adnanthecoder.com" target="_blank" rel="noopener noreferrer" className="font-medium text-green-400 hover:text-white">Adnan</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer