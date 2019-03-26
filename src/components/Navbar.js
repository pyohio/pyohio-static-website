import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/pyohio-logo-small.png'

const Navbar = class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      burgerExpanded: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      burgerExpanded: !state.burgerExpanded
    }));
  }
 
 render() {
   return (
  
  <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
    <div className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item" title="Logo">
          <img src={logo} alt="PyOhio 2019"  />
        </Link>
        {/* Hamburger menu */}
        <button className={this.state.burgerExpanded ? "navbar-burger burger is-active" : "navbar-burger burger"} data-target="navMenu" onClick={this.handleClick} aria-label="hamburger menu" aria-expanded={this.state.burgerExpanded ? true : false}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div id="navMenu" className={this.state.burgerExpanded ? "navbar-menu is-active" : "navbar-menu"}>
      <div className="navbar-start has-text-centered">
        <Link className="navbar-item" to="/about">
          About
        </Link>
        <Link className="navbar-item" to="/news">
          News
        </Link>
        <Link className="navbar-item" to="/sponsorship">
          Sponsorship
        </Link>
       </div>
      <div className="navbar-end has-text-centered">
        <a
          className="navbar-item"
          href="https://github.com/pyohio/pyohio-static-website"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon">
            <img src={github} alt="Github" />
          </span>
        </a>
      </div>
      </div>
    </div>
  </nav>
  )}
}

export default Navbar
