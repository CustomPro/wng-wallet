import React, { PropTypes } from 'react'
import {
  convertDQTToDBN,
  getType
} from 'redux/utils/nrs'
import { FormattedNumber } from 'react-intl'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import { tokenName, tokenDecimals } from 'config.json'

export class OrdirnaryPaymentInformation extends React.Component {
  paymentInfo (response) {
    const responseKeys = [
      'type',
      'amountDQT',
      'feeDQT',
      'recipientRS',
      'senderRS'
    ]
    const headers = [
      { name: 'type', 'messageId': 'type', 'label': 'Type' },
      { name: 'amountDQT', messageId: 'amount', label: 'Amount' },
      { name: 'feeDQT', messageId: 'fee', label: 'Fee' },
      { name: 'recipientRS', messageId: 'recipient_RS', label: 'Recipient' },
      { name: 'senderRS', messageId: 'sender_RS', label: 'Sender' }
    ]
    const rows = []
    if (response) {
      for (let item in response) {
        const row = {}
        responseKeys.map((key) => {
          if (item === key) {
            switch (item) {
              case 'amountDQT':
                const amount = (
                  <span>
                    <FormattedNumber
                      value={convertDQTToDBN(response[key], tokenDecimals)}
                      maximumFractionDigits={tokenDecimals} /> {tokenName}
                  </span>
                )
                row[item] = amount
                break
              case 'feeDQT':
                const fee = (
                  <span>
                    <FormattedNumber
                      value={convertDQTToDBN(response[key], tokenDecimals)}
                      maximumFractionDigits={tokenDecimals} /> {tokenName}
                  </span>
                )
                row[item] = fee
                break
              case 'type':
                const type = getType(this.props.transactionTypes, response.type, response.subtype)
                row['type'] = type.message
                break
              case 'senderRS':
              case 'recipientRS':
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.props.handleOpenAccountDialog}
                    data-val={response[key]}>{response[key]}
                  </a>)
                break
              default:
                row[key] = response[key]
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
    const data = this.paymentInfo(this.props.transactionInformation)
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

OrdirnaryPaymentInformation.propTypes = {
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

export default OrdirnaryPaymentInformation
