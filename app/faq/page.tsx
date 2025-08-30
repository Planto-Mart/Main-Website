"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaLeaf, 
  FaStore, 
  FaUsers, 
  FaShieldAlt, 
  FaChartLine,
  FaMobileAlt,
  FaGlobe,
  FaRecycle,
  FaSeedling,
  FaQuestionCircle,
  FaCheckCircle,
  FaHeart,
  FaCreditCard,
  FaTruck,
  FaUserShield
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openItems, setOpenItems] = useState<number[]>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
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
        staggerChildren: 0.1
      }
    }
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <FaSeedling className="text-2xl text-green-600" />,
      color: "from-green-100 to-emerald-100",
      questions: [
        {
          question: "What is PlantoMart and how does it work?",
          answer: "PlantoMart is a robust, full-stack eCommerce platform designed for multi-vendor operations. It allows multiple vendors to create and manage their own online stores within a unified marketplace. Customers can browse products from various vendors, add items from different shops to a single cart, and enjoy a seamless checkout experience. Our platform focuses on sustainable products and green living solutions, connecting eco-conscious consumers with environmentally responsible vendors."
        },
        {
          question: "How do I create an account on PlantoMart?",
          answer: "Creating an account is simple! You can sign up using your email address or use Google OAuth for quick registration. We support both customer and vendor accounts. For vendors, after registration, you'll go through a quick verification process before you can start listing products. All user data is securely encrypted and protected with enterprise-grade security measures."
        },
        {
          question: "Is PlantoMart free to use?",
          answer: "For customers, browsing and shopping on PlantoMart is completely free. For vendors, we offer flexible pricing plans including transaction-based fees and subscription options. Our goal is to make it cost-effective for businesses of all sizes to join our green marketplace and reach over 50,000+ customers already on our platform."
        }
      ]
    },
    {
      title: "For Vendors",
      icon: <FaStore className="text-2xl text-green-600" />,
      color: "from-emerald-100 to-teal-100",
      questions: [
        {
          question: "How can I become a vendor on PlantoMart?",
          answer: "Becoming a vendor is easy! Click on 'Become a Vendor' button, complete the registration process, and provide necessary business documentation. Our team will review your application within 2-3 business days. Once approved, you'll get access to your personalized vendor dashboard where you can start listing products immediately. We support over 100+ vendors currently on our platform."
        },
        {
          question: "What tools are available in the vendor dashboard?",
          answer: "Our comprehensive vendor dashboard includes real-time analytics, inventory management, order tracking, customer communication tools, marketing features like discount codes and flash sales, and performance insights. You can customize your storefront, manage product listings, track sales metrics, and monitor customer reviews all in one place. The dashboard is mobile-responsive and optimized for efficiency."
        },
        {
          question: "How do I manage my inventory and track sales?",
          answer: "The vendor dashboard provides advanced inventory management with real-time stock tracking, low-stock alerts, and automated reorder suggestions. Sales analytics include revenue tracking, customer demographics, conversion rates, and performance comparisons. You can export reports, set up automated notifications, and use our predictive analytics to optimize your product offerings."
        },
        {
          question: "What are the commission rates and payment terms?",
          answer: "We offer competitive commission rates that vary based on product categories and vendor tier. Payments are processed securely through Razorpay and transferred to vendors on a weekly basis. All transactions are PCI-DSS compliant, and we provide detailed transaction reports for your accounting needs. There are no hidden fees, and we're transparent about all charges."
        }
      ]
    },
    {
      title: "For Customers",
      icon: <FaUsers className="text-2xl text-green-600" />,
      color: "from-teal-100 to-cyan-100",
      questions: [
        {
          question: "How do I search and filter products effectively?",
          answer: "Our advanced search system allows you to filter by vendor, price range, ratings, product categories, eco-friendly certifications, and more. You can compare products from different vendors side-by-side, read authentic customer reviews, and use our recommendation engine to discover new sustainable products that match your preferences."
        },
        {
          question: "Can I buy from multiple vendors in one order?",
          answer: "Absolutely! Our cross-vendor shopping cart allows you to add products from different vendors and checkout in a single transaction. The system automatically calculates shipping from different vendors and provides you with tracking information for each part of your order. This unified experience makes shopping convenient while supporting multiple small businesses."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, net banking, UPI, and digital wallets through our secure Razorpay integration. All payments are encrypted and processed with bank-level security. We also offer EMI options for larger purchases and support international payments for global customers."
        },
        {
          question: "How can I track my orders?",
          answer: "Once your order is placed, you'll receive a tracking number via email and SMS. You can track your order in real-time through your customer dashboard or the tracking link. Since orders may come from multiple vendors, each item will have its own tracking information. We provide updates at every step until delivery."
        }
      ]
    },
    {
      title: "Technical & Security",
      icon: <FaShieldAlt className="text-2xl text-green-600" />,
      color: "from-blue-100 to-indigo-100",
      questions: [
        {
          question: "How secure is my data on PlantoMart?",
          answer: "Security is our top priority. We use enterprise-grade encryption, PCI-DSS compliance for payments, multi-factor authentication, and fraud prevention systems. All data is encrypted both in transit and at rest. Our platform is built with Supabase for robust database security and deployed on Cloudflare for additional protection against cyber threats."
        },
        {
          question: "What technologies power PlantoMart?",
          answer: "PlantoMart is built with modern technologies including Next.js, TypeScript, Tailwind CSS, Supabase for database and authentication, Razorpay for payments, and Google OAuth. We use a microservices architecture deployed on Cloudflare for 99.9% uptime, ensuring fast, reliable performance across all devices."
        },
        {
          question: "Is the platform mobile-friendly?",
          answer: "Yes! PlantoMart features a mobile-first design that's fully responsive across all devices. Whether you're a vendor managing your store or a customer shopping, you'll have a seamless experience on smartphones, tablets, and desktops. Our progressive web app capabilities ensure fast loading times even on slower connections."
        },
        {
          question: "How do you handle disputes and customer support?",
          answer: "We have a comprehensive dispute resolution system with dedicated customer support. Issues are tracked through our admin panel, and we facilitate communication between vendors and customers. Our support team is available via email, chat, and phone. We maintain strict quality standards and have clear policies for returns, refunds, and vendor accountability."
        }
      ]
    },
    {
      title: "Platform Features",
      icon: <FaGlobe className="text-2xl text-green-600" />,
      color: "from-purple-100 to-pink-100",
      questions: [
        {
          question: "What makes PlantoMart different from other marketplaces?",
          answer: "PlantoMart specializes in sustainable and eco-friendly products with a focus on plants and green living. We offer advanced analytics for vendors, a unified shopping experience across multiple stores, and robust technical infrastructure. Our platform supports over 10,000+ products from 100+ vendors while maintaining 99.9% uptime and enterprise-level security."
        },
        {
          question: "How does the review and rating system work?",
          answer: "Customers can leave detailed reviews and ratings for products after purchase. Reviews are verified to ensure authenticity, and vendors can respond to feedback. The rating system helps other customers make informed decisions and helps vendors improve their products and services. All reviews are moderated to maintain quality standards."
        },
        {
          question: "Can vendors customize their storefronts?",
          answer: "Yes! Each vendor gets a personalized storefront with customization options for layout, branding, and product presentation. Vendors can upload their logo, customize colors, organize product categories, and create featured product sections. The customization tools are user-friendly and don't require technical expertise."
        },
        {
          question: "What analytics and insights are available?",
          answer: "Our platform provides comprehensive analytics including sales metrics, customer behavior insights, inventory tracking, conversion rates, and performance comparisons. Vendors get real-time dashboards with actionable insights, while admins have platform-wide analytics. All data is presented in easy-to-understand visualizations and can be exported for further analysis."
        }
      ]
    }
  ];

  const stats = [
    { number: "100+", label: "Trusted Vendors", icon: <FaStore /> },
    { number: "10K+", label: "Green Products", icon: <FaLeaf /> },
    { number: "50K+", label: "Happy Customers", icon: <FaHeart /> },
    { number: "99.9%", label: "Platform Uptime", icon: <FaCheckCircle /> }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-32 h-32 bg-green-200 opacity-20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-24 h-24 bg-emerald-300 opacity-20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 3, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-200 opacity-20 rounded-full blur-xl"
          />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: isVisible ? 1 : 0, rotate: isVisible ? 0 : -180 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="inline-block p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6 shadow-lg"
              >
                <FaQuestionCircle className="text-6xl text-green-600" />
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-gray-800 mb-6"
              >
                <span className="text-green-600">Frequently</span> Asked
                <br />
                <span className="relative inline-block">
                  Questions
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="absolute bottom-2 left-0 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-30"
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              >
                Everything you need to know about our sustainable eCommerce platform
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="text-3xl text-green-600 mb-3 flex justify-center"
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-3xl font-bold text-gray-800 mb-2"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Find Your <span className="text-green-600">Answers</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Browse through our comprehensive FAQ sections organized by topic
              </p>
            </motion.div>

            <div className="space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-green-100"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6`}>
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-3 bg-white rounded-full shadow-md"
                      >
                        {category.icon}
                      </motion.div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="p-6">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 10 + faqIndex;
                      const isOpen = openItems.includes(globalIndex);
                      
                      return (
                        <motion.div
                          key={faqIndex}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: faqIndex * 0.1 }}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <motion.button
                            onClick={() => toggleItem(globalIndex)}
                            className="w-full py-6 flex items-center justify-between text-left hover:bg-green-50 transition-colors duration-300 rounded-lg px-4"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-lg md:text-xl font-semibold text-gray-800 pr-4">
                              {faq.question}
                            </span>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex-shrink-0"
                            >
                              <FaChevronDown className="text-green-600 text-xl" />
                            </motion.div>
                          </motion.button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  initial={{ y: -10 }}
                                  animate={{ y: 0 }}
                                  className="px-4 pb-6"
                                >
                                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-400">
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Help Section */}
        <section className="py-20 bg-gradient-to-br from-green-100 to-emerald-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-block p-4 bg-green-100 rounded-full mb-6"
                >
                  <FaHeart className="text-4xl text-green-600" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our dedicated support team is here to help you with any additional questions about PlantoMart
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
                >
                  <FaUsers className="text-3xl text-green-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Customer Support</h3>
                  <p className="text-gray-600 mb-4">Get help with orders, returns, and account issues</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors"
                  >
                    Contact Support
                  </motion.button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
                >
                  <FaStore className="text-3xl text-emerald-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Vendor Assistance</h3>
                  <p className="text-gray-600 mb-4">Help with store setup, product listing, and sales</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Vendor Help
                  </motion.button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100"
                >
                  <FaUserShield className="text-3xl text-teal-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Technical Support</h3>
                  <p className="text-gray-600 mb-4">Platform issues, security, and technical queries</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Tech Help
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platform Benefits Highlight */}
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
                Why Choose <span className="text-green-600">PlantoMart</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built with cutting-edge technology for a sustainable future
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
                { icon: <FaRecycle />, title: "Eco-Friendly", desc: "Sustainable products only" },
                { icon: <FaShieldAlt />, title: "Secure", desc: "Enterprise-grade security" },
                { icon: <FaMobileAlt />, title: "Mobile-First", desc: "Optimized for all devices" },
                { icon: <FaChartLine />, title: "Analytics", desc: "Real-time insights" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100 shadow-lg"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    className="text-4xl text-green-600 mb-4"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
          {/* Animated Background Elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 left-10 w-32 h-32 border-2 border-white opacity-10 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white opacity-10 rounded-full"
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block p-4 bg-white bg-opacity-20 rounded-full mb-6"
              >
                <FaSeedling className="text-5xl text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Join Our Green Community?
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Whether you're a vendor ready to grow your sustainable business or a customer 
                looking for eco-friendly products, PlantoMart is your gateway to a greener future.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <FaStore className="text-xl" />
                    <span>Become a Vendor</span>
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <FaLeaf className="text-xl" />
                    <span>Start Shopping</span>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default FAQPage;