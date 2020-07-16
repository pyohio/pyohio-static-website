import React from 'react';
import { Link, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../../components/layout/layout';

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: sprintList } = data.allSprintsYaml;
    const pageTitle = 'Sprints';

    return (
      <Layout>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="twitter:title" content={pageTitle} />
          <meta property="og:title" content={pageTitle} />
        </Helmet>
        <h1>{pageTitle}</h1>
        <p>
          For more information on sprints or to submit your own, see:{' '}
          <Link to={`/events/overview#sprints`}>Events Overview: Sprints</Link>
        </p>
        {sprintList.map(({ node: sprint }) => (
          <div key={sprint.id}>
            <h2>{sprint.name}</h2>
            <p>Organized by: {sprint.organizers.join(', ')}</p>
            <p>Times: {sprint.when}</p>
            <p>
              URL: <a href={sprint.project_url}>{sprint.project_url}</a> (
              <a href={sprint.getting_started_url}>getting started</a>)
            </p>
            <p dangerouslySetInnerHTML={{ __html: sprint.description }}></p>
            <p dangerouslySetInnerHTML={{ __html: sprint.objectives }}></p>
          </div>
        ))}
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query SprintsListQuery {
    allSprintsYaml(sort: { fields: [name] }) {
      edges {
        node {
          name
          objectives
          organizers
          when
          getting_started_url
          description
          project_url
        }
      }
    }
  }
`;
