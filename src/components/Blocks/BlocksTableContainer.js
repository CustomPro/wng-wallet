import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getBlocks, updateBlocksPage } from 'redux/modules/blocks'

import BlocksTable from './BlocksTable'

const mapActionCreators = {
  getBlocks,
  updateBlocksPage
}

const mapStateToProps = (state) => {
  const {
    selectedBlocks,
    isLoadingBlocks,
    blocksPageSize,
    blocksPageNumber,
    blocksHasNext,
    blocksHasPrev
  } = state.blocks
  const isMobile = state.browser.lessThanOrEqual.medium
  return {
    selectedBlocks,
    isLoadingBlocks,
    blocksPageSize,
    blocksPageNumber,
    blocksHasNext,
    blocksHasPrev,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(BlocksTable))
