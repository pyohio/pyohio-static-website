import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'

export default class Footer extends React.Component {
    render() {

        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>&copy; 2019 PyOhio - PyOhio is made possible by our premier sponsor:</p>
                    {/* <Img/> */}
                    <p>and our other sponsors.</p>
                </div>
            </footer>
        );
    }
}