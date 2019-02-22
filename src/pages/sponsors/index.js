import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/Layout'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: sponsors } = data.allSponsorsYaml 

    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">PyOhio 2019 Sponsors</h1>
            </div>
            {sponsors
              .map(({ node: sponsor }) => (
                <div
                  className="content"
                  style={{ border: '1px solid #333', padding: '2em 4em' }}
                  key={sponsor.id}
                >
                <h2><a href={sponsor.url}>{sponsor.name}</a></h2>
                <p>{sponsor.description}</p>
                </div>
              ))}
          </div>
        </section>
      </Layout>
    )
  }
}

SponsorsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query SponsorsQuery {
    allSponsorsYaml(
      sort: { order:ASC, fields: [name] },
      filter: { active: {eq: true} }
    ) {
      edges {
        node {
          id,
          name,
          url,
          description
        }
      }
    }
  }
`
