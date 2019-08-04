import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Img from "gatsby-image"
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import moment from 'moment'
import TutorialRegistrationMessage from '../components/TutorialRegistrationMessage'

export const PresentationPageTemplate = ({ 
  abstract,
  contentComponent,
  description,
  feedback_url,
  helmet,
  kind,
  prerequisites,
  room,
  speakers,
  startDate,
  startMoment,
  startTime,
  title,
  youtubeID,
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
              {youtubeID && 
              <div className="presentation-video">
                <h2 className="is-size-4">Video</h2>
                <div className="video-frame">
                  <iframe title="Presentation Video" src={`https://www.youtube-nocookie.com/embed/${youtubeID}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
              </div>
              }
              {moment().isBetween(startMoment, "2019-08-06") && (
                <div className="content presentation-feedback">
                  <a href={feedback_url} className="button is-link">Rate this session!</a>
                </div>
              )}
              {kind==="120-minute Tutorial" &&
                <TutorialRegistrationMessage/>
              }
              {prerequisites &&
              <div>
                <h2 className="is-size-4">Prerequisites & Setup Instructions</h2>
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
  feedback_url: PropTypes.string,
  helmet: PropTypes.object,
  kind: PropTypes.string,
  prerequisites: PropTypes.string,
  room: PropTypes.string,
  speakers: PropTypes.object,
  startDate: PropTypes.string,
  startMoment: PropTypes.string,
  startTime: PropTypes.string,
  title: PropTypes.string,
  youtubeID: PropTypes.string,
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
  const startMoment = moment(presentation.schedule.start)
  if ( !isNaN(startMoment) ) {
    startDate = startMoment.format('dddd, MMMM DD')
    startTime = startMoment.format('h:mma')
  }
  const speakersString = presentation.speakers.map(speaker => speaker.name).join(", ")
  const pageTitle = `PyOhio 2019 Presentation: ${presentation.title}`
  const pageDescription = `${presentation.kind}: ${presentation.title} by ${speakersString}`
  let youtubeID = null
  if (presentation.youtube_url && presentation.youtube_url.includes("youtu")) {
    youtubeID = presentation.youtube_url.replace("http://youtu.be/", "")
  }

  return (
    <Layout>
      <PresentationPageTemplate
        abstract={presentation.abstract_html}
        contentComponent={HTMLContent}
        description={presentation.description_html}
        feedback_url={presentation.feedback_url}
        helmet={
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:title" content={pageTitle} />
            <meta property="og:title" content={pageTitle} />
            {youtubeID && ([
                <meta property="og:image" content={`https://img.youtube.com/vi/${youtubeID}/0.jpg`} />,
                <meta property="twitter:card" content="player" />,
                <meta property="twitter:image" content={`https://img.youtube.com/vi/${youtubeID}/0.jpg`} />,
                <meta property="twitter:player" content={`https://www.youtube-nocookie.com/embed/${youtubeID}`} />,
                <meta property="twitter:player:height" content="315" />,
                <meta property="twitter:player:width" content="560" />,
            ]
            )}
          </Helmet>
        }
        kind={presentation.kind}
        prerequisites={presentation.prerequisite_setup_html}
        room={presentation.schedule.room}
        speakers={presentation.speakers}
        startDate={startDate}
        startMoment={startMoment}
        startTime={startTime}
        title={presentation.title}
        youtubeID={youtubeID}
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
      feedback_url
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
      youtube_url
    }
    tutorials(id: {eq: $id}) {
      title
      description_html
      abstract_html
      feedback_url
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
      youtube_url
    }
  }
`
