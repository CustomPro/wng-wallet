import React, { PropTypes } from 'react'
import style from './ResponsiveTable.css'
import {
  CardTitle,
  FlatButton,
  CircularProgress
} from 'material-ui'

import { defineMessages } from 'react-intl'
import { renderFormattedMessagesArray, renderFormattedMessage } from 'redux/utils/intl'
import ActionAutorenew from 'material-ui/svg-icons/action/autorenew'
import OnClick from 'components/OnClick'

const messages = defineMessages({
  empty_rows: {
    id: 'empty_rows',
    defaultMessage: 'There is nothing here at the moment.'
  },
  sender: {
    id: 'sender',
    defaultMessage: 'Sender'
  },
  quantity: {
    id: 'quantity',
    defaultMessage: 'Quantity'
  },
  total: {
    id: 'total',
    defaultMessage: 'Total'
  },
  seller: {
    id: 'seller',
    defaultMessage: 'Seller'
  },
  buyer: {
    id: 'buyer',
    defaultMessage: 'Buyer'
  },
  ask_order: {
    id: 'ask_order',
    defaultMessage: 'Ask Order'
  },
  bid_order: {
    id: 'bid_order',
    defaultMessage: 'Bid Order'
  },
  name: {
    id: 'name',
    defaultMessage: 'Name'
  },
  description: {
    id: 'description',
    defaultMessage: 'Description'
  },
  decimals: {
    id: 'decimals',
    defaultMessage: 'Decimals'
  },
  balance: {
    id: 'balance',
    defaultMessage: 'Balance'
  },
  type: {
    id: 'type',
    defaultMessage: 'Type'
  },
  amount: {
    id: 'amount',
    defaultMessage: 'Amount'
  },
  fee: {
    id: 'fee',
    defaultMessage: 'Fee'
  },
  date: {
    id: 'date',
    defaultMessage: 'Date'
  },
  account: {
    id: 'account',
    defaultMessage: 'Account'
  },
  next: {
    id: 'next',
    defaultMessage: 'Next'
  },
  prev: {
    id: 'prev',
    defaultMessage: 'Prev'
  },
  sender_public_key: {
    id: 'sender_public_key',
    defaultMessage: 'Sender Public Key'
  },
  signature: {
    id: 'signature',
    defaultMessage: 'Signature'
  },
  transaction_index: {
    id: 'transaction_index',
    defaultMessage: 'Transaction Index'
  },
  confirmations: {
    id: 'confirmations',
    defaultMessage: 'Confirmations'
  },
  full_hash: {
    id: 'full_hash',
    defaultMessage: 'Full Hash'
  },
  ec_block_id: {
    id: 'ec_block_id',
    defaultMessage: 'EC Block ID'
  },
  sender_RS: {
    id: 'sender_RS',
    defaultMessage: 'Sender RS'
  },
  recipient_RS: {
    id: 'recipient_RS',
    defaultMessage: 'Recipient RS'
  },
  ec_block_height: {
    id: 'ec_block_height',
    defaultMessage: 'EC Block Height'
  },
  block: {
    id: 'block',
    defaultMessage: 'Block'
  },
  block_timestamp: {
    id: 'block_timestamp',
    defaultMessage: 'Block Timestamp'
  },
  deadline: {
    id: 'deadline',
    defaultMessage: 'Deadline'
  },
  timestamp: {
    id: 'timestamp',
    defaultMessage: 'Timestamp'
  },
  height: {
    id: 'height',
    defaultMessage: 'Height'
  },
  price: {
    id: 'price',
    defaultMessage: 'Price'
  },
  price_per_unit: {
    id: 'price_per_unit',
    defaultMessage: 'Price per Unit'
  },
  total_quantity: {
    id: 'total_quantity',
    defaultMessage: 'Total Quantity'
  },
  select_asset: {
    id: 'select_asset',
    defaultMessage: 'Select asset'
  },
  age: {
    id: 'age',
    defaultMessage: 'Age'
  },
  total_amount: {
    id: 'total_amount',
    defaultMessage: 'Total Amount'
  },
  fees: {
    id: 'fees',
    defaultMessage: 'Fees'
  },
  generator: {
    id: 'generator',
    defaultMessage: 'Generator'
  },
  id: {
    id: 'id',
    defaultMessage: 'ID'
  },
  address: {
    id: 'address',
    defaultMessage: 'Address'
  },
  comments: {
    id: 'comments',
    defaultMessage: 'Comments'
  },
  status: {
    id: 'status',
    defaultMessage: 'Status'
  },
  files: {
    id: 'files',
    defaultMessage: 'Files'
  },
  actions: {
    id: 'actions',
    defaultMessage: 'Actions'
  },
  base_target: {
    id: 'base_target',
    defaultMessage: 'Base Target'
  },
  generatorRS: {
    id: 'generatorRS',
    defaultMessage: 'Generator RS'
  },
  next_block: {
    id: 'next_block',
    defaultMessage: 'Next Block'
  },
  number_of_transactions: {
    id: 'number_of_transactions',
    defaultMessage: 'Number of Transactions'
  },
  previous_block: {
    id: 'previous_block',
    defaultMessage: 'Previous Block'
  },
  total_fee: {
    id: 'total_fee',
    defaultMessage: 'Total Fee'
  },
  asset: {
    id: 'asset',
    defaultMessage: 'Asset'
  },
  trades: {
    id: 'trades',
    defaultMessage: 'Trades'
  },
  total_trades: {
    id: 'total_trades',
    defaultMessage: 'Total Trades'
  },
  initial_quantity: {
    id: 'initial_quantity',
    defaultMessage: 'Initial Quantity'
  },
  information: {
    id: 'information',
    defaultMessage: 'Information'
  },
  token_per_asset: {
    id: 'token_per_asset',
    defaultMessage: '1 {token}'
  },
  code: {
    id: 'code',
    defaultMessage: 'Code'
  },
  value: {
    id: 'Value',
    defaultMessage: 'Value'
  },
  expiration_date: {
    id: 'expiration_date',
    defaultMessage: 'Expiration Date'
  },
  redemption_status: {
    id: 'redemption_status',
    defaultMessage: 'Redemption Status'
  }
})

