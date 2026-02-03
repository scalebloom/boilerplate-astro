/**
 * Centralized site configuration and business data
 * Used across schema markup, meta tags, and components
 */

export const siteConfig = {
  // Business Identity
  name: "Your Business Name",
  legalName: "Your Legal Entity LLC",
  url: "https://www.example.com",
  description:
    "Your business description goes here. Describe what you do, who you serve, and what makes you unique.",
  slogan: "Your Tagline Here",

  // Contact Information
  contact: {
    email: "hello@example.com",
    phone: "555-123-4567",
    phoneDisplay: "(555) 123-4567",
    hours: "Monday-Friday: 9:00 AM - 5:00 PM",
    hoursStructured: {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  },

  // Location
  location: {
    serviceArea: "Your service area",
    streetAddress: "123 Main Street",
    addressLocality: "Anytown",
    addressRegion: "CA",
    postalCode: "12345",
    addressCountry: "US",
  },

  // Business Details
  business: {
    owner: "Jane Doe",
    priceRange: "$$",
    type: "LocalBusiness",
    category: "Professional Services",
    serviceTypes: ["Service One", "Service Two", "Service Three"],
    paymentAccepted: ["Cash", "Credit Card"],
    currenciesAccepted: "USD",
  },

  // Branding
  branding: {
    logo: "/logo.svg",
    favicon: "/favicon/favicon.svg",
  },

  // Social Media
  social: {
    facebook: "https://www.facebook.com/yourbusiness",
    instagram: "https://www.instagram.com/yourbusiness/",
  },
} as const;

// Type exports for use in components
export type SiteConfig = typeof siteConfig;
