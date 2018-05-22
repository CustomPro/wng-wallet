import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import BidOrders from './BidOrders'

import {
  getBidOrders,
  cancelOrder,
  updatePage,
  selectExistingOrder,
  clearExistingOrder
} from 'redux/modules/orders'

const mapActionCreators = {
  getBidOrders,
  cancelOrder,
  updatePage,
  selectExistingOrder,
  clearExistingOrder
}

const mapStateToProps = (state) => {
  const {
    auth,
    orders,
    browser
  } = state

  const {
    bidOrders,
    isLoadingBidOrders,
    isCancellingOrder,
    bidOrdersPageNumber,
    bidOrdersPageSize,
    bidOrdersHasNext,
    bidOrdersHasPrev
  } = orders

  const {
    accountRS
  } = auth.account

  const isMobile = browser.lessThanOrEqual.medium

  return {
    bidOrders,
    isLoadingBidOrders,
    isCancellingOrder,
    accountRS,
    bidOrdersPageNumber,
    bidOrdersPageSize,
    isMobile,
    bidOrdersHasNext,
    bidOrdersHasPrev
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(BidOrders))
