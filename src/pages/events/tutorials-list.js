import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../../components/Layout'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: talkList } = data.allTutorials
    function description(html) {
      return {__html: html}
    }
    const pageTitle = "PyOhio 2019 Tutorials"

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

            <article class="message">
              <div class="message-body">
                <strong>Please note:</strong> All tutorials have limited capacity
                and require pre-registration. Registration will open in early July.
                Be sure to <Link to="/news/keep-in-touch">subscribe to our mailing
                list</Link> for updates.
              </div>
            </article>

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
                    <p className="content" dangerouslySetInnerHTML={description(talk.description_html)}/>
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
  query TutorialsListQuery {
    allTutorials(
      sort: {fields: [title]}
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
