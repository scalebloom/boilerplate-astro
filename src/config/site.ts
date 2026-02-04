/**
 * Centralized site configuration and business data
 * Used across schema markup, meta tags, and components
 */

export const siteConfig: SiteConfig = {
  // ===========================================================================
  // Business Type (determines which schema.org markup is generated)
  // ===========================================================================
  // Options:
  //   - "LocalBusiness"  → Physical location serving local customers
  //   - "Organization"   → Companies, non-profits, institutions
  //   - "OnlineBusiness" → E-commerce, SaaS, digital products
  //
  // Tip: For local businesses, a specific subtype improves SEO.
  // Set type to "Restaurant", "Dentist", "Attorney", "Store", etc.
  // Full list: https://schema.org/LocalBusiness#subtypes
  // ===========================================================================
  business: {
    type: "LocalBusiness",
    owner: {
      name: "Jane Doe",
      type: "Person", // "Person" or "Organization"
    },
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card"],
    currenciesAccepted: "USD",
  },

  // Business Identity
  name: "Your Business Name",
  legalName: "Your Legal Entity LLC",
  url: "https://www.example.com",
  description: "Your business description goes here. Describe what you do, who you serve, and what makes you unique.",
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

  // Location (required for LocalBusiness, optional for others)
  location: {
    serviceArea: "Your service area",
    streetAddress: "123 Main Street",
    addressLocality: "Anytown",
    addressRegion: "CA",
    postalCode: "12345",
    addressCountry: "US",
    // Geo coordinates improve "near me" search visibility (use Google Maps to find yours)
    geo: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
  },

  // Branding
  branding: {
    logo: "/logo.svg",
    favicon: "/favicon/favicon.svg",
  },

  // Social Media (footer icons + schema markup)
  // Only include platforms you use - remove or leave empty the others
  social: {
    facebook: "https://www.facebook.com/yourbusiness",
    instagram: "https://www.instagram.com/yourbusiness/",
    // linkedin: "https://www.linkedin.com/company/yourbusiness",
    // x: "https://x.com/yourbusiness",
  },
};

// ============================================================================
// Type Definitions (optional fields marked with "?")
// ============================================================================

interface ContactConfig {
  email: string;
  phone: string;
  phoneDisplay: string;
  hours?: string;
  hoursStructured?: {
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
}

interface GeoConfig {
  latitude: number;
  longitude: number;
}

interface LocationConfig {
  serviceArea: string;
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
  geo?: GeoConfig;
}

// Common types, but any schema.org type string is accepted (e.g., "Restaurant", "Dentist")
type BusinessType = "LocalBusiness" | "Organization" | "OnlineBusiness" | (string & {});

interface OwnerConfig {
  name: string;
  type: "Person" | "Organization";
}

interface BusinessConfig {
  type: BusinessType;
  owner: OwnerConfig;
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string;
}

interface BrandingConfig {
  logo: string;
  favicon: string;
}

interface SocialConfig {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
}

export interface SiteConfig {
  business: BusinessConfig;
  name: string;
  legalName: string;
  url: string;
  description: string;
  slogan: string;
  contact: ContactConfig;
  location: LocationConfig;
  branding: BrandingConfig;
  social: SocialConfig;
}
