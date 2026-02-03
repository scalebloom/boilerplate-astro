/**
 * Centralized site configuration and business data
 * Used across schema markup, meta tags, and components
 */

export const siteConfig = {
  // Business Identity
  name: "Acorn Pals",
  legalName: "Clearance Vault LLC",
  url: "https://www.acornpals.com",
  description:
    "Book premium mobile soft play rentals in Charlotte, NC. Acorn Pals delivers safe, clean, and affordable fun for children's birthday parties. View our packages!",
  slogan: "Soft Play Rentals in Charlotte NC and Nearby",

  // Contact Information
  contact: {
    email: "hi@acornpals.com",
    phone: "980-202-1310",
    phoneDisplay: "(980) 202-1310",
    hours: "Monday-Sunday: 7:00 AM - 7:00 PM ET",
    hoursStructured: {
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "19:00",
    },
  },

  // Location
  location: {
    serviceArea: "Charlotte, NC metropolitan area",
    streetAddress: "Youngblood Rd",
    addressLocality: "Charlotte",
    addressRegion: "NC",
    postalCode: "28278",
    addressCountry: "US",
  },

  // Business Details
  business: {
    owner: "Elizabeth K.",
    priceRange: "$$",
    type: "LocalBusiness",
    category: "Party Equipment Rental Service",
  },

  // Rental Policies
  rentalPolicies: {
    delivery: {
      fee: "Free",
      area: "Charlotte, NC metropolitan area",
      description: "Free delivery and setup within the Charlotte metro area",
    },
    cancellation: {
      policy: "Full refund if cancelled 24+ hours before rental start time",
      refundEligibilityDays: 1, // 24 hours = 1 day
    },
    terms: {
      hasLatePickupFee: true,
      hasDamageDeposit: true,
      customerResponsibleForDamage: true,
      rentalDuration: "4 hours",
    },
  },

  // Branding
  branding: {
    logo: "/logo.svg",
    favicon: "/favicon.svg",
  },

  // Social Media
  social: {
    facebook: "https://www.facebook.com/acornpals",
    instagram: "https://www.instagram.com/acornpals/",
  },
} as const;

// Type exports for use in components
export type SiteConfig = typeof siteConfig;
