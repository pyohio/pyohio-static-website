import React from 'react';

const Newsletter = () => {
  return (
    <>
      <link
        href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css"
        rel="stylesheet"
        type="text/css"
      />
      <div id="mc_embed_signup">
        <form
          action="https://pyohio.us3.list-manage.com/subscribe/post?u=8c9245b985e483ce2777296fb&amp;id=ebb557184f"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          novalidate
        >
          <div id="mc_embed_signup_scroll">
            <div className="indicates-required">
              <span className="asterisk">*</span> indicates required
            </div>
            <div className="mc-field-group">
              <label for="mce-EMAIL">
                Email Address <span className="asterisk">*</span>
              </label>
              <input
                type="email"
                value=""
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
              />
            </div>
            <div className="mc-field-group">
              <label for="mce-FNAME">First Name </label>
              <input
                type="text"
                value=""
                name="FNAME"
                className=""
                id="mce-FNAME"
              />
            </div>
            <div className="mc-field-group">
              <label for="mce-LNAME">Last Name </label>
              <input
                type="text"
                value=""
                name="LNAME"
                className=""
                id="mce-LNAME"
              />
            </div>
            <div className="mc-field-group input-group">
              <strong>Email Format </strong>
              <ul>
                <li>
                  <input
                    type="radio"
                    value="html"
                    name="EMAILTYPE"
                    id="mce-EMAILTYPE-0"
                  />{' '}
                  <label for="mce-EMAILTYPE-0">html</label>
                </li>
                <li>
                  <input
                    type="radio"
                    value="text"
                    name="EMAILTYPE"
                    id="mce-EMAILTYPE-1"
                  />{' '}
                  <label for="mce-EMAILTYPE-1">text</label>
                </li>
              </ul>
            </div>
            <p>
              <a href="https://us3.campaign-archive.com/home/?u=8c9245b985e483ce2777296fb&id=ebb557184f">
                View previous campaigns
              </a>
            </p>
            <div id="mce-responses" className="clear">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: 'none' }}
              ></div>
              <div
                className="response"
                id="mce-success-response"
                style={{ display: 'none' }}
              ></div>
            </div>
            {/* Bot honeypot */}
            <div
              style={{ position: 'absolute', left: '-5000px' }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_8c9245b985e483ce2777296fb_ebb557184f"
                tabindex="-1"
                value=""
              />
            </div>
            <div className="clear">
              <input
                type="submit"
                value="Subscribe"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Newsletter;
