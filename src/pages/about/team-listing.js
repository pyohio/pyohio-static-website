import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from 'gatsby-image'
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
              <div className="card organizer-bio">
                <Img className="organizer-image-wrapper" fixed={organizer.photo.local.childImageSharp.fixed}/>
                <p className="title">
                  {organizer.name}
                </p>
                <p className="subtitle">{organizer.organizer_roles.join(", ")}</p>
                <div dangerouslySetInnerHTML={{__html: organizer.biography_html}}/>
              </div>
              ))}
            </div>
        </section>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query OrganizersListQuery {
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
