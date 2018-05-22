import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import {
  Card,
  CardTitle,
  CardText,
  FlatButton
} from 'material-ui'

import {
  getTransactions,
  nextPage,
  previousPage,
  resetPagination
} from 'redux/modules/transaction'

import TransactionsTable from 'components/Transaction/TransactionsTable'

export class TransactionsListContainer extends React.Component {
  componentWillUnmount = () => {
    const { resetPagination } = this.props
    resetPagination()
  }

  _onNextClick = () => {
    const { onNextClick } = this.props
    onNextClick()
  }

  _onPreviousClick = () => {
    const { onPreviousClick } = this.props
    onPreviousClick()
  }

  render () {
    const {
      intl: { formatMessage },
      accountRS,
      isRetrievingTransactions,
      transactions,
      disableNextButton,
      disablePreviousButton
    } = this.props

    return (
      <Card>
        <CardTitle
          title={formatMessage({ id: 'transactions' })}
          subtitle={formatMessage({ id: 'latest_transactions' })} />
        <CardText>
          <TransactionsTable
            loading={isRetrievingTransactions}
            accountRS={accountRS}
            transactions={transactions} />
          <FlatButton
            onTouchTap={this._onPreviousClick}
            label={formatMessage({ id: 'previous' })}
            disabled={disablePreviousButton} />
          <FlatButton
            onTouchTap={this._onNextClick}
            label={formatMessage({ id: 'next' })}
            disabled={disableNextButton} />
        </CardText>
      </Card>
    )
  }
}

TransactionsListContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  accountRS: PropTypes.string.isRequired,
  transactions: PropTypes.array.isRequired,
  isRetrievingTransactions: PropTypes.bool.isRequired,
  disableNextButton: PropTypes.bool.isRequired,
  disablePreviousButton: PropTypes.bool.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired
}

export default injectIntl(connect((state) => {
  const { accountRS } = state.auth.account
  const {
    transactions,
    isRetrievingTransactions,
    limit,
    offset
  } = state.transaction

  const disableNextButton = transactions.length < limit
  const disablePreviousButton = offset <= 0

  return {
    accountRS,
    transactions,
    isRetrievingTransactions,
    disableNextButton,
    disablePreviousButton
  }
}, (dispatch) => {
  return {
    onNextClick: () => {
      dispatch(nextPage())
      dispatch(getTransactions())
    },
    onPreviousClick: () => {
      dispatch(previousPage())
      dispatch(getTransactions())
    },
    resetPagination: () => {
      dispatch(resetPagination())
    }
  }
})(TransactionsListContainer))
