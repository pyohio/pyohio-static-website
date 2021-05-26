/** @jsx jsx */

import Layout from "gatsby-theme-catalyst-core/src/components/layout"
import { graphql, Link } from "gatsby"
import { jsx, BaseStyles, Themed } from "theme-ui"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function TalkPage({ data }) {
  const speaker = data.speakersYaml
  const talks = speaker.talks
    .map((t) => (
      <Themed.a as={Link} to={`/program/talks/${t.slug}`}>
        {t.title}
      </Themed.a>
    ))
    .reduce((prev, curr) => [prev, ", ", curr])

  return (
    <Layout>
    <BaseStyles>
      <h1>{speaker.name}</h1>
      <Themed.img
        as={GatsbyImage}
        sx={{
          borderRadius: "35px",
          border: "7px solid",
          borderColor: "highlight",
        }}
        image={getImage(speaker.localImage.childImageSharp)}
      />
      <div dangerouslySetInnerHTML={{ __html: speaker.biography }} />
      <h2>Presenting</h2>
      <p>{talks}</p>
    </BaseStyles>
    </Layout>
  )
}

export const speakerPageQuery = graphql`
  query SpeakerPage($id: String!) {
    speakersYaml(id: { eq: $id }) {
      name
      biography
      localImage {
        childImageSharp {
          gatsbyImageData(
            height: 300
            width: 300
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
`
