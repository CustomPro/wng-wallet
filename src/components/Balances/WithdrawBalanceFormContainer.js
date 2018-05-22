import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import WithdrawBalanceForm from './WithdrawBalanceForm'

import { postSellOrder } from 'redux/modules/balances'
import { getAsset, getAssetClear } from 'redux/modules/asset'
import { formValueSelector } from 'redux-form'
const selector = formValueSelector('withdrawBalanceForm')

const mapActionCreators = {
  postSellOrder,
  getAsset,
  getAssetClear
}
const mapStateToProps = (state) => {
  const { balances, auth, asset } = state
  const {
    quantity,
    recipient } = selector(state, 'quantity', 'recipient')
  return {
    account: auth.account,
    asset: asset.selectedAsset,
    isPostingSellOrder: balances.isPostingSellOrder,
    hasPostedSellOrder: balances.hasPostedSellOrder,
    postSellOrderError: balances.postSellOrderError,
    postSellOrderSuccess: balances.postSellOrderSuccess,
    quantity,
    recipient
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(WithdrawBalanceForm))
