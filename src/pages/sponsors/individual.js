import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../../components/Layout'

export default class SponsorsPage extends React.Component {
  render() {
    const { data } = this.props
    const { edges: sponsorList } = data.allIndividualSponsors
    const pageTitle = "PyOhio 2019 Individual Sponsors"

    return (
      <Layout>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="twitter:title" content={pageTitle} />
          <meta property="og:title" content={pageTitle} />
        </Helmet>
        <section className="section">
          <div className="container">
            <h1 className="has-text-weight-bold is-size-2">{pageTitle}</h1>
            <p><em>Thank you to our individual sponsors!</em></p>
            <div class="supporter-list">
              {sponsorList.map(({ node: sponsor }) => (
                  <p className="supporter-name">{sponsor.name}</p>
              ))}
            </div>
          </div>
        </section>
        <section>
        <div className="container">
          <div className="content">
            <h2>About Individual Sponsorship</h2>

          <p>PyOhio is proud to offer free admission to everyone however the event has significant costs. We need corporate sponsors to cover the bulk of these costs however we've had individuals ask how they can contribute. If you would like to make a financial contribution to PyOhio and would like your contribution to be recognized publicly you may indicate so when donating.</p>
          <p>For a $50+ donation, individual sponsors will get:</p>
          <ul>
          <li>Their name listed on the sponsors page (optional)</li>
          <li>A limited edition PyOhio Supporter sticker</li>
          </ul>

          <p>You may make a donation of any amount at the <a href="https://ti.to/pyohio/pyohio-2019">registration site</a>.</p>
          If you have already registered for PyOhio, make sure to only select the donation line item.
          <p>If you would like to keep your donation anonymous, leave the "who should we credit" field blank when checking out.</p>

          <p><strong>Please note:</strong></p>
          <ul>
          <li>This level is for <em>individuals only</em>.</li> Please don't include your company name in the credit line.
          <li>Donating doesn't automatically include registration. Be sure to also select a registration if you plan on attending PyOhio</li>
          </ul>

          <p>If your company would like to sponsor PyOhio, please see the <Link to="/sponsors/prospectus">Sponsors Prospectus</Link>.</p>

          <p>If you'd like to support PyOhio in some other way please email <a href="mailto:info@pyohio.org">info@pyohio.org</a>.</p>
          </div></div>
      </section>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query IndividualSponsorsQuery {
    allIndividualSponsors {
      edges {
        node {
          name
        }
      }
    } 
  }
`
