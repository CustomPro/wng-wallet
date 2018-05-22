import React, { PropTypes} from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import {
  CircularProgress,
  List,
  ListItem
} from 'material-ui'

import {
  formatTimestamp,
  convertDQTToDBN
} from 'redux/utils/nrs'

import style from './TransactionsList.scss'

// I don't think we are using this anymore TODO: remove?

export class TransactionsList extends React.Component {
  render () {
    const {
      intl: { formatNumber },
      accountRS,
      loading,
      transactions
    } = this.props

    if (loading) {
      return <CircularProgress />
    }

    if (!transactions || !transactions.length) {
      return <div>
        <em><FormattedMessage id='no_transactions' /></em>
      </div>
    }

    const item = (type, fromTo, account, amount) => {
      return <div className={style.item}>
        <span className={type === 'received' ? style.received : style.sent}>
          <FormattedMessage id={type} />
        </span>
        <span className='hidden-xs'>
          <FormattedMessage id={fromTo} />
        </span>
        <span className='hidden-xs'>{account}</span>
        <span style={{ float: 'right' }}>{formatNumber(amount)} <FormattedMessage id='currency_name' /></span>
      </div>
    }

    return (
      <List>
        {transactions.map((transaction) => {
          const amount = convertDQTToDBN(transaction.amountDQT)
          let type = 'received'
          let fromTo = 'from'
          let account = transaction.senderRS
          if (account === accountRS) {
            type = 'sent'
            fromTo = 'to'
            account = transaction.recipientRS
          }

          const style = {}
          if (!transaction.confirmations) {
            style.fontStyle = 'italic'
          }

          return <ListItem
            key={transaction.transaction}
            primaryText={item(type, fromTo, account, amount)}
            secondaryText={<div>
              {formatTimestamp(transaction.timestamp).toLocaleString()}
            </div>}
            secondaryTextLines={2}
            style={style} />
        })}
      </List>
    )
  }
}

TransactionsList.propTypes = {
  intl: PropTypes.object.isRequired,
  accountRS: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  transactions: PropTypes.array.isRequired
}

export default injectIntl(TransactionsList)
