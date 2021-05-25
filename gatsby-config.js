module.exports = {
  siteMetadata: {
    title: `PyOhio 2021`,
    description: `The free annual Python community conference based in Ohio. July 31, 2021.`,
    keywords: [`python`, `programming`],
    author: `PyOhio Organizers`,
    siteUrl: `https://www.pyohio.org`, //Change to you site address, required for sitemap.xml and robots.txt file among other things
    menuLinks: [
      // {
      //   name: `Example`,
      //   link: `/example`,
      //   location: `left`,
      // },
      {
        name: `About`,
        link: `/about`,
        subMenu: [
          {
            name: `About PyOhio`,
            link: `/about`
          },
          {
            name: `Code of Conduct`,
            link: `/about/code-of-conduct`,
          },
          {
            name: `Newsletter`,
            link: `/about/newsletter`
          },
        ],
      },
      {
        name: `Attend`,
        link: `/attend`,
        subMenu: [
          {
            name: `Virtual Attendance`,
            link: `/attend`,
          },
          {
            name: `Register`,
            link: `/attend/register`,
          },
        ],
      },
      {
        name: `Program`,
        link: `/program`,
        subMenu: [
          {
            name: `Talks`,
            link: `/program/talks`,
          },
          {
            name: `Speakers`,
            link: `/program/speakers`,
          },
        ],
      },
      {
        name: `Speaking`,
        link: `/speaking`,
        subMenu: [
          {
            name: `Speaker Information`,
            link: `/speaking/speaker-info`,
          },
          {
            name: `Call for Proposals (closed)`,
            link: `/speaking/call-for-proposals`,
          },
        ],
      },
    ],
    socialLinks: [
      {
        name: `Email`,
        link: `info@pyohio.org`,
        location: `footer`, //Options are "all", "header", "footer"
      },
      {
        name: `Twitter`,
        link: `https://twitter.com/pyohio`,
        location: `all`, //Options are "all", "header", "footer"
      },
      {
        name: `Github`,
        link: `https://www.github.com/pyohio`,
        location: `all`, //Options are "all", "header", "footer"
      },
    ],
  },
  pathPrefix: `/2021`,
  plugins: [
    {
      resolve: `gatsby-theme-catalyst-core`,
      options: {
        //Default options are:
        // contentPath: `content/pages`,
        // assetPath: `content/assets`,
        // remarkImagesWidth: 1440,
        imageQuality: 90,
        // useAlertBanner: false,
      },
    },
    {
      resolve: `gatsby-theme-catalyst-header-top`,
      options: {
        // Default options are
        // useStickyHeader: true,
        // useHeaderSocialLinks: true,
        // useColorMode: true
      },
    },
    {
      resolve: `gatsby-theme-catalyst-footer`,
      options: {
        // Default options are
        // useFooterSocialLinks: true,
        footerContentLocation: "center", // "left", "right", "center"
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-catalyst`,
        short_name: `catalyst`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#cccccc`,
        display: `minimal-ui`,
        icon: `content/assets/pyohio-2021-logo-sticker.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-transformer-yaml-plus',
      options: {
        enableRemark: true,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./data/talks/`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-112992906-1',
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
