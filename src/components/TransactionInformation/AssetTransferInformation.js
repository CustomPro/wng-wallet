import React, { PropTypes } from 'react'
import {
  convertDQTToDBN,
  convertQNTToQuantity,
  getType
} from 'redux/utils/nrs'
import { FormattedNumber } from 'react-intl'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import { tokenName } from 'config.json'

export class AssetTransferInformation extends React.Component {
  assetTransferInfo (response) {
    const responseKeys = ['type', 'asset', 'name', 'amountDQT', 'senderRS', 'recipientRS', 'quantity']
    const headers = [
      { name: 'type', 'messageId': 'type', 'label': 'Type' },
      { name: 'asset', 'messageId': 'asset', 'label': 'Asset' },
      { name: 'name', 'messageId': 'name', 'label': 'Asset Name' },
      { name: 'amountDQT', 'messageId': 'amount', 'label': 'Amount' },
      { name: 'senderRS', label: 'Sender RS', messageId: 'sender_RS' },
      { name: 'recipientRS', label: 'Recipient RS', messageId: 'recipient_RS' },
      { name: 'quantity', label: 'Quantity', messageId: 'quantity' }
    ]
    const rows = []
    if (response) {
      const { decimals, name } = this.props.asset
      response['name'] = name
      response['asset'] = response.attachment.asset
      response['quantity'] = <FormattedNumber
        maximumFractionDigits={decimals}
        value={convertQNTToQuantity(response.attachment.quantityQNT, decimals)} />
      for (let item in response) {
        const row = {}
        responseKeys.map((key) => {
          if (item === key) {
            row[item] = response[key]
            switch (item) {
              case 'type': {
                const type = getType(this.props.transactionTypes, response.type, response.subtype)
                row[item] = type.message
                break
              }
              case 'senderRS':
              case 'recipientRS': {
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.props.handleOpenAccountDialog}
                    data-val={response[key]}>{response[key]}
                  </a>)
                break
              }
              case 'amountDQT': {
                const amount = (<span><FormattedNumber
                  value={convertDQTToDBN(response[key], decimals)} /> {tokenName}</span>)
                row[item] = amount
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
    const data = this.assetTransferInfo(this.props.transactionInformation)
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

AssetTransferInformation.propTypes = {
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

export default AssetTransferInformation
