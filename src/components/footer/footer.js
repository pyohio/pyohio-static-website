import React from 'react';
import { Link } from 'gatsby';
import { Footer, Image, Paragraph, Anchor, Text } from 'grommet';

// this is to force grommet's styles on to gatsby's links
const linkProps = {
  color: 'control',
  weight: 'bold',
};

const CustomFooter = props => (
  <Footer
    direction="column"
    margin={{ bottom: '1.5rem' }}
    gap="none"
    justify="center"
    {...props}
  >
    <Paragraph>&copy; 2020 PyOhio</Paragraph>
    {/* <Paragraph margin={{ bottom: '0' }}>
      PyOhio is made possible by our premier sponsor:
    </Paragraph>
    <Anchor href="#">
      <Image alt="sponsor" src="https://placekitten.com/150/150" />
    </Anchor> */}
    <Anchor href="https://www.netlify.com">
      <Image
        src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
        alt="Netlify"
      />
    </Anchor>
    <Text {...linkProps}>
      <Link to="/about/newsletter">Sign up for our newsletter!</Link>
    </Text>
  </Footer>
);

export default CustomFooter;
