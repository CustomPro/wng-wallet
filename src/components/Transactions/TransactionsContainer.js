import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import {
  getBlockchainTransactions,
  updateBlockchainTransactionsPage
} from 'redux/modules/transaction'
import { getConstants } from 'redux/modules/site'
import Transactions from './Transactions'

const mapActionCreators = {
  getBlockchainTransactions,
  getConstants,
  updateBlockchainTransactionsPage
}

const mapStateToProps = (state) => {
  const {
    isLoadingTransactions,
    blockchainTransactions,
    blockchainTransactionsPageSize,
    blockchainTransactionsPageNumber,
    blockchainTransactionsHasNext,
    blockchainTransactionsHasPrev
  } = state.transaction

  const {
    account
  } = state.auth

  const {
    constants
  } = state.site

  const { selectedAssets } = state.balances

  return {
    account: account.accountRS,
    isLoadingTransactions,
    blockchainTransactions,
    blockchainTransactionsPageSize,
    blockchainTransactionsPageNumber,
    blockchainTransactionsHasNext,
    blockchainTransactionsHasPrev,
    transactionTypes: constants.transactionTypes,
    selectedAssets
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Transactions))
