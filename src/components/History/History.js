import React, { PropTypes } from 'react'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import { FormattedNumber } from 'react-intl'
import { tokenName } from 'config.json'
import {
  convertQNTToQuantity,
  convertDQTToPrice,
  formatTimestamp
} from 'redux/utils/nrs'
import { renderFormattedMessage } from 'redux/utils/intl'

export class History extends React.Component {

  constructor (props) {
    super(props)
    this.handleOpenAccountDialog = this.handleOpenAccountDialog.bind(this)
    this.handleOpenTransactionDialog = this.handleOpenTransactionDialog.bind(this)
  }

  handlePrevClick = () => {
    const currentPage = this.props.pageNumber
    const prevPage = currentPage - 1
    this.props.updatePage(this.props.UI, prevPage, this.props.pageSize)
  }

  handleNextClick = () => {
    const currentPage = this.props.pageNumber
    const nextPage = currentPage + 1
    this.props.updatePage(this.props.UI, nextPage, this.props.pageSize)
  }

  handleOpenAccountDialog = (e) => {
    const account = e.target.getAttribute('data-val')
    this.props.openAccountDialog(account)
  }

  handleOpenTransactionDialog = (e) => {
    const transaction = e.target.getAttribute('data-val')
    this.props.openTransactionDialog(transaction)
  }

  filterData (responseKeys, response) {
    if (response) {
      const rows = []
      const { decimals } = this.props
      response.map((item) => {
        let row = {}
        const italic = { fontStyle: 'italic' }
        if (!item.hasOwnProperty('height')) {
          row.style = JSON.stringify(italic)
        }
        responseKeys.map((key) => {
          if (item[key]) {
            switch (key) {
              case 'quantityQNT':
                const quantity = convertQNTToQuantity(item[key], decimals)
                row[key] = (<span><FormattedNumber value={quantity} />
                &nbsp;{renderFormattedMessage({ id: this.props.assetName })}</span>)
                break
              case 'priceDQT':
                const price = convertDQTToPrice(item[key], decimals)
                row[key] = (<span><FormattedNumber value={price} /> {tokenName}</span>)
                break
              case 'timestamp':
                const date = formatTimestamp(item[key]).toLocaleString()
                row[key] = date
                break
              case 'sellerRS':
              case 'buyerRS':
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.handleOpenAccountDialog}
                    data-val={item[key]}>{item[key]}
                  </a>)
                break
              case 'bidOrder':
              case 'askOrder':
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.handleOpenTransactionDialog}
                    data-val={item[key]}>{item[key]}
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

  render () {
    const {
      history,
      isLoadingHistory,
      hasNext,
      hasPrev
    } = this.props

    const responseKeys = ['sellerRS', 'buyerRS', 'bidOrder', 'askOrder', 'quantityQNT', 'timestamp']
    const headers = [
      { name: 'sellerRS', 'messageId': 'seller', 'label': 'Seller' },
      { name: 'buyerRS', 'messageId': 'buyer', 'label': 'Buyer' },
      { name: 'bidOrder', 'messageId': 'bid_order', 'label': 'Bid Order' },
      { name: 'askOrder', 'messageId': 'ask_order', 'label': 'Ask Order' },
      { name: 'quantityQNT', 'messageId': 'quantity', 'label': 'Quantity' },
      { name: 'timestamp', 'messageId': 'date', 'label': 'Date' }
    ]
    const historyData = this.processResponse(headers, responseKeys, history)
    return (
      <ResponsiveTable
        data={historyData}
        title={this.props.title}
        isMobile={this.props.isMobile}
        isLoading={isLoadingHistory}
        handleNextClick={this.handleNextClick}
        handlePrevClick={this.handlePrevClick}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    )
  }
}

History.propTypes = {
  title: PropTypes.string,
  UI: PropTypes.string,
  isMobile: PropTypes.bool,
  decimals: PropTypes.number,
  getHistory: PropTypes.func,
  asset: PropTypes.string,
  pageSize: PropTypes.number,
  pageNumber: PropTypes.number,
  history: PropTypes.array,
  isLoadingHistory: PropTypes.bool,
  updatePage: PropTypes.func,
  assetName: PropTypes.string,
  tokenName: PropTypes.string,
  account: PropTypes.string,
  openAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool
}

export default History
