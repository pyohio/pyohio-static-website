import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"

import Footer from '../components/Footer'
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
              siteUrl,
            }
            pathPrefix
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
          <meta property="og:image" content={`${data.site.siteMetadata.siteUrl}${data.site.pathPrefix}/img/pyohio-2019-og.jpg`}/>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={`${data.site.siteMetadata.siteUrl}${data.site.pathPrefix}/img/pyohio-2019-og.jpg`}/>
          <meta name="twitter:site" content="@pyohio" />
          <meta name="twitter:title" content={data.site.siteMetadata.title} />
          <meta name="twitter:description" content={data.site.siteMetadata.description} />
        </Helmet>
        <Navbar />
        <div>{children}</div>
        {/* <Footer /> */}
      </div>
    )}
  />
)

export default TemplateWrapper