export class ResponsiveTable extends React.Component {

  constructor (props) {
    super(props)
    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.handleNextClick = this.handleNextClick.bind(this)
  }

  handleNextClick () {
    if (this.props.handleNextClick) {
      this.props.handleNextClick()
    }
  }

  handlePrevClick () {
    if (this.props.handlePrevClick) {
      this.props.handlePrevClick()
    }
  }

  renderHeaders (headerData) {
    if (headerData && Array.isArray(headerData)) {
      const headers = headerData.map((header) => {
        if (header.label) {
          let message = header.label
          let values
          if (header.values) { values = header.values }
          if (header.messageId) { message = renderFormattedMessagesArray(header.messageId, messages, values) }
          return (
            <div key={header.name} className={style.ResponsiveTable_Header}>
              {message}
            </div>
          )
        }
        return null
      })
      return (<div className={style.ResponsiveTable_Headers}>{headers}</div>)
    }
    return null
  }

  renderRows (rowData) {
    if (rowData && Array.isArray(rowData) && rowData.length > 0) {
      const rows = rowData.map((row, index) => {
        const cells = this.renderCells(row)
        return (
          <div key={index}
            className={style.ResponsiveTable_Row}
            >
            {cells}
          </div>
        )
      })
      return rows
    }
    return (
      <div className={style.ResponsiveTable_EmptyRows}>
        {renderFormattedMessage(messages.empty_rows)}
      </div>)
  }

  renderCells (cellData) {
    if (cellData) {
      let cells = []
      let listItemStyle = {}
      if (cellData.hasOwnProperty('style')) {
        listItemStyle = JSON.parse(cellData['style'])
      }
      for (const item in cellData) {
        if (item !== 'style') {
          const cell = (
            <div key={item} className={style.ResponsiveTable_Cell} style={listItemStyle}>
              <div className={style.ResponsiveTable_CellText}>{cellData[item]}</div>
            </div>
          )
          cells.push(cell)
        }
      }
      return cells
    }
    return null
  }

  renderList (headerData, rowData) {
    let rows
    if (rowData && rowData.length > 0) {
      if (rowData && Array.isArray(rowData)) {
        rows = rowData.map((row, index) => {
          const cells = this.renderListItems(row, headerData)
          return (
            <div key={index} className={style.ResponsiveTable_ListItem}>
              {cells}
            </div>
          )
        })
      }
      return (
        <div>
          {rows}
        </div>
      )
    }
    return (
      <div className={style.ResponsiveTable_EmptyRows}>
        {renderFormattedMessage(messages.empty_rows)}
      </div>)
  }

