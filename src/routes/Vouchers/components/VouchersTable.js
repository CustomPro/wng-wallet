import React, { PropTypes } from 'react'
import ResponsiveTable from 'components/ResponsiveTable'
import { RaisedButton } from 'material-ui'
import OnClick from 'components/OnClick'
import { FormattedNumber, defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import { convertDQTToDBN } from 'redux/utils/nrs'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'
import { tokenName } from 'config.json'

const messages = defineMessages({
  vouchers: {
    id: 'voucherstable.vouchers',
    defaultMessage: 'Vouchers'
  },
  send_voucher_button: {
    id: 'voucherstable.send_voucher_button',
    defaultMessage: 'Transfer {asset}'
  },
  deposit_voucher_button: {
    id: 'voucherstable.deposit_voucher_button',
    defaultMessage: 'Deposit {asset}'
  },
  withdraw_voucher_button: {
    id: 'voucherstable.withdraw_voucher_button',
    defaultMessage: 'Withdraw {asset}'
  },
  send_voucher: {
    id: 'voucherstable.send_voucher',
    defaultMessage: 'Send voucher'
  },
  deposit_voucher: {
    id: 'voucherstable.deposit_voucher',
    defaultMessage: 'Deposit voucher'
  },
  withdraw_voucher: {
    id: 'voucherstable.withdraw_voucher',
    defaultMessage: 'Withdraw voucher'
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
  },
  redemption_status_account_text: {
    id: 'voucherstable.redemption_status_account_text',
    defaultMessage: 'Redeemed by {account}'
  },
  redemption_status_timestamp_text: {
    id: 'voucherstable.redemption_status_timestamp_text',
    defaultMessage: 'on {date}'
  }
})

class VouchersTable extends React.Component {

  componentDidMount () {
    const { getVouchers, vouchersPageNumber, vouchersPageSize } = this.props
    getVouchers(vouchersPageNumber, vouchersPageSize)
  }

  handlePrevClick = () => {
    const { vouchersPageNumber } = this.props
    const prevPage = vouchersPageNumber - 1
    this.props.updateVouchersPage(prevPage)
  }

  handleNextClick = () => {
    const { vouchersPageNumber } = this.props
    const nextPage = vouchersPageNumber + 1
    this.props.updateVouchersPage(nextPage)
  }

  renderButton (enabled, label, voucher, asset, callback) {
    if (enabled) {
      return (
        <OnClick callback={callback} value={{ assetId: voucher.asset, name: asset.name }}>
          <RaisedButton
            ref={voucher.asset}
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
              case 'value':
                row[key] = (<span><FormattedNumber value={convertDQTToDBN(item[key])} /> {tokenName}</span>)
                break
              case 'redeemed':
                if (item[key] === true) {
                  row[key] = (
                    <div>
                      {renderFormattedMessage(messages.redemption_status_account_text, { account: item.redeemedBy })}
                      <br />
                      {renderFormattedMessage(messages.redemption_status_timestamp_text, { date: item.updatedAt })}
                    </div>)
                }
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
    const { vouchers,
      hasLoadedVouchers,
      vouchersHasNext, vouchersHasPrev,
      isMobile, isLoadingVouchers,
      intl: { formatMessage } } = this.props
    const headers = [
      { name: 'code', label: 'Code', messageId: 'code' },
      { name: 'value', label: 'Value', messageId: 'value' },
      { name: 'recipient', label: 'Recipient', messageId: 'recipient' },
      { name: 'expiration', label: 'Expiration Date', messageId: 'expiration_date' },
      { name: 'redeemed', label: 'Redemption Status', messageId: 'redemption_status' }
    ]
    const responseKeys = ['code', 'value', 'recipient', 'expiration', 'redeemed']
    const vouchersData = this.processResponse(headers, responseKeys, vouchers)
    let titleColor
    let textColor
    if (CustomTheme.responsive_tables && CustomTheme.responsive_tables.vouchers_table) {
      if (CustomTheme.responsive_tables.vouchers_table.color) {
        titleColor = CustomTheme.responsive_tables.vouchers_table.color
      }
      if (CustomTheme.responsive_tables.vouchers_table.textColor) {
        textColor = CustomTheme.responsive_tables.vouchers_table.textColor
      }
    }

    return (
      <div>
        <ResponsiveTable
          data={vouchersData}
          isLoading={isLoadingVouchers}
          hasLoaded={hasLoadedVouchers}
          isMobile={isMobile}
          titleColor={titleColor}
          textColor={textColor}
          hasNext={vouchersHasNext}
          hasPrev={vouchersHasPrev}
          handleNextClick={this.handleNextClick}
          handlePrevClick={this.handlePrevClick}
          title={formatMessage(messages.vouchers)}
        />
      </div>
    )
  }
}

VouchersTable.propTypes = {
  selectedAssets: PropTypes.array,
  vouchers: PropTypes.array,
  isMobile: PropTypes.bool,
  openSendVoucherDialog: PropTypes.func,
  openDepositVoucherDialog: PropTypes.func,
  openWithdrawVoucherDialog: PropTypes.func,
  isLoadingVouchers: PropTypes.bool,
  hasLoadedVouchers: PropTypes.bool,
  intl: PropTypes.object,
  vouchersPageSize: PropTypes.number,
  vouchersPageNumber: PropTypes.number,
  getVouchers: PropTypes.func,
  vouchersHasPrev: PropTypes.bool,
  vouchersHasNext: PropTypes.bool,
  updateVouchersPage: PropTypes.func
}

export default VouchersTable
