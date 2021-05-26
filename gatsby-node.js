const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const talksResult = await graphql(`
    query {
      allTalksYaml {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `)
  talksResult.data.allTalksYaml.edges.forEach(({ node }) => {
    createPage({
      path: `/program/talks/${node.slug}`,
      component: path.resolve(`./src/templates/talk-page.js`),
      context: {
        id: node.id,
      },
    })
  })

  const speakersResult = await graphql(`
    query {
      allSpeakersYaml {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `)
  speakersResult.data.allSpeakersYaml.edges.forEach(({ node }) => {
    createPage({
      path: `/program/speakers/${node.slug}`,
      component: path.resolve(`./src/templates/speaker-page.js`),
      context: {
        id: node.id,
      },
    })
  })
}
