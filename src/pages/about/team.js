import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../../components/Layout'

export default class OrganizersPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: organizers } = data.allOrganizers
    const pageTitle = "PyOhio 2019 Organizing Team"

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
            {organizers.map(({ node: organizer }) => (
              <div>
                <p className="is-size-4">{organizer.organizer_roles.join(", ")}</p>
                <p>{organizer.name}</p>
              </div>
            ))}
            </div>
        </section>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query OrganizersSimpleListQuery {
    allOrganizers {
      edges {
        node {
          biography_html
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
          organizer_roles
          speaker_id
          twitter
        }
      }
    }
  }
`
