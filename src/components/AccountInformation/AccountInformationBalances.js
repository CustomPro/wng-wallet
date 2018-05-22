import React, { PropTypes } from 'react'
import ResponsiveTable from 'components/ResponsiveTable'
import { FormattedNumber, defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import { convertQNTToQuantity } from 'redux/utils/nrs'

const messages = defineMessages({
  balances: {
    id: 'balancestable.balances',
    defaultMessage: 'Balances'
  },
  send_balance_button: {
    id: 'balancestable.send_balance_button',
    defaultMessage: 'Transfer {asset}'
  },
  deposit_balance_button: {
    id: 'balancestable.deposit_balance_button',
    defaultMessage: 'Deposit {asset}'
  },
  withdraw_balance_button: {
    id: 'balancestable.withdraw_balance_button',
    defaultMessage: 'Withdraw {asset}'
  },
  send_balance: {
    id: 'balancestable.send_balance',
    defaultMessage: 'Send balance'
  },
  deposit_balance: {
    id: 'balancestable.deposit_balance',
    defaultMessage: 'Deposit balance'
  },
  withdraw_balance: {
    id: 'balancestable.withdraw_balance',
    defaultMessage: 'Withdraw balance'
  },
  USD: {
    id: 'USD',
    defaultMessage: 'USD'
  },
  SGD: {
    id: 'SGD',
    defaultMessage: 'SGD'
  },
  CNY: {
    id: 'CNY',
    defaultMessage: 'CNY'
  },
  BTC: {
    id: 'BTC',
    defaultMessage: 'BTC'
  }
})

class AccountInformationBalances extends React.Component {

  openSendBalanceDialog = (asset) => {
    this.props.openSendBalanceDialog(asset)
  }

  openDepositBalanceDialog = (asset) => {
    this.props.openDepositBalanceDialog(asset)
  }

  openWithdrawBalanceDialog = (asset) => {
    this.props.openWithdrawBalanceDialog(asset)
  }

  combineData (selectedAssets, assetBalances = []) {
    const combinedData = selectedAssets.map((asset) => {
      let balanceQNT
      assetBalances.map((balance) => {
        if (balance.asset === asset.asset) {
          balanceQNT = balance.balanceQNT
        }
      })
      asset.balanceQNT = balanceQNT
      return asset
    })
    return combinedData
  }

  filterData (responseKeys, response) {
    if (response) {
      const rows = []
      response.map((item) => {
        let row = {}
        if (item.balanceQNT !== 0 && item.balanceQNT !== undefined) {
          responseKeys.map((key) => {
            if (item[key]) {
              switch (key) {
                case 'name':
                  row[key] = renderFormattedMessage(messages[item[key]])
                  break
                case 'balanceQNT':
                  const qt = convertQNTToQuantity(item[key], item.decimals)
                  row[key] = <FormattedNumber value={qt} />
                  break
                default:
                  row[key] = item[key]
              }
            } else { row[key] = '' }
          })
          rows.push(row)
        }
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
    const { selectedAssets, assetBalances, hasLoadedAssets,
      isMobile, isLoadingAssets } = this.props
    const combinedData = this.combineData(selectedAssets, assetBalances)
    const headers = [
      { name: 'name', 'label': 'Name', messageId: 'name' },
      { name: 'balanceQNT', 'label': 'Balance', messageId: 'balance' }
    ]
    const responseKeys = ['name', 'balanceQNT']
    const balancesData = this.processResponse(headers, responseKeys, combinedData)
    return (
      <div>
        <ResponsiveTable
          data={balancesData}
          isLoading={isLoadingAssets}
          hasLoaded={hasLoadedAssets}
          isMobile={isMobile}
        />
      </div>
    )
  }
}

AccountInformationBalances.propTypes = {
  selectedAssets: PropTypes.array,
  assetBalances: PropTypes.array,
  isMobile: PropTypes.bool,
  openSendBalanceDialog: PropTypes.func,
  openDepositBalanceDialog: PropTypes.func,
  openWithdrawBalanceDialog: PropTypes.func,
  isLoadingAssets: PropTypes.bool,
  hasLoadedAssets: PropTypes.bool,
  intl: PropTypes.object
}

export default AccountInformationBalances
