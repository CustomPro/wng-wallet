import React, { PropTypes } from 'react'
import {
  convertDQTToDBN,
  formatTimestamp,
  getType,
  getAssetInformation
} from 'redux/utils/nrs'
import { FormattedNumber, defineMessages } from 'react-intl'
import { Tabs, Tab } from 'material-ui'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import { tokenName, tokenDecimals } from 'config.json'
import { renderFormattedMessage } from 'redux/utils/intl'
import AssetIssuanceInformation from './AssetIssuanceInformation'
import AssetTransferInformation from './AssetTransferInformation'
import OrderPlacementInformation from './OrderPlacementInformation'
import OrdinaryPaymentInformation from './OrdinaryPaymentInformation'

const messages = defineMessages({
  info: {
    id: 'transactioninformation.info',
    defaultMessage: 'Info'
  },
  details: {
    id: 'details',
    defaultMessage: 'Details'
  }
})

export class TransactionInformation extends React.Component {

  componentDidMount () {
    const { getTransactionInformation, transaction } = this.props
    getTransactionInformation(transaction)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.transactionInformation !== nextProps.transactionInformation) {
      const { transactionInformation, getOrderTrades } = this.props
      const type = getType(this.props.transactionTypes,
        transactionInformation.type, transactionInformation.subtype)
      switch (type.name) {
        case 'BidOrderPlacement':
          getOrderTrades('bidOrder',
            transactionInformation.transaction,
            transactionInformation.attachment.asset)
          break
        case 'AskOrderPlacement':
          getOrderTrades('askOrder',
            transactionInformation.transaction,
            transactionInformation.attachment.asset)
          break
      }
    }
  }

  handleOpenAccountDialog = (e) => {
    const account = e.target.getAttribute('data-val')
    this.props.closeDialog()
    this.props.openAccountDialog(account)
  }

  handleOpenTransactionDialog = (e) => {
    const transaction = e.target.getAttribute('data-val')
    this.props.closeDialog()
    this.props.openTransactionDialog(transaction)
  }

  filterDetailsData (responseKeys, response) {
    if (response) {
      const rows = []
      for (let item in response) {
        const row = {}
        responseKeys.map((key) => {
          if (item === key) {
            switch (item) {
              case 'type': {
                const type = getType(this.props.transactionTypes,
                  response.type, response.subtype)
                row['type'] = type.message
                break
              }
              case 'amountDQT': {
                const amount = (
                  <span>
                    <FormattedNumber
                      value={convertDQTToDBN(response[key], tokenDecimals)}
                      maximumFractionDigits={tokenDecimals} /> {tokenName}
                  </span>
                )
                row[item] = amount
                break
              }
              case 'feeDQT': {
                const fee = (
                  <span>
                    <FormattedNumber
                      value={convertDQTToDBN(response[key], tokenDecimals)}
                      maximumFractionDigits={tokenDecimals} /> {tokenName}
                  </span>
                )
                row[item] = fee
                break
              }
              case 'senderRS':
              case 'recipientRS': {
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.handleOpenAccountDialog}
                    data-val={response[key]}>{response[key]}
                  </a>)
                break
              }
              case 'timestamp':
              case 'blockTimestamp': {
                const date = formatTimestamp(response[key]).toLocaleString()
                row[item] = date
                break
              }
              case 'senderPublicKey':
              case 'signature': {
                row[item] = (<div style={{wordBreak: 'break-all'}}>{response[key]}</div>)
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
      return rows
    }
    return null
  }

  renderDetails (transaction) {
    const responseKeys = [
      'senderPublicKey',
      'amountDQT',
      'signature',
      'transactionIndex',
      'confirmations',
      'feeDQT',
      'type',
      'fullHash',
      'senderRS',
      'recipientRS',
      'sender',
      'ecBlockHeight',
      'ecBlockId',
      'block',
      'blockTimestamp',
      'deadline',
      'timestamp',
      'height'
    ]
    const headers = [
      { name: 'senderPublicKey', label: 'Sender Public Key', messageId: 'sender_public_key' },
      { name: 'amountDQT', label: 'Amount', messageId: 'amount' },
      { name: 'signature', label: 'Signature', messageId: 'signature' },
      { name: 'transactionIndex', label: 'Transaction Index', messageId: 'transaction_index' },
      { name: 'type', label: 'Type', messageId: 'type' },
      { name: 'confirmations', label: 'Confirmations', messageId: 'confirmations' },
      { name: 'feeDQT', label: 'Fee DQT', messageId: 'fee' },
      { name: 'fullHash', label: 'Full Hash', messageId: 'full_hash' },
      { name: 'senderRS', label: 'Sender RS', messageId: 'sender_RS' },
      { name: 'recipientRS', label: 'Recipient RS', messageId: 'recipient_RS' },
      { name: 'sender', label: 'Sender', messageId: 'sender' },
      { name: 'ecBlockHeight', label: 'EC Block Height', messageId: 'ec_block_height' },
      { name: 'ecBlockId', label: 'EC Block ID', messageId: 'ec_block_id' },
      { name: 'block', label: 'Block', messageId: 'block' },
      { name: 'blockTimestamp', label: 'Block Timestamp', messageId: 'block_timestamp' },
      { name: 'deadline', label: 'Deadline', messageId: 'deadline' },
      { name: 'timestamp', label: 'Timestamp', messageId: 'timestamp' },
      { name: 'height', label: 'Height', messageId: 'height' }
    ]

    const rows = this.filterDetailsData(responseKeys, transaction)
    const data = { headers, rows }
    const isMobile = true
    return (
      <ResponsiveTable
        data={data}
        isMobile={isMobile}
        hasNext={false}
        hasPrev={false}
        isLoading={this.props.isLoading}
      />
    )
  }

  renderTransactionInformation (transactionInfo) {
    let attachmentInfo
    if (transactionInfo.hasOwnProperty('type') && transactionInfo) {
      const type = getType(this.props.transactionTypes, transactionInfo.type, transactionInfo.subtype)
      let assetInfo = getAssetInformation(this.props.assets, transactionInfo.attachment.asset)
      if (!assetInfo) assetInfo = this.props.asset
      switch (type.name) {
        case 'AssetIssuance':
          attachmentInfo = <AssetIssuanceInformation
            handleOpenAccountDialog={this.handleOpenAccountDialog}
            handleOpenTransactionDialog={this.handleOpenTransactionDialog}
            {...this.props}
            asset={assetInfo} />
          break
        case 'AssetTransfer':
          attachmentInfo = <AssetTransferInformation
            handleOpenAccountDialog={this.handleOpenAccountDialog}
            handleOpenTransactionDialog={this.handleOpenTransactionDialog}
            {...this.props}
            asset={assetInfo} />
          break
        case 'BidOrderPlacement':
        case 'AskOrderPlacement':
          attachmentInfo = <OrderPlacementInformation
            handleOpenAccountDialog={this.handleOpenAccountDialog}
            handleOpenTransactionDialog={this.handleOpenTransactionDialog}
            {...this.props}
            asset={assetInfo} />
          break
        case 'OrdinaryPayment':
          attachmentInfo = <OrdinaryPaymentInformation
            handleOpenAccountDialog={this.handleOpenAccountDialog}
            handleOpenTransactionDialog={this.handleOpenTransactionDialog}
            {...this.props} />
          break
        default:
          attachmentInfo = <OrdinaryPaymentInformation
            handleOpenAccountDialog={this.handleOpenAccountDialog}
            handleOpenTransactionDialog={this.handleOpenTransactionDialog}
            {...this.props} />
      }
    }
    const info = (
      <div style={{ paddingTop: 20 }}>
        <Tabs>
          <Tab label={renderFormattedMessage(messages.info)}>
            {attachmentInfo}
          </Tab>
          <Tab label={renderFormattedMessage(messages.details)}>
            {this.renderDetails(this.props.transactionInformation)}
          </Tab>
        </Tabs>
      </div>
    )
    return info
  }

  render () {
    let transactionInfo
    if (this.props.transactionInformation) {
      transactionInfo = this.renderTransactionInformation(this.props.transactionInformation)
    }
    return (
      <div>
        {transactionInfo}
      </div>
    )
  }
}

TransactionInformation.propTypes = {
  transaction: PropTypes.string,
  getTransactionInformation: PropTypes.func,
  transactionInformation: PropTypes.object,
  asset: PropTypes.object,
  assets: PropTypes.array,
  closeDialog: PropTypes.func,
  openAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  isLoading: PropTypes.bool,
  transactionTypes: PropTypes.object,
  getOrderTrades: PropTypes.func,
  orderTrades: PropTypes.array
}

export default TransactionInformation
