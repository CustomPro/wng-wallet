import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import DocumentTitle from 'react-document-title'
import { tokenName } from 'config.json'

class PageTitle extends React.Component {

  capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  render () {
    const {
      pageName
    } = this.props

    // const siteName = formatMessage({ id: 'website_name' })
    const siteName = `${tokenName} Wallet`
    const pageTitle = this.capitalizeFirstLetter(pageName)

    return (
      <DocumentTitle title={`${pageTitle} | ${siteName}`}>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {this.props.children}
        </div>
      </DocumentTitle>
    )
  }
}

PageTitle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  intl: PropTypes.object.isRequired,
  pageName: PropTypes.string.isRequired
}

PageTitle.defaultProps = {
  pageName: 'home'
}

export default injectIntl(PageTitle)
