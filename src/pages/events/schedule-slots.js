import React from "react"
import { Link, graphql } from "gatsby"
import Helmet from "react-helmet"
import Layout from "../../components/Layout"
import strftime from "strftime"

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: slots } = data.allSlots
    const pageTitle = "PyOhio 2019 Schedule"

    function formatDatetime(timeString, format) {
      let formatted = ""
      const datetime = new Date(timeString)
      if (!isNaN(datetime)) {
        formatted = strftime(format, datetime)
      }
      return formatted
    }

    function formatTime(timeString) {
      return formatDatetime(timeString, "%-I:%M%P")
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
            {slots.map(({ node: slot }) => (
              <div className="card" key={slot.id}>
                <div className="card-content">
                  <p className="title">{slot.title}</p>
                  <p className="subtitle">{slot.speaker_name}</p>
                  <p>Room: {slot.room}</p>
                  <p>Date: {formatDate(slot.start)}</p>
                  <p>Start: {formatTime(slot.start)}</p>
                  <p>End: {formatTime(slot.end)}</p>
                  <p>Kind: {slot.kind}</p>
                  <div
                    dangerouslySetInnerHTML={{ __html: slot.description_html }}
                  />
                  <p>
                    {slot.presentation_id && (
                      <Link
                        to={`/presentations/${slot.presentation_id}`}
                        title="Presentation details"
                      >
                        More details
                      </Link>
                    )}
                  </p>
                </div>
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
      sort: { fields: [start, room] }
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
