// Site configuration constants - leveraging Astro config values
export const SITE_CONFIG = {
  // Event details
  eventName: 'PyOhio 2025',
  eventDescription: 'Free Python programming language community conference.',
  organizationName: 'PyOhio',
  
  // Event dates (ISO format with timezone)
  startDate: '2025-07-26T09:00-04:00',
  endDate: '2025-07-27T18:00-04:00',
  
  // Social media
  twitterHandle: '@pyohio',
  
  // Keywords for SEO
  keywords: ['Python', 'Programming', 'Conference', 'Free', 'Online', 'Open Source', 'Software Development'],
  
  // Audience
  audience: 'Developers, Programmers, Python enthusiasts',
  
  // Educational level
  educationalLevel: 'Beginner to Advanced'
} as const

// Helper function to get full site URL using Astro's built-in values
export function getFullSiteUrl(site?: URL, baseUrl?: string): string {
  // site comes from astro.config.mjs (https://www.pyohio.org)
  // baseUrl comes from astro.config.mjs (/2025)
  const siteUrl = site?.href || 'https://www.pyohio.org'
  const base = baseUrl || '/2025'
  return `${siteUrl.replace(/\/$/, '')}${base}`
}

// Helper function to get OG image URL
export function getOGImageUrl(fullSiteUrl: string): string {
  return `${fullSiteUrl}/pyohio-2025-logo-og.png`
}

// Helper function to get site metadata with dynamic URLs
export function getSiteMetadata(site?: URL, baseUrl?: string) {
  const fullSiteUrl = getFullSiteUrl(site, baseUrl)
  const siteUrl = site?.href || 'https://www.pyohio.org'
  
  return {
    ...SITE_CONFIG,
    fullSiteUrl,
    siteUrl: siteUrl.replace(/\/$/, ''),
    ogImageUrl: getOGImageUrl(fullSiteUrl)
  }
}

// Helper function to format event dates
export function getEventDateInfo() {
  const startDate = new Date(SITE_CONFIG.startDate)
  const endDate = new Date(SITE_CONFIG.endDate)
  
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' })
  const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric' })
  const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric' })
  
  const month = monthFormatter.format(startDate)
  const startDay = dayFormatter.format(startDate)
  const endDay = dayFormatter.format(endDate)
  const year = yearFormatter.format(startDate)
  
  return {
    month,
    startDay,
    endDay,
    year,
    // Common date formats
    shortRange: `${month} ${startDay}-${endDay}`, // "July 26-27"
    longRange: `${month} ${startDay}-${endDay}, ${year}`, // "July 26-27, 2025"
    ampersandRange: `${month} ${startDay} & ${endDay}`, // "July 26 & 27"
    separateDates: `${month} ${startDay}th–${endDay}th, ${year}`, // "July 26th–27th, 2025"
    currentYear: `18th` // This could be calculated or stored in config
  }
}