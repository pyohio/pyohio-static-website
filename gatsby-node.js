const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const pages = graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(edge => {
      const id = edge.node.id
      createPage({
        path: edge.node.fields.slug,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })
  })

  const programPages = graphql(`
  {
    allSpeakers {
      edges {
        node {
          id
          speaker_id
        }
      }
    }
    allTalks {
      edges {
        node {
          id
          presentation_id
        }
      }
    }
    allTutorials {
      edges {
        node {
          id
          presentation_id
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const speakers = result.data.allSpeakers.edges
    speakers.forEach(edge => {
      const id = edge.node.id
      createPage({
        path: `/speakers/${edge.node.speaker_id}`,
        component: path.resolve("./src/templates/speaker-page.js"),
        context: {
          id,
        }
      })
    })

    const talks = result.data.allTalks.edges
    const tutorials = result.data.allTutorials.edges
    const allPresentations = talks.concat(tutorials)
    allPresentations.forEach(edge => {
      const id = edge.node.id
      createPage({
        path: `/presentations/${edge.node.presentation_id}`,
        component: path.resolve("./src/templates/presentation-page.js"),
        context: {
          id,
        }
      })
    })

  })

  return Promise.all([pages, programPages]);
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
