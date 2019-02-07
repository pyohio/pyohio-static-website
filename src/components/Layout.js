import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"

import Navbar from '../components/Navbar'
import './all.sass'

const TemplateWrapper = ({ children }) => (
  <StaticQuery
    query={graphql`
      query HeadingQuery {
          site {
            siteMetadata {
              title,
              description,
            }
          }
        }
    `}
    render={data => (
      <div>
        <Helmet>
          <html lang="en" />
          <title>{data.site.siteMetadata.title}</title>
          <meta name="description" content={data.site.siteMetadata.description} />
          
          <link rel="apple-touch-icon" sizes="180x180" href="/2019/img/apple-touch-icon.png" />
	        <link rel="icon" type="image/png" href="/2019/img/favicon-32x32.png" sizes="32x32" />
	        <link rel="icon" type="image/png" href="/2019/img/favicon-16x16.png" sizes="16x16" />
	
	        <link rel="mask-icon" href="/2019/img/safari-pinned-tab.svg" color="#ff4400" />
	        <meta name="theme-color" content="#fff" />

	        <meta property="og:type" content="business.business" />
          <meta property="og:title" content={data.site.siteMetadata.title} />
          <meta property="og:url" content="/2019/" />
          <meta property="og:image" content="/2019/img/og-image.jpg" />
        </Helmet>
        <Navbar />
        <div>{children}</div>

        <script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "PyOhio 2019",
  "startDate": "2019-07-27T10:00-05:00",
  "location": {
    "@type": "Place",
    "name": "The Ohio Union",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1739 N. High St",
      "addressLocality": "Columbus",
      "postalCode": "43210",
      "addressRegion": "OH",
      "addressCountry": "US"
    }
  },
  "image": [
    "https://www.pyohio.org/2019/img/og-image.png"
   ],
  "description": "The FREE Python community conference in Columbus, OH, July 27-28, 2019.",
  "endDate": "2019-07-28T17:00-05:00",
  "offers": {
    "@type": "Offer",
    "url": "https://www.pyohio.org/2019/",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2019-04-15T09:00-05:00"
  }
}}
</script>

      </div>
    )}
  />
)

export default TemplateWrapper
