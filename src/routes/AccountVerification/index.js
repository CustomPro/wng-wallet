import { requireAuth } from 'routes'

export default (store) => ({
  path: '/account-verification',
  onEnter: requireAuth(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const AccountVerification = require('./containers/AccountVerificationContainer').default
      cb(null, AccountVerification)
    }, 'account-verification')
  }
})
