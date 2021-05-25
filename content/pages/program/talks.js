/** @jsx jsx */

import Layout from "gatsby-theme-catalyst-core/src/components/layout"
import React from "react";
import {Link, graphql} from "gatsby";
import { jsx, Themed } from "theme-ui"


export default class TalksPage extends React.Component {
    render() {
        const { data } = this.props;
        const { edges: talkList } = data.allTalksYaml;

        return (
            <Layout>
                <Themed.h1>Talks</Themed.h1>

        {talkList.map(({ node: talk }) => (
          <div key={talk.id}>
            <Themed.p
                as="h2"
                sx={{
                    fontSize: 3,
                    lineHeight:1.25,
                    pt: `20px`,
                }}
            >
              <Themed.a
                as={Link}
                to={`/events/talks/${talk.slug}`}
              >
                {talk.title}
              </Themed.a>
            </Themed.p>
            <Themed.p
              sx={{
                  fontSize: 1,
                  lineHeight: 1,
              }}
            >by {talk.speakers
                .map(s => <Themed.a as={Link} to={`/program/speakers/${s.slug}`}>{s.name}</Themed.a>)
                .reduce((prev, curr) => [prev, ', ', curr])}</Themed.p>
          </div>
        ))}
            </Layout>
        )
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
            slug
          }
        }
      }
    }
  }
`;