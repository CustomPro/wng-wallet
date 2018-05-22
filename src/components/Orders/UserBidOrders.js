import React, { PropTypes } from 'react'
import Orders from './Orders'
import { tokenName } from 'config.json'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import ConfirmAlert from 'components/ConfirmAlert'

const messages = defineMessages({
  confirm_cancel_order: {
    id: 'user_bid_orders.confirm_cancel_order',
    defaultMessage: 'Are you sure you want to cancel this order?'
  }
})

export class UserBidOrders extends React.Component {

  componentDidMount () {
    const {
      asset,
      getUserBidOrders,
      userBidOrdersPageNumber,
      userBidOrdersPageSize,
      accountRS } = this.props
    getUserBidOrders(asset.asset, accountRS, userBidOrdersPageNumber, userBidOrdersPageSize)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      asset,
      getUserBidOrders,
      userBidOrdersPageNumber,
      userBidOrdersPageSize,
      accountRS } = this.props
    if (prevProps.asset !== asset) {
      getUserBidOrders(asset.asset, accountRS, userBidOrdersPageNumber, userBidOrdersPageSize)
    }
  }

  handleCancelBidOrderConfirm = (UI, value) => {
    const { cancelBidOrderConfirm } = this.props
    cancelBidOrderConfirm(value)
  }

  handleConfirmCancelBidOrder = () => {
    const { cancelBidOrder, cancelBidOrderDialogOrderId } = this.props
    cancelBidOrder(cancelBidOrderDialogOrderId)
  }

  handleConfirmBidOrderClose = () => {
    const { cancelBidOrderClose } = this.props
    cancelBidOrderClose()
  }

  render () {
    const {
      asset,
      accountRS,
      isLoadingUserBidOrders,
      getUserBidOrders,
      userBidOrders,
      isMobile,
      isCancellingBidOrder,
      cancelBidOrder,
      openAccountDialog,
      closeAccountDialog,
      userBidOrdersPageNumber,
      userBidOrdersPageSize,
      updatePage,
      userBidOrdersHasNext,
      userBidOrdersHasPrev,
      cancelBidOrderDialogIsOpen,
      cancelledBidOrdersIds
    } = this.props

    return (
      <div>
        <Orders
          asset={asset.asset}
          assetName={asset.name}
          tokenName={tokenName}
          isLoadingOrders={isLoadingUserBidOrders}
          cancelledOrders={cancelledBidOrdersIds}
          getAssetOrders={getUserBidOrders}
          orders={userBidOrders}
          isMobile={isMobile}
          decimals={asset.decimals}
          updatePage={updatePage}
          openAccountDialog={openAccountDialog}
          closeAccountDialog={closeAccountDialog}
          UI={'userBidOrders'}
          pageSize={userBidOrdersPageSize}
          pageNumber={userBidOrdersPageNumber}
          accountRS={accountRS}
          isCancellingOrder={isCancellingBidOrder}
          cancelOrder={cancelBidOrder}
          cancelOrderConfirm={this.handleCancelBidOrderConfirm}
          updateOrders={this.updateOrders}
          hasPrev={userBidOrdersHasPrev}
          hasNext={userBidOrdersHasNext}
          onlyMyOrders
       />
        <ConfirmAlert
          confirmCallback={this.handleConfirmCancelBidOrder}
          closeCallback={this.handleConfirmBidOrderClose}
          message={renderFormattedMessage(messages.confirm_cancel_order)}
          open={cancelBidOrderDialogIsOpen}
        />
      </div>
    )
  }
}

UserBidOrders.propTypes = {
  asset: PropTypes.object,
  accountRS: PropTypes.string,
  isLoadingUserBidOrders: PropTypes.bool,
  getUserBidOrders: PropTypes.func,
  userBidOrders: PropTypes.array,
  isMobile: PropTypes.bool,
  isCancellingBidOrder: PropTypes.bool,
  cancelBidOrder: PropTypes.func,
  pageNumber: PropTypes.number,
  pageSize: PropTypes.number,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  userBidOrdersPageNumber: PropTypes.number,
  userBidOrdersPageSize: PropTypes.number,
  userBidOrdersHasPrev: PropTypes.bool,
  userBidOrdersHasNext: PropTypes.bool,
  updatePage: PropTypes.func,
  cancelBidOrderDialogIsOpen: PropTypes.bool,
  cancelBidOrderDialogOrderId: PropTypes.string,
  cancelBidOrderConfirm: PropTypes.func,
  cancelBidOrderClose: PropTypes.func,
  cancelledBidOrdersIds: PropTypes.array
}

export default UserBidOrders
