"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaLeaf, 
  FaUsers, 
  FaStore, 
  FaShieldAlt,
  FaHeadset,
  FaComment,
  FaQuestionCircle,
  FaBug,
  FaLightbulb,
  FaHeart,
  FaSeedling,
  FaTree,
  FaGlobe,
  FaRocket,
  FaHandshake,
  FaCheckCircle,
  FaPaperPlane,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ContactUsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 2000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const contactOptions = [
    {
      icon: <FaHeadset className="text-3xl text-green-600" />,
      title: "Customer Support",
      description: "Get help with orders, returns, and account issues",
      contact: "support@plantomart.com",
      hours: "24/7 Available",
      color: "from-green-100 to-emerald-100",
      hoverColor: "hover:from-green-200 hover:to-emerald-200"
    },
    {
      icon: <FaStore className="text-3xl text-emerald-600" />,
      title: "Vendor Support",
      description: "Assistance with store setup and vendor tools",
      contact: "vendors@plantomart.com",
      hours: "Mon-Fri 9AM-6PM",
      color: "from-emerald-100 to-teal-100",
      hoverColor: "hover:from-emerald-200 hover:to-teal-200"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-teal-600" />,
      title: "Technical Support",
      description: "Platform issues and technical assistance",
      contact: "tech@plantomart.com",
      hours: "24/7 Available",
      color: "from-teal-100 to-cyan-100",
      hoverColor: "hover:from-teal-200 hover:to-cyan-200"
    },
    {
      icon: <FaHandshake className="text-3xl text-cyan-600" />,
      title: "Business Partnerships",
      description: "Collaborate and grow with PlantoMart",
      contact: "partnerships@plantomart.com",
      hours: "Mon-Fri 10AM-5PM",
      color: "from-cyan-100 to-blue-100",
      hoverColor: "hover:from-cyan-200 hover:to-blue-200"
    }
  ];

  const officeLocations = [
    {
      city: "Hyderabad",
      country: "India",
      address: "HITEC City, Cyberabad",
      timezone: "IST (UTC+5:30)",
      type: "Headquarters",
      icon: <FaGlobe className="text-2xl text-green-600" />
    },
    {
      city: "Bangalore",
      country: "India", 
      address: "Electronic City, Tech Park",
      timezone: "IST (UTC+5:30)",
      type: "Development Center",
      icon: <FaRocket className="text-2xl text-emerald-600" />
    },
    {
      city: "Remote",
      country: "Global",
      address: "Distributed Team",
      timezone: "All Timezones",
      type: "Virtual Office",
      icon: <FaUsers className="text-2xl text-teal-600" />
    }
  ];

  const categories = [
    { value: "", label: "Select a category" },
    { value: "general", label: "General Inquiry" },
    { value: "vendor", label: "Vendor Support" },
    { value: "customer", label: "Customer Support" },
    { value: "technical", label: "Technical Issue" },
    { value: "partnership", label: "Business Partnership" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "media", label: "Media & Press" }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -40, 0],
              x: [0, 30, 0],
              rotate: [0, 8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-48 h-48 bg-green-200 opacity-10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, 50, 0],
              x: [0, -25, 0],
              rotate: [0, -5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-60 right-20 w-36 h-36 bg-emerald-300 opacity-15 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              x: [0, 40, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-40 left-1/3 w-44 h-44 bg-teal-200 opacity-12 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, 35, 0],
              x: [0, -20, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-1/4 w-40 h-40 bg-cyan-200 opacity-10 rounded-full blur-3xl"
          />
        </div>

        {/* Hero Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -270 }}
                animate={{ scale: isVisible ? 1 : 0, rotate: isVisible ? 0 : -270 }}
                transition={{ delay: 0.3, duration: 1.2, type: "spring", bounce: 0.4 }}
                className="inline-block p-6 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-full mb-8 shadow-2xl"
              >
                <FaComment className="text-7xl text-green-600" />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-gray-800 mb-8"
              >
                <span className="text-green-600 relative">
                  Get in
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-green-400 to-emerald-400 opacity-30 rounded-full"
                  />
                </span>
                <br />
                <span className="text-emerald-600">Touch</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              >
                Have questions? Need support? Want to partner with us? 
                <br />
                We're here to help you grow your sustainable business journey.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Options */}
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
                How Can We <span className="text-green-600">Help?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the best way to reach our specialized support teams
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {contactOptions.map((option, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -8,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                  }}
                  className={`bg-gradient-to-br ${option.color} ${option.hoverColor} rounded-3xl p-8 shadow-xl border border-green-100 transition-all duration-300`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="mb-6"
                  >
                    {option.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{option.title}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{option.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-green-600" />
                      <span className="font-semibold text-gray-800">{option.contact}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaClock className="text-green-600" />
                      <span className="text-gray-700">{option.hours}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-green-100"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-block p-4 bg-green-100 rounded-full mb-4"
                  >
                    <FaPaperPlane className="text-3xl text-green-600" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Send us a Message</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours</p>
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 border border-green-300 rounded-2xl p-6 mb-6 text-center"
                  >
                    <FaCheckCircle className="text-3xl text-green-600 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-green-800 mb-2">Message Sent Successfully!</h4>
                    <p className="text-green-700">Thank you for reaching out. We'll respond soon!</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                        placeholder="Enter your full name"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                        placeholder="Enter your email"
                      />
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                      >
                        {categories.map((cat, index) => (
                          <option key={index} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                        placeholder="Brief subject line"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FaPaperPlane />
                        <span>Send Message</span>
                      </div>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Quick Contact */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                  <div className="flex items-center space-x-4 mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="p-3 bg-green-100 rounded-full"
                    >
                      <FaPhone className="text-2xl text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800">Quick Contact</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                      <FaPhone className="text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-800">Phone Support</div>
                        <div className="text-green-600">+91 9876 543 210</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl">
                      <FaEnvelope className="text-emerald-600" />
                      <div>
                        <div className="font-semibold text-gray-800">Email Support</div>
                        <div className="text-emerald-600">hello@plantomart.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-teal-50 rounded-xl">
                      <FaClock className="text-teal-600" />
                      <div>
                        <div className="font-semibold text-gray-800">Response Time</div>
                        <div className="text-teal-600">Within 24 Hours</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Connect With Us
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <FaTwitter />, name: "Twitter", color: "hover:bg-blue-500", link: "@plantomart" },
                      { icon: <FaLinkedin />, name: "LinkedIn", color: "hover:bg-blue-700", link: "PlantoMart" },
                      { icon: <FaInstagram />, name: "Instagram", color: "hover:bg-pink-500", link: "@plantomart" },
                      { icon: <FaGithub />, name: "GitHub", color: "hover:bg-gray-800", link: "PlantoMart" }
                    ].map((social, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, y: -3 }}
                        className={`bg-gray-100 ${social.color} hover:text-white rounded-xl p-4 text-center transition-all duration-300 cursor-pointer`}
                      >
                        <div className="text-2xl mb-2">{social.icon}</div>
                        <div className="text-sm font-semibold">{social.link}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
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
                Our <span className="text-green-600">Locations</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find us across India and our global remote network
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {officeLocations.map((location, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border border-green-100 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="mb-6"
                  >
                    {location.icon}
                  </motion.div>
                  <div className="text-sm font-bold text-green-600 mb-2">{location.type}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{location.city}</h3>
                  <div className="text-gray-600 mb-4">{location.country}</div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <FaMapMarkerAlt className="text-green-500" />
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <FaClock className="text-green-500" />
                      <span>{location.timezone}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Quick <span className="text-green-600">Help</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find instant answers to common questions
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { 
                  icon: <FaQuestionCircle className="text-3xl text-green-600" />, 
                  title: "General FAQ", 
                  desc: "Common questions about our platform",
                  gradient: "from-green-100 to-emerald-100"
                },
                { 
                  icon: <FaStore className="text-3xl text-emerald-600" />, 
                  title: "Vendor Guide", 
                  desc: "How to set up and manage your store",
                  gradient: "from-emerald-100 to-teal-100"
                },
                { 
                  icon: <FaUsers className="text-3xl text-teal-600" />, 
                  title: "Customer Help", 
                  desc: "Shopping, orders, and account support",
                  gradient: "from-teal-100 to-cyan-100"
                },
                { 
                  icon: <FaBug className="text-3xl text-cyan-600" />, 
                  title: "Report Issue", 
                  desc: "Technical problems and bug reports",
                  gradient: "from-cyan-100 to-blue-100"
                }
              ].map((help, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${help.gradient} rounded-2xl p-6 shadow-lg border border-green-100 text-center cursor-pointer transition-all duration-300`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="mb-4"
                  >
                    {help.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{help.title}</h3>
                  <p className="text-gray-600 text-sm">{help.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Support Statistics */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-green-100"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-block p-4 bg-white rounded-full mb-6 shadow-lg"
                >
                  <FaHeart className="text-4xl text-green-600" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Our Support <span className="text-green-600">Promise</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Committed to providing exceptional support to our community
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { 
                    metric: "< 2 hrs", 
                    label: "Average Response", 
                    icon: <FaClock />, 
                    color: "text-green-600",
                    bg: "bg-green-100"
                  },
                  { 
                    metric: "98%", 
                    label: "Issue Resolution", 
                    icon: <FaCheckCircle />, 
                    color: "text-emerald-600",
                    bg: "bg-emerald-100"
                  },
                  { 
                    metric: "4.9/5", 
                    label: "Support Rating", 
                    icon: <FaHeart />, 
                    color: "text-teal-600",
                    bg: "bg-teal-100"
                  },
                  { 
                    metric: "24/7", 
                    label: "Availability", 
                    icon: <FaHeadset />, 
                    color: "text-cyan-600",
                    bg: "bg-cyan-100"
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                      className={`inline-block p-3 ${stat.bg} rounded-full mb-4`}
                    >
                      <div className={`text-2xl ${stat.color}`}>{stat.icon}</div>
                    </motion.div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">{stat.metric}</div>
                    <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Chat Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-green-100 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-8"
              >
                <FaComment className="text-5xl text-green-600" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Need <span className="text-green-600">Immediate</span> Help?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Our live chat support is available 24/7 for urgent queries and real-time assistance
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: "Instant Responses", desc: "Get answers in real-time", icon: <FaRocket /> },
                  { title: "Expert Support", desc: "Talk to our specialists", icon: <FaUsers /> },
                  { title: "24/7 Available", desc: "We're always here to help", icon: <FaClock /> }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-2xl text-green-600 mb-3">{feature.icon}</div>
                    <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl"
              >
                <span className="flex items-center space-x-3">
                  <FaComment className="text-xl" />
                  <span>Start Live Chat</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-green-300 rounded-full"
                  />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>


        {/* Emergency Contact */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-l-4 border-red-400 shadow-lg"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <FaShieldAlt className="text-2xl text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Emergency Support</h3>
                    <p className="text-gray-600">For critical platform issues or security concerns</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
                >
                  Emergency Contact
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block p-6 bg-white bg-opacity-20 rounded-full mb-8"
              >
                <FaSeedling className="text-6xl text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Let's Grow <span className="text-green-200">Together</span>
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Whether you're starting your sustainable business journey or looking for eco-friendly products, 
                we're here to support you every step of the way.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { 
                    title: "50,000+", 
                    desc: "Happy Customers Served", 
                    icon: <FaUsers />,
                    gradient: "bg-green-500"
                  },
                  { 
                    title: "100+", 
                    desc: "Trusted Vendors", 
                    icon: <FaStore />,
                    gradient: "bg-emerald-500"
                  },
                  { 
                    title: "10,000+", 
                    desc: "Sustainable Products", 
                    icon: <FaLeaf />,
                    gradient: "bg-teal-500"
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-30"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.7, type: "spring" }}
                      className={`inline-block p-4 ${stat.gradient} text-white rounded-full mb-4`}
                    >
                      <div className="text-2xl">{stat.icon}</div>
                    </motion.div>
                    <div className="text-2xl font-bold text-white mb-2">{stat.title}</div>
                    <p className="text-green-100 text-sm">{stat.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                    y: -3
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-xl"
                >
                  <span className="flex items-center space-x-2">
                    <FaStore className="text-xl" />
                    <span>Join as Vendor</span>
                  </span>
                </motion.button>
                <motion.button
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 15px 35px rgba(255,255,255,0.3)",
                    y: -3
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <FaLeaf className="text-xl" />
                    <span>Start Shopping</span>
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactUsPage;