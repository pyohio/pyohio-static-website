import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const Footer = () => (
    <StaticQuery
        query={graphql`
            query sponsorsQuery {
                allSponsorLevels(filter: {name: {eq: "Non-Profit"}}) {
                    edges {
                        node {
                            name
                            sponsors {
                                name
                                web_logo {
                                    local {
                                        childImageSharp{
                                            resize(height: 50) {
                                                src
                                                tracedSVG
                                                width
                                                height
                                                aspectRatio
                                                originalName
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
                <footer className="footer">
                    <div className="content has-text-centered">
                        <p>&copy; 2019 PyOhio - PyOhio is made possible by our premier sponsor:</p>
                        <Img fixed={data.allSponsorLevels.edges[0].node.sponsors[0].web_logo.local.childImageSharp.resize}
                            alt={data.allSponsorLevels.edges[0].node.sponsors[0].name}
                            />
                        <p>and our other sponsors.</p>
                    </div>
                </footer>
            )
        }
    />
)

export default Footer