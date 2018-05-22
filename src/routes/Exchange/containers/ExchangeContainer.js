import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  convertQNTToQuantity,
  convertDQTToDBN
} from 'redux/utils/nrs'

import {
  getAccountBalance
} from '../modules/Exchange'

import {
  getAsset
} from 'redux/modules/asset'

import {
  openAccountDialog,
  closeAccountDialog
} from 'redux/modules/accountinformation'

import {
  openTransactionDialog,
  closeTransactionDialog
} from 'redux/modules/transactioninformation'

import { getAssets } from 'redux/modules/balances'

import Exchange from '../components/Exchange'

const mapActionCreators = {
  getAsset,
  getAssets,
  getAccountBalance,
  openAccountDialog,
  closeAccountDialog,
  openTransactionDialog,
  closeTransactionDialog
}

const mapStateToProps = (state) => {
  const {
    asset,
    auth,
    orders,
    exchange,
    browser,
    accountinformation,
    transactioninformation,
    balances
  } = state
  const { selectedAsset } = asset
  const { selectedAssets, isLoadingAssets, hasLoadedAssets } = balances
  const { accountBalance } = exchange
  const isMobile = browser.lessThanOrEqual.medium
  let balance
  let assetBalance = '0'

  if (accountBalance && accountBalance.assetBalances) {
    balance = convertDQTToDBN(accountBalance.unconfirmedBalanceDQT)
    assetBalance = accountBalance.assetBalances.find((asset) => asset.asset === selectedAsset.asset)
  } else {
    balance = convertDQTToDBN(auth.account.unconfirmedBalanceDQT)
    if (auth.account && auth.account.assetBalances) {
      assetBalance = auth.account.assetBalances.find((asset) => asset.asset === selectedAsset.asset)
    }
  }

  if (assetBalance) {
    assetBalance = convertQNTToQuantity(assetBalance.balanceQNT, selectedAsset.decimals)
  }

  return {
    asset: selectedAsset,
    selectedAssets,
    isLoadingAssets,
    hasLoadedAssets,
    balance,
    assetBalance,
    isLoadingAsset: asset.isLoadingAsset,
    isCancellingOrder: orders.isCancellingOrder,
    isLoadingAccountBalance: exchange.isLoadingAccountBalance,
    account: auth.account,
    accountBalance: exchange.accountBalance,
    isMobile,
    accountDialogIsOpen: accountinformation.accountDialogIsOpen,
    accountInformationId: accountinformation.accountInformationId,
    transactionDialogIsOpen: transactioninformation.transactionDialogIsOpen,
    transactionInformationId: transactioninformation.transactionInformationId
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Exchange))
