/** @jsx jsx */

import { Layout, Seo } from "gatsby-theme-catalyst-core"
import React from "react"
import { Link, graphql } from "gatsby"
import { jsx, Message, Themed } from "theme-ui"
import { format } from "date-fns"

export default class TalksPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: talkList } = data.allTalksYaml

    return (
      <Layout>
        <Seo title="PyOhio 2021 Schedule" />
        <Themed.h1>Schedule</Themed.h1>
        <Message sx={{ backgroundColor: "muted" }}>
          PyOhio is July 31, 2021. All times EDT.
        </Message>

        <Themed.table
          sx={{
            tr: {
              td: {
                border: "2px solid",
                borderColor: "muted",
                pl: "10px",
                pr: "10px",
              },
              th: {
                backgroundColor: "muted",
              },
            },
          }}
        >
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Talk</th>
          </tr>
          {talkList.map(({ node: talk }) => (
            <tr key={talk.id}>
              <td>{format(new Date(talk.start_time), "hh:mma")}</td>
              <td>{format(new Date(talk.end_time), "hh:mma")}</td>

              <td>
                <Themed.a
                  as="h2"
                  sx={{
                    fontSize: 2,
                  }}
                >
                  <Themed.a
                    as={Link}
                    to={`/program/talks/${talk.slug}`}
                    sx={{ color: "highlight" }}
                  >
                    {talk.title}
                  </Themed.a>
                </Themed.a>
                by{" "}
                {talk.speakers
                  .map((s) => (
                    <Themed.a as={Link} to={`/program/speakers/${s.slug}`}>
                      {s.name}
                    </Themed.a>
                  ))
                  .reduce((prev, curr) => [prev, ", ", curr])}
              </td>
            </tr>
          ))}
        </Themed.table>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query TalkScheduleQuery {
    allTalksYaml(
      sort: { fields: [start_time] }
      filter: { type: { ne: "Bonus Talk" } }
    ) {
      edges {
        node {
          title
          slug
          type
          start_time
          end_time
          speakers {
            name
            slug
          }
        }
      }
    }
  }
`
