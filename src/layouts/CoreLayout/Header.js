import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl, defineMessages } from 'react-intl'
import { AppBar } from 'material-ui'

import { openSidebar, closeSidebar } from 'redux/modules/site'
import { openSearch, closeSearch } from 'redux/modules/search'
import { tokenName, search } from 'config.json'

import { renderFormattedMessage } from 'redux/utils/intl'
import IconButton from 'material-ui/IconButton'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ChangeLocaleMenu from 'components/ChangeLocaleMenu'

const messages = defineMessages({
  website_name: {
    id: 'website_name',
    defaultMessage: '{currency} Wallet'
  }
})

class Header extends React.Component {
  _onLeftIconButtonTouchTap = (e) => {
    e.preventDefault()
    const { sidebarOpen, openSidebar } = this.props
    if (sidebarOpen === false) {
      openSidebar()
    }
  }

  handleSearchClick = () => {
    const {
      openSearch,
      closeSearch,
      searchIsOpen
    } = this.props

    if (searchIsOpen) {
      closeSearch()
    } else {
      openSearch()
    }
  }

  render () {
    const {
      isBigScreen,
      isMobile
    } = this.props
    let logo
    const appBarStyle = { flex: 'none' }
    const changeLocaleMenu = <ChangeLocaleMenu labelStyle={{ color: 'white' }} />

    return (
      <div id='header'>
        {logo}
        <AppBar
          title={<div>
            <img src={CustomTheme.headerLogoImage} style={{
              marginTop: 5,
              width: 50,
              height: 50,
              borderRadius: 50
            }} />
            {!isMobile && <span style={{ position: 'absolute', color: '#FECE1A', marginLeft: 8 }}>
              {renderFormattedMessage(messages.website_name, { currency: tokenName })}
            </span>}
          </div>}
          onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
          showMenuIconButton={!isBigScreen}
          iconElementRight={(<span>
            {changeLocaleMenu}
            {search.enabled && <IconButton
              iconStyle={{ color: 'white' }}
              onClick={this.handleSearchClick}>
              <ActionSearch />
            </IconButton>}
          </span>)}
          style={appBarStyle} />
      </div>
    )
  }
}

Header.propTypes = {
  intl: PropTypes.object.isRequired,
  isBigScreen: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  openSidebar: PropTypes.func,
  closeSidebar: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  searchIsOpen: PropTypes.bool,
  openSearch: PropTypes.func,
  closeSearch: PropTypes.func,
  sidebarOpen: PropTypes.bool
}

export default injectIntl(connect((state) => {
  const isLoggedIn = !!state.auth.account.secretPhrase
  const { locale } = state.intl
  const isBigScreen = state.browser.greaterThan.medium
  const isMobile = state.browser.lessThan.small
  const { searchIsOpen } = state.search
  const { sidebarOpen } = state.site

  return {
    isLoggedIn,
    locale,
    isBigScreen,
    isMobile,
    searchIsOpen,
    sidebarOpen,
    site: state.site
  }
}, (dispatch) => {
  return {
    openSidebar: () => {
      dispatch(openSidebar())
    },
    closeSidebar: () => {
      dispatch(closeSidebar())
    },
    openSearch: () => {
      dispatch(openSearch())
    },
    closeSearch: () => {
      dispatch(closeSearch())
    }
  }
})(Header))
