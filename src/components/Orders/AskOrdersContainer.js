import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import AskOrders from './AskOrders'

import {
  getAskOrders,
  cancelOrder,
  updatePage,
  selectExistingOrder,
  clearExistingOrder
} from 'redux/modules/orders'

const mapActionCreators = {
  getAskOrders,
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
    askOrders,
    isLoadingAskOrders,
    isCancellingOrder,
    askOrdersPageNumber,
    askOrdersPageSize
  } = orders

  const {
    accountRS
  } = auth.account

  const isMobile = browser.lessThanOrEqual.medium

  return {
    askOrders,
    isLoadingAskOrders,
    isCancellingOrder,
    accountRS,
    askOrdersPageNumber,
    askOrdersPageSize,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(AskOrders))
