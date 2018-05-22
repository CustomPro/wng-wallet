import React, { PropTypes } from 'react'
import History from './History'
import { tokenName } from 'config.json'

export class AccountHistory extends React.Component {

  componentDidMount () {
    const {
      asset,
      getAccountHistory,
      accountHistoryPageNumber,
      accountHistoryPageSize } = this.props
    getAccountHistory(asset.asset, accountHistoryPageNumber, accountHistoryPageSize)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      asset,
      getAccountHistory,
      accountHistoryPageNumber,
      accountHistoryPageSize } = this.props
    if (prevProps.asset !== asset) {
      getAccountHistory(asset.asset, accountHistoryPageNumber, accountHistoryPageSize)
    }
  }

  render () {
    const {
      asset,
      accountRS,
      isLoadingAccountHistory,
      getAccountHistory,
      accountHistory,
      isMobile,
      openAccountDialog,
      closeAccountDialog,
      openTransactionDialog,
      closeTransactionDialog,
      accountHistoryPageNumber,
      accountHistoryPageSize,
      accountHistoryHasNext,
      accountHistoryHasPrev,
      updateHistoryPage
    } = this.props

    return (
      <History
        account={accountRS}
        asset={asset.asset}
        assetName={asset.name}
        tokenName={tokenName}
        isLoadingHistory={isLoadingAccountHistory}
        getHistory={getAccountHistory}
        history={accountHistory}
        UI={'accountHistory'}
        openAccountDialog={openAccountDialog}
        closeAccountDialog={closeAccountDialog}
        openTransactionDialog={openTransactionDialog}
        closeTransactionDialog={closeTransactionDialog}
        isMobile={isMobile}
        decimals={asset.decimals}
        hasNext={accountHistoryHasNext}
        hasPrev={accountHistoryHasPrev}
        updatePage={updateHistoryPage}
        pageNumber={accountHistoryPageNumber}
        pageSize={accountHistoryPageSize} />
    )
  }
}

AccountHistory.propTypes = {
  asset: PropTypes.object,
  accountRS: PropTypes.string,
  isLoadingAccountHistory: PropTypes.bool,
  getAccountHistory: PropTypes.func,
  accountHistory: PropTypes.array,
  isMobile: PropTypes.bool,
  accountHistoryPageNumber: PropTypes.number,
  accountHistoryPageSize: PropTypes.number,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  updateHistoryPage: PropTypes.func,
  accountHistoryHasNext: PropTypes.bool,
  accountHistoryHasPrev: PropTypes.bool
}

export default AccountHistory
