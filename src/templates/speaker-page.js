/** @jsx jsx */

import { Layout, Seo } from "gatsby-theme-catalyst-core"
import { graphql, Link } from "gatsby"
import { jsx, BaseStyles, Themed } from "theme-ui"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { FaTwitter } from "react-icons/fa"

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
      <Seo title={`PyOhio 2022 Speaker: ${speaker.name}`} />
      <BaseStyles>
        <h1>{speaker.name}</h1>
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

        {speaker.twitter && (
          <p>
            <a href={`https://www.twitter.com/${speaker.twitter}`}>
              <FaTwitter /> {speaker.twitter}
            </a>
          </p>
        )}
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
      twitter
      localImage {
        childImageSharp {
          gatsbyImageData(
            height: 300
            width: 300
            transformOptions: { fit: COVER }
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
