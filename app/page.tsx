"use client";

import About from "@/components/About";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Featured from "@/components/Featured";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <Navbar/>
      {/* Hero Section */}
      <Hero/>
      {/* Feature Categories */}
      <Features/>
      {/* About Section */}
      <About/>
      {/* Featured Products */}
      <Featured/>
      {/* Testimonials */}
      <Testimonials/>
      {/* Call to Action */}
      <CTA/>
      <FAQ/>
      {/* Footer */}
      <Footer/>
    </div>
  );
}