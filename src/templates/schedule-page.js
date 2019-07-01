import React from "react"
import { graphql } from "gatsby"
import Helmet from "react-helmet"
import Layout from "../components/Layout"
import ScheduleSlot from "../components/ScheduleSlot"
import _ from 'lodash'
import strftime from 'strftime'

export default class SlottedSchedule extends React.Component {
  render() {
    const { data } = this.props
    const { edges: slotNodes } = data.allSlots
    const pageTitle = "PyOhio 2019 Schedule"
    const slots = slotNodes.map(({node: slot}) => slot)
    function dateFromTimestamp(timestamp) {
      const datetime = new Date(timestamp)
      const dateOnly = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate())
      return dateOnly
    }
    slots.map(slot => slot.day = dateFromTimestamp(slot.start) )
    const daySlots = _.groupBy(slots, "day")

    // TODO: refactor this! Move to a utility (component?) file and use from there
    function formatDatetime(timeString, format) {
      let formatted = ""
      const datetime = new Date(timeString)
      if (!isNaN(datetime)) {
        formatted = strftime(format, datetime)
      }
      return formatted
    }

    function formatDate(timeString) {
      return formatDatetime(timeString, "%A, %B %d")
    }

    function stringToID(timeString) {
      let formatted = ""
      const datetime = new Date(timeString)
      if (!isNaN(datetime)) {
        formatted = strftime('%s', datetime)
      }
      return formatted
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
            <div className="content">
              <h1 className="has-text-weight-bold is-size-2">{pageTitle}</h1>
            </div>
            <div className="table-of-contents">
              {/* I know ahead of time what these IDs will be,
                  which doesn't really excuse this not being
                  programmatic but #effort */}
              <ul>
                <li><a href="#1564113600">Friday, July 26</a></li>
                <li><a href="#1564200000">Saturday, July 27</a></li>
                <li><a href="#1564286400">Sunday, July 28</a></li>
              </ul>
            </div>
            {Object.entries(daySlots).map(([date, slots]) => (
              <div className="day" id={stringToID(date)} tabIndex="-1" key={stringToID(date)}>
                <h2 className="is-size-2">{formatDate(date)}</h2>
                {Object.entries(_.groupBy(slots, "section")).sort().reverse().map(([section, slots]) => (
                <div className="section" key={section}>
                  {Object.entries(_.groupBy(slots, "start")).map(([start, slots]) => (
                    <div className="time-block is-flex" key={start}>
                      <div className="time-block-label">
                      <p>Time to Time</p>
                      </div>
                      <div className="time-block-slots is-flex">
                      {slots.map((slot) => (
                        <ScheduleSlot slot={slot} key={slot.id}/>
                      ))}
                      </div>
                    </div>
                  ))}
                </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query SlotsQuery {
    allSlots(
      filter: { kind: { ne: "nothing" } }
      sort: { fields: [section, start, room_order] }
    ) {
      edges {
        node {
          id
          title
          kind
          end
          duration
          description_html
          presentation_id
          room
          rooms
          section
          speaker_name
          speakers {
            name
            speaker_id
          }
          start
          cancelled
        }
      }
    }
  }
`
