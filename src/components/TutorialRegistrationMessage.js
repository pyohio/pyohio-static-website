import React from "react"
import { Link } from "gatsby"

export default class TutorialRegistrationMessage extends React.Component {
  render() {
    return (
      <article class="message is-primary">
      <div className="message-body">
        <strong>PLEASE NOTE:</strong> All tutorials have limited capacity
        and require pre-registration. <a href="https://ti.to/pyohio/pyohio-2019">Check availability and register here</a>.
        Be sure to <Link to="/news/keep-in-touch">subscribe to our newsletter</Link> for updates.
      </div>
    </article>
    )
  }
}