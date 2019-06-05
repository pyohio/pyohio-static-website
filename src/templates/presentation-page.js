import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Img from "gatsby-image"
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const PresentationPageTemplate = ({ 
  abstract,
  contentComponent,
  description,
  helmet,
  kind,
  room,
  speakers,
  startTime,
  title,
}) => {
  const PageContent = contentComponent || Content

  const speakerList = speakers.map((item, key) =>
  <article className="tile is-child speaker-bio">
    <Link to={`/speakers/${item.speaker_id}`}>
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
              <div><em>{kind} - {startTime} in {room}</em></div>
              <PageContent className="content presentation-description" content={description} />
              <PageContent className="content presentation-abstract" content={abstract} />
              <h2 className="is-size-4">Presented by:</h2>
              <div className="tile is-ancestor">
                {speakerList}
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
  room: PropTypes.string,
  speakers: PropTypes.object,
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

  const speakersString = 'speakers go here'
  //presentation.schedule.room = "room TBD"
  //presentation.schedule.start = "time TBD"

//   presentation.speakers = [
//     {"name": "Speaker 1",
//   "speaker_id": 123
// }
//   ]
  return (
    <Layout>
      <PresentationPageTemplate
        abstract={presentation.abstract_html}
        contentComponent={HTMLContent}
        description={presentation.description_html}
        helmet={
          <Helmet>
            <title>{`PyOhio 2019 - ${presentation.title}`}</title>
            <meta name="description" content={`PyOhio 2019 ${presentation.kind}: ${presentation.title} by ${speakersString}`} />
          </Helmet>
        }
        kind={presentation.kind}
        room={presentation.schedule.room}
        speakers={presentation.speakers}
        startTime={presentation.schedule.start}
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
              fixed(width:250, height:250, cropFocus:ATTENTION){
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
              fixed(width:250, height:250, cropFocus:ATTENTION){
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`
