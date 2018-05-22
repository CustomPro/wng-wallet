import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider as IntlProvider } from 'react-intl-redux'

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  render () {
    const { history, routes, store } = this.props

    return (
      <IntlProvider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={history} children={routes} />
        </div>
      </IntlProvider>
    )
  }
}

export default AppContainer
