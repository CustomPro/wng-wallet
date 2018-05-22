import React, { PropTypes } from 'react'
import Orders from './Orders'
import { tokenName } from 'config.json'

export class BidOrders extends React.Component {

  componentDidMount () {
    const {
      asset,
      getBidOrders,
      bidOrdersPageNumber,
      bidOrdersPageSize } = this.props
    getBidOrders(asset.asset, bidOrdersPageNumber, bidOrdersPageSize)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      asset,
      getBidOrders,
      bidOrdersPageNumber,
      bidOrdersPageSize } = this.props
    if (prevProps.asset !== asset) {
      getBidOrders(asset.asset, bidOrdersPageNumber, bidOrdersPageSize)
    }
  }

  render () {
    const {
      asset,
      accountRS,
      isLoadingBidOrders,
      getBidOrders,
      bidOrders,
      isMobile,
      isCancellingOrder,
      cancelOrder,
      openAccountDialog,
      closeAccountDialog,
      bidOrdersPageNumber,
      bidOrdersPageSize,
      bidOrdersHasNext,
      bidOrdersHasPrev,
      updatePage,
      selectExistingOrder
    } = this.props

    return (
      <Orders
        asset={asset.asset}
        assetName={asset.name}
        tokenName={tokenName}
        isLoadingOrders={isLoadingBidOrders}
        getAssetOrders={getBidOrders}
        orders={bidOrders}
        isMobile={isMobile}
        decimals={asset.decimals}
        updatePage={updatePage}
        openAccountDialog={openAccountDialog}
        closeAccountDialog={closeAccountDialog}
        UI={'bidOrders'}
        pageSize={bidOrdersPageSize}
        pageNumber={bidOrdersPageNumber}
        accountRS={accountRS}
        isCancellingOrder={isCancellingOrder}
        cancelOrder={cancelOrder}
        updateOrders={this.updateOrders}
        hasNext={bidOrdersHasNext}
        hasPrev={bidOrdersHasPrev}
        selectExistingOrder={selectExistingOrder}
     />
    )
  }
}

BidOrders.propTypes = {
  asset: PropTypes.object,
  accountRS: PropTypes.string,
  isLoadingBidOrders: PropTypes.bool,
  getBidOrders: PropTypes.func,
  bidOrders: PropTypes.array,
  isMobile: PropTypes.bool,
  isCancellingOrder: PropTypes.bool,
  cancelOrder: PropTypes.func,
  pageNumber: PropTypes.number,
  pageSize: PropTypes.number,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  bidOrdersPageNumber: PropTypes.number,
  bidOrdersPageSize: PropTypes.number,
  updatePage: PropTypes.func,
  bidOrdersHasNext: PropTypes.bool,
  bidOrdersHasPrev: PropTypes.bool,
  selectExistingOrder: PropTypes.func
}

export default BidOrders
