import React, { PropTypes } from 'react'
import { Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText,
  TextField
} from 'material-ui'

import PageTitle from 'components/PageTitle'
import AccountsTable from './AccountsTable'
import TransactionModal from 'components/TransactionModal'
import SendFormContainer from 'components/SendForm/SendFormContainer'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import { tokenName } from 'config.json'

const messages = defineMessages({
  accounts: {
    id: 'accounts',
    defaultMessage: 'Accounts'
  },
  accounts_subtitle: {
    id: 'accounts_subtitle',
    defaultMessage: 'List of registered accounts'
  },
  search_help: {
    id: 'search_help',
    defaultMessage: 'Search for username, email or account number'
  },
  search: {
    id: 'search',
    defaultMessage: 'Search'
  },
  send_currency: {
    id: 'send_currency',
    defaultMessage: 'Send {currency}'
  }
})

export class Accounts extends React.Component {
  constructor () {
    super()
    this.searching
  }

  componentDidMount () {
    const { getAccounts, accountsPageNumber, accountsPageSize } = this.props
    getAccounts(accountsPageNumber, accountsPageSize)
  }

  componentWillUnmount = () => {
    const { resetPagination } = this.props
    resetPagination()
  }

  _onSearch = (e) => {
    const { getAccounts, setSearch, accountsPageNumber, accountsPageSize } = this.props
    const { value } = e.target
    clearTimeout(this.searching)
    this.searching = setTimeout(() => {
      setSearch(value)
      getAccounts(accountsPageNumber, accountsPageSize)
    }, 500)
  }

  render () {
    const {
      showTransactionModal,
      search,
      intl: { formatMessage },
      accounts,
      isLoadingAccounts,
      isMobile,
      accountsHasNext,
      accountsHasPrev,
      getAccounts,
      updateAccountsPage,
      accountsPageSize,
      accountsPageNumber,
      onAccountRSClick
    } = this.props

    return (
      <PageTitle pageName='accounts'>
        <Card>
          <CardTitle
            title={renderFormattedMessage(messages.accounts)}
            subtitle={renderFormattedMessage(messages.accounts_subtitle)} />
          <CardText>
            <Col xs={12} md={6}>
              <TextField
                defaultValue={search}
                fullWidth
                onChange={this._onSearch}
                hintText={renderFormattedMessage(messages.search_help)}
                floatingLabelText={renderFormattedMessage(messages.search)} />
            </Col>
            <AccountsTable
              getAccounts={getAccounts}
              accounts={accounts}
              isLoadingAccounts={isLoadingAccounts}
              isMobile={isMobile}
              accountsHasNext={accountsHasNext}
              accountsHasPrev={accountsHasPrev}
              updateAccountsPage={updateAccountsPage}
              accountsPageSize={accountsPageSize}
              accountsPageNumber={accountsPageNumber}
              onAccountRSClick={onAccountRSClick}
            />
          </CardText>
        </Card>
        <TransactionModal
          onSendClose={this.props.onSendClose}
          show={showTransactionModal}
          title={formatMessage(messages.send_currency, {currency: tokenName})}
          form={<SendFormContainer />} />
      </PageTitle>
    )
  }
}

Accounts.propTypes = {
  getAccounts: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  resetPagination: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  isLoadingAccounts: PropTypes.bool.isRequired,
  accountsHasNext: PropTypes.bool,
  accountsHasPrev: PropTypes.bool,
  showTransactionModal: PropTypes.bool.isRequired,
  transactionModalTitle: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  onSendClose: PropTypes.func,
  isMobile: PropTypes.bool,
  updateAccountsPage: PropTypes.func,
  accountsPageSize: PropTypes.number,
  accountsPageNumber: PropTypes.number,
  onAccountRSClick: PropTypes.func
}

export default Accounts
