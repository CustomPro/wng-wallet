import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import {
  getBlockInformation,
  openBlockDialog,
  closeBlockDialog
} from 'redux/modules/blockinformation'

import {
  openTransactionDialog,
  closeTransactionDialog
} from 'redux/modules/transactioninformation'

import BlockInformation from 'components/BlockInformation/BlockInformation'

const mapActionCreators = {
  getBlockInformation,
  openBlockDialog,
  closeBlockDialog,
  openTransactionDialog,
  closeTransactionDialog
}

const mapStateToProps = (state) => {
  const {
    isLoadingBlockInformation,
    blockInformation
  } = state.blockinformation

  const { selectedAsset } = state.asset

  return {
    isLoadingBlockInformation,
    blockInformation,
    asset: selectedAsset
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(BlockInformation))
