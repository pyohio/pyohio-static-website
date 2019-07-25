import React from "react"
import { graphql } from "gatsby"
import Helmet from "react-helmet"
import Layout from "../components/Layout"
import ScheduleSlot from "../components/ScheduleSlot"
import _ from 'lodash'
import moment from 'moment'

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
    slots.map(slot => slot.span = `${slot.start}-${slot.end}`)
    const daySlots = _.groupBy(slots, "day")

    function formatDate(timeString) {
      return moment(timeString).format('dddd, MMMM DD')
    }
    function formatTime(timeString) {
      return moment(timeString).format('h:mma')
    }

    function stringToID(timeString) {
      return moment(timeString).format('X')
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
            <div className="calendar-links">
            <p>
              <a className="button is-link" href="https://calendar.google.com/calendar/ical/pyohio.org_g6ed23i95jt8v8ciu4g3c24278%40group.calendar.google.com/public/basic.ics">iCal</a>
              <a className="button is-link" href="https://calendar.google.com/calendar?cid=cHlvaGlvLm9yZ19nNmVkMjNpOTVqdDh2OGNpdTRnM2MyNDI3OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t">Google Calendar</a>
              <a className="button is-link" href="https://calendar.google.com/calendar/embed?src=pyohio.org_g6ed23i95jt8v8ciu4g3c24278%40group.calendar.google.com&ctz=America%2FNew_York">Web Calendar</a>
            </p> 
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
                {Object.entries(_.groupBy(slots, "section_name")).sort().map(([section, slots]) => (
                <div className="section" key={section}>
                  <h3 className="is-size-3">{slots[0].section_name}</h3>
                  {Object.entries(_.groupBy(slots, "span")).map(([span, slots]) => (
                    <div className="time-block is-flex" key={span}>
                      <div className="time-wrapper">
                      <p>
                        <time>{formatTime(slots[0].start)}</time>
                      </p>
                      <p>to</p>
                      <p>
                        <time>{formatTime(slots[0].end)}</time>
                      </p>
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
          section_name
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
