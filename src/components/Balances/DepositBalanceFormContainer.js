import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import DepositBalanceForm from './DepositBalanceForm'

import { postBuyOrder } from 'redux/modules/balances'
import { getAsset, getAssetClear } from 'redux/modules/asset'
import { formValueSelector } from 'redux-form'
const selector = formValueSelector('depositBalanceForm')

const mapActionCreators = {
  postBuyOrder,
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
    isPostingBuyOrder: balances.isPostingBuyOrder,
    hasPostedBuyOrder: balances.hasPostedBuyOrder,
    postBuyOrderError: balances.postBuyOrderError,
    postBuyOrderSuccess: balances.postBuyOrderSuccess,
    quantity,
    recipient
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(DepositBalanceForm))
