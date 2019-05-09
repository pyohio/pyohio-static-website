import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from "gatsby-image"

export default () => (
  <StaticQuery
    query={graphql`
      query SponsorsShowcaseQuery {
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
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-10 is-offset-1">
                <div className="section">
                  <h2 className="has-text-weight-bold is-size-2">Sponsors</h2>
                  <div className="content sponsor-showcase-container">
                  {data.allSponsorLevels.edges.filter(level => level.node.sponsors)
                    .map(({ node: level }) => (
                        level.sponsors.map((sponsor, index) => (
                          <div className="sponsor" key={index}>
                              <a href={sponsor.url}>
                                  <Img fixed={sponsor.web_logo.local.childImageSharp.fixed}  alt={sponsor.web_logo.description ? sponsor.web_logo.description : sponsor.name}/>
                              </a>
                          </div>
                        ))
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }
  />
)