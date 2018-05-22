import React, { PropTypes } from 'react'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import { FormattedNumber } from 'react-intl'
import { tokenName, tokenDecimals } from 'config.json'
import {
  convertDQTToDBN,
  convertQNTToQuantity,
  formatTimestamp,
  getType,
  getAssetInformation
} from 'redux/utils/nrs'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'

export class Transactions extends React.Component {

  componentDidMount () {
    const { getBlockchainTransactions,
      selectedAccount,
      account,
      blockchainTransactionsPageNumber,
      blockchainTransactionsPageSize } = this.props
    let transactionAccount
    if (selectedAccount) { transactionAccount = selectedAccount } else { transactionAccount = account }
    getBlockchainTransactions(transactionAccount, blockchainTransactionsPageNumber, blockchainTransactionsPageSize)
  }

  componentDidUpdate (prevProps, prevState) {
    const { getBlockchainTransactions,
      selectedAccount,
      account,
      blockchainTransactionsPageNumber,
      blockchainTransactionsPageSize } = this.props
    let transactionAccount
    if (selectedAccount) { transactionAccount = selectedAccount } else { transactionAccount = account }
    if (prevProps.selectedAccount !== this.props.selectedAccount) {
      getBlockchainTransactions(transactionAccount, blockchainTransactionsPageNumber, blockchainTransactionsPageSize)
    }
  }

  handlePrevClick = () => {
    const {
      selectedAccount,
      account
    } = this.props
    let transactionAccount
    if (selectedAccount) { transactionAccount = selectedAccount } else { transactionAccount = account }
    const currentPage = this.props.blockchainTransactionsPageNumber
    const prevPage = currentPage - 1
    this.props.updateBlockchainTransactionsPage(prevPage, transactionAccount)
  }

  handleNextClick = () => {
    const {
      selectedAccount,
      account
    } = this.props
    let transactionAccount
    if (selectedAccount) { transactionAccount = selectedAccount } else { transactionAccount = account }
    const currentPage = this.props.blockchainTransactionsPageNumber
    const nextPage = currentPage + 1
    this.props.updateBlockchainTransactionsPage(nextPage, transactionAccount)
  }

  handleOpenAccountDialog = (e) => {
    const account = e.target.getAttribute('data-val')
    this.props.openAccountDialog(account)
  }

  handleOpenTransactionDialog = (e) => {
    const transaction = e.target.getAttribute('data-val')
    this.props.openTransactionDialog(transaction)
  }

  autorenew = () => {
    const { updateBlockchainTransactionsPage } = this.props
    updateBlockchainTransactionsPage(1)
  }

  filterData (responseKeys, response) {
    if (response) {
      const rows = []

      response.map((item) => {
        let row = {}
        const italic = { fontStyle: 'italic' }
        if (!item.hasOwnProperty('confirmations')) {
          row.style = JSON.stringify(italic)
        }
        const type = getType(this.props.transactionTypes, item.type, item.subtype)
        row['type'] = type.message
        responseKeys.map((key) => {
          if (item[key]) {
            switch (key) {
              case 'senderRS':
              case 'recipientRS':
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.handleOpenAccountDialog}
                    data-val={item[key]}>{item[key]}
                  </a>)
                break
              case 'amountDQT':
                if (type.name === 'AssetTransfer' ||
                type.name === 'BidOrderPlacement' ||
                type.name === 'AskOrderPlacement') {
                  const assetInfo = getAssetInformation(this.props.selectedAssets, item.attachment.asset)
                  let name
                  let decimals = item.decimals
                  if (assetInfo && assetInfo.name) {
                    name = assetInfo.name
                    decimals = assetInfo.decimals
                  }
                  const value = convertQNTToQuantity(item.attachment.quantityQNT, decimals)

                  row[key] = <span>
                    <FormattedNumber value={value} maximumFractionDigits={decimals} />&nbsp;{name}
                  </span>
                } else {
                  row[key] = (
                    <span>
                      <FormattedNumber
                        value={convertDQTToDBN(item[key], tokenDecimals)}
                        maximumFractionDigits={tokenDecimals}
                        /> {tokenName}
                    </span>)
                }
                break
              case 'feeDQT':
                row[key] = (
                  <span>
                    <FormattedNumber
                      value={convertDQTToDBN(item[key], tokenDecimals)}
                      maximumFractionDigits={tokenDecimals}
                      /> {tokenName}
                  </span>)
                break
              case 'timestamp':
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.handleOpenTransactionDialog}
                    data-val={item.transaction}>{formatTimestamp(item[key]).toLocaleString()}
                  </a>)
                break
              default:
                row[key] = item[key]
            }
          } else { row[key] = '' }
        })
        rows.push(row)
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

  renderTransactions () {
    const {
      blockchainTransactions,
      isLoadingTransactions,
      blockchainTransactionsHasNext,
      blockchainTransactionsHasPrev
    } = this.props
    let titleColor
    let textColor
    if (CustomTheme.responsive_tables && CustomTheme.responsive_tables.transactions) {
      if (CustomTheme.responsive_tables.transactions.color) {
        titleColor = CustomTheme.responsive_tables.transactions.color
      }
      if (CustomTheme.responsive_tables.transactions.textColor) {
        textColor = CustomTheme.responsive_tables.transactions.textColor
      }
    }
    const responseKeys = ['senderRS', 'recipientRS', 'amountDQT', 'feeDQT', 'timestamp']
    const headers = [
      { name: 'type', messageId: 'type', 'label': 'Type' },
      { name: 'senderRS', messageId: 'sender', 'label': 'Sender' },
      { name: 'recipientRS', messageId: 'recipient', 'label': 'Recipient' },
      { name: 'amountDQT', messageId: 'amount', 'label': 'Amount' },
      { name: 'feeDQT', messageId: 'fee', 'label': 'Fee' },
      { name: 'timestamp', messageId: 'date', 'label': 'Date' }
    ]
    const transactionsData = this.processResponse(headers, responseKeys, blockchainTransactions)
    return (
      <ResponsiveTable
        data={transactionsData}
        title={this.props.title}
        isMobile={this.props.isMobile}
        isLoading={isLoadingTransactions}
        handleNextClick={this.handleNextClick}
        handlePrevClick={this.handlePrevClick}
        hasNext={blockchainTransactionsHasNext}
        hasPrev={blockchainTransactionsHasPrev}
        autorenewCallback={this.autorenew}
        autorenew
        titleColor={titleColor}
        textColor={textColor}
      />
    )
  }

  render () {
    const transactions = this.renderTransactions()
    return (
      <div>
        {transactions}
      </div>
    )
  }
}

Transactions.propTypes = {
  account: PropTypes.string,
  selectedAccount: PropTypes.string,
  asset: PropTypes.object,
  tokenName: PropTypes.string,
  isLoadingTransactions: PropTypes.bool,
  blockchainTransactions: PropTypes.array.isRequired,
  title: PropTypes.string,
  isMobile: PropTypes.bool,
  decimals: PropTypes.number,
  getAsset: PropTypes.func,
  getBlockchainTransactions: PropTypes.func,
  blockchainTransactionsPageSize: PropTypes.number,
  blockchainTransactionsPageNumber: PropTypes.number,
  blockchainTransactionsHasNext: PropTypes.bool,
  blockchainTransactionsHasPrev: PropTypes.bool,
  updateBlockchainTransactionsPage: PropTypes.func,
  UI: PropTypes.string,
  openAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  transactionTypes: PropTypes.object,
  selectedAssets: PropTypes.array
}

export default Transactions
