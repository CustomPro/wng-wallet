import React, { PropTypes } from 'react'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import OnClick from 'components/OnClick'
import { FormattedNumber, defineMessages } from 'react-intl'
import BigNumber from 'bignumber.js'
import {
  convertQNTToQuantity,
  convertDQTToPrice
} from 'redux/utils/nrs'
import { tokenName } from 'config.json'
import { renderFormattedMessage } from 'redux/utils/intl'
import { RaisedButton } from 'material-ui'
import Scroll from 'react-scroll'

const messages = defineMessages({
  select_order: {
    id: 'orders.select_order',
    defaultMessage: 'Select Order'
  },
  selected: {
    id: 'orders.selected',
    defaultMessage: 'Selected'
  },
  cancel: {
    id: 'orders.cancel',
    defaultMessage: 'Cancel'
  }
})

export class Orders extends React.Component {

  constructor (props) {
    super(props)
    this.handleOpenAccountDialog = this.handleOpenAccountDialog.bind(this)
  }

  handlePrevClick = () => {
    const currentPage = this.props.pageNumber
    const prevPage = currentPage - 1
    this.props.updatePage(this.props.UI, prevPage)
  }

  handleNextClick = () => {
    const currentPage = this.props.pageNumber
    const nextPage = currentPage + 1
    this.props.updatePage(this.props.UI, nextPage)
  }

  handleOpenAccountDialog = (e) => {
    const account = e.target.getAttribute('data-val')
    this.props.openAccountDialog(account)
  }

  handleCancelClick = (value) => {
    const { UI, cancelOrderConfirm } = this.props
    cancelOrderConfirm(UI, value)
  }

  handleOrderClick = (value) => {
    this.props.selectExistingOrder(value)
    Scroll.scroller.scrollTo('orderFormWidget', {
      duration: 300,
      smooth: true
    })
  }

  getTrueIndex (pageSize, pageNumber, index) {
    const actualPage = pageNumber - 1
    const trueIndex = (actualPage * pageSize) + index
    return trueIndex
  }

