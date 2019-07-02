import React from "react"
import { Link } from "gatsby"

export default class ScheduleSlot extends React.Component {
  constructor(props) {
    super(props);
    this.slot = props.slot;
  }
  render() {
    return (
      <div className={`card schedule-item ${this.slot.kind === 'talk' ? 'schedule-talk' : 'schedule-non-talk'}`}>
        <div className="card-content is-flex">
          <div className="schedule-item-wrapper">
            <h3 className="schedule-title">{this.slot.title}</h3>
            <p className="schedule-speaker">{this.slot.speaker_name}</p>
            <p>{ this.slot.kind === 'break' || this.slot.title.includes('Registration') ? '' : `Room: ${this.slot.room}`}</p>
            <p>
                {this.slot.presentation_id && (
                <Link
                    to={`/presentations/${this.slot.presentation_id}`}
                >
                    {this.slot.kind.charAt(0).toUpperCase() + this.slot.kind.slice(1)} details
                </Link>
                )}
            </p>
          </div>
        </div>
      </div>
    )
  }
}