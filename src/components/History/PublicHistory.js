import React, { PropTypes } from 'react'
import History from 'components/History/History'
import { tokenName } from 'config.json'

export class PublicHistory extends React.Component {

  componentDidMount () {
    const {
      asset,
      getHistory,
      historyPageNumber,
      historyPageSize } = this.props
    getHistory(asset.asset, historyPageNumber, historyPageSize)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      asset,
      getHistory,
      historyPageNumber,
      historyPageSize } = this.props
    if (prevProps.asset !== asset) {
      getHistory(asset.asset, historyPageNumber, historyPageSize)
    }
  }

  render () {
    const {
      asset,
      accountRS,
      isLoadingHistory,
      getHistory,
      history,
      isMobile,
      openAccountDialog,
      closeAccountDialog,
      openTransactionDialog,
      closeTransactionDialog,
      historyPageNumber,
      historyPageSize,
      historyHasNext,
      historyHasPrev,
      updateHistoryPage
    } = this.props

    return (
      <History
        account={accountRS}
        asset={asset.asset}
        assetName={asset.name}
        tokenName={tokenName}
        isLoadingHistory={isLoadingHistory}
        getHistory={getHistory}
        history={history}
        UI={'history'}
        openAccountDialog={openAccountDialog}
        closeAccountDialog={closeAccountDialog}
        openTransactionDialog={openTransactionDialog}
        closeTransactionDialog={closeTransactionDialog}
        isMobile={isMobile}
        decimals={asset.decimals}
        hasNext={historyHasNext}
        hasPrev={historyHasPrev}
        updatePage={updateHistoryPage}
        pageNumber={historyPageNumber}
        pageSize={historyPageSize} />
    )
  }
}

PublicHistory.propTypes = {
  asset: PropTypes.object,
  accountRS: PropTypes.string,
  isLoadingHistory: PropTypes.bool,
  getHistory: PropTypes.func,
  history: PropTypes.array,
  isMobile: PropTypes.bool,
  historyPageNumber: PropTypes.number,
  historyPageSize: PropTypes.number,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  updateHistoryPage: PropTypes.func,
  historyHasNext: PropTypes.bool,
  historyHasPrev: PropTypes.bool
}

export default PublicHistory
