import React from 'react'
import {  graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../../components/Layout'
import moment from 'moment'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: talkList } = data.allTalks
    const pageTitle = "PyOhio 2019 Talks"

    function formatDay(timeString) {
      return moment(timeString).format('dddd')
    }
    function formatTime(timeString) {
      return moment(timeString).format('h:mma')
    }

    return (
      <Layout>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="twitter:title" content={pageTitle} />
          <meta property="og:title" content={pageTitle} />
        </Helmet>
        <section className="section">
          <div className="container">
            <div className="room-sign">-</div>
            {talkList.map(({ node: talk }) => (
                <div
                  className="room-sign"
                  key={talk.id}
                >
                  <p className="sign-room-name">{talk.schedule.room}</p>
                    <p className="title sign-title">
                      {talk.title}
                    </p>
                    <p className="subtitle sign-speakers">{talk.speakers.map(s => s.name).join(", ")}</p>
                    <p className="sign-times">{formatDay(talk.schedule.start)} {formatTime(talk.schedule.start)} - {formatTime(talk.schedule.end)}</p>
                  </div>
              ))}
          </div>
        </section>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query TalksSignsQuery {
    allTalks(
      sort: {order: ASC, fields: start_time},
      filter: {kind: {nin: ["Keynote", "Plenary"]}}
      ) {
      edges {
        node {
          title
          presentation_id
          description_html
          kind
          schedule {
            end
            room
            start
          }
          speakers {
            name
          }
        }
      }
    }
  }
`
