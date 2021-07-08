/** @jsx jsx */

import { Layout, Seo } from "gatsby-theme-catalyst-core"
import React from "react"
import { Link, graphql } from "gatsby"
import { jsx, Box, Flex, Themed } from "theme-ui"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default class TalksPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: speakerList } = data.allSpeakersYaml

    return (
      <Layout>
        <Seo title="PyOhio 2021 Speakers" />
        <Themed.h1>Speakers</Themed.h1>

        <Flex
          sx={{
            flexFlow: "row wrap",
          }}
        >
          {speakerList.map(({ node: speaker }) => (
            <Box
              key={speaker.id}
              sx={{
                flex: "1 1 auto",
                maxWidth: 160,
                textAlign: "center",
                px: 2,
              }}
            >
              <Themed.p>
                <Themed.a as={Link} to={`/program/speakers/${speaker.slug}`}>
                  <Themed.img
                    as={GatsbyImage}
                    sx={{
                      borderRadius: "35px",
                      border: "7px solid",
                      borderColor: "highlight",
                      WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    }}
                    image={getImage(speaker.localImage.childImageSharp)}
                  />
                  <br />
                  {speaker.name}
                </Themed.a>
              </Themed.p>
            </Box>
          ))}
        </Flex>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query SpeakersListQuery {
    allSpeakersYaml(sort: { fields: [name] }) {
      edges {
        node {
          name
          slug
          localImage {
            childImageSharp {
              gatsbyImageData(
                height: 150
                width: 150
                transformOptions: { fit: CONTAIN }
              )
            }
          }
          talks {
            title
            slug
          }
        }
      }
    }
  }
`
