import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Box, Heading } from 'grommet';
import Layout from '../components/layout/layout';
import Content, { HTMLContent } from '../components/content/content';
import SEO from '../components/seo/seo';

export const TalkPageTemplate = ({
  title,
  content,
  contentComponent,
  seoTitle,
}) => {
  const PageContent = contentComponent || Content

  return (
    <Box>
      <SEO title={seoTitle || title} />
      <Heading>{title}</Heading>
      <PageContent className="content" content={content} />
    </Box>
  );
};

TalkPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
  seoTitle: PropTypes.string,
};

const TalkPage = ({ data }) => {
  const { talksYaml: talk } = data;
  const pageTitle = `${talk.title}`;
  const speakerList = talk.speakers.map((speaker, key) =>
    `<h3>${speaker.name}</h3>
    <p>${speaker.biography}</p>`
  )

  const pageContent = `
    <div>
    <p>${talk.type}<p>
      ${talk.description}
    <h2>Presented by</h2>
    <div>${speakerList}</div>
    </div>

  `
  return (
    <Layout>
      <TalkPageTemplate
        contentComponent={HTMLContent}
        title={talk.title}
        content={pageContent}
        seoTitle={pageTitle}
        speakers={talk.speakers}
      />
    </Layout>
  );
};

TalkPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TalkPage;

export const talkPageQuery = graphql`
  query TalkPage($id: String!) {
    talksYaml(id: {eq: $id}) {
      title
      description
      type
      speakers {
        name
        biography
      }
    }
  }
`;
