"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSeedling, 
  FaLeaf, 
  FaStore, 
  FaUsers, 
  FaGlobe, 
  FaChartLine,
  FaAward,
  FaRocket,
  FaHandshake,
  FaHeart,
  FaTree,
  FaRecycle,
  FaShieldAlt,
  FaMobileAlt,
  FaLightbulb,
  FaGem,
  FaCrown,
  FaCheckCircle
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OurHistoryPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);

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

  const timelineEvents = [
    {
      year: "2019",
      title: "The Seed of an Idea",
      subtitle: "Founding Vision",
      icon: <FaSeedling className="text-3xl" />,
      description: "PlantoMart was conceived by founder Adnan with a simple yet powerful vision: to create a sustainable marketplace that connects eco-conscious consumers with green vendors. Starting as a small project to promote plant-based products and sustainable living.",
      achievements: ["Initial concept development", "Market research completed", "First prototype built"],
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      year: "2020",
      title: "Digital Roots Take Hold",
      subtitle: "Platform Development",
      icon: <FaLightbulb className="text-3xl" />,
      description: "During the global shift towards digital commerce, we began developing our robust multi-vendor platform. The team focused on creating a user-friendly interface that would revolutionize how people shop for sustainable products online.",
      achievements: ["Core platform architecture designed", "First vendor partnerships established", "Beta testing with 10 vendors"],
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      year: "2021",
      title: "Growing Our Garden",
      subtitle: "Platform Launch",
      icon: <FaLeaf className="text-3xl" />,
      description: "PlantoMart officially launched with 25 carefully selected vendors offering over 500 sustainable products. We implemented advanced features like cross-vendor shopping carts, real-time analytics, and secure payment processing.",
      achievements: ["Official platform launch", "25+ vendors onboarded", "500+ products listed", "First 1,000 customers"],
      color: "from-teal-400 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50"
    },
    {
      year: "2022",
      title: "Branching Out",
      subtitle: "Feature Expansion",
      icon: <FaStore className="text-3xl" />,
      description: "We expanded our platform with advanced vendor tools, mobile optimization, and enhanced security features. The introduction of our comprehensive analytics dashboard helped vendors grow their businesses significantly.",
      achievements: ["Mobile-first redesign", "Advanced analytics launched", "50+ vendors joined", "5,000+ active customers"],
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50"
    },
    {
      year: "2023",
      title: "Flourishing Ecosystem",
      subtitle: "Market Leadership",
      icon: <FaUsers className="text-3xl" />,
      description: "PlantoMart became a leading sustainable marketplace with enhanced vendor support, customer experience improvements, and enterprise-grade security. We introduced innovative features like AI-powered recommendations and automated inventory management.",
      achievements: ["75+ vendors partnership", "10,000+ products catalog", "25,000+ satisfied customers", "99.9% platform uptime achieved"],
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      year: "2024",
      title: "Reaching New Heights",
      subtitle: "Global Expansion",
      icon: <FaGlobe className="text-3xl" />,
      description: "We expanded our reach globally while maintaining our commitment to sustainability. Advanced features like multi-currency support, international shipping, and localized vendor dashboards were implemented.",
      achievements: ["100+ trusted vendors", "15,000+ green products", "40,000+ global customers", "Multiple payment gateways integrated"],
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50"
    },
    {
      year: "2025",
      title: "Sustainable Future",
      subtitle: "Innovation Continues",
      icon: <FaCrown className="text-3xl" />,
      description: "Today, PlantoMart stands as a testament to sustainable commerce with over 50,000 customers and a thriving ecosystem of eco-friendly vendors. We continue to innovate with AI-driven features, carbon footprint tracking, and advanced sustainability metrics.",
      achievements: ["50,000+ happy customers", "Industry recognition received", "Carbon-neutral marketplace", "Next-gen features launched"],
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    }
  ];

  const milestones = [
    { icon: <FaRocket />, title: "Platform Launch", description: "Official marketplace launch", year: "2021" },
    { icon: <FaAward />, title: "First 1K Users", description: "Reached our first milestone", year: "2021" },
    { icon: <FaGem />, title: "Mobile App", description: "Mobile-first redesign", year: "2022" },
    { icon: <FaShieldAlt />, title: "Security Certification", description: "PCI-DSS compliance achieved", year: "2023" },
    { icon: <FaGlobe />, title: "Global Reach", description: "International expansion", year: "2024" },
    { icon: <FaHeart />, title: "50K Customers", description: "Community milestone", year: "2025" }
  ];

  const values = [
    {
      icon: <FaRecycle className="text-4xl text-green-600" />,
      title: "Sustainability First",
      description: "Every decision we make prioritizes environmental impact and sustainable practices.",
      gradient: "from-green-100 to-emerald-100"
    },
    {
      icon: <FaHandshake className="text-4xl text-emerald-600" />,
      title: "Community Driven",
      description: "Building strong relationships between vendors and customers in our green ecosystem.",
      gradient: "from-emerald-100 to-teal-100"
    },
    {
      icon: <FaLightbulb className="text-4xl text-teal-600" />,
      title: "Innovation",
      description: "Constantly evolving our platform with cutting-edge technology and user-centric features.",
      gradient: "from-teal-100 to-cyan-100"
    },
    {
      icon: <FaHeart className="text-4xl text-cyan-600" />,
      title: "Customer Care",
      description: "Putting our customers and vendors first in everything we do, ensuring success for all.",
      gradient: "from-cyan-100 to-blue-100"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-40 h-40 bg-green-200 opacity-10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, 40, 0],
              x: [0, -15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-60 right-20 w-32 h-32 bg-emerald-300 opacity-15 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              x: [0, 25, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-40 left-1/4 w-36 h-36 bg-teal-200 opacity-10 rounded-full blur-3xl"
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
                initial={{ scale: 0, rotate: -360 }}
                animate={{ scale: isVisible ? 1 : 0, rotate: isVisible ? 0 : -360 }}
                transition={{ delay: 0.3, duration: 1, type: "spring", bounce: 0.5 }}
                className="inline-block p-6 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-full mb-8 shadow-2xl"
              >
                <FaTree className="text-7xl text-green-600" />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-gray-800 mb-8"
              >
                Our <span className="text-green-600 relative">
                  Journey
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-green-400 to-emerald-400 opacity-30 rounded-full"
                  />
                </span>
                <br />
                <span className="text-emerald-600">to Sustainability</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              >
                From a simple idea to a thriving ecosystem of 100+ vendors and 50,000+ customers, 
                discover how we're revolutionizing sustainable commerce one green step at a time.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
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
                Our <span className="text-green-600">Growth Story</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow our evolution from startup to sustainable marketplace leader
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-green-400 via-emerald-400 to-teal-400 rounded-full hidden md:block" style={{ height: `${timelineEvents.length * 300}px` }} />
              
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className={`relative mb-16 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'}`}
                >
                  {/* Timeline Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                    className={`absolute top-8 w-16 h-16 bg-gradient-to-br ${event.color} rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10 hidden md:flex ${
                      index % 2 === 0 ? 'right-0 transform translate-x-1/2' : 'left-0 transform -translate-x-1/2'
                    }`}
                  >
                    <div className="text-white">
                      {event.icon}
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`bg-gradient-to-br ${event.bgColor} rounded-3xl p-8 shadow-xl border border-opacity-20 ${
                      index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                    }`}
                  >
                    <div className="flex items-center space-x-4 mb-6 md:hidden">
                      <div className={`p-3 bg-gradient-to-br ${event.color} rounded-full text-white`}>
                        {event.icon}
                      </div>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${event.color} bg-clip-text text-transparent`}>
                        {event.year}
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div className={`text-4xl font-bold bg-gradient-to-r ${event.color} bg-clip-text text-transparent mb-2`}>
                        {event.year}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {event.title}
                    </h3>
                    <div className="text-lg text-green-600 font-semibold mb-4">
                      {event.subtitle}
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {event.description}
                    </p>

                    <div className="space-y-3">
                      {event.achievements.map((achievement, achIndex) => (
                        <motion.div
                          key={achIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + achIndex * 0.1 + 0.8 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-600 font-medium">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones Section */}
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
                Key <span className="text-green-600">Milestones</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Celebrating the achievements that shaped our journey
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="inline-block p-4 bg-green-100 rounded-full mb-6"
                  >
                    <div className="text-3xl text-green-600">
                      {milestone.icon}
                    </div>
                  </motion.div>
                  <div className="text-2xl font-bold text-green-600 mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
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
                Our Core <span className="text-green-600">Values</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide every decision and drive our mission forward
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className={`bg-gradient-to-br ${value.gradient} rounded-3xl p-8 border border-green-100 shadow-lg`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2, type: "spring" }}
                    className="mb-6"
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Evolution */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Our <span className="text-green-600">Impact</span> Today
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Numbers that showcase our commitment to sustainable commerce
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { number: "100+", label: "Verified Vendors", icon: <FaStore />, color: "text-green-600" },
                { number: "10K+", label: "Eco Products", icon: <FaLeaf />, color: "text-emerald-600" },
                { number: "50K+", label: "Happy Customers", icon: <FaUsers />, color: "text-teal-600" },
                { number: "99.9%", label: "Platform Uptime", icon: <FaChartLine />, color: "text-cyan-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg border border-green-100"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className={`text-4xl mb-4 ${stat.color}`}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Future Vision */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
          {/* Animated Background */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 left-0 w-full h-full opacity-10"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 border-4 border-white rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-4 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-full" />
          </motion.div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", duration: 1 }}
                className="inline-block p-6 bg-white bg-opacity-20 rounded-full mb-8"
              >
                <FaRocket className="text-6xl text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                The Future is <span className="text-green-200">Green</span>
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                As we look ahead, PlantoMart continues to innovate with AI-powered sustainability metrics, 
                carbon footprint tracking, and revolutionary features that make eco-friendly shopping 
                the easiest choice for everyone.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { title: "AI Recommendations", desc: "Smart product suggestions", icon: <FaLightbulb /> },
                  { title: "Carbon Tracking", desc: "Environmental impact metrics", icon: <FaRecycle /> },
                  { title: "Global Expansion", desc: "Worldwide sustainable marketplace", icon: <FaGlobe /> }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20"
                  >
                    <div className="text-3xl text-white mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-green-100">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-xl"
                >
                  <span className="flex items-center space-x-2">
                    <FaHeart className="text-xl" />
                    <span>Join Our Mission</span>
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <FaTree className="text-xl" />
                    <span>Explore Platform</span>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Development Journey */}
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
                Development <span className="text-green-600">Philosophy</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                How we built a platform that scales with purpose
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={fadeInUp}>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Modular & Scalable Architecture
                </h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Built with microservices architecture and modern web technologies, PlantoMart 
                  can handle everything from small local vendors to enterprise-level operations. 
                  Our cloud-optimized infrastructure ensures 99.9% uptime and lightning-fast performance.
                </p>
                <div className="space-y-4">
                  {[
                    "Microservices-based architecture for independent scaling",
                    "Cloud-optimized deployment on Cloudflare",
                    "Real-time data synchronization across all components",
                    "Enterprise-grade security with PCI-DSS compliance"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="p-1 bg-green-100 rounded-full mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="relative"
              >
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-xl">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Platform Evolution</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { phase: "MVP Development", progress: 100, year: "2020" },
                      { phase: "Multi-Vendor Integration", progress: 100, year: "2021" },
                      { phase: "Mobile Optimization", progress: 100, year: "2022" },
                      { phase: "AI Features", progress: 85, year: "2024" },
                      { phase: "Global Expansion", progress: 70, year: "2025" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-800">{item.phase}</span>
                          <span className="text-green-600 font-bold">{item.year}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full relative overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="absolute top-0 left-0 w-full h-full bg-white opacity-30"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Community Impact */}
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
                Community <span className="text-green-600">Impact</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Creating positive change through sustainable commerce
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <FaTree className="text-5xl text-green-600" />,
                  title: "Environmental Impact",
                  metrics: ["10,000+ Trees Planted", "50% Carbon Reduction", "100% Eco Products"],
                  gradient: "from-green-100 to-emerald-100"
                },
                {
                  icon: <FaHandshake className="text-5xl text-emerald-600" />,
                  title: "Vendor Success",
                  metrics: ["100+ Small Businesses", "300% Average Growth", "$2M+ Revenue Generated"],
                  gradient: "from-emerald-100 to-teal-100"
                },
                {
                  icon: <FaHeart className="text-5xl text-teal-600" />,
                  title: "Customer Satisfaction",
                  metrics: ["4.9/5 Average Rating", "95% Return Rate", "24/7 Support"],
                  gradient: "from-teal-100 to-cyan-100"
                }
              ].map((impact, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`bg-gradient-to-br ${impact.gradient} rounded-3xl p-8 shadow-xl border border-green-100`}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2, type: "spring" }}
                    className="mb-6 text-center"
                  >
                    {impact.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{impact.title}</h3>
                  <div className="space-y-4">
                    {impact.metrics.map((metric, metricIndex) => (
                      <motion.div
                        key={metricIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + metricIndex * 0.1 + 0.5 }}
                        className="bg-white bg-opacity-50 rounded-lg p-4 text-center"
                      >
                        <div className="font-bold text-gray-800">{metric}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Looking Ahead */}
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
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6"
                >
                  <FaGem className="text-5xl text-green-600" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  What's <span className="text-green-600">Next?</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Our roadmap for the future of sustainable commerce
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "AR Product Visualization",
                    description: "See plants in your space before buying",
                    timeline: "Q2 2025",
                    icon: <FaMobileAlt />,
                    color: "from-green-400 to-emerald-500"
                  },
                  {
                    title: "Blockchain Transparency",
                    description: "Supply chain tracking with blockchain",
                    timeline: "Q3 2025",
                    icon: <FaShieldAlt />,
                    color: "from-emerald-400 to-teal-500"
                  },
                  {
                    title: "AI Sustainability Coach",
                    description: "Personal eco-friendly shopping assistant",
                    timeline: "Q4 2025",
                    icon: <FaLightbulb />,
                    color: "from-teal-400 to-cyan-500"
                  },
                  {
                    title: "Global Marketplace",
                    description: "Worldwide vendor and customer network",
                    timeline: "2026",
                    icon: <FaGlobe />,
                    color: "from-cyan-400 to-blue-500"
                  }
                ].map((roadmap, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                      className={`inline-block p-4 bg-gradient-to-br ${roadmap.color} text-white rounded-full mb-4`}
                    >
                      <div className="text-2xl">{roadmap.icon}</div>
                    </motion.div>
                    <div className="text-sm font-bold text-green-600 mb-2">{roadmap.timeline}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">{roadmap.title}</h3>
                    <p className="text-gray-600 text-sm">{roadmap.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
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
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block p-6 bg-white bg-opacity-20 rounded-full mb-8"
              >
                <FaSeedling className="text-6xl text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Be Part of Our <span className="text-green-200">Growing Story</span>
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands of vendors and customers who are already making a difference. 
                Together, we're building a more sustainable future, one transaction at a time.
              </p>
              
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-xl"
                >
                  <span className="flex items-center space-x-2">
                    <FaStore className="text-xl" />
                    <span>Start Your Store</span>
                  </span>
                </motion.button>
                <motion.button
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <FaLeaf className="text-xl" />
                    <span>Shop Sustainably</span>
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

export default OurHistoryPage;