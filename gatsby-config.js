module.exports = {
  siteMetadata: {
    title: 'PyOhio 2019',
    description: 'PyOhio is a FREE annual Python conference. July 27-28, 2019 in Columbus, OH.',
    siteUrl: 'https://www.pyohio.org'
  },
  pathPrefix: `/2019`,
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'uploads',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              destinationDir: 'static',
            }
          }
        ],
      },
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://static.pyohio.org/2019/sponsors-by-level.json',
        rootKey: 'SponsorLevels',
        imageKeys: ['web_logo']
      }
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://static.pyohio.org/2019/talks-list.json',
        rootKey: 'Talks',
        imageKeys: ['photo']
      }
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://static.pyohio.org/2019/tutorials-list.json',
        rootKey: 'Tutorials',
        imageKeys: ['photo']
      }
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://static.pyohio.org/2019/speakers-list.json',
        rootKey: 'Speakers',
        imageKeys: ['photo']
      }
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://static.pyohio.org/2019/organizers-list.json',
        rootKey: 'Organizers',
        imageKeys: ['photo']
      }
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://static.pyohio.org/2019/slots-list.json',
        rootKey: 'Slots'
      }
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://static.pyohio.org/2019/individual-sponsors.json',
        rootKey: 'IndividualSponsors'
      }
    },
    // {
    //   resolve: `gatsby-transformer-remark`,
    //   options: {
    //     plugins: [
    //       `gatsby-remark-social-cards`,
    //       // ...
    //     ],
    //   },
    // },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: "UA-112992906-1",
      },
    },
    {
      resolve:'gatsby-plugin-purgecss', // purges all unused/unreferenced css rules
      options: {
        develop: true,            // Activates purging in npm run develop
        purgeOnly: ['/all.sass'], // applies purging only on the bulma css file
        printRejected: true,
      },
    }, // must be after other CSS plugins
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
