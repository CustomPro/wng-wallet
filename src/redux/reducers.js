import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import { responsiveStateReducer as browser } from 'redux-responsive'

import intl from 'redux/modules/intl'
import site from 'redux/modules/site'
import transaction from 'redux/modules/transaction'
import accountinformation from 'redux/modules/accountinformation'
import transactioninformation from 'redux/modules/transactioninformation'
import blockinformation from 'redux/modules/blockinformation'
import asset from 'redux/modules/asset'
import orders from 'redux/modules/orders'
import history from 'redux/modules/history'
import balances from 'redux/modules/balances'
import blocks from 'redux/modules/blocks'
import search from 'redux/modules/search'
import exchange from 'routes/Exchange/modules/Exchange'
import auth from 'routes/Auth/modules/Auth'
import forging from 'routes/Forging/modules/Forging'
import accounts from 'routes/Accounts/modules/Accounts'
import verifications from 'routes/Verifications/modules/Verifications'
import qrscanner from 'redux/modules/qrscanner'
import qrreader from 'redux/modules/qrreader'
import vouchers from 'routes/Vouchers/modules/Vouchers'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    auth,
    asset,
    exchange,
    blocks,
    accounts,
    search,
    browser,
    form,
    intl,
    router,
    site,
    transaction,
    accountinformation,
    transactioninformation,
    blockinformation,
    balances,
    orders,
    history,
    forging,
    verifications,
    qrscanner,
    qrreader,
    vouchers,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
