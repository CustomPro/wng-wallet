import { requireAuth } from 'routes'

export default (store) => ({
  path: 'forging',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Forging = require('./containers/ForgingContainer').default
      cb(null, Forging)
    }, 'forging')
  }
})
