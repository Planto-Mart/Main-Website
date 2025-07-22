"use client";
import About from "@/components/home/About";
import CTA from "@/components/home/CTA";
import FAQ from "@/components/home/FAQ";
import Featured from "@/components/home/Featured";
import Features from "@/components/home/Categories_Featured";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/home/Testimonials";
import Hero from "@/components/home/Hero";
// import Hero from "@/components/home/Hero-with-backend"; 
// // can use idb-kevyal even for caching images and all

export default function Home() {
  return (
    // <div className="min-h-screen overflow-hidden bg-gradient-to-b from-green-50 to-white">
    <>
      <Navbar/>
      {/* Hero Section */}
      {/* <Hero/> */}
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
    {/* </div> */}
    </>
  );
}