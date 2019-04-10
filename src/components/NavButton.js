import React from 'react'

const NavButton = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          expanded: false,
        };

        this.setExpanded = this.setExpanded.bind(this);
    }

    setExpanded(event) {
        if (event && event.key) {
            if (event.key !== 'Enter' || event.key !== ' ') {
                return;
            }
        }

        this.setState(state => ({
            expanded: !state.expanded
        }));
    }

    render() {
        return (
            <button className="navbar-link" type="button"
                onClick={this.setExpanded} onKeyUp={this.setExpanded}
                aria-expanded={this.state.expanded ? true : false}>
                {this.props.name}
            </button>
        )
    }
}

export default NavButton