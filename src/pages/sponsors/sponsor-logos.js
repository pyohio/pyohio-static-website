import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Img from "gatsby-image"
import Layout from '../../components/Layout'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: sponsorLevels } = data.allSponsorLevels
    const pageTitle = "PyOhio 2019 Sponsors"
    const pageDescription = "PyOhio is FREE to attend thanks to the support of our sponsors."
    return (
      <div style={{textAlign: "center"}}>
            {sponsorLevels.filter(level => level.node.sponsors)
              .map(({ node: level }) => (
                <span
                  key={level.id}
                >
                  {level.sponsors.map((sponsor, index) => (
                        <Img fixed={sponsor.web_logo.local.childImageSharp.fixed}  alt={sponsor.web_logo.description}/>
                 ))}
                </span>
              ))}
</div>
    )
  }
}

export const pageQuery = graphql`
  query SponsorLogosQuery {
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
          web_logo {
            local {
              childImageSharp {
                fixed(width:200){
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
