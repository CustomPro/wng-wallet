import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl'

import {
  getAccounts,
  setSearch,
  updateAccountsPage,
  resetPagination
} from '../modules/Accounts'
import { showModal, hideModal } from 'redux/modules/transaction'

import Accounts from '../components/Accounts'

const mapActionCreators = (dispatch) => ({
  ...bindActionCreators({
    getAccounts,
    setSearch,
    updateAccountsPage,
    resetPagination
  }, dispatch),
  onAccountRSClick: (accountRS) => {
    dispatch(showModal({ recipient: accountRS }))
  },
  onSendClose: () => {
    dispatch(hideModal())
  }
})

const mapStateToProps = (state) => {
  const {
    accounts,
    isLoadingAccounts,
    accountsHasNext,
    accountsHasPrev,
    accountsPageSize,
    accountsPageNumber,
    search
  } = state.accounts

  const {
    showModal,
    modalTitle
  } = state.transaction

  const isMobile = state.browser.lessThanOrEqual.medium

  return {
    accounts,
    isLoadingAccounts,
    accountsHasNext,
    accountsHasPrev,
    accountsPageSize,
    accountsPageNumber,
    showTransactionModal: showModal,
    transactionModalTitle: modalTitle,
    search,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Accounts))
