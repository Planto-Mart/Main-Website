import Head from "next/head";
import "./globals.css";

export const metadata = {
  title: "Plantomart | Eco-Friendly Plants & Sustainable Living Essentials",
  description:
    "Plantomart brings nature's best to your doorstep. Discover indoor plants, eco-friendly home products, and sustainable living solutions curated by local vendors.",
  keywords:
    "Plantomart, indoor plants, sustainable living, eco-friendly products, Hyderabad, green lifestyle, plant delivery, home gardening, plant-based products, local vendors, eco-conscious shopping",
  og: {
    title: "Plantomart | Eco-Friendly Plants & Sustainable Living Essentials",
    description:
      "Explore a curated selection of indoor plants and sustainable products at Plantomart. Embrace a greener lifestyle with our eco-conscious offerings.",
    url: "https://www.plantomart.com",
    type: "website",
    image: "https://www.plantomart.com/assets/plantomart_banner.png",
  },
  openGraph: {
    title: "Plantomart | Eco-Friendly Plants & Sustainable Living Essentials",
    description:
      "Explore a curated selection of indoor plants and sustainable products at Plantomart. Embrace a greener lifestyle with our eco-conscious offerings.",
    url: "https://www.plantomart.com",
    type: "website",
    siteName: "Plantomart",
    images: [
      {
        url: "https://www.plantomart.com/assets/plantomart_banner.png",
        width: 1200,
        height: 700,
        alt: "Plantomart Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Plantomart",
    title: "Plantomart | Eco-Friendly Plants & Sustainable Living Essentials",
    description:
      "Discover indoor plants and sustainable products at Plantomart. Your one-stop shop for eco-friendly living.",
    image: "https://www.plantomart.com/assets/plantomart_banner.png",
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Plantomart",
    url: "https://www.plantomart.com",
    logo: "https://www.plantomart.com/assets/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-8331801000",
      contactType: "Customer Service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Telugu"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gachibowli",
      addressLocality: "Hyderabad",
      postalCode: "500008",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.facebook.com/plantomart",
      "https://twitter.com/plantomart",
      "https://www.youtube.com/plantomart",
      "https://plantomart.wordpress.com",
    ],
  },
};

export default function PlantomartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <meta name="keywords" content={metadata.keywords} />
          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={metadata.og.title} />
          <meta property="og:description" content={metadata.og.description} />
          <meta property="og:url" content={metadata.og.url} />
          <meta property="og:type" content={metadata.og.type} />
          <meta property="og:image" content={metadata.og.image} />
          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content={metadata.twitter.card} />
          <meta name="twitter:site" content={metadata.twitter.site} />
          <meta name="twitter:title" content={metadata.twitter.title} />
          <meta name="twitter:description" content={metadata.twitter.description} />
          <meta name="twitter:image" content={metadata.twitter.image} />
        </Head>
        <div>{children}</div>
      </body>
    </html>
  );
}