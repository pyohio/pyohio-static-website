/** @jsx jsx */

import Layout from "gatsby-theme-catalyst-core/src/components/layout"
import React from "react";
import {Link, graphql} from "gatsby";
import { jsx, Themed } from "theme-ui"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default class TalksPage extends React.Component {
    render() {
        const { data } = this.props;
        const { edges: speakerList } = data.allSpeakersYaml;

        return (
            <Layout>
                <Themed.h1>Speakers</Themed.h1>

        {speakerList.map(({ node: speaker }) => (
          <div key={speaker.id}>
            <Themed.p
                as="h2"
                sx={{
                    fontSize: 3,
                    lineHeight:1.25,
                    pt: `20px`,
                }}
            >

              <Themed.a
                as={Link}
                to={`/program/speakers/${speaker.slug}`}
              >
                                  <Themed.img
                    as={GatsbyImage}
                    sx={{
                        borderRadius: "25px",
                        border: "5px solid",
                        borderColor: "highlight"
                    }}
                    image={getImage(speaker.localImage.childImageSharp)}
                />
                <br />
                {speaker.name}
              </Themed.a>
            </Themed.p>
          </div>
        ))}
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