import React, { PropTypes } from 'react'
import { FormattedNumber, defineMessages } from 'react-intl'
import { formatTimestamp, convertDQTToDBN } from 'redux/utils/nrs'
import ResponsiveTable from 'components/ResponsiveTable'
import OnClick from 'components/OnClick'
import { blocks, tokenName } from 'config.json'
import style from 'routes/Blocks/components/Blocks.css'
import { renderFormattedMessage } from 'redux/utils/intl'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'

const messages = defineMessages({
  blocks: {
    id: 'blocks_table.no_transactions',
    defaultMessage: 'No transactions'
  }
})

export class BlocksTable extends React.Component {

  componentDidMount () {
    const { getBlocks, blocksPageNumber, blocksPageSize } = this.props
    getBlocks(blocksPageNumber, blocksPageSize)
  }

  handlePrevClick = () => {
    const { blocksPageNumber } = this.props
    const prevPage = blocksPageNumber - 1
    this.props.updateBlocksPage(prevPage)
  }

  handleNextClick = () => {
    const { blocksPageNumber } = this.props
    const nextPage = blocksPageNumber + 1
    this.props.updateBlocksPage(nextPage)
  }

  autorenew = () => {
    this.props.updateBlocksPage(1)
  }

  filterData (responseKeys, response) {
    if (response) {
      const rows = []
      response.map((item) => {
        let row = {}
        responseKeys.map((key) => {
          if (item[key]) {
            switch (key) {
              case 'timestamp':
                const date = formatTimestamp(item[key]).toLocaleString()
                row[key] = date
                break
              case 'totalAmountDQT':
              case 'totalFeeDQT':
                const amount = convertDQTToDBN(item[key])
                row[key] = <span><FormattedNumber value={amount} /> {tokenName}</span>
                break
              case 'transactions':
                const arr = item[key]
                let transactions
                if (arr.length > 0) {
                  transactions = arr.map((transaction) => {
                    return (
                      <div>
                        <OnClick
                          callback={this.props.openTransactionDialog}
                          value={transaction}>
                          <a style={{ cursor: 'pointer' }}>
                            {transaction}
                          </a>
                        </OnClick>
                      </div>
                    )
                  })
                } else {
                  transactions = (
                    <span className={style.BlocksTable__NoTransactions}>
                      {renderFormattedMessage(messages.no_transactions)}
                    </span>
                  )
                }
                row[key] = transactions
                break
              case 'generatorRS':
                row[key] = (
                  <OnClick
                    callback={this.props.openAccountDialog}
                    value={item[key]}>
                    <a style={{ cursor: 'pointer' }}>
                      {item[key]}
                    </a>
                  </OnClick>)
                break
              case 'height':
                row[key] = (
                  <OnClick
                    callback={this.props.openBlockDialog}
                    value={item[key]}>
                    <a style={{ cursor: 'pointer' }}>
                      {item[key]}
                    </a>
                  </OnClick>)
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
    const { selectedBlocks, isLoadingBlocks,
      blocksHasPrev, blocksHasNext,
      isMobile, title } = this.props
    let titleColor
    let textColor
    if (CustomTheme.responsive_tables && CustomTheme.responsive_tables.blocks_table) {
      if (CustomTheme.responsive_tables.blocks_table.color) {
        titleColor = CustomTheme.responsive_tables.blocks_table.color
      }
      if (CustomTheme.responsive_tables.blocks_table.textColor) {
        textColor = CustomTheme.responsive_tables.blocks_table.textColor
      }
    }
    const headers = [
      { name: 'height', 'label': 'Height', messageId: 'height' },
      { name: 'timestamp', 'label': 'Age', messageId: 'age' },
      { name: 'totalAmountDQT', 'label': 'Total Amount', messageId: 'total_amount' },
      { name: 'totalFeeDQT', 'label': 'Fees', 'messageId': 'fees' },
      { name: 'generatorRS', 'label': 'Generator', 'messageId': 'generator' }
    ]
    const responseKeys = [
      'height', 'timestamp',
      'totalAmountDQT',
      'totalFeeDQT', 'generatorRS']
    if (blocks.showTransactions === true) {
      headers.push({ name: 'transactions', 'label': 'Transactions', messageId: 'transactions' })
      responseKeys.push('transactions')
    }
    const blocksData = this.processResponse(headers, responseKeys, selectedBlocks)

    return (
      <div>
        <ResponsiveTable
          data={blocksData}
          isLoading={isLoadingBlocks}
          isMobile={isMobile}
          handleNextClick={this.handleNextClick}
          handlePrevClick={this.handlePrevClick}
          hasNext={blocksHasNext}
          hasPrev={blocksHasPrev}
          autorenewCallback={this.autorenew}
          autorenew
          title={title}
          titleColor={titleColor}
          textColor={textColor}
          pagination={blocks.pagination}
        />
      </div>
    )
  }

}

BlocksTable.propTypes = {
  selectedBlocks: PropTypes.array,
  isLoadingBlocks: PropTypes.bool,
  isMobile: PropTypes.bool,
  getBlocks: PropTypes.func,
  pageSize: PropTypes.number,
  pageNumber: PropTypes.number,
  updatePage: PropTypes.func,
  UI: PropTypes.string,
  openTransactionDialog: PropTypes.func,
  openAccountDialog: PropTypes.func,
  openBlockDialog: PropTypes.func,
  title: PropTypes.string,
  blocksPageNumber: PropTypes.number,
  blocksPageSize: PropTypes.number,
  blocksHasPrev: PropTypes.bool,
  blocksHasNext: PropTypes.bool,
  updateBlocksPage: PropTypes.func
}

export default BlocksTable
