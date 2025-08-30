import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "About Planto-Mart - Multi-Vendor E-commerce Platform",
  description: "Planto-Mart is a comprehensive full-stack eCommerce multi-vendor platform enabling vendors to list products and customers to purchase across different vendors. Built by Syed Adnan Ali with advanced vendor dashboards, analytics, and seamless shopping experience.",
  keywords: "multi-vendor ecommerce, ecommerce platform, vendor marketplace, online shopping, vendor dashboard, product management, ecommerce analytics, multi-vendor website, online marketplace, vendor management system",
  authors: [
    {
      name: "Syed Adnan Ali",
      url: "https://www.linkedin.com/in/syedadnanali99",
    },
  ],
  creator: "Syed Adnan Ali",
  publisher: "Planto-Mart",
  openGraph: {
    title: "About Planto-Mart - Multi-Vendor E-commerce Platform by Syed Adnan Ali",
    description: "Comprehensive full-stack eCommerce platform enabling multiple vendors to manage their stores with advanced dashboards, analytics, and seamless customer experience across all vendors.",
    url: "https://plantomart.com/about",
    siteName: "Planto-Mart",
    images: [
      {
        url: "/assets/plantomart_platform.png",
        width: 1200,
        height: 630,
        alt: "Planto-Mart Multi-Vendor E-commerce Platform Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Planto-Mart - Multi-Vendor E-commerce Platform",
    description: "Full-stack eCommerce platform enabling vendors to manage their stores with advanced dashboards, analytics, and seamless customer shopping experience.",
    images: ["/assets/plantomart_platform.png"],
    creator: "@SyedAdnanAli",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://plantomart.com/about",
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`antialiased`}
      >
        {children}
        <Script id="schema-script" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Planto-Mart",
            url: "https://plantomart.com",
            applicationCategory: "E-commerce Platform",
            operatingSystem: "Web Browser",
            description: "Full-stack eCommerce multi-vendor platform enabling vendors to list products and customers to purchase across different vendors with comprehensive vendor dashboards and analytics.",
            author: {
              "@type": "Person",
              name: "Syed Adnan Ali",
              url: "https://www.linkedin.com/in/syedadnanali99",
              jobTitle: "Full-Stack Developer & Platform Architect",
              sameAs: [
                "https://www.linkedin.com/in/syedadnanali99",
                "https://github.com/Adnan-The-Coder",
                "https://adnanthecoder.com"
              ]
            },
            creator: {
              "@type": "Person",
              name: "Syed Adnan Ali",
              url: "https://www.linkedin.com/in/syedadnanali99"
            },
            features: [
              "Multi-vendor marketplace",
              "Vendor dashboard and analytics",
              "Product management system",
              "Order tracking and management",
              "Customer review system",
              "Payment processing",
              "Inventory management",
              "Real-time analytics",
              "Mobile responsive design",
              "SEO optimized"
            ],
            offers: {
              "@type": "Offer",
              description: "Comprehensive eCommerce platform for vendors and customers",
              category: "E-commerce Software"
            },
            targetAudience: [
              {
                "@type": "Audience",
                "audienceType": "Small to Medium Enterprises"
              },
              {
                "@type": "Audience",
                "audienceType": "Independent Vendors"
              },
              {
                "@type": "Audience",
                "audienceType": "Online Retailers"
              }
            ],
            softwareVersion: "1.0",
            applicationSubCategory: "Multi-Vendor E-commerce Platform",
            browserRequirements: "Modern web browser with JavaScript enabled",
            image: "/assets/plantomart_platform.png"
          })}
        </Script>
      </body>
    </html>
  );
}