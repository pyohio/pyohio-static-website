import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const GeneralPageTemplate = ({ title, content, contentComponent, helmet }) => {
  const PageContent = contentComponent || Content

  return (
    <section className="section section--gradient">
      {helmet || ''}
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                {title}
              </h1>
              <PageContent className="content" content={content} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

GeneralPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  helmet: PropTypes.object,
}

const GeneralPage = ({ data }) => {
  const { markdownRemark: post } = data
  const pageTitle = `PyOhio 2019 - ${post.frontmatter.title}`
  return (
    <Layout>
      <GeneralPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
        helmet={
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="twitter:title" content={pageTitle} />
            <meta property="og:title" content={pageTitle} />
          </Helmet>
        }

      />
    </Layout>
  )
}

GeneralPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default GeneralPage

export const generalPageQuery = graphql`
  query GeneralPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
