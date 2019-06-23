import React from "react"
import { Link } from "gatsby"
import strftime from "strftime"

export default class ScheduleSlot extends React.Component {
  constructor(props) {
    super(props);
    this.slot = props.slot;
  }
  render() {
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
      <div className="card schedule-item">
        <div className="card-content is-flex">
          <div className="time-wrapper">
            <p>
              <time>{formatTime(this.slot.start)}</time>
            </p>
            <p>
              to
            </p>
            <p>
              <time>{formatTime(this.slot.end)}</time>
            </p>
          </div>
          <div className="schedule-item-wrapper">
            <h3 className="title">{this.slot.title}</h3>
            <p className="subtitle">{this.slot.speaker_name}</p>
            <p>Room: {this.slot.room}</p>
            {/* <p>Kind: {this.slot.kind}</p> */}
            <div
                dangerouslySetInnerHTML={{ __html: this.slot.description_html }}
            />
            <p>
                {this.slot.presentation_id && (
                <Link
                    to={`/presentations/${this.slot.presentation_id}`}
                >
                    {this.slot.kind === 'talk' ? 'Presentation' : 'Tutorial'} details
                </Link>
                )}
            </p>
          </div>
        </div>
      </div>
    )
  }
}