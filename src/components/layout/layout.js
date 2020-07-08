/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { Grommet, Box, Main, Grid } from 'grommet';

import CustomHeader from '../header/header';
import CustomFooter from '../footer/footer';
import './layout.css';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  // Add brand colors here once we're ready for them
  // Font face jacked from the output of https://theme-designer.grommet.io/Document
  const theme = {
    global: {
      font: {
        family: 'Noto Sans',
        face:
          "/* cyrillic-ext */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr6DRAW_0.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr4TRAW_0.woff2) format('woff2');\n  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* devanagari */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr5DRAW_0.woff2) format('woff2');\n  unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr6TRAW_0.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr5jRAW_0.woff2) format('woff2');\n  unicode-range: U+0370-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr6jRAW_0.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr6zRAW_0.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Noto Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Noto Sans'), local('NotoSans'), url(https://fonts.gstatic.com/s/notosans/v9/o-0IIpQlx3QUlC5A4PNr5TRA.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n\n/* latin-ext */\n@font-face {\n  font-family: 'Raleway';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Raleway'), local('Raleway-Regular'), url(https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyCMIT5lu.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Raleway';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Raleway'), local('Raleway-Regular'), url(https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyC0ITw.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n",
      },
      colors: {
        brand: '#333',
        backgroundBack: '#ddd',
      },
      heading: {
        font: {
          family: 'Raleway',
        },
      },
    },
    anchor: {
      textDecoration: 'underline',
    },
  };

  return (
    <Grommet theme={theme}>
      <Grid
        // embiggen footer when we add this year's sponsor
        rows={[['min-content', '160px'], '1fr', 'min-content']}
        columns={{ count: 'fit', size: '240px' }}
        gap="small"
      >
        <CustomHeader
          siteTitle={data.site.siteMetadata.title}
          style={{ gridRow: 1, gridColumn: '1 / -1' }}
        />
        <Box
          align="center"
          margin={{ top: '0', bottom: '0', left: '1rem', right: '1rem' }}
          style={{ gridRow: 2, gridColumn: '1 / -1' }}
        >
          <Main
            width={{ max: '80ch' }}
            border={{ color: 'brand', side: 'bottom', size: '2px' }}
            pad={{ bottom: '1rem' }}
            style={{ borderRadius: '0 0 5px 5px' }}
          >
            {children}
          </Main>
        </Box>
        <CustomFooter style={{ gridRow: 3, gridColumn: '1 / -1' }} />
      </Grid>
    </Grommet>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
