import React, { PropTypes } from 'react'
import Orders from './Orders'
import { tokenName } from 'config.json'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import ConfirmAlert from 'components/ConfirmAlert'

const messages = defineMessages({
  confirm_cancel_order: {
    id: 'user_ask_orders.confirm_cancel_order',
    defaultMessage: 'Are you sure you want to cancel this order?'
  }
})

export class UserAskOrders extends React.Component {

  componentDidMount () {
    const {
      asset,
      getUserAskOrders,
      userAskOrdersPageNumber,
      userAskOrdersPageSize,
      accountRS } = this.props
    getUserAskOrders(asset.asset, accountRS, userAskOrdersPageNumber, userAskOrdersPageSize)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      asset,
      getUserAskOrders,
      userAskOrdersPageNumber,
      userAskOrdersPageSize,
      accountRS } = this.props
    if (prevProps.asset !== asset) {
      getUserAskOrders(asset.asset, accountRS, userAskOrdersPageNumber, userAskOrdersPageSize)
    }
  }
  handleCancelAskOrderConfirm = (UI, value) => {
    const { cancelAskOrderConfirm } = this.props
    cancelAskOrderConfirm(value)
  }

  handleConfirmCancelAskOrder = () => {
    const { cancelAskOrder, cancelAskOrderDialogOrderId } = this.props
    cancelAskOrder(cancelAskOrderDialogOrderId)
  }

  handleConfirmAskOrderClose = () => {
    const { cancelAskOrderClose } = this.props
    cancelAskOrderClose()
  }

  render () {
    const {
      asset,
      accountRS,
      isLoadingUserAskOrders,
      getUserAskOrders,
      userAskOrders,
      isMobile,
      isCancellingAskOrder,
      cancelAskOrder,
      openAccountDialog,
      closeAccountDialog,
      userAskOrdersPageNumber,
      userAskOrdersPageSize,
      userAskOrdersHasNext,
      userAskOrdersHasPrev,
      updatePage,
      cancelAskOrderDialogIsOpen,
      cancelledAskOrdersIds
    } = this.props

    return (
      <div>
        <Orders
          asset={asset.asset}
          assetName={asset.name}
          tokenName={tokenName}
          isLoadingOrders={isLoadingUserAskOrders}
          getAssetOrders={getUserAskOrders}
          orders={userAskOrders}
          cancelledOrders={cancelledAskOrdersIds}
          isMobile={isMobile}
          decimals={asset.decimals}
          updatePage={updatePage}
          openAccountDialog={openAccountDialog}
          closeAccountDialog={closeAccountDialog}
          UI={'userAskOrders'}
          pageSize={userAskOrdersPageSize}
          pageNumber={userAskOrdersPageNumber}
          accountRS={accountRS}
          isCancellingOrder={isCancellingAskOrder}
          cancelOrder={cancelAskOrder}
          cancelOrderConfirm={this.handleCancelAskOrderConfirm}
          updateOrders={this.updateOrders}
          hasNext={userAskOrdersHasNext}
          hasPrev={userAskOrdersHasPrev}
          onlyMyOrders
       />
        <ConfirmAlert
          confirmCallback={this.handleConfirmCancelAskOrder}
          closeCallback={this.handleConfirmAskOrderClose}
          message={renderFormattedMessage(messages.confirm_cancel_order)}
          open={cancelAskOrderDialogIsOpen}
        />
      </div>
    )
  }
}

UserAskOrders.propTypes = {
  asset: PropTypes.object,
  accountRS: PropTypes.string,
  isLoadingUserAskOrders: PropTypes.bool,
  getUserAskOrders: PropTypes.func,
  userAskOrders: PropTypes.array,
  isMobile: PropTypes.bool,
  isCancellingAskOrder: PropTypes.bool,
  cancelAskOrder: PropTypes.func,
  pageNumber: PropTypes.number,
  pageSize: PropTypes.number,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  userAskOrdersPageNumber: PropTypes.number,
  userAskOrdersPageSize: PropTypes.number,
  userAskOrdersHasNext: PropTypes.bool,
  userAskOrdersHasPrev: PropTypes.bool,
  updatePage: PropTypes.func,
  cancelAskOrderDialogIsOpen: PropTypes.bool,
  cancelAskOrderDialogOrderId: PropTypes.string,
  cancelAskOrderConfirm: PropTypes.func,
  cancelAskOrderClose: PropTypes.func,
  cancelledAskOrdersIds: PropTypes.array
}

export default UserAskOrders
