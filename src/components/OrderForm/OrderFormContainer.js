import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { formValueSelector } from 'redux-form'
import BigNumber from 'bignumber.js'
import { convertDQTToDBN } from 'redux/utils/nrs'
import { minimumFee } from 'config.json'
import {
  openAdvancedOptions,
  closeAdvancedOptions
} from 'redux/modules/site'

import OrderForm from './OrderForm'

import {
  postOrder,
  openOrderDialog,
  closeOrderDialog
} from 'routes/Exchange/modules/Exchange'

import {
  updatePage,
  clearExistingOrder,
  retrieveOrderTotal
} from 'redux/modules/orders'

const mapActionCreators = {
  postOrder,
  openOrderDialog,
  closeOrderDialog,
  updatePage,
  openAdvancedOptions,
  closeAdvancedOptions,
  clearExistingOrder,
  retrieveOrderTotal
}

const selector = formValueSelector('orderForm')
const mapStateToProps = (state) => {
  const { asset, exchange, auth } = state
  const { selectedOrder } = state.orders
  const {
    orderType,
    quantity,
    price,
    fee
  } = selector(state, 'orderType', 'quantity', 'price', 'fee')
  let total
  if (selectedOrder.total) {
    total = selectedOrder.total.toString()
  } else if (quantity && price) {
    const bigQuantity = new BigNumber(quantity)
    const bigPrice = new BigNumber(price)
    total = bigQuantity.times(bigPrice).toString(10)
  } else {
    total = ''
  }
  let tokenPerAsset = 0
  if (price) {
    tokenPerAsset = (1 / price).toFixed(8)
  }
  const minFee = convertDQTToDBN(minimumFee)

  return {
    asset: asset.selectedAsset,
    account: auth.account,
    isPostingOrder: exchange.isPostingOrder,
    hasPostedOrder: exchange.hasPostedOrder,
    postOrderError: exchange.postOrderError,
    postOrderSuccess: exchange.postOrderSuccess,
    advancedOptionsOpen: state.site.advancedOptionsOpen,
    initialValues: {
      orderType: state.exchange.order.type,
      fee: minFee
    },
    orderDialogIsOpen: exchange.orderDialogIsOpen,
    orderValues: exchange.orderValues,
    orderType,
    quantity,
    price,
    tokenPerAsset,
    total,
    fee,
    selectedOrder
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(OrderForm))
