import React from 'react'
import { Link } from 'gatsby'
import NavButton from '../components/NavButton'

const NavDropdown = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          expanded: false,
        };

        this.setExpanded = this.setExpanded.bind(this);
    }

    setExpanded(event) {
        if (event) {
            if (event.key && (event.key !== 'Enter' && event.key !== ' ')) {
                return;
            }

            // Prevent expanding/collapsing from being reversed
            if (event.dispatchConfig && event.dispatchConfig.phasedRegistrationNames) {
                let action = event.dispatchConfig.phasedRegistrationNames.bubbled;
                if (action === 'onMouseOver' && this.state.expanded
                    || action === 'onMouseOut' && !this.state.expanded)
                    return;
            }
        }

        // Open/close dropdowns
        this.props.handleDropdownClick(this);
    }

    render() {
        return (
            <div className={this.state.expanded ? "navbar-item has-dropdown is-active" : "navbar-item has-dropdown"}
                 onMouseOver={this.setExpanded}
                 onMouseOut={this.setExpanded}>
                <NavButton name={this.props.buttonName} onClick={this.setExpanded}
                    onKeyUp={this.setExpanded}
                    ariaExpanded={this.state.expanded}
                    />
                <div className="navbar-dropdown">
                    {this.props.links.map((link) =>
                        <Link className="navbar-item" to={link.url} key={link.url}>
                            {link.name}
                        </Link>
                    )}
                </div>
            </div>
        )
    }
};

export default NavDropdown;