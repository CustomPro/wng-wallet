import React, { PropTypes } from 'react'
import {
  formatTimestamp,
  convertDQTToPrice,
  convertQNTToQuantity,
  getType
} from 'redux/utils/nrs'
import { FormattedNumber } from 'react-intl'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import { tokenName } from 'config.json'

export class OrderPlacementInformation extends React.Component {
  orderPlacementInfo (response) {
    const responseKeys = [
      'type',
      'asset',
      'name',
      'quantity',
      'price',
      'total',
      'senderRS',
      'trades',
      'traded_quantity',
      'total_trades'
    ]
    const headers = [
      { name: 'type', 'messageId': 'type', 'label': 'Type' },
      { name: 'asset', 'messageId': 'asset', 'label': 'Asset' },
      { name: 'name', 'messageId': 'name', 'label': 'Asset Name' },
      { name: 'quantity', label: 'Quantity', messageId: 'quantity' },
      { name: 'price', label: 'Price', messagedId: 'price' },
      { name: 'total', label: 'Total', messageId: 'total' },
      { name: 'senderRS', label: 'Sender RS', messageId: 'sender_RS' },
      { name: 'trades', label: 'Trades', messageId: 'trades' },
      { name: 'traded_quantity', label: 'Traded Quantity', messageId: 'traded_quantity' },
      { name: 'total_trades', label: 'Total Trades', messageId: 'total_trades' }
    ]
    const orderTradesHeaders = [
      { name: 'date', messageId: 'date', label: 'Date' },
      { name: 'quantity', messageId: 'quantity', label: 'Quantity' },
      { name: 'price', messageId: 'price', label: 'Price' },
      { name: 'total', messageId: 'total', label: 'Total' }
    ]
    const rows = []
    if (response) {
      const { decimals, name } = this.props.asset
      const { orderTrades } = this.props
      const price = convertDQTToPrice(response.attachment.priceDQT, decimals)
      const quantity = convertQNTToQuantity(response.attachment.quantityQNT, decimals)
      const total = price * quantity
      response['name'] = name
      response['asset'] = response.attachment.asset
      response['price'] = (<span><FormattedNumber value={price} /> {tokenName}</span>)
      response['quantity'] = <FormattedNumber value={quantity} />
      response['total'] = (<span><FormattedNumber value={total} /> {tokenName}</span>)
      if (orderTrades && orderTrades.length > 0) {
        const orderTradesRows = []
        orderTrades.map((trade) => {
          const {
            timestamp,
            quantityQNT,
            priceDQT
          } = trade
          const assetQuantity = convertQNTToQuantity(quantityQNT, decimals)
          const assetPrice = convertDQTToPrice(priceDQT, decimals)
          const assetTotal = assetQuantity * assetPrice
          const tradeRow = {
            date: formatTimestamp(timestamp).toLocaleString(),
            quantity: assetQuantity,
            price: assetPrice,
            total: assetTotal
          }
          orderTradesRows.push(tradeRow)
        })
        response['total_trades'] = `${this.props.asset.numberOfTrades} ${tokenName}`
        response['trades'] = (
          <ResponsiveTable
            data={{headers: orderTradesHeaders, rows: orderTradesRows}}
          />
        )
      }
      for (let item in response) {
        const row = {}
        responseKeys.map((key) => {
          if (item === key) {
            switch (item) {
              case 'type': {
                const type = getType(this.props.transactionTypes, response.type, response.subtype)
                row[item] = type.message
                break
              }
              case 'senderRS': {
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.props.handleOpenAccountDialog}
                    data-val={response[key]}>{response[key]}
                  </a>)
                break
              }
              default: {
                row[item] = response[key]
              }
            }
            rows.push(row)
          }
        })
      }
    }
    const data = {
      headers,
      rows
    }
    return data
  }

  render () {
    const data = this.orderPlacementInfo(this.props.transactionInformation)
    return (
      <ResponsiveTable
        data={data}
        isMobile
        hasNext={false}
        hasPrev={false}
      />
    )
  }
}

OrderPlacementInformation.propTypes = {
  transaction: PropTypes.string,
  getAssetIssuanceInformation: PropTypes.func,
  transactionInformation: PropTypes.object,
  asset: PropTypes.object,
  assets: PropTypes.array,
  closeDialog: PropTypes.func,
  openAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  isLoading: PropTypes.bool,
  transactionTypes: PropTypes.object,
  getOrderTrades: PropTypes.func,
  orderTrades: PropTypes.array,
  handleOpenAccountDialog: PropTypes.func,
  handleOpenTransactionDialog: PropTypes.func
}

export default OrderPlacementInformation
