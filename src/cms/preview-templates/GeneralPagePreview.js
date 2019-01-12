import React from 'react'
import PropTypes from 'prop-types'
import { GeneralPageTemplate } from '../../templates/general-page'

const GeneralPagePreview = ({ entry, widgetFor }) => (
  <GeneralPageTemplate
    title={entry.getIn(['data', 'title'])}
    content={widgetFor('body')}
  />
)

GeneralPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default GeneralPagePreview
