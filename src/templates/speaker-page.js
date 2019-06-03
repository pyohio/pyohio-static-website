import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Img from "gatsby-image"
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const SpeakerPageTemplate = ({ 
  contentComponent,
  photoSrc,
  presentations,
  speakerName,
  speakerBio,
  helmet,
}) => {
  const PageContent = contentComponent || Content

  const presentationList = presentations.map((item, key) =>
  <p>
    {/* {item.kind}: <Link to="{`/events/{item.presentation_id}`}">{item.title}</Link> */}
    <strong>{item.kind}:</strong> {item.title}
  </p>
  )
  return (
    <section className="section section--gradient">
      {helmet || ''}
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section speaker-bio">
              <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                Speaker: {speakerName}
              </h1>
              <div className="speaker-image-wrapper is-clearfix">
                <Img fixed={photoSrc}  alt={speakerName}/>
              </div>
              <PageContent className="content" content={speakerBio} />
              <h2 className="is-size-3">Presenting:</h2>
              {presentationList}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

SpeakerPageTemplate.propTypes = {
  contentComponent: PropTypes.func,
  helmet: PropTypes.object,
  photoSrc: PropTypes.string,
  presentations: PropTypes.array,
  speakerName: PropTypes.string.isRequired,
  speakerBio: PropTypes.string,
  title: PropTypes.string,
}

const SpeakerPage = ({ data }) => {
  const { speakers: speaker } = data
  // TODO: handle missing images w/ a default?
  let photoSrc = ''
  if (speaker.photo){
    photoSrc = speaker.photo.local.childImageSharp.fixed 
  }

  return (
    <Layout>
      <SpeakerPageTemplate
        contentComponent={HTMLContent}
        photoSrc={photoSrc}
        presentations={speaker.presentations}
        speakerName={speaker.name}
        speakerBio={speaker.biography_html}
        title={`Speaker: ${speaker.name}`}
        helmet={
          <Helmet>
            <title>{`PyOhio 2019 Speaker: ${speaker.name}`}</title>
            <meta name="description" content={`PyOhio 2019 speaker: ${speaker.name}`} />
          </Helmet>
        }
      />
    </Layout>
  )
}

SpeakerPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default SpeakerPage

export const speakerPageQuery = graphql`
  query SpeakerPageByID($id: String!) {
    speakers(id: {eq: $id}) {
      biography_html
      name
      photo {
        local {
          childImageSharp {
            fixed(width:250){
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
      presentations {
        kind
        title
        presentation_id
      }
    }
  }
`
