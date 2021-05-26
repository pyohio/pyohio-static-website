/** @jsx jsx */

import Layout from "gatsby-theme-catalyst-core/src/components/layout"
import React from "react";
import {Link, graphql} from "gatsby";
import { jsx, Box, Flex, Themed } from "theme-ui"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default class TalksPage extends React.Component {
    render() {
        const { data } = this.props;
        const { edges: speakerList } = data.allSpeakersYaml;

        return (
            <Layout>
                <Themed.h1>Speakers</Themed.h1>

            <Flex
              sx={{
                  flexFlow: 'row wrap',
                }}
            >

        {speakerList.map(({ node: speaker }) => (
          <Box
            key={speaker.id}
            sx={{
                flex: '1 1 auto',
                maxWidth: 200,
                textAlign: 'center',
                px: 2,
            }}
          >
            <Themed.p>
              <Themed.a
                as={Link}
                to={`/program/speakers/${speaker.slug}`}
              >
                                  <Themed.img
                    as={GatsbyImage}
                    sx={{
                        borderRadius: "35px",
                        border: "7px solid",
                        borderColor: "highlight"
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
                gatsbyImageData(height: 200, width: 200,  transformOptions: {fit: CONTAIN})
            }
          }
          talks {
            title,
            slug
          }
        }
      }
    }
  }
`;