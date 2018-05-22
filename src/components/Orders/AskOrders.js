import React, { PropTypes } from 'react'
import Orders from './Orders'
import { tokenName } from 'config.json'

export class AskOrders extends React.Component {

  componentDidMount () {
    const {
      asset,
      getAskOrders,
      askOrdersPageNumber,
      askOrdersPageSize } = this.props
    getAskOrders(asset.asset, askOrdersPageNumber, askOrdersPageSize)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      asset,
      getAskOrders,
      askOrdersPageNumber,
      askOrdersPageSize } = this.props
    if (prevProps.asset !== asset) {
      getAskOrders(asset.asset, askOrdersPageNumber, askOrdersPageSize)
    }
  }

  render () {
    const {
      asset,
      accountRS,
      isLoadingAskOrders,
      getAskOrders,
      askOrders,
      isMobile,
      isCancellingOrder,
      cancelOrder,
      openAccountDialog,
      closeAccountDialog,
      askOrdersPageNumber,
      askOrdersPageSize,
      askOrdersHasPrev,
      askOrdersHasNext,
      updatePage,
      selectExistingOrder
    } = this.props

    return (
      <Orders
        asset={asset.asset}
        assetName={asset.name}
        tokenName={tokenName}
        isLoadingOrders={isLoadingAskOrders}
        getAssetOrders={getAskOrders}
        orders={askOrders}
        isMobile={isMobile}
        decimals={asset.decimals}
        updatePage={updatePage}
        openAccountDialog={openAccountDialog}
        closeAccountDialog={closeAccountDialog}
        UI={'askOrders'}
        pageSize={askOrdersPageSize}
        pageNumber={askOrdersPageNumber}
        accountRS={accountRS}
        isCancellingOrder={isCancellingOrder}
        cancelOrder={cancelOrder}
        updateOrders={this.updateOrders}
        hasPrev={askOrdersHasPrev}
        hasNext={askOrdersHasNext}
        selectExistingOrder={selectExistingOrder}
     />
    )
  }
}

AskOrders.propTypes = {
  asset: PropTypes.object,
  accountRS: PropTypes.string,
  isLoadingAskOrders: PropTypes.bool,
  getAskOrders: PropTypes.func,
  askOrders: PropTypes.array,
  isMobile: PropTypes.bool,
  isCancellingOrder: PropTypes.bool,
  cancelOrder: PropTypes.func,
  pageNumber: PropTypes.number,
  pageSize: PropTypes.number,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  askOrdersPageNumber: PropTypes.number,
  askOrdersPageSize: PropTypes.number,
  updatePage: PropTypes.func,
  askOrdersHasNext: PropTypes.bool,
  askOrdersHasPrev: PropTypes.bool,
  selectExistingOrder: PropTypes.func
}

export default AskOrders
