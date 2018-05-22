import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import UserAskOrders from './UserAskOrders'

import {
  getUserAskOrders,
  cancelAskOrder,
  cancelAskOrderConfirm,
  cancelAskOrderClose,
  updatePage
} from 'redux/modules/orders'

const mapActionCreators = {
  getUserAskOrders,
  cancelAskOrder,
  cancelAskOrderConfirm,
  cancelAskOrderClose,
  updatePage
}

const mapStateToProps = (state) => {
  const {
    auth,
    orders,
    browser
  } = state

  const {
    userAskOrders,
    isLoadingUserAskOrders,
    isCancellingAskOrder,
    userAskOrdersPageNumber,
    userAskOrdersPageSize,
    userAskOrdersHasNext,
    userAskOrdersHasPrev,
    cancelAskOrderDialogIsOpen,
    cancelAskOrderDialogOrderId,
    cancelledAskOrdersIds
  } = orders

  const {
    accountRS
  } = auth.account

  const isMobile = browser.lessThanOrEqual.medium

  return {
    userAskOrders,
    isLoadingUserAskOrders,
    isCancellingAskOrder,
    accountRS,
    userAskOrdersPageNumber,
    userAskOrdersPageSize,
    userAskOrdersHasNext,
    userAskOrdersHasPrev,
    cancelledAskOrdersIds,
    cancelAskOrderDialogIsOpen,
    cancelAskOrderDialogOrderId,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(UserAskOrders))
