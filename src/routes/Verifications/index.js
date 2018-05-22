import { requireAdmin } from 'routes'

export default (store) => ({
  path: 'verifications',
  onEnter: requireAdmin(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Verifications = require('./components/VerificationsContainer').default
      cb(null, Verifications)
    }, 'verifications')
  }
})
