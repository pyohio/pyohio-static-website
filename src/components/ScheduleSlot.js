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
            {this.slot.kind !== 'plenary' && (
              <p className="schedule-speaker">{this.slot.speaker_name}</p>
            )}
            <p>{ this.slot.kind === 'break' || this.slot.title.includes('Registration') ? '' : `Location: ${this.slot.room}`}</p>
            { ['break', 'off-site'].includes(this.slot.kind) && (
                <div dangerouslySetInnerHTML={{__html:this.slot.description_html}}/>
            )}
            <p>
              {this.slot.presentation_id && (
              <Link
                  to={`/presentations/${this.slot.presentation_id}`}
              >
                  {this.slot.kind.charAt(0).toUpperCase() + this.slot.kind.slice(1)} details
              </Link>
              )}
              { this.slot.feedback_url && (
              <div className="">
                <a href={`${this.slot.feedback_url}`} className="button is-link">Rate this session</a>
              </div>
              )}
              { this.slot.kind === 'tutorial' && (
                <p><em><Link to='/attend/register'>Requires pre-registration</Link></em></p>
              )}
            </p>
          </div>
        </div>
      </div>
    )
  }
}