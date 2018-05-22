import React, { PropTypes} from 'react'
import ResponsiveTable from 'components/ResponsiveTable'
import { injectIntl } from 'react-intl'
import {
  FlatButton
} from 'material-ui'

class AccountRSButton extends React.Component {
  _onClick = () => {
    const { accountRS, onClick } = this.props
    onClick(accountRS)
  }

  render () {
    const { accountRS } = this.props
    return <FlatButton
      style={{ marginTop: '-10px' }}
      label={accountRS}
      onTouchTap={this._onClick} />
  }
}

AccountRSButton.propTypes = {
  accountRS: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}
export class AccountsTable extends React.Component {

  handlePrevClick = () => {
    const { accountsPageNumber } = this.props
    const prevPage = accountsPageNumber - 1
    this.props.updateAccountsPage(prevPage)
  }

  handleNextClick = () => {
    const { accountsPageNumber } = this.props
    const nextPage = accountsPageNumber + 1
    this.props.updateAccountsPage(nextPage)
  }

  filterData (responseKeys, response) {
    const { onAccountRSClick } = this.props
    if (response) {
      const rows = []
      response.map((item) => {
        let row = {}
        responseKeys.map((key) => {
          if (item[key]) {
            switch (key) {
              case 'accountRS':
                row[key] = <AccountRSButton
                  accountRS={item.accountRS}
                  onClick={onAccountRSClick} />
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
      isLoadingAccounts,
      accounts,
      isMobile,
      accountsHasNext,
      accountsHasPrev
    } = this.props

    const headers = [
      { name: 'id', 'label': 'ID', messageId: 'id' },
      { name: 'accountRS', 'label': 'Account', messageId: 'account' },
      { name: 'email', 'label': 'Email', messageId: 'email' }
    ]
    const responseKeys = ['id', 'accountRS', 'email']

    const accountsData = this.processResponse(headers, responseKeys, accounts)

    return (
      <ResponsiveTable
        data={accountsData}
        isLoading={isLoadingAccounts}
        isMobile={isMobile}
        handleNextClick={this.handleNextClick}
        handlePrevClick={this.handlePrevClick}
        hasNext={accountsHasNext}
        hasPrev={accountsHasPrev}
      />
    )
  }
}

AccountsTable.propTypes = {
  intl: PropTypes.object.isRequired,
  isLoadingAccounts: PropTypes.bool.isRequired,
  accounts: PropTypes.array,
  onAccountRSClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  accountsPageNumber: PropTypes.number,
  accountsPageSize: PropTypes.number,
  getAccounts: PropTypes.func,
  updateAccountsPage: PropTypes.func,
  accountsHasPrev: PropTypes.bool,
  accountsHasNext: PropTypes.bool
}

export default injectIntl(AccountsTable)
