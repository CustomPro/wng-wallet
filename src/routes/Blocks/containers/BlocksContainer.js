import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
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

import {
  openBlockDialog,
  closeBlockDialog
} from 'redux/modules/blockinformation'

import Blocks from '../components/Blocks'

const mapActionCreators = {
  getAsset,
  openAccountDialog,
  closeAccountDialog,
  openTransactionDialog,
  closeTransactionDialog,
  openBlockDialog,
  closeBlockDialog
}

const mapStateToProps = (state) => {
  const {
    selectedBlocks,
    isLoadingBlocks,
    hasLoadedBlocks
  } = state.blocks

  const {
    selectedAsset
  } = state.exchange

  const {
    accountDialogIsOpen,
    accountInformationId
  } = state.accountinformation

  const {
    isLoadingBlockInformation,
    blockInformation,
    blockDialogIsOpen,
    blockInformationId
  } = state.blockinformation

  const {
    transactionDialogIsOpen,
    transactionInformationId
  } = state.transactioninformation

  const isMobile = state.browser.lessThanOrEqual.medium
  return {
    asset: selectedAsset,
    selectedBlocks,
    isLoadingBlocks,
    hasLoadedBlocks,
    isMobile,
    accountDialogIsOpen,
    accountInformationId,
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
)(injectIntl(Blocks))
