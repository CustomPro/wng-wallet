import { requireAuth } from 'routes'
import { injectReducer } from 'redux/reducers'

export default (store) => ({
  path: '/exchange',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Exchange = require('./containers/ExchangeContainer').default
      const reducer = require('./modules/Exchange').default
      injectReducer(store, { key: 'exchange', reducer })
      cb(null, Exchange)
    }, 'exchange')
  }
})
