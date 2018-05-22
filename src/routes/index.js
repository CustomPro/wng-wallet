import CoreLayout from 'layouts/CoreLayout/CoreLayout'

import AuthRoute from './Auth'
import HomeRoute from './Home'
import AccountsRoute from './Accounts'
import VerificationsRoute from './Verifications'
import VouchersRoute from './Vouchers'
import BalancesRoute from './Balances'
import ForgingRoute from './Forging'
import SettingsRoute from './Settings'
import ExchangeRoute from './Exchange'
import BlocksRoute from './Blocks'
import AccountVerificationRoute from './AccountVerification'

export const requireAuth = (store) => (nextState, replace) => {
  const loggedIn = store.getState().auth.account.secretPhrase !== ''

  if (!loggedIn) {
    replace('/login')
  }
}

export const requireAdmin = (store) => (nextState, replace) => {
  const { isAdmin } = store.getState().auth

  if (!isAdmin) {
    replace('/admin')
  }
}

export const createRoutes = (store) => ({
  component: CoreLayout,
  childRoutes: [
    AuthRoute(store),
    HomeRoute(store),
    AccountsRoute(store),
    VerificationsRoute(store),
    VouchersRoute(store),
    BalancesRoute(store),
    ForgingRoute(store),
    SettingsRoute(store),
    ExchangeRoute(store),
    BlocksRoute(store),
    AccountVerificationRoute(store)
  ]
})

export default createRoutes
