import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import createMemoryHistory from 'history/lib/createMemoryHistory'
import createHashHistory from 'history/lib/createHashHistory'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import createRoutes from './routes'
import AppContainer from 'containers/AppContainer'

import configureStore from './redux/createStore'
import { isLocalhost } from 'config.json'

import { getVersion, getConstants, getBlockchainStatus } from 'redux/modules/site'

injectTapEventPlugin()

let createHistory
if (__ANDROID__) {
  createHistory = createHashHistory
} else if (isLocalhost) {
  createHistory = createMemoryHistory
} else {
  createHistory = createBrowserHistory
}

// Configure history for react-router
const browserHistory = useRouterHistory(createHistory)({
  basename: __BASENAME__
})

// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the key "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const initialState = window.__INITIAL_STATE__
const store = configureStore(initialState, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

store.dispatch(getVersion())
store.dispatch(getConstants())
store.dispatch(getBlockchainStatus())
setInterval(() => {
  store.dispatch(getVersion())
}, 10 * 60 * 1000) // 10 minutes
setInterval(() => {
  store.dispatch(getBlockchainStatus())
}, 1 * 60 * 1000) // 1 minute

// Now that we have the Redux store, we can create our routes. We provide
// the store to the route definitions so that routes have access to it for
// hooks such as `onEnter`.
const routes = createRoutes(store)

// Now that redux and react-router have been configured, we can render the
// React application to the DOM!
ReactDOM.render(
  <AppContainer history={history} routes={routes} store={store} />,
  document.getElementById('root')
)
