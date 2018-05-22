import React, { PropTypes } from 'react'
import ResponsiveTable from 'components/ResponsiveTable'
import { RaisedButton } from 'material-ui'
import OnClick from 'components/OnClick'
import { FormattedNumber, defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import { convertQNTToQuantity } from 'redux/utils/nrs'
import { deposit, withdraw } from 'config.json'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'

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

class BalancesTable extends React.Component {

  openSendBalanceDialog = (asset) => {
    this.props.openSendBalanceDialog(asset)
  }

  openDepositBalanceDialog = (asset) => {
    const { openDepositBalanceDialog } = this.props
    openDepositBalanceDialog(asset)
  }

  openWithdrawBalanceDialog = (asset) => {
    this.props.openWithdrawBalanceDialog(asset)
  }

  combineData (selectedAssets, assetBalances = []) {
    const combinedData = selectedAssets.map((asset) => {
      let balanceQNT = '0'
      const assetName = renderFormattedMessage({ id: asset.name })
      const sendLabel = renderFormattedMessage(messages.send_balance_button, { asset: assetName })
      const depositLabel = renderFormattedMessage(messages.deposit_balance_button, { asset: assetName })
      const withdrawLabel = renderFormattedMessage(messages.withdraw_balance_button, { asset: assetName })
      asset.sendBalance = this.renderButton(false, sendLabel)
      if (deposit && deposit.enabled) {
        asset.depositBalance = this.renderButton(true, depositLabel, asset, asset, this.openDepositBalanceDialog)
      }
      if (withdraw && withdraw.enabled) { asset.withdrawBalance = this.renderButton(false, withdrawLabel) }
      assetBalances.map((balance) => {
        if (balance.asset === asset.asset) {
          balanceQNT = balance.balanceQNT
          asset.sendBalance = this.renderButton(true, sendLabel, balance, asset, this.openSendBalanceDialog)
          if (withdraw && withdraw.enabled) {
            asset.withdrawBalance =
            this.renderButton(true, withdrawLabel, balance, asset, this.openWithdrawBalanceDialog)
          }
        }
      })
      asset.balanceQNT = balanceQNT
      return asset
    })
    return combinedData
  }

  renderButton (enabled, label, balance, asset, callback) {
    if (enabled) {
      return (
        <OnClick callback={callback} value={{ assetId: balance.asset, name: asset.name }}>
          <RaisedButton
            ref={balance.asset}
            label={label}
            primary />
        </OnClick>)
    } else {
      return (
        <RaisedButton
          label={label}
          disabled />
      )
    }
  }

  filterData (responseKeys, response) {
    if (response) {
      const rows = []
      response.map((item) => {
        let row = {}
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
      isMobile, isLoadingAssets, intl: { formatMessage } } = this.props
    const combinedData = this.combineData(selectedAssets, assetBalances)
    const headers = [
      { name: 'name', 'label': 'Name', messageId: 'name' },
      { name: 'balanceQNT', 'label': 'Balance', messageId: 'balance' },
      { name: 'sendBalance', 'label': 'Send Balance', messageId: 'balancestable.send_balance' }
    ]
    const responseKeys = ['name', 'balanceQNT', 'sendBalance']
    if (deposit && deposit.enabled) {
      headers.push({ name: 'depositBalance', 'label': 'Deposit Balance', messageId: 'balancestable.deposit_balance' })
      responseKeys.push('depositBalance')
    }
    if (withdraw && withdraw.enabled) {
      headers.push({
        name: 'withdrawBalance', 'label': 'Withdraw Balance',
        messageId: 'balancestable.withdraw_balance' })
      responseKeys.push('withdrawBalance')
    }
    const balancesData = this.processResponse(headers, responseKeys, combinedData)
    let titleColor
    let textColor
    if (CustomTheme.responsive_tables && CustomTheme.responsive_tables.balances_table) {
      if (CustomTheme.responsive_tables.balances_table.color) {
        titleColor = CustomTheme.responsive_tables.balances_table.color
      }
      if (CustomTheme.responsive_tables.balances_table.textColor) {
        textColor = CustomTheme.responsive_tables.balances_table.textColor
      }
    }

    return (
      <div>
        <ResponsiveTable
          data={balancesData}
          isLoading={isLoadingAssets}
          hasLoaded={hasLoadedAssets}
          isMobile={isMobile}
          titleColor={titleColor}
          textColor={textColor}
          title={formatMessage(messages.balances)}
        />
      </div>
    )
  }
}

BalancesTable.propTypes = {
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

export default BalancesTable
