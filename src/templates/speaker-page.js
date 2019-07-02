import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Img from "gatsby-image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faMastodon } from '@fortawesome/free-brands-svg-icons'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const SpeakerPageTemplate = ({
  contentComponent,
  photoSrc,
  presentations,
  speakerName,
  speakerBio,
  helmet,
  twitter,
  mastodon,
  website
}) => {
  const PageContent = contentComponent || Content

  const presentationList = presentations.map((item, key) =>
  <p>
    <strong>{item.kind}:</strong> <Link to={`/presentations/${item.presentation_id}`}>{item.title}</Link>
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
              <div className="social-icons">
                <ul>
                  {(twitter) &&
                    <li>
                      <a href={`https://twitter.com/${twitter}`}>
                        <span className="icon" role="presentation">
                          <FontAwesomeIcon icon={faTwitter}/>&nbsp;
                        </span>
                        @{twitter}
                        </a>
                    </li>
                  }
                  {(mastodon) &&
                    <li>
                      <a href={mastodon}>
                        <span className="icon" role="presentation">
                          <FontAwesomeIcon icon={faMastodon}/>&nbsp;
                        </span>
                        {mastodon}
                      </a>
                    </li>
                  }
                  {(website) &&
                  <li>
                    <a href={website}>
                      <span className="icon" role="presentation">
                        <FontAwesomeIcon icon={faCode}/>&nbsp;
                      </span>
                      {website}
                    </a>
                  </li>
                  }
                </ul>
              </div>
              <Img fixed={photoSrc}  alt={speakerName} className="speaker-image-wrapper is-clearfix"/>
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
  twitter: PropTypes.string,
}

const SpeakerPage = ({ data }) => {
  const { speakers: speaker } = data
  // TODO: handle missing images w/ a default?
  let photoSrc = ''
  if (speaker.photo){
    photoSrc = speaker.photo.local.childImageSharp.fixed 
  }
  const pageTitle = `PyOhio 2019 Speaker: ${speaker.name}`
  const presentationNames = speaker.presentations.map(p => p.title).join(", ")
  const pageDescription = `${speaker.name} presenting: ${presentationNames}`

  return (
    <Layout>
      <SpeakerPageTemplate
        contentComponent={HTMLContent}
        photoSrc={photoSrc}
        presentations={speaker.presentations}
        speakerName={speaker.name}
        speakerBio={speaker.biography_html}
        title={`Speaker: ${speaker.name}`}
        twitter={speaker.twitter}
        mastodon={speaker.mastodon}
        website={speaker.website}
        helmet={
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:title" content={pageTitle} />
            <meta property="og:title" content={pageTitle} />
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
            fixed(width:250, height:250, cropFocus:CENTER){
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
      twitter
      mastodon
      website
    }
  }
`
