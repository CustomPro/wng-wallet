import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import { showModal, updateBlockchainTransactionsPage, hideModal } from 'redux/modules/transaction'
import { showReceiveModal, hideReceiveModal, getAccount } from 'routes/Auth/modules/Auth'
import { convertDQTToDBN } from 'redux/utils/nrs'
import {
  getAsset
} from 'redux/modules/asset'

import {
  openAccountDialog,
  closeAccountDialog
} from 'redux/modules/accountinformation'

import {
  openTransactionDialog,
  closeTransactionDialog
} from 'redux/modules/transactioninformation'

import Home from '../components/Home'

const mapActionCreators = (dispatch) => ({
  onSendClick: () => {
    dispatch(showModal())
  },
  onSendClose: () => {
    dispatch(hideModal())
  },
  onReceiveClick: () => {
    dispatch(showReceiveModal())
  },
  handleReceiveClose: () => {
    dispatch(hideReceiveModal())
  },
  getAsset: () => {
    dispatch(getAsset())
  },
  openAccountDialog: (account) => {
    dispatch(openAccountDialog(account))
  },
  closeAccountDialog: () => {
    dispatch(closeAccountDialog())
  },
  openTransactionDialog: (transaction) => {
    dispatch(openTransactionDialog(transaction))
  },
  closeTransactionDialog: () => {
    dispatch(closeTransactionDialog())
  },
  getAccount: () => {
    dispatch(getAccount())
  },
  updateBlockchainTransactionsPage: (pageNumber, account) => {
    dispatch(updateBlockchainTransactionsPage(pageNumber, account))
  }
})

const mapStateToProps = (state) => {
  const {
    accountRS,
    publicKey
  } = state.auth.account
  const {
    showModal,
    modalTitle
  } = state.transaction

  const {
    selectedAsset
  } = state.exchange

  const isMobile = state.browser.lessThanOrEqual.medium

  const {
    showReceiveModal
  } = state.auth

  const balance = convertDQTToDBN(state.auth.account.unconfirmedBalanceDQT)
  const {
    accountDialogIsOpen,
    accountInformationId
  } = state.accountinformation

  const {
    transactionDialogIsOpen,
    transactionInformationId
  } = state.transactioninformation

  return {
    asset: selectedAsset,
    accountRS,
    balance,
    publicKey,
    showModal,
    showReceiveModal,
    modalTitle,
    isMobile,
    accountDialogIsOpen: accountDialogIsOpen,
    accountInformationId: accountInformationId,
    transactionDialogIsOpen,
    transactionInformationId
  }
}
export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Home))
