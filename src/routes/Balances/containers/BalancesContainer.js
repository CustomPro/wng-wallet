import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getAssets,
  openSendBalanceDialog,
  closeSendBalanceDialog,
  openWithdrawBalanceDialog,
  closeWithdrawBalanceDialog,
  openDepositBalanceDialog,
  closeDepositBalanceDialog
} from 'redux/modules/balances'

import Balances from '../components/Balances'

const mapActionCreators = {
  getAssets,
  openSendBalanceDialog,
  closeSendBalanceDialog,
  openWithdrawBalanceDialog,
  closeWithdrawBalanceDialog,
  openDepositBalanceDialog,
  closeDepositBalanceDialog
}

const mapStateToProps = (state) => {
  const {
    selectedAssets,
    isLoadingAssets,
    hasLoadedAssets,
    sendBalanceDialogIsOpen,
    withdrawBalanceDialogIsOpen,
    depositBalanceDialogIsOpen,
    selectedBalanceAssetId,
    sendBalanceId,
    bitcoinAddress
  } = state.balances
  const { assetBalances, accountRS } = state.auth.account
  const isMobile = state.browser.lessThanOrEqual.medium
  return {
    selectedAssets,
    isLoadingAssets,
    hasLoadedAssets,
    assetBalances,
    isMobile,
    selectedBalanceAssetId,
    sendBalanceId,
    sendBalanceDialogIsOpen,
    withdrawBalanceDialogIsOpen,
    depositBalanceDialogIsOpen,
    accountRS,
    bitcoinAddress
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Balances))
