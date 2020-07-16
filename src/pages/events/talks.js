import React from "react";
import { Link, graphql } from "gatsby";
import Helmet from "react-helmet";
import Layout from "../../components/layout/layout";

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: talkList } = data.allTalksYaml;
    const pageTitle = "Talks";

    return (
      <Layout>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="twitter:title" content={pageTitle} />
          <meta property="og:title" content={pageTitle} />
        </Helmet>
        <h1>{pageTitle}</h1>

        {talkList.map(({ node: talk }) => (
          <div key={talk.id}>
            <h2>
              <Link
                to={`/events/talks/${talk.slug}`}
              >
                {talk.title}
              </Link>
            </h2>
            <p>by {talk.speakers.map((s) => s.name).join(", ")}</p>
          </div>
        ))}
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query TalksListQuery {
    allTalksYaml(sort: { fields: [title] }) {
      edges {
        node {
          title
          slug
          speakers {
            name
          }
        }
      }
    }
  }
`;
