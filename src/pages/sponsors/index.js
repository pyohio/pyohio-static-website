import React from 'react'
import { Link, graphql, withPrefix } from 'gatsby'
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
                {level.sponsors.map((sponsor, index) => (
                  <div>
                    <h3>{sponsor.name}</h3>
                    <Img fixed={sponsor.web_logo.local.childImageSharp.fixed}  alt={sponsor.web_logo.description}/>
                    <p>{sponsor.url}</p>
                    {sponsor.twitter && <p>@{sponsor.twitter}</p>}
                    <p>{sponsor.description}</p>
                  </div>
                ))}
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
