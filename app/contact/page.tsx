/** biome-ignore-all lint/a11y/noLabelWithoutControl: will look into while refactoring */
"use client";
import  { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Leaf, MessageCircle, Users, ShoppingBag } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    userType: 'customer',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const _handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for contacting us! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        userType: 'customer',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      color: "text-green-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["hello@plantomart.com", "support@plantomart.com"],
      color: "text-green-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: ["123 Garden Street", "Green Valley, CA 90210"],
      color: "text-green-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"],
      color: "text-green-600"
    }
  ];

  const supportCategories = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Customer Support",
      description: "Help with orders, returns, and general inquiries",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Vendor Support",
      description: "Assistance for vendors managing their stores",
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Plant Care",
      description: "Expert advice on plant care and gardening",
      color: "bg-lime-50 border-lime-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-lime-100 rounded-full opacity-35 animate-pulse delay-2000"></div>
      </div>

      {/* Header Section */}
      <div className="relative pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get in <span className="text-green-600">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're here to help you grow your green dreams. Whether you're a customer looking for the perfect plant 
            or a vendor wanting to join our marketplace, we'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Support Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {supportCategories.map((category, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: not required for this one
            <div key={index} className={`${category.color} border-2 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105`}>
              <div className="flex justify-center mb-4">
                <div className="text-green-600">
                  {category.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a *
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="potential-vendor">Potential Vendor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: not required here
                    <div key={index} className="flex items-start">
                    <div className={`${info.color} bg-green-50 p-3 rounded-lg mr-4 flex-shrink-0`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: not required here
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Help</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">For Customers</h4>
                  <p className="text-sm text-gray-600">Track orders, returns, plant care tips</p>
                </div>
                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">For Vendors</h4>
                  <p className="text-sm text-gray-600">Dashboard help, product listings, analytics</p>
                </div>
                <div className="bg-white bg-opacity-70 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">Join as Vendor</h4>
                  <p className="text-sm text-gray-600">Learn about our vendor program</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <Leaf className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Growing Together</h2>
          <p className="text-green-100 max-w-2xl mx-auto">
            Join thousands of plant lovers and vendors who trust Planto-Mart for their green journey. 
            We're committed to providing exceptional service and fostering a thriving plant community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;