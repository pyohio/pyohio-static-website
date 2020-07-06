import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Box, Heading, Text } from 'grommet';
import Layout from '../components/layout/layout';
import Content, { HTMLContent } from '../components/content/content';
import SEO from '../components/seo/seo';

export const EventPageTemplate = ({
  title,
  content,
  contentComponent,
  seoTitle,
  pageKey,
}) => {
  const PageContent = contentComponent || Content;

  const secondaryLinks = [
    {
      key: 'ov',
      href: '/events/overview',
      text: 'Events Overview',
    },
    {
      key: 'sch',
      href: '/events/schedule',
      text: 'Schedule of Events',
    },
    {
      href: '/events/talks',
      text: 'List of Talks',
    },
  ];

  // this is to force grommet's styles on to gatsby's links
  const linkProps = {
    color: 'control',
    weight: 'bold',
  };

  return (
    <Box>
      <SEO title={seoTitle || title} />
      <Box
        as="nav"
        direction="row"
        pad="medium"
        background="backgroundBack"
        justify="around"
        wrap="true"
        margin={{ bottom: 'xsmall' }}
        style={{ borderRadius: '5px' }}
      >
        {secondaryLinks.map(item =>
          item.key === pageKey ? (
            <></>
          ) : (
            <Text {...linkProps}>
              <Link key={item.key} to={item.href} margin="small">
                {item.text}
              </Link>
            </Text>
          )
        )}
      </Box>
      <Heading>{title}</Heading>
      <PageContent className="content" content={content} />
    </Box>
  );
};

EventPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  seoTitle: PropTypes.string,
  pageKey: PropTypes.string,
};

const EventPage = ({ data }) => {
  const { markdownRemark: post } = data;
  const pageTitle = `${post.frontmatter.title}`;
  return (
    <Layout>
      <EventPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
        seoTitle={pageTitle}
        pageKey={post.frontmatter.pageKey}
      />
    </Layout>
  );
};

EventPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default EventPage;

export const eventPageQuery = graphql`
  query EventPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        pageKey
      }
    }
  }
`;
