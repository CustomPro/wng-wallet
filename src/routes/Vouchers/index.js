import { requireAdmin } from 'routes'

export default (store) => ({
  path: 'vouchers',
  onEnter: requireAdmin(store),
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Verifications = require('./components/VouchersContainer').default
      cb(null, Verifications)
    }, 'vouchers')
  }
})
