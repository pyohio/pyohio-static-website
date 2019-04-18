import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from "gatsby-image"
import Layout from '../components/Layout'

export default () => (
  <StaticQuery
    query={graphql`
      query SponsorsQuery {
        allSponsorLevels(
          sort: {fields:order}
          filter: {order: {lt: 100}}
        ) {
          edges {
            node {
              id
              name
              cost
              order
              sponsors {
                id
                name
                description
                url
                twitter
                web_logo {
                  local {
                    childImageSharp {
                      fixed(width:250) {
                        ...GatsbyImageSharpFixed
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={
      data => (
        <Layout>
          <section className="section">
            <div className="container">
              <div className="content">
                <h2 className="has-text-weight-bold is-size-2">Sponsors</h2>
              </div>
              {data.edges.filter(level => level.node.sponsors)
                .map(({ node: level }) => (
                  <div
                    className="content sponsor-showcase-container"
                    key={level.id}
                  >
                    {level.sponsors.map((sponsor, index) => (
                      <div className="sponsor" key={index}>
                          <a href={sponsor.url}>
                              <Img fixed={sponsor.web_logo.local.childImageSharp.fixed}  alt={sponsor.web_logo.description}/>
                          </a>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </section>
        </Layout>
      )
    }
  />
)