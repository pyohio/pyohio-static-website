import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading } from 'grommet';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import Newsletter from '../components/newsletter/newsletter';

export const NewsletterPageTemplate = ({ title, seoTitle }) => {
  return (
    <Box>
      <SEO title={seoTitle || title} />
      <Heading>{title}</Heading>
      <p><a href="https://pyohio.us3.list-manage.com/subscribe?u=8c9245b985e483ce2777296fb&id=ebb557184f">Subscribe here!</a></p>
    </Box>
  );
};

NewsletterPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  seoTitle: PropTypes.string,
};

const NewsletterPage = ({ data }) => {
  const { markdownRemark: post } = data;
  const pageTitle = `${post.frontmatter.title}`;
  return (
    <Layout>
      <NewsletterPageTemplate
        title={post.frontmatter.title}
        seoTitle={pageTitle}
      />
    </Layout>
  );
};

NewsletterPage.propTypes = {
  data: PropTypes.object,
};

export default NewsletterPage;

export const newsletterPageQuery = graphql`
  query NewsletterPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
