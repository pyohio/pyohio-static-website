import React from 'react'

const NavButton = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          expanded: false,
        };
    }

    render() {
        return (
            <button className="navbar-link" type="button" 
            onClick={this.props.onClick} onKeyUp={this.props.onKeyUp}
            aria-expanded={this.props.ariaExpanded}>
                {this.props.name}
            </button>
        )
    }
}

export default NavButton