/** @jsx jsx */

import { Layout, Seo } from "gatsby-theme-catalyst-core"
import React from "react"
import { Link, graphql } from "gatsby"
import { jsx, Message, Themed } from "theme-ui"

export default class TalksPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: talkList } = data.allTalksYaml

    return (
      <Layout>
        <Seo title="PyOhio 2022 Talks" />
        <Themed.h1>Talks</Themed.h1>
        <Message sx={{ backgroundColor: "muted" }}>
          TBA:{" "}
          <Themed.a as={Link} to={`/program/schedule`}>
            Detailed schedule TBA
          </Themed.a>
        </Message>

        {talkList.map(({ node: talk }) => (
          <div key={talk.id}>
            <Themed.p
              as="h2"
              sx={{
                fontSize: 3,
                lineHeight: 1.25,
                pt: `20px`,
              }}
            >
              <Themed.a
                as={Link}
                to={`/program/talks/${talk.slug}`}
                sx={{ color: "highlight" }}
              >
                {talk.title}
              </Themed.a>
            </Themed.p>
            <Themed.p
              sx={{
                fontSize: 1,
                lineHeight: 1,
              }}
            >
              by{" "}
              {talk.speakers
                .map((s) => (
                  <Themed.a as={Link} to={`/program/speakers/${s.slug}`}>
                    {s.name}
                  </Themed.a>
                ))
                .reduce((prev, curr) => [prev, ", ", curr])}
            </Themed.p>
          </div>
        ))}
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query TalksListQuery {
    allTalksYaml(sort: { fields: [title] }, filter: { type: { ne: "Break" } }) {
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
`
