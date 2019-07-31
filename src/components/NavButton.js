import React from 'react'

const NavButton = class extends React.Component {

    render() {
        return (
            <button className="navbar-link" type="button" 
            onClick={this.props.onClick} onKeyUp={this.props.onKeyUp}
            aria-expanded={this.props.ariaExpanded}
            onMouseOver={this.props.onMouseOver}
            onMouseOut={this.props.onMouseOut}>
                {this.props.name}
            </button>
        )
    }
};

export default NavButton;