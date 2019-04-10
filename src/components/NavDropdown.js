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

    setExpanded() {
        this.setState(state => ({
            expanded: !state.expanded
        }));
    }

    render() {
        return (
            <div className="navbar-item has-dropdown">
                <NavButton name={this.props.buttonName}/>
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
}

export default NavDropdown