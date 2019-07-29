import React from 'react'
import { Link } from 'gatsby'
import NavDropdown from '../components/NavDropdown'
import github from '../img/github-icon.svg'
import logo from '../img/pyohio-logo-small.png'

const Navbar = class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      burgerExpanded: false,
      expandedDropdown: null
    };

    this.handleBurgerClick = this.handleBurgerClick.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
  }

  handleBurgerClick() {
    this.setState(state => ({
      burgerExpanded: !state.burgerExpanded
    }));
  }

  handleDropdownClick(dropdown) {
    this.setState(state => {
      let newExpandedDropdown = null;
      // Close currently expanded dropdown (if one open)
      if (state.expandedDropdown) {
        state.expandedDropdown.setState({
          expanded: false
        });
      }
      // Open new dropdown if it is not the one just closed
      if (state.expandedDropdown !== dropdown) {
        dropdown.setState({
          expanded: true
        });
        // Set new dropdown that's expanded
        newExpandedDropdown = dropdown;
      }
      return {expandedDropdown: newExpandedDropdown};
    });
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
        <button className={this.state.burgerExpanded ? "navbar-burger burger is-active" : "navbar-burger burger"}
                data-target="navMenu"
                onClick={this.handleBurgerClick}
                aria-label="hamburger menu"
                aria-expanded={this.state.burgerExpanded}>
          <span/>
          <span/>
          <span/>
        </button>
      </div>
      <div id="navMenu" className={this.state.burgerExpanded ? "navbar-menu is-active" : "navbar-menu"}>
      <div className="navbar-start has-text-centered">
        <NavDropdown
          buttonName={'About'}
          handleDropdownClick={this.handleDropdownClick}
          links={[
          {name: 'About PyOhio', url: '/about'},
          {name: 'Code of Conduct', url: '/about/code-of-conduct'},
          {name: 'Organizing Team', url: '/about/team'},
          {name: 'Speakers', url: '/about/speakers'},
          {name: 'Newsletter', url: '/news/keep-in-touch'}
          ]}/>
        {/* <NavDropdown buttonName={'News'} links={[
          {name: 'PyOhio News', url: '/news'},
          
        ]}/> */}
        <NavDropdown
          buttonName={'Events'}
          handleDropdownClick={this.handleDropdownClick}
          links={[
          {name: 'Events Overview', url: '/events'},
          {name: 'Full Schedule', url: '/events/schedule'},
          {name: 'Talks', url: '/events/talks'},
          {name: 'Tutorials', url: '/events/tutorials'},
          {name: 'Reception & Sprints', url: '/events/reception-sprints'},
          {name: 'MicroPython on FPGAs Hackfest', url: '/events/hackfest'},
          {name: 'Young Coders', url: '/events/young-coders'},
          {name: 'Lightning Talks', url: '/events/lightning-talks'}
        ]}/>
        <NavDropdown
          buttonName={'Attend'}
          handleDropdownClick={this.handleDropdownClick}
          links={[
          {name: 'Register', url: '/attend/register'},
          {name: 'Volunteer', url: '/attend/volunteer'},
          {name: 'Travel & Directions', url: '/attend/travel-directions'},
          {name: 'Hotels', url: '/attend/hotels'},
          {name: 'Venue', url: '/attend/venue'},
          {name: 'Food', url: '/attend/food'}
        ]}/>
        <NavDropdown
          buttonName={'Sponsors'}
          handleDropdownClick={this.handleDropdownClick}
          links={[
          {name: 'Our Sponsors', url: '/sponsors'},
          {name: 'Prospectus', url: '/sponsors/prospectus'},
          {name: 'Individual Sponsors', url: '/sponsors/individual'}
        ]}/>
        {/* <NavDropdown buttonName={'Speak'} links={[
          {name: 'Call for Proposals', url: '/speak/cfp'},
          {name: 'Talk Selection Process', url: '/speak/selection'},
          {name: 'Review Proposals', url: '/speak/review-proposals'}
        ]}/> */}
        <Link className="navbar-item" to="/jobs">
          Job Listings
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
};

export default Navbar;