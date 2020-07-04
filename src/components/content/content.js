import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';

export const HTMLContent = ({ content, className }) => (
  <Box className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

const Content = ({ content, className }) => (
  <Box className={className}>{content}</Box>
);

Content.propTypes = {
  content: PropTypes.node,
  className: PropTypes.string,
};

HTMLContent.propTypes = Content.propTypes;

export default Content;
