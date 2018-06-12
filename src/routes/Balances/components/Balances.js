import React, { PropTypes } from 'react'
import {
  Card
} from 'material-ui'
import PageTitle from 'components/PageTitle'
import BalancesTable from 'components/Balances/BalancesTable'
import SendBalanceDialog from 'components/Balances/SendBalanceDialog'
import DepositBalanceDialogContainer from 'components/Balances/DepositBalanceDialogContainer'
import WithdrawBalanceDialog from 'components/Balances/WithdrawBalanceDialog'
import style from './Balances.css'

export class Balances extends React.Component {
  componentDidMount = () => {
    const { getAssets } = this.props
    getAssets()
  }

  handleCloseBalanceDialog = () => {
    this.props.closeSendBalanceDialog()
    this.props.getAssets()
  }

  render () {
    const {
      selectedAssets,
      assetBalances,
      isMobile,
      isLoadingAssets,
      hasLoadedAssets,
      bitcoinAddress,
      intl
    } = this.props

    return (
      <PageTitle pageName='balances'>
        <div className={style.Balances_Widget}>
          <Card>
            <BalancesTable
              intl={intl}
              selectedAssets={selectedAssets}
              assetBalances={assetBalances}
              openSendBalanceDialog={this.props.openSendBalanceDialog}
              closeSendBalanceDialog={this.props.closeSendBalanceDialog}
              openDepositBalanceDialog={this.props.openDepositBalanceDialog}
              openWithdrawBalanceDialog={this.props.openWithdrawBalanceDialog}
              isLoadingAssets={isLoadingAssets}
              hasLoadedAssets={hasLoadedAssets}
              isMobile={isMobile} />
          </Card>
        </div>
        <SendBalanceDialog
          asset={this.props.selectedBalanceAssetId}
          show={this.props.sendBalanceDialogIsOpen}
          openSendBalanceDialog={this.props.openSendBalanceDialog}
          closeSendBalanceDialog={this.props.closeSendBalanceDialog}
          closeDialog={this.handleCloseBalanceDialog}
          isMobile={isMobile}
        />
        <DepositBalanceDialogContainer
          asset={this.props.selectedBalanceAssetId}
          show={this.props.depositBalanceDialogIsOpen}
          closeDialog={this.props.closeDepositBalanceDialog}
          accountRS={this.props.accountRS}
          isMobile={isMobile}
          bitcoinAddress={bitcoinAddress}
        />
        <WithdrawBalanceDialog
          asset={this.props.selectedBalanceAssetId}
          show={this.props.withdrawBalanceDialogIsOpen}
          closeDialog={this.props.closeWithdrawBalanceDialog}
          accountRS={this.props.accountRS}
          isMobile={isMobile}
        />
      </PageTitle>
    )
  }
}

Balances.propTypes = {
  intl: PropTypes.object.isRequired,
  getAssets: PropTypes.func,
  selectedAssets: PropTypes.array,
  assetBalances: PropTypes.array,
  isMobile: PropTypes.bool,
  openSendBalanceDialog: PropTypes.func,
  closeSendBalanceDialog: PropTypes.func,
  sendBalanceDialogIsOpen: PropTypes.bool,
  openWithdrawBalanceDialog: PropTypes.func,
  closeWithdrawBalanceDialog: PropTypes.func,
  withdrawBalanceDialogIsOpen: PropTypes.bool,
  openDepositBalanceDialog: PropTypes.func,
  closeDepositBalanceDialog: PropTypes.func,
  depositBalanceDialogIsOpen: PropTypes.bool,
  selectedBalanceAssetId: PropTypes.object,
  sendBalanceId: PropTypes.object,
  isLoadingAssets: PropTypes.bool,
  accountRS: PropTypes.string,
  hasLoadedAssets: PropTypes.bool,
  bitcoinAddress: PropTypes.string
}

export default Balances
