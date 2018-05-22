import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import { getTransactionInformation } from 'redux/modules/transactioninformation'
import { getOrderTrades } from 'redux/modules/history'
import TransactionInformation from './TransactionInformation'

const mapActionCreators = {
  getTransactionInformation,
  getOrderTrades
}

const mapStateToProps = (state) => {
  const {
    isLoadingTransactionInformation,
    transactionInformation
  } = state.transactioninformation

  const {
    orderTrades
  } = state.history

  const asset = state.asset.selectedAsset
  const assets = state.balances.selectedAssets

  const {
    constants
  } = state.site

  return {
    isLoadingTransactionInformation,
    transactionInformation,
    asset,
    assets,
    orderTrades,
    transactionTypes: constants.transactionTypes
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(TransactionInformation))
