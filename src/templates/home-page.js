import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import SponsorShowcase from '../components/SponsorShowcase'
import logo from '../../static/img/pyohio-2019-transparent-300x225.png'

export const HomePageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <div>
      <div className="hero is-medium is-primary">
        <div className="hero-body">
          <div className="columns">
            <div className="column is-one-third">
              <img src={logo} alt="PyOhio 2019 Logo"/>
            </div>
            <div className="column is-flex vertical-center">
              <div className="content">
                <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                  {title}
                </h1>
                <h2 className="subtitle">
                  The FREE Annual Python Conference in Ohio
                </h2>
                <p>
                  PyOhio 2019 is <strong>July 27-28, 2019</strong> at The Ohio Union in <strong>Columbus, OH</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-foot is-flex">
          <a href="https://ti.to/pyohio/pyohio-2019" className="button is-link is-large">Register to attend</a>
          <Link to="/speak/cfp" className="button is-link is-large">
            Call for Proposals
          </Link>
        </div>
      </div>
      <section className="section section--gradient">
        <div className="container">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="section">
                <div className="columns is-centered">
                  <div className="column">
                    <Link className="has-text-centered is-block" to="/events/talks">
                      <img className="center-image" src="https://placebear.com/500/500.jpg" alt=""/>
                      <p className="has-text-weight-bold">Talks</p>
                    </Link>
                  </div>
                  <div className="column">
                    <Link className="has-text-centered is-block" to="/events/tutorials">
                      <img className="center-image" src="https://placebear.com/500/500.jpg" alt=""/>
                      <p className="has-text-weight-bold">Tutorials</p>
                    </Link>
                  </div>
                  <div className="column">
                    <Link className="has-text-centered is-block" to="/events/reception-sprints">
                      <img className="center-image" src="https://placebear.com/500/500.jpg" alt=""/>
                      <p className="has-text-weight-bold">Sprints</p>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="columns is-centered">
                  <div className="column is-narrow-tablet">
                    <h3 className="is-size-4 has-text-centered">Important Info</h3>
                    <ul>
                      <li>
                        <Link to="/about/code-of-conduct">
                          Code of Conduct
                        </Link>
                      </li>
                      <li>
                        <Link to="/attend/travel-directions">
                          Directions &amp; Travel Info
                        </Link>
                      </li>
                      <li>
                        <Link to="/events">
                          Events Overview
                        </Link>
                      </li>
                      <li>Schedule (TBD)</li>
                    </ul>
                  </div>
                  <div className="column is-narrow-tablet">
                    <h3 className="is-size-4 has-text-centered">Keep in Touch</h3>
                    <ul>
                      <li>
                        <Link to="/news/keep-in-touch">
                          Subscribe to our mailing list for updates
                        </Link>
                      </li>
                      <li>
                        <a href="https://slack.pyohio.org/">
                          Join us on Slack
                        </a>
                      </li>
                      <li>
                        <a href="https://twitter.com/pyohio">
                          Follow us on Twitter
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <PageContent className="content" content={content} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

HomePageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const HomePage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <HomePageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
      <SponsorShowcase/>
    </Layout>
  )
}

HomePage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default HomePage

export const homePageQuery = graphql`
  query HomePage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
