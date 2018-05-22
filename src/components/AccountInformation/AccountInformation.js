import React, { PropTypes } from 'react'
import { convertDQTToDBN } from 'redux/utils/nrs'
import TransactionsContainer from 'components/Transactions/TransactionsContainer'
import { Tabs, Tab } from 'material-ui'
import { tokenName } from 'config.json'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages, FormattedNumber } from 'react-intl'
import AccountInformationBalances from './AccountInformationBalances'
import style from './AccountInformation.css'

const messages = defineMessages({
  account_has_balance: {
    id: 'account_information.account_has_balance',
    defaultMessage: 'Account has a balance of'
  },
  transactions: {
    id: 'account_information.transactions',
    defaultMessage: 'Transactions'
  },
  balances: {
    id: 'account_information.balances',
    defaultMessage: 'Balances'
  },
  authorized_user: {
    id: 'account_information.authorized_user',
    defaultMessage: 'Authorized User'
  },
  unauthorized_user: {
    id: 'account_information.unauthorized_user',
    defaultMessage: 'Unauthorized User'
  }
})

export class AccountInformation extends React.Component {
  openAccountDialog = (account) => {
    const { getAccountInformation, openAccountDialog, getAccountInformationProperties } = this.props
    this.props.closeTransactionDialog()
    openAccountDialog(account)
    getAccountInformation(account)
    getAccountInformationProperties(account)
  }

  openTransactionDialog = (transaction) => {
    this.props.closeAccountDialog()
    this.props.openTransactionDialog(transaction)
  }

  componentDidMount () {
    const { getAccountInformation, account, getAccountInformationProperties } = this.props
    getAccountInformation(account)
    getAccountInformationProperties(account)
  }

  renderAuthorizedFlag () {
    let authorizedFlag
    const { accountInformationProperties, isAdmin } = this.props
    if (isAdmin) {
      if (accountInformationProperties) {
        authorizedFlag = (
          <div className={style.AccountInformation_AuthorizedUserDiv}>
            <span className={accountInformationProperties.authorized
              ? style.AccountInformation_AuthorizedUser : style.AccountInformation_UnauthorizedUser}>
              {accountInformationProperties.authorized
                ? <span>{renderFormattedMessage(messages.authorized_user)}</span>
                : <span>{renderFormattedMessage(messages.unauthorized_user)}</span>
              }
            </span>
          </div>
        )
      }
    }

    return authorizedFlag
  }

  renderAccountInformation (accountInfo) {
    if (accountInfo) {
      const balance = convertDQTToDBN(accountInfo.unconfirmedBalanceDQT)

      const {
        asset,
        account,
        intl,
        selectedAssets,
        accountInformation
      } = this.props
      const isMobile = true
      const authorizedFlag = this.renderAuthorizedFlag()

      const info = (
        <div style={{ paddingTop: 20 }}>
          <div style={{ paddingBottom: 20 }}>
            <span>{renderFormattedMessage(messages.account_has_balance)}</span>&nbsp;
            <strong><FormattedNumber value={balance} /> {tokenName}</strong>
            {authorizedFlag}
          </div>
          <Tabs>
            <Tab label={renderFormattedMessage(messages.transactions)} style={{ cursor: 'default' }}>
              <TransactionsContainer
                asset={asset}
                selectedAccount={account}
                UI={'transactions'}
                openAccountDialog={this.openAccountDialog}
                openTransactionDialog={this.openTransactionDialog}
                tokenName={tokenName}
                titleColor='#c37a00'
                isMobile={isMobile}
              />
            </Tab>
            <Tab label={renderFormattedMessage(messages.balances)} style={{ cursor: 'default' }}>
              <AccountInformationBalances
                intl={intl}
                selectedAssets={selectedAssets}
                assetBalances={accountInformation.assetBalances}
                isMobile={isMobile} />
            </Tab>
          </Tabs>
        </div>
      )
      return info
    }
    return null
  }

  render () {
    let accountInfo
    if (this.props.accountInformation) {
      accountInfo = this.renderAccountInformation(this.props.accountInformation)
    }
    return (
      <div>
        {accountInfo}
      </div>
    )
  }
}

AccountInformation.propTypes = {
  account: PropTypes.string,
  getAccountInformation: PropTypes.func,
  getAccountInformationProperties: PropTypes.func,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  accountInformation: PropTypes.object,
  accountInformationProperties: PropTypes.object,
  accountTradeHistory: PropTypes.object,
  asset: PropTypes.object,
  getAccountHistory: PropTypes.func,
  isLoadingAccountHistory: PropTypes.bool,
  accountHistoryPageNumber: PropTypes.number,
  accountHistoryPageSize: PropTypes.number,
  intl: PropTypes.object,
  selectedAssets: PropTypes.array,
  isAdmin: PropTypes.bool
}

export default AccountInformation
