import { requireAdmin } from 'routes'

export default (store) => ({
  path: 'accounts',
  onEnter: requireAdmin(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Accounts = require('./containers/AccountsContainer').default
      cb(null, Accounts)
    }, 'accounts')
  }
})
