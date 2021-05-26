// exports.onCreateNode = ({ node }) => {
//     if (node.internal.type === `TalksYaml`){
//         console.log("Create talk page")
//     }
//   }

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

// const path = require("path");
// const { createFilePath } = require("gatsby-source-filesystem");
// const { fmImagesToRelative } = require("gatsby-remark-relative-images");

// exports.createPages = ({ actions, graphql }) => {
//   const { createPage } = actions;

//   const pages = graphql(`
//     {
//       allMarkdownRemark(limit: 1000) {
//         edges {
//           node {
//             id
//             fields {
//               slug
//             }
//             frontmatter {
//               templateKey
//             }
//           }
//         }
//       }
//     }
//   `).then((result) => {
//     if (result.errors) {
//       result.errors.forEach((e) => console.error(e.toString()));
//       return Promise.reject(result.errors);
//     }

//     const posts = result.data.allMarkdownRemark.edges;

//     posts.forEach((edge) => {
//       const id = edge.node.id;
//       createPage({
//         path: edge.node.fields.slug,
//         component: path.resolve(
//           `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
//         ),
//         // additional data can be passed via context
//         context: {
//           id,
//         },
//       });
//     });
//   });

//   const talkPages = graphql(`
//     {
//       allTalksYaml {
//         edges {
//           node {
//             id
//             slug
//           }
//         }
//       }
//     }
//   `).then((result) => {
//     if (result.errors) {
//       result.errors.forEach((e) => console.error(e.toString()));
//       return Promise.reject(result.errors);
//     }
//     const talks = result.data.allTalksYaml.edges;

//     talks.forEach((edge) => {
//       const id = edge.node.id;
//       createPage({
//         path: `/events/talks/${edge.node.slug}`,
//         component: path.resolve("./src/templates/talk-page.js"),
//         context: {
//           id,
//         },
//       });
//     });
//   });

//   return Promise.all([pages, talkPages]);
// };

// exports.onCreateNode = ({ node, actions, getNode }) => {
//   const { createNodeField } = actions;
//   fmImagesToRelative(node); // convert image paths for gatsby images

//   if (node.internal.type === `MarkdownRemark`) {
//     const value = createFilePath({ node, getNode });
//     createNodeField({
//       name: `slug`,
//       node,
//       value,
//     });
//   }
// // };