  mutateHeaderData (headerData) {
    const headerObj = {}
    headerData.map((header) => {
      const headerItem = { label: header.label }
      if (header.messageId) { headerItem.messageId = header.messageId }
      if (header.values) { headerItem.values = header.values }
      headerObj[header.name] = headerItem
    })
    return headerObj
  }

  renderListItems (listData, headerData) {
    if (listData) {
      const headerObj = this.mutateHeaderData(headerData)
      let list = []
      let listItemStyle = {}
      if (listData.hasOwnProperty('style')) {
        listItemStyle = JSON.parse(listData['style'])
      }
      for (const item in listData) {
        if (listData[item] !== '') {
          if (item !== 'style') {
            let message = headerObj[item].label
            if (headerObj[item].hasOwnProperty('messageId')) {
              message = renderFormattedMessagesArray(headerObj[item].messageId, messages, headerObj[item].values)
            }
            const listItem = (
              <div
                key={item}
                className={style.ResponsiveTable_ListItem_Item}
                style={listItemStyle}
              >
                <div className={style.ResponsiveTable_ListLabel}>
                  {message}
                </div>
                <div className={style.ResponsiveTable_ListValue}>{listData[item]}</div>
              </div>
            )
            list.push(listItem)
          }
        }
      }
      return list
    }
    return null
  }

  renderMobile (headerData, rowData) {
    const cards = this.renderList(headerData, rowData)
    return cards
  }

  renderDesktop (headerData, rowData) {
    const headers = this.renderHeaders(headerData)
    const rows = this.renderRows(rowData)

    return (
      <div className={style.ResponsiveTable_Table}>
        {headers}
        {rows}
      </div>
    )
  }

  renderFooter () {
    let prevDisabled
    let nextDisabled
    if (!this.props.hasPrev) {
      prevDisabled = true
    }
    if (!this.props.hasNext) {
      nextDisabled = true
    }
    let footer
    if (!(!this.props.hasNext && !this.props.hasPrev)) {
      footer = (
        <div className={style.ResponsiveTable_Footer}>
          <div className={style.ResponsiveTable_Pagination}>
            <FlatButton label={renderFormattedMessage(messages.prev)}
              disabled={prevDisabled} primary onClick={this.handlePrevClick} />
            <FlatButton label={renderFormattedMessage(messages.next)}
              disabled={nextDisabled} primary onClick={this.handleNextClick} />
          </div>
        </div>
      )
    }
    return footer
  }

  render () {
    let table
    let title
    let footer
    if (this.props.title) {
      let autorenew
      const titleStyle = {}
      if (this.props.autorenew) {
        autorenew = (
          <OnClick
            callback={this.props.autorenewCallback}
            className={style.ResponsiveTable_Autorenew}>
            <ActionAutorenew color='black' />
          </OnClick>)
      }
      if (this.props.titleColor) {
        titleStyle.backgroundColor = this.props.titleColor
      }
      if (this.props.textColor) {
        titleStyle.color = this.props.textColor
      }
      title = (
        <CardTitle style={titleStyle}>
          <div className={style.ResponsiveTable_CardTitle}>
            {this.props.title}
            {autorenew}
          </div>
        </CardTitle>)
    }
    if (this.props.isLoading === true) {
      table = (<CircularProgress />)
    } else {
      if (this.props.isMobile) {
        table = (
          <div className={style.ResponsiveTable_Table__Mobile}>
            {this.renderMobile(this.props.data.headers, this.props.data.rows)}
          </div>
          )
      } else {
        table = (
          <div className={style.ResponsiveTable_Table__Desktop}>
            {this.renderDesktop(this.props.data.headers, this.props.data.rows)}
          </div>
          )
      }
    }

    if (this.props.pagination !== false) {
      footer = this.renderFooter()
    }
    return (
      <div className={style.ResponsiveTable}>
        {title}
        <div className={style.ResponsiveTable_Container}>
          {table}
        </div>
        {footer}
      </div>
    )
  }
}

ResponsiveTable.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
  isMobile: PropTypes.bool,
  isLoading: PropTypes.bool,
  hasLoaded: PropTypes.bool,
  numberOfItems: PropTypes.number,
  handleNextClick: PropTypes.func,
  handlePrevClick: PropTypes.func,
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool,
  autorenew: PropTypes.bool,
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  autorenewCallback: PropTypes.func,
  pagination: PropTypes.bool
}

export default ResponsiveTable
