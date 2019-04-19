import React from 'react'
import { graphql } from 'gatsby'
import Img from "gatsby-image"
import Layout from '../../components/Layout'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: sponsorLevels } = data.allSponsorLevels

    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">PyOhio 2019 Sponsors</h1>
            </div>
            {sponsorLevels.filter(level => level.node.sponsors)
              .map(({ node: level }) => (
                <div
                  className="content"
                  key={level.id}
                >
                <h2>{level.name}</h2>
                <div className="sponsor-level-container">
                  {level.sponsors.map((sponsor, index) => (
                    <div className="card" key={index}>
                      <div className="card-image">
                        <Img fixed={sponsor.web_logo.local.childImageSharp.fixed}  alt={sponsor.web_logo.description}/>
                      </div>
                      <div className="card-header">
                        <h3 className="card-header-title">{sponsor.name}</h3>
                      </div>
                      <div className="card-content">
                        <p>{sponsor.description}</p>
                      </div>
                      <div className="card-footer">
                        <a href={sponsor.url} className="card-footer-item" aria-label={`Website for ${sponsor.name}`}>Website</a>
                        {sponsor.twitter && <a href={`https://twitter.com/${sponsor.twitter}`} className="card-footer-item" aria-label={`@${sponsor.twitter} on Twitter`}>@{sponsor.twitter}</a>}
                      </div>
                    </div>
                  ))}
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
                fixed(width:250){
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
`
