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
            {Object.entries(daySlots).map(([date, slots]) => (
              <div>
                <p className="title">{formatDate(date)}</p>
                {Object.entries(_.groupBy(slots, "section")).sort().reverse().map(([section, slots]) => (
                <div>
                  <p>{section}</p>
                  {slots.map((slot) => (
                    <ScheduleSlot slot={slot} key={slot.id}/>
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
