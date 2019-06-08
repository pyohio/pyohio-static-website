import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from "gatsby-image"
import Layout from '../../components/Layout'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: speakerList } = data.allSpeakers
    const pageTitle = "PyOhio 2019 Speakers"

    return (
      <Layout>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="twitter:title" content={pageTitle} />
          <meta property="og:title" content={pageTitle} />
        </Helmet>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">{pageTitle}</h1>
            </div>
            <div className="speakers-list is-flex">
              {speakerList.map(({ node: speaker }) => (
                  <Link to={`/speakers/${speaker.speaker_id}`}>
                    <Img className="speaker-image-wrapper" fixed={speaker.photo.local.childImageSharp.fixed}/>
                    <p>
                      {speaker.name}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query SpeakersListQuery {
    allSpeakers(sort: {fields: name, order: DESC}) {
      edges {
        node {
          id
          name
          photo {
            local {
              childImageSharp {
                fixed(width: 150, height: 150, cropFocus: CENTER) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
          speaker_id
        }
      }
    }
  }
`
