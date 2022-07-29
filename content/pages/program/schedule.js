/** @jsx jsx */

import { Layout, Seo } from "gatsby-theme-catalyst-core"
import React from "react"
import { Link, graphql } from "gatsby"
import { jsx, Message, Themed } from "theme-ui"
import { DateTime } from "luxon"

export default class TalksPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: talkList } = data.allTalksYaml

    function formatTime(timeString) {
      const talkTime = DateTime.fromISO(timeString)
      if (isNaN(talkTime)) {
        return "TBD"
      } else {
        return talkTime.setZone("America/New_York").toFormat("h:mma")
      }
    }

    return (
      <Layout>
        <Seo title="PyOhio 2022 Schedule" />
        <Themed.h1>Schedule</Themed.h1>
        {/* <Themed.h2>To be announced closer to the event!</Themed.h2> */}
        <Message sx={{ backgroundColor: "muted" }}>
          PyOhio is July 30, 2022. Times rounded to the nearest 5 mins. There
          are short breaks between groups of talks. All times EDT.
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
                border: "2px solid",
                borderColor: "muted",
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
              <td>{formatTime(talk.start_time)}</td>
              <td>{formatTime(talk.end_time)}</td>

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
                {talk.type !== "Break" && (
                  <span>
                    by{" "}
                    {talk.speakers
                      .map((s) => (
                        <Themed.a as={Link} to={`/program/speakers/${s.slug}`}>
                          {s.name}
                        </Themed.a>
                      ))
                      .reduce((prev, curr) => [prev, ", ", curr])}
                  </span>
                )}
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