  filterData (responseKeys, response) {
    if (response && Array.isArray(response)) {
      const rows = []
      const {
        decimals,
        onlyMyOrders,
        cancelledOrders,
        accountRS,
        pageNumber,
        pageSize,
        assetName
      } = this.props
      response.map((item, index) => {
        const trueIndex = this.getTrueIndex(pageSize, pageNumber, index)
        let row = {}
        let rowStyle = {}
        let cancelledOrderDisabled = false
        if (!item.hasOwnProperty('transactionHeight')) {
          rowStyle['fontStyle'] = 'italic'
          cancelledOrderDisabled = true
        }
        const qnt = convertQNTToQuantity(item['quantityQNT'], decimals)
        const dqt = convertDQTToPrice(item['priceDQT'], decimals)
        responseKeys.map((key) => {
          if (item[key]) {
            switch (key) {
              case 'quantityQNT':
                row[key] = (<span><FormattedNumber value={qnt} />
                &nbsp;{renderFormattedMessage({ id: assetName })}</span>)
                break
              case 'priceDQT':
                row[key] = (<span><FormattedNumber value={dqt} /> {tokenName}</span>)
                break
              case 'accountRS':
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.handleOpenAccountDialog}
                    data-val={item[key]}>{item[key]}
                  </a>)
                break
              default:
                row[key] = item[key]
            }
          } else { row[key] = '' }
        })
        const tokenPerAsset = (1 / dqt).toFixed(8)
        row['tokenPerAsset'] = <span>
          <FormattedNumber value={tokenPerAsset} /> {assetName}
        </span>
        if (qnt && dqt) {
          const bigQuantity = new BigNumber(qnt)
          const bigPrice = new BigNumber(dqt)
          const total = bigQuantity.times(bigPrice)
          row['total'] = (<span><FormattedNumber value={total.toString(10)} /> {tokenName}</span>)
        }
        const orderID = item.order
        if (onlyMyOrders) {
          if (item.accountRS === accountRS) {
            if (cancelledOrders && cancelledOrders.includes(orderID)) {
              cancelledOrderDisabled = true
              rowStyle['textDecoration'] = 'line-through'
            }
            const cancelButton = (
              <OnClick
                disabled={cancelledOrderDisabled}
                callback={this.handleCancelClick}
                value={orderID}>
                <RaisedButton
                  label={renderFormattedMessage(messages.cancel)}
                  primary
                  disabled={cancelledOrderDisabled}
                />
              </OnClick>

            )
            row['actions'] = (
              <div style={{ marginTop: -10 }}>
                {cancelButton}
              </div>
            )
            row.style = JSON.stringify(rowStyle)
            rows.push(row)
          }
        } else {
          const orderValue = {
            item: item,
            id: orderID,
            price: dqt,
            quantity: qnt,
            type: this.props.UI,
            index: trueIndex
          }
          const orderButton = (
            <OnClick
              callback={this.handleOrderClick}
              value={orderValue}
              >
              <RaisedButton
                label={renderFormattedMessage(messages.select_order)}
                primary
                disabled={cancelledOrderDisabled}
              />
            </OnClick>
          )
          row['actions'] = (
            <div style={{ marginTop: -10 }}>
              {orderButton}
            </div>
          )
          row.style = JSON.stringify(rowStyle)
          rows.push(row)
        }
      })
      return rows
    }
    return null
  }

  processResponse (headers, responseKeys, response) {
    const rows = this.filterData(responseKeys, response)
    const data = { headers, rows }
    return data
  }

  renderOrders () {
    const {
      orders,
      isLoadingOrders,
      hasLoadedOrders,
      assetName
    } = this.props

    const responseKeys = ['accountRS', 'quantityQNT', 'priceDQT']
    const headers = [
      { name: 'accountRS', 'messageId': 'account', 'label': 'Account' },
      { name: 'quantityQNT', 'messageId': 'quantity', 'label': 'Quantity' },
      { name: 'priceDQT', 'messageId': 'price_per_unit', 'label': 'Price per Unit' },
      { name: 'tokenPerAsset',
        'messageId': 'token_per_asset',
        'label': '1 {token}',
        'values': { token: tokenName } },
      { name: 'total', 'messageId': 'total', 'label': 'Total' },
      { name: 'actions', 'messageId': 'actions', 'label': 'Actions' }
    ]
    const ordersData = this.processResponse(headers, responseKeys, orders)

    return (
      <ResponsiveTable
        data={ordersData}
        title={this.props.title}
        isMobile={this.props.isMobile}
        isLoading={isLoadingOrders}
        hasLoaded={hasLoadedOrders}
        handleNextClick={this.handleNextClick}
        handlePrevClick={this.handlePrevClick}
        hasNext={this.props.hasNext}
        hasPrev={this.props.hasPrev}
        UI={this.props.UI}
      />
    )
  }

  render () {
    const orders = this.renderOrders()
    return (
      <div>
        {orders}
      </div>
    )
  }
}

Orders.propTypes = {
  isLoadingOrders: PropTypes.bool,
  hasLoadedOrders: PropTypes.bool,
  orders: PropTypes.array,
  title: PropTypes.string,
  isMobile: PropTypes.bool,
  decimals: PropTypes.number,
  getAssetOrders: PropTypes.func,
  asset: PropTypes.string,
  assetName: PropTypes.string,
  tokenName: PropTypes.string,
  pageSize: PropTypes.number,
  pageNumber: PropTypes.number,
  updatePage: PropTypes.func,
  UI: PropTypes.string,
  openAccountDialog: PropTypes.func,
  onlyMyOrders: PropTypes.bool,
  accountRS: PropTypes.string,
  cancelOrder: PropTypes.func,
  isCancellingOrder: PropTypes.bool,
  updateOrders: PropTypes.func,
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool,
  cancelOrderConfirm: PropTypes.func,
  cancelledOrders: PropTypes.array,
  selectExistingOrder: PropTypes.func
}

export default Orders
