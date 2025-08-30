"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLeaf, 
  FaUsers, 
  FaShieldAlt, 
  FaMobileAlt, 
  FaChartLine, 
  FaStore,
  FaHeart,
  FaGlobe,
  FaAward,
  FaHandshake,
  FaRecycle,
  FaSeedling
} from 'react-icons/fa';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <FaStore className="text-4xl text-green-600" />,
      title: "Multi-Vendor Support",
      description: "Empowering vendors with easy store setup, product management, and custom storefronts."
    },
    {
      icon: <FaUsers className="text-4xl text-green-600" />,
      title: "Seamless Customer Experience",
      description: "Cross-vendor shopping cart, secure transactions, and comprehensive order tracking."
    },
    {
      icon: <FaChartLine className="text-4xl text-green-600" />,
      title: "Advanced Analytics",
      description: "Real-time insights, inventory management, and performance tracking for vendors."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-green-600" />,
      title: "Enterprise Security",
      description: "PCI-DSS compliance, data encryption, and fraud prevention systems."
    },
    {
      icon: <FaMobileAlt className="text-4xl text-green-600" />,
      title: "Mobile-First Design",
      description: "Fully responsive platform optimized for all devices and screen sizes."
    },
    {
      icon: <FaGlobe className="text-4xl text-green-600" />,
      title: "Scalable Architecture",
      description: "Cloud-optimized microservices architecture for high performance and reliability."
    }
  ];

  const benefits = [
    {
      icon: <FaHeart className="text-3xl text-green-500" />,
      title: "For Vendors",
      items: [
        "Increased reach to broad customer base",
        "Real-time analytics and insights",
        "Cost-effective infrastructure",
        "User-friendly management dashboard"
      ]
    },
    {
      icon: <FaHandshake className="text-3xl text-green-500" />,
      title: "For Customers",
      items: [
        "One-stop shopping experience",
        "Competitive pricing comparison",
        "Trustworthy customer reviews",
        "Unified cart and checkout"
      ]
    },
    {
      icon: <FaAward className="text-3xl text-green-500" />,
      title: "For Platform",
      items: [
        "Centralized control and management",
        "Multiple revenue streams",
        "Comprehensive user management",
        "Scalable growth potential"
      ]
    }
  ];


  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isVisible ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-block p-4 bg-green-100 rounded-full mb-6"
            >
              <FaSeedling className="text-6xl text-green-600" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
              About <span className="text-green-600">PlantoMart</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A robust, full-stack eCommerce platform built for multi-vendor operations, 
              bringing nature's best to your doorstep with sustainable living solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                PlantoMart is dedicated to creating a sustainable ecosystem where vendors can thrive, 
                customers can discover quality products, and everyone can contribute to a greener future. 
                We believe in the power of nature to transform lives and spaces.
              </p>
              <div className="flex items-center space-x-4">
                <FaRecycle className="text-3xl text-green-500" />
                <span className="text-lg font-semibold text-green-600">Eco-Friendly & Sustainable</span>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="relative">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
                    <div className="text-gray-600">Vendors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
                    <div className="text-gray-600">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
                    <div className="text-gray-600">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
                    <div className="text-gray-600">Uptime</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes PlantoMart the leading platform for sustainable commerce
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Benefits for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creating value for vendors, customers, and the platform ecosystem
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100"
              >
                <div className="mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <FaLeaf className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Green Revolution
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Whether you're a vendor looking to expand your reach or a customer seeking sustainable products, 
              PlantoMart is your gateway to a greener future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors duration-300"
              >
                Become a Vendor
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                Start Shopping
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default AboutPage;
