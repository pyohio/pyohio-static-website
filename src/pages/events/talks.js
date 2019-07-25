import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../../components/Layout'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: talkList } = data.allTalks
    const pageTitle = "PyOhio 2019 Talks"

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
            {talkList.map(({ node: talk }) => (
                <div
                  className="card"
                  key={talk.id}
                >
                  <div className="card-content">
                    <p className="title">
                      <Link to={`/presentations/${talk.presentation_id}`} title="Presentation details">
                      {talk.title}
                     </Link>
                    </p>
                    <p className="subtitle">{talk.speakers.map(s => s.name).join(", ")}</p>
                    <div dangerouslySetInnerHTML={{__html: talk.description_html}}/>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query TalksListQuery {
    allTalks(
      sort: {fields: [title]},
      filter: {kind: {nin: ["Keynote", "Plenary"]}}
      ) {
      edges {
        node {
          title
          presentation_id
          description_html
          kind
          speakers {
            name
          }
        }
      }
    }
  }
`
