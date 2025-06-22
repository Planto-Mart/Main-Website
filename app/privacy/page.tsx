"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    introduction: true,
    dataCollection: true,
    dataPurpose: true,
    consent: true,
    dataRetention: true,
    thirdParty: true,
    userRights: true,
    changes: true,
    contact: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-16">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center text-green-700 hover:text-green-600">
              <ArrowLeft className="mr-2 size-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
          </div>
          <p className="mt-2 text-gray-500">Last Updated: May 19, 2025</p>
        </div>
      </header>
      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Introduction Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("introduction")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">1. Introduction</h2>
              {expandedSections.introduction ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.introduction && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  Welcome to PlantoMart, a robust, full-stack eCommerce platform built for multi-vendor operations. At PlantoMart,
                  we are committed to protecting your privacy and ensuring the security of your personal information.
                </p>
                <p className="mb-4 text-gray-600">
                  This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to
                  safeguard your data. By using PlantoMart, you agree to the collection and use of information in accordance with
                  this policy.
                </p>
                <p className="text-gray-600">
                  PlantoMart allows multiple vendors to create and manage their own online stores within a unified marketplace. Our
                  platform is built with scalability, security, and ease of use in mind, enabling a wide range of businesses to set
                  up their online presence, sell products, and track performance while maintaining the highest standards of data
                  privacy.
                </p>
              </div>
            )}
          </section>
          {/* Data Collection Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("dataCollection")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">2. Data Collection</h2>
              {expandedSections.dataCollection ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.dataCollection && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  To provide and improve our services, we collect various types of information from our users. The data collection
                  process is transparent, and you have control over what information you share with us.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">2.1 Information Automatically Collected Upon Login</h3>
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>IP Address</li>
                    <li>Hostname</li>
                    <li>City, Region, Country</li>
                    <li>Location (Coordinates)</li>
                    <li>Organization</li>
                    <li>Postal Code</li>
                    <li>Timezone</li>
                  </ul>
                </div>
                <h3 className="mb-3 text-lg font-medium text-gray-800">2.2 Information Collected During Sign-up</h3>
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Full Name</li>
                    <li>Avatar URL (if provided)</li>
                    <li>Phone Number</li>
                    <li>Email Address</li>
                  </ul>
                </div>
                <h3 className="mb-3 text-lg font-medium text-gray-800">2.3 Additional Information for Vendors</h3>
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Business Name</li>
                    <li>Business Address</li>
                    <li>Tax Information</li>
                    <li>Banking Details for Payments</li>
                  </ul>
                </div>
                <h3 className="mb-3 text-lg font-medium text-gray-800">2.4 Transaction and Order Information</h3>
                <p className="mb-4 text-gray-600">
                  When you make a purchase on PlantoMart, we collect information necessary to process your transaction, including
                  payment details, billing and shipping addresses, items purchased, and order history.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">2.5 Cookies and Tracking Technologies</h3>
                <p className="text-gray-600">
                  PlantoMart uses cookies and similar tracking technologies to track activity on our platform and hold certain
                  information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You
                  can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>
            )}
          </section>
          {/* Purpose of Data Collection Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("dataPurpose")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">3. Purpose of Data Collection</h2>
              {expandedSections.dataPurpose ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.dataPurpose && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  We collect and use your information for various purposes to provide, maintain, and improve our services to you.
                  These purposes include:
                </p>
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-gray-800">3.1 Platform Operation and Improvement</h3>
                    <p className="text-gray-600">
                      To ensure the seamless operation of the PlantoMart platform, including processing transactions, fulfilling orders,
                      resolving disputes, and providing customer support.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-gray-800">3.2 Fraud Prevention and Security</h3>
                    <p className="text-gray-600">
                      To protect the PlantoMart platform, our users, and the public by detecting and preventing fraud, unauthorized
                      activities, and access to our services, as well as enforcing our terms and policies.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-gray-800">3.3 Personalization and User Experience</h3>
                    <p className="text-gray-600">
                      To personalize your experience, deliver content and product offerings most relevant to you, and improve the
                      overall usability of our platform.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-gray-800">3.4 Communication</h3>
                    <p className="text-gray-600">
                      To communicate with you about your account, orders, transactions, and platform updates. We may also send you
                      promotional communications about products, services, offers, and events offered by PlantoMart or our partners.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-gray-800">3.5 Legal Compliance</h3>
                    <p className="text-gray-600">
                      To comply with applicable laws, regulations, legal processes, or governmental requests, including for tax
                      reporting purposes where required.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-gray-800">3.6 Analytics and Research</h3>
                    <p className="text-gray-600">
                      To conduct research and analytics to better understand how users access and use our platform, so we can improve
                      our services and develop new features and functionality.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
          {/* User Consent & Opt-Out Options Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("consent")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">4. User Consent & Opt-Out Options</h2>
              {expandedSections.consent ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.consent && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  PlantoMart is committed to transparency and giving users control over their data. We obtain your consent for data
                  collection and provide clear options to manage your privacy preferences.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">4.1 Express Consent</h3>
                <p className="mb-4 text-gray-600">
                  When you sign up for PlantoMart, you will be presented with a checkbox to explicitly agree to our data collection
                  practices as outlined in this Privacy Policy. This checkbox is not pre-selected, ensuring that your consent is
                  active and intentional.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">4.2 Opt-Out Mechanism</h3>
                <p className="mb-4 text-gray-600">
                  If you choose to opt out during the sign-up process, we will only collect and store the minimum information necessary
                  for the basic functioning of your account. This includes your name, email address, and essential account security
                  information.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">4.3 Updating Your Preferences</h3>
                <p className="mb-4 text-gray-600">
                  You can review and update your data collection preferences at any time through your account settings. Changes to your
                  preferences will be applied going forward, but may not affect information already collected.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">4.4 Marketing Communications</h3>
                <p className="mb-4 text-gray-600">
                  You can opt out of receiving marketing communications from us by clicking the "unsubscribe" link in our emails or
                  by updating your communication preferences in your account settings. Even if you opt out of marketing communications,
                  we may still send you service-related communications.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">4.5 Cookie Management</h3>
                <p className="text-gray-600">
                  Our platform uses a cookie banner that allows you to manage your cookie preferences. You can choose to accept all
                  cookies, only essential cookies, or customize your cookie preferences. Additionally, most web browsers provide
                  settings that allow you to control cookies at the browser level.
                </p>
              </div>
            )}
          </section>
          {/* Data Retention & Security Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("dataRetention")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">5. Data Retention & Security</h2>
              {expandedSections.dataRetention ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.dataRetention && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  PlantoMart takes data security seriously and employs industry-standard practices to protect your information from
                  unauthorized access, disclosure, alteration, and destruction.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">5.1 Data Retention Period</h3>
                <p className="mb-4 text-gray-600">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
                  unless a longer retention period is required or permitted by law. For example:
                </p>
                <ul className="mb-4 list-disc space-y-2 pl-5 text-gray-600">
                  <li>Account information is retained for as long as your account is active.</li>
                  <li>Transaction data is kept for a minimum of 7 years for tax, accounting, and legal compliance purposes.</li>
                  <li>
                    Login and device information is typically retained for 90 days for security and fraud prevention purposes.
                  </li>
                </ul>
                <p className="mb-4 text-gray-600">
                  When your data is no longer needed for the purposes specified, we will securely delete or anonymize it.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">5.2 Security Measures</h3>
                <p className="mb-4 text-gray-600">
                  To protect your personal information, we implement a variety of security measures, including:
                </p>
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Encryption of data in transit and at rest using industry-standard TLS and AES encryption.</li>
                    <li>Regular security assessments and penetration testing of our systems.</li>
                    <li>Strict access controls and authentication procedures for our staff.</li>
                    <li>
                      Regular security training for employees with access to personal data.
                    </li>
                    <li>Physical security measures at our data centers.</li>
                    <li>Continuous monitoring for suspicious activities and unauthorized access attempts.</li>
                  </ul>
                </div>
                <h3 className="mb-3 text-lg font-medium text-gray-800">5.3 Data Breach Procedures</h3>
                <p className="mb-4 text-gray-600">
                  In the event of a data breach that compromises your personal information, we will notify you and the appropriate
                  regulatory authorities without undue delay, as required by applicable law. This notification will include information
                  about the breach, the data affected, and steps you can take to protect yourself.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">5.4 Payment Information</h3>
                <p className="text-gray-600">
                  PlantoMart adheres to PCI-DSS requirements for handling credit card information. We do not store complete credit
                  card information on our servers. Payment processing is handled by secure, PCI-compliant third-party payment processors.
                </p>
              </div>
            )}
          </section>
          {/* Third-Party Sharing & Data Usage Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("thirdParty")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">6. Third-Party Sharing & Data Usage</h2>
              {expandedSections.thirdParty ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.thirdParty && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  PlantoMart may share your information with third parties in certain circumstances. We're committed to transparency
                  about when and why your data is shared.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">6.1 Vendors and Service Providers</h3>
                <p className="mb-4 text-gray-600">
                  We may share your personal information with vendors, service providers, and other third parties who perform services
                  on our behalf, such as:
                </p>
                <ul className="mb-4 list-disc space-y-2 pl-5 text-gray-600">
                  <li>Payment processors to process transactions and payments</li>
                  <li>Cloud hosting providers to store our data</li>
                  <li>Analytics providers to help us understand platform usage</li>
                  <li>Customer service providers to assist with inquiries</li>
                  <li>Email service providers to send communications</li>
                </ul>
                <p className="mb-4 text-gray-600">
                  These third parties are only permitted to use your information as necessary to provide services to us and are required
                  to maintain the confidentiality and security of your data.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">6.2 Marketplace Sellers</h3>
                <p className="mb-4 text-gray-600">
                  When you make a purchase on PlantoMart, we share certain information with the vendor(s) from whom you purchase products:
                </p>
                <ul className="mb-4 list-disc space-y-2 pl-5 text-gray-600">
                  <li>Name, shipping address, and contact information to fulfill and ship your order</li>
                  <li>Order details and purchase history related to that vendor</li>
                </ul>
                <p className="mb-4 text-gray-600">
                  Vendors are required to comply with our privacy policies and may only use your information to fulfill orders and
                  provide customer service.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">6.3 Legal Requirements</h3>
                <p className="mb-4 text-gray-600">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities
                  (e.g., a court or government agency). We may also disclose your information to:
                </p>
                <ul className="mb-4 list-disc space-y-2 pl-5 text-gray-600">
                  <li>Enforce our terms and policies</li>
                  <li>Protect and defend our rights or property</li>
                  <li>Prevent or investigate possible wrongdoing</li>
                  <li>Protect the personal safety of users or the public</li>
                </ul>
                <h3 className="mb-3 text-lg font-medium text-gray-800">6.4 Business Transfers</h3>
                <p className="mb-4 text-gray-600">
                  If PlantoMart is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be
                  transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any
                  change in ownership or uses of your personal information.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">6.5 With Your Consent</h3>
                <p className="mb-4 text-gray-600">
                  We may share your information with third parties when you have given us your consent to do so.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">6.6 Data Protection Compliance</h3>
                <p className="text-gray-600">
                  PlantoMart complies with applicable data protection laws, including the General Data Protection Regulation (GDPR) for
                  users in the European Union and the California Consumer Privacy Act (CCPA) for California residents. We do not sell your
                  personal information as defined by these regulations.
                </p>
              </div>
            )}
          </section>
          {/* User Rights Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("userRights")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">7. User Rights</h2>
              {expandedSections.userRights ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.userRights && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  Depending on your location, you may have certain rights regarding your personal information. PlantoMart respects these
                  rights and provides mechanisms for you to exercise them.
                </p>
                <div className="mb-6 border-l-4 border-green-500 bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        To exercise any of the rights described below, please contact us using the information provided in the
                        Contact Information section.
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.1 Right to Access</h3>
                <p className="mb-4 text-gray-600">
                  You have the right to request copies of your personal information that we hold. You can view much of this information
                  directly through your account settings. If you require additional information, we will respond to your request within
                  the timeframe required by applicable law.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.2 Right to Rectification</h3>
                <p className="mb-4 text-gray-600">
                  You have the right to request that we correct any information you believe is inaccurate. You can update much of your
                  personal information directly through your account settings. For information that cannot be changed through your account,
                  please contact us.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.3 Right to Erasure (Right to be Forgotten)</h3>
                <p className="mb-4 text-gray-600">
                  You have the right to request that we erase your personal information in certain circumstances, such as when the data
                  is no longer necessary for the purposes for which it was collected. Please note that we may be required to retain
                  certain information for legal or compliance purposes.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.4 Right to Restrict Processing</h3>
                <p className="mb-4 text-gray-600">
                  You have the right to request that we restrict the processing of your personal information in certain circumstances,
                  such as when you contest the accuracy of the data.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.5 Right to Data Portability</h3>
                <p className="mb-4 text-gray-600">
                  You have the right to request that we transfer the data we have collected to another organization or directly to you in
                  a structured, commonly used, and machine-readable format.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.6 Right to Object</h3>
                <p className="mb-4 text-gray-600">
                  You have the right to object to our processing of your personal information in certain circumstances, such as for direct
                  marketing purposes.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.7 Rights Related to Automated Decision Making</h3>
                <p className="mb-4 text-gray-600">
                  You have the right not to be subject to a decision based solely on automated processing, including profiling, which
                  produces legal effects concerning you or similarly significantly affects you.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">7.8 Response Timeframe</h3>
                <p className="text-gray-600">
                  We will respond to all legitimate requests within one month. Occasionally, it may take us longer if your request is
                  particularly complex or you have made a number of requests. In this case, we will notify you and keep you updated on
                  the progress.
                </p>
              </div>
            )}
          </section>
          {/* Changes to Privacy Policy Section */}
          <section className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggleSection("changes")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">8. Changes to Privacy Policy</h2>
              {expandedSections.changes ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.changes && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
                  on this page and updating the "Last Updated" date at the top of this page.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">8.1 Notification of Changes</h3>
                <p className="mb-4 text-gray-600">
                  For significant changes to this Privacy Policy, we will notify you through a notice on our home page or by sending an
                  email to the primary email address associated with your account. We may also display a banner or pop-up notification
                  on the PlantoMart platform to inform you of these changes.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">8.2 Review of Policy</h3>
                <p className="mb-4 text-gray-600">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
                  Your continued use of the PlantoMart platform after any changes to this Privacy Policy constitutes your acceptance of
                  the updated terms.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">8.3 Material Changes</h3>
                <p className="text-gray-600">
                  If we make material changes to how we treat our users' personal information, we will notify you by email to the email
                  address specified in your account and/or through a notice on the PlantoMart website. Changes will be effective immediately
                  upon posting of the updated Privacy Policy, and we will indicate the date the policy was last revised at the top of this page.
                </p>
              </div>
            )}
          </section>
          {/* Contact Information Section */}
          <section>
            <button
              type="button"
              onClick={() => toggleSection("contact")}
              className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-gray-800">9. Contact Information</h2>
              {expandedSections.contact ? (
                <ChevronUp className="size-5 text-gray-500" />
              ) : (
                <ChevronDown className="size-5 text-gray-500" />
              )}
            </button>
            {expandedSections.contact && (
              <div className="bg-white px-6 py-4">
                <p className="mb-4 text-gray-600">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-5">
                  <h3 className="mb-3 text-lg font-medium text-gray-800">PlantoMart</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><span className="font-semibold">Email:</span> privacy@plantomart.com</li>
                    <li><span className="font-semibold">Phone:</span> +1 (555) 123-4567</li>
                    <li>
                      <span className="font-semibold">Postal Address:</span><br />
                      PlantoMart Privacy Team<br />
                      123 Commerce Street<br />
                      Suite 400<br />
                      San Francisco, CA 94103<br />
                      United States
                    </li>
                  </ul>
                </div>
                <h3 className="mb-3 text-lg font-medium text-gray-800">9.1 Data Protection Officer</h3>
                <p className="mb-4 text-gray-600">
                  For inquiries specifically related to data protection, you can contact our Data Protection Officer at dpo@plantomart.com.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">9.2 EU Representative</h3>
                <p className="mb-4 text-gray-600">
                  For individuals in the European Union, our EU representative can be contacted at eu-rep@plantomart.com.
                </p>
                <h3 className="mb-3 text-lg font-medium text-gray-800">9.3 Response Time</h3>
                <p className="text-gray-600">
                  We aim to respond to all legitimate privacy inquiries within 72 hours. For more complex requests, we may require
                  additional time but will keep you informed of our progress.
                </p>
              </div>
            )}
          </section>
        </div>
        {/* Bottom Banner */}
        <div className="mt-10 overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">Have Questions About Your Privacy?</h2>
            <p className="mt-2 text-gray-600">
              We're here to help. Contact our privacy team or visit our help center for more information.
            </p>
          </div>
          <div className="flex flex-col gap-4 bg-gray-50 p-6 sm:flex-row">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Contact Support
            </Link>
            <Link 
              href="/faq" 
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              View Privacy FAQs
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center md:mb-0">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} PlantoMart. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm font-semibold text-green-600">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-700">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}