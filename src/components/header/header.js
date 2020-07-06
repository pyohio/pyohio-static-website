import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'gatsby';
import { Header, Box, Anchor, Text } from 'grommet';
import { Github } from 'grommet-icons';
import Logo from '../image/logo';

// this is to force grommet's styles on to gatsby's links
const linkProps = {
  color: 'control',
  weight: 'bold',
};

const CustomHeader = ({ siteTitle, ...props }) => (
  <Header
    align="center"
    background="brand"
    justify="center"
    overflow="visible"
    {...props}
  >
    {/* Wrapper to let us have the header background extend full width, even if we want to contain stuff to be smaller */}
    <Box
      pad="1rem"
      direction="row"
      align="center"
      justify="around"
      width="100%"
      wrap={true}
    >
      <Box>
        <Link to="/">
          <Logo />
        </Link>
      </Box>
      <Box
        direction="row"
        as="nav"
        flex={{ grow: 1 }}
        justify="end"
        wrap={true}
        className="bad-nav"
      >
        <Box pad="small">
          <Text {...linkProps}>
            <Link to="/about">About PyOhio</Link>
          </Text>
        </Box>
        <Box pad="small">
          <Text {...linkProps}>
            <Link to="/events/overview">Events</Link>
          </Text>
        </Box>
        <Box pad="small">
          {/* Change this up later on (/attend/venue maybe?) */}
          <Text {...linkProps}>
            <Link to="/attend/register">Attend</Link>
          </Text>
        </Box>
        <Box pad="small">
          {/* Change to sponsors landing when we get a list (change word to "Sponsors") */}
          <Text {...linkProps}>
            <Link to="/sponsors/become">Sponsorship</Link>
          </Text>
        </Box>
        <Box pad="small">
          <Anchor href="https://github.com/pyohio/pyohio-static-website">
            <Text className="sr-only">View this site on GitHub</Text>
            <Github />
          </Anchor>
        </Box>
      </Box>
    </Box>
  </Header>
);

CustomHeader.propTypes = {
  siteTitle: PropTypes.string,
};

CustomHeader.defaultProps = {
  siteTitle: ``,
};

export default CustomHeader;
