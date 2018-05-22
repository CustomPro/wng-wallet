import React, { PropTypes } from 'react'
import { convertDQTToDBN, formatTimestamp } from 'redux/utils/nrs'
import { FormattedNumber, defineMessages } from 'react-intl'
import { Tabs, Tab } from 'material-ui'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'
import { tokenName } from 'config.json'
import { renderFormattedMessage } from 'redux/utils/intl'
import OnClick from 'components/OnClick'

const messages = defineMessages({
  details: {
    id: 'details',
    defaultMessage: 'Details'
  }
})

export class BlockInformation extends React.Component {

  componentDidMount () {
    const { getBlockInformation, block } = this.props
    getBlockInformation(block)
  }

  handleOpenAccountDialog = (e) => {
    const account = e.target.getAttribute('data-val')
    this.props.openAccountDialog(account)
  }

  handleOpenBlockDialog = (e) => {
    const block = e.target.getAttribute('data-val')
    this.props.openBlockDialog(block)
  }

  filterDetailsData (responseKeys, response) {
    if (response) {
      const row = {}
      for (let item in response) {
        switch (item) {
          case 'timestamp':
            const date = formatTimestamp(response[item]).toLocaleString()
            row[item] = date
            break
          case 'totalAmountDQT':
          case 'totalFeeDQT':
            const amount = convertDQTToDBN(response[item])
            row[item] = <span><FormattedNumber value={amount} /> {tokenName}</span>
            break
          case 'transactions':
            const arr = response[item]
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
                <span>
                  {renderFormattedMessage(messages.no_transactions)}
                </span>
              )
            }
            row[item] = transactions
            break
          case 'generatorRS':
            row[item] = (
              <OnClick
                callback={this.props.openAccountDialog}
                value={response[item]}>
                <a style={{ cursor: 'pointer' }}>
                  {response[item]}
                </a>
              </OnClick>)
            break
          case 'block':
          case 'baseTarget':
          case 'nextBlock':
          case 'previousBlock':
          case 'height':
          case 'numberOfTransactions':
            row[item] = response[item]
            break
        }
      }
      const rows = []
      rows.push(row)
      return rows
    }
    return null
  }

  renderDetails (block) {
    const responseKeys = [
      'block',
      'baseTarget',
      'generatorRS',
      'nextBlock',
      'previousBlock',
      'totalFeeDQT',
      'totalAmountDQT',
      'height',
      'timestamp',
      'numberOfTransactions',
      'transactions'
    ]
    const headers = [
      { name: 'block', label: 'Block', messageId: 'block' },
      { name: 'baseTarget', label: 'Base Target', messageId: 'base_target' },
      { name: 'generatorRS', label: 'Generator RS', messageId: 'generatorRS' },
      { name: 'nextBlock', label: 'Next Block', messageId: 'next_block' },
      { name: 'previousBlock', label: 'Previous Block', messageId: 'previous_block' },
      { name: 'totalFeeDQT', label: 'Total Fee', messageId: 'total_fee' },
      { name: 'totalAmountDQT', label: 'Total Amount', messageId: 'total_amount' },
      { name: 'height', label: 'Height', messageId: 'height' },
      { name: 'timestamp', label: 'Timestamp', messageId: 'timestamp' },
      { name: 'numberOfTransactions', label: 'Number of Transactions', messageId: 'number_of_transactions' },
      { name: 'transactions', label: 'Transactions', messageId: 'transactions' }
    ]

    const rows = this.filterDetailsData(responseKeys, block)
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

  renderBlockInformation (blockInfo) {
    const info = (
      <div style={{ paddingTop: 20 }}>
        <Tabs>
          <Tab label={renderFormattedMessage(messages.details)}>
            {this.renderDetails(this.props.blockInformation)}
          </Tab>
        </Tabs>
      </div>
    )
    return info
  }

  render () {
    let blockInfo
    if (this.props.blockInformation) {
      blockInfo = this.renderBlockInformation(this.props.blockInformation)
    }
    return (
      <div>
        {blockInfo}
      </div>
    )
  }
}

BlockInformation.propTypes = {
  block: PropTypes.string,
  getBlockInformation: PropTypes.func,
  blockInformation: PropTypes.object,
  asset: PropTypes.object,
  openAccountDialog: PropTypes.func,
  openBlockDialog: PropTypes.func,
  isLoading: PropTypes.bool,
  openTransactionDialog: PropTypes.func
}

export default BlockInformation
