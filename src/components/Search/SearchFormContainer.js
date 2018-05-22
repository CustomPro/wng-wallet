import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import SearchForm from './SearchForm'

import {
  changeSearchType,
  getSearchBlocks,
  getSearchTransactions,
  getSearchAccounts
} from 'redux/modules/search'

import {
  openAccountDialog,
  closeAccountDialog
} from 'redux/modules/accountinformation'

import {
  openTransactionDialog,
  closeTransactionDialog
} from 'redux/modules/transactioninformation'

import {
  openBlockDialog,
  closeBlockDialog
} from 'redux/modules/blockinformation'

const mapActionCreators = {
  changeSearchType,
  getSearchBlocks,
  getSearchTransactions,
  getSearchAccounts,
  openAccountDialog,
  closeAccountDialog,
  openTransactionDialog,
  closeTransactionDialog,
  openBlockDialog,
  closeBlockDialog
}

const mapStateToProps = (state) => {
  const {
    searchType,
    searchBlock,
    searchTransaction,
    searchAccounts,
    searchError,
    isLoadingSearchBlocks,
    isLoadingSearchTransactions,
    isLoadingSearchAccounts
  } = state.search

  const {
    isLoadingAccountInformation,
    accountInformation,
    accountDialogIsOpen,
    accountInformationId
  } = state.accountinformation

  const {
    isLoadingTransactionInformation,
    transactionInformation,
    transactionDialogIsOpen,
    transactionInformationId
  } = state.transactioninformation

  const {
    isLoadingBlockInformation,
    blockInformation,
    blockDialogIsOpen,
    blockInformationId
  } = state.blockinformation

  const isLoading = isLoadingSearchBlocks || isLoadingSearchAccounts || isLoadingSearchTransactions

  return {
    searchType,
    searchBlock,
    searchTransaction,
    searchAccounts,
    searchError,
    isLoading,
    isLoadingAccountInformation,
    accountInformation,
    accountDialogIsOpen,
    accountInformationId,
    isLoadingTransactionInformation,
    transactionInformation,
    transactionDialogIsOpen,
    transactionInformationId,
    isLoadingBlockInformation,
    blockInformation,
    blockDialogIsOpen,
    blockInformationId
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(SearchForm))
