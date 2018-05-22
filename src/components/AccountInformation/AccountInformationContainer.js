import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  getAccountInformation,
  getAccountInformationProperties,
  openAccountDialog,
  closeAccountDialog
} from 'redux/modules/accountinformation'

import {
  openTransactionDialog,
  closeTransactionDialog
} from 'redux/modules/transactioninformation'

import AccountInformation from 'components/AccountInformation/AccountInformation'

import {
  getAccountHistory
} from 'redux/modules/history'

const mapActionCreators = {
  getAccountInformation,
  getAccountHistory,
  openAccountDialog,
  closeAccountDialog,
  openTransactionDialog,
  closeTransactionDialog,
  getAccountInformationProperties
}

const mapStateToProps = (state) => {
  const {
    isLoadingAccountInformation,
    accountInformation,
    accountInformationProperties
  } = state.accountinformation
  const {
    selectedAssets,
    isLoadingAssets } = state.balances

  const { history } = state
  const { selectedAsset } = state.asset
  const { isAdmin } = state.auth

  return {
    isLoadingAccountInformation,
    accountInformation,
    accountInformationProperties,
    accountHistory: history.accountHistory,
    isLoadingAccountHistory: history.isLoadingAccountHistory,
    asset: selectedAsset,
    selectedAssets,
    isLoadingAssets,
    isAdmin
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(AccountInformation))
