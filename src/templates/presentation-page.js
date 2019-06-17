import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Img from "gatsby-image"
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import strftime from 'strftime'

export const PresentationPageTemplate = ({ 
  abstract,
  contentComponent,
  description,
  helmet,
  kind,
  prerequisites,
  room,
  speakers,
  startDate,
  startTime,
  title,
}) => {
  const PageContent = contentComponent || Content

  const speakerList = speakers.map((item, key) =>
  <article className="tile is-child speaker-bio is-flex">
    <Link className="is-clearfix is-block" to={`/speakers/${item.speaker_id}`}>
      <Img fixed={item.photo.local.childImageSharp.fixed}  alt={item.name} className="speaker-image-wrapper is-clearfix"/>
    </Link>
    <p className="subtitle"><Link to={`/speakers/${item.speaker_id}`}>
      {item.name}
    </Link></p>
  </article>
  )
  return (
    <section className="section section--gradient">
      {helmet || ''}
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section presentation-detail">
              <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                {title}
              </h1>
              <div><em>{kind} - {startDate} at {startTime} in {room}</em></div>
              <PageContent className="content presentation-description" content={description} />
              <PageContent className="content presentation-abstract" content={abstract} />
              {prerequisites &&
              <div>
                <h2 className="is-size-4">Prerequisites & Setup Instructions:</h2>
                <PageContent className="content presentation-prerequisites" content={prerequisites} />
                </div>
              }
              <h2 className="is-size-4">Presented by:</h2>
              <div className="tile is-ancestor">
                <div className="tile is-parent">
                  {speakerList}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

PresentationPageTemplate.propTypes = {
  abstract: PropTypes.string,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  helmet: PropTypes.object,
  kind: PropTypes.string,
  prerequisites: PropTypes.string,
  room: PropTypes.string,
  speakers: PropTypes.object,
  startDate: PropTypes.string,
  startTime: PropTypes.string,
  title: PropTypes.string,
}

const PresentationPage = ({ data }) => {
  const { talks: talk, tutorials: tutorial } = data
  let presentation = null
  if (talk) {
    presentation = talk
  } else {
    presentation = tutorial
  }

  let startDate = "date TBD"
  let startTime = "time TBD"
  const startDatetime = new Date(presentation.schedule.start)
  if ( !isNaN(startDatetime) ) {
    startDate = strftime("%a %B %d", startDatetime)
    startTime = strftime("%H:%M%P", startDatetime)
  }
  const speakersString = presentation.speakers.map(speaker => speaker.name).join(", ")
  const pageTitle = `PyOhio 2019 Presentation: ${presentation.title}`
  const pageDescription = `${presentation.kind}: ${presentation.title} by ${speakersString}`
  return (
    <Layout>
      <PresentationPageTemplate
        abstract={presentation.abstract_html}
        contentComponent={HTMLContent}
        description={presentation.description_html}
        helmet={
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:title" content={pageTitle} />
            <meta property="og:title" content={pageTitle} />
          </Helmet>
        }
        kind={presentation.kind}
        prerequisites={presentation.prerequisite_setup_html}
        room={presentation.schedule.room}
        speakers={presentation.speakers}
        startDate={startDate}
        startTime={startTime}
        title={presentation.title}
      />
    </Layout>
  )
}

PresentationPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default PresentationPage

export const PresentationPageQuery = graphql`
  query PresentationPageByID($id: String!){
    talks(id: {eq: $id}) {
      title
      description_html
      abstract_html
      kind
      schedule {
        room
        start
      }
      speakers {
        name
        speaker_id
        photo {
          local {
            childImageSharp {
              fixed(width:250, height:250, cropFocus:CENTER){
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
    tutorials(id: {eq: $id}) {
      title
      description_html
      abstract_html
      kind
      prerequisite_setup_html
      schedule {
        room
        start
      }
      speakers {
        name
        speaker_id
        photo {
          local {
            childImageSharp {
              fixed(width:250, height:250, cropFocus:CENTER){
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`
