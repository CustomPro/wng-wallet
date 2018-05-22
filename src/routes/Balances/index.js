import { requireAuth } from 'routes'

export default (store) => ({
  path: 'balances',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Balances = require('./containers/BalancesContainer').default
      cb(null, Balances)
    }, 'balances')
  }
})
