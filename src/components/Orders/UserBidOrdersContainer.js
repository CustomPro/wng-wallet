import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import UserBidOrders from './UserBidOrders'

import {
  getUserBidOrders,
  cancelBidOrder,
  cancelBidOrderConfirm,
  cancelBidOrderClose,
  updatePage
} from 'redux/modules/orders'

const mapActionCreators = {
  getUserBidOrders,
  cancelBidOrder,
  cancelBidOrderConfirm,
  cancelBidOrderClose,
  updatePage
}

const mapStateToProps = (state) => {
  const {
    auth,
    orders,
    browser
  } = state

  const {
    userBidOrders,
    isLoadingUserBidOrders,
    isCancellingOrder,
    userBidOrdersPageNumber,
    userBidOrdersPageSize,
    userBidOrdersHasNext,
    userBidOrdersHasPrev,
    cancelBidOrderDialogIsOpen,
    cancelBidOrderDialogOrderId,
    cancelledBidOrdersIds
  } = orders

  const {
    accountRS
  } = auth.account

  const isMobile = browser.lessThanOrEqual.medium

  return {
    userBidOrders,
    isLoadingUserBidOrders,
    isCancellingOrder,
    accountRS,
    userBidOrdersPageNumber,
    userBidOrdersPageSize,
    userBidOrdersHasNext,
    userBidOrdersHasPrev,
    cancelBidOrderDialogIsOpen,
    cancelBidOrderDialogOrderId,
    cancelledBidOrdersIds,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(UserBidOrders))
