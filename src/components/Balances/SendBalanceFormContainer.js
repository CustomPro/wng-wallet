import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import SendBalanceForm from './SendBalanceForm'

import {
  postSendBalance,
  sendBalanceSetPage
} from 'redux/modules/balances'
import { getAsset, getAssetClear } from 'redux/modules/asset'
import { formValueSelector } from 'redux-form'
import { minimumFee } from 'config.json'
import { convertDQTToDBN } from 'redux/utils/nrs'
import {
  openAdvancedOptions,
  closeAdvancedOptions
} from 'redux/modules/site'

import { clearQRCode } from 'redux/modules/qrscanner'

const selector = formValueSelector('sendBalanceForm')

const mapActionCreators = {
  postSendBalance,
  getAsset,
  getAssetClear,
  openAdvancedOptions,
  closeAdvancedOptions,
  sendBalanceSetPage,
  clearQRCode
}
const mapStateToProps = (state) => {
  const { balances, auth, asset } = state
  const { qrCode } = state.qrscanner
  const {
    quantity,
    recipient,
    fee
  } = selector(state, 'quantity', 'recipient', 'fee')
  const minFee = convertDQTToDBN(minimumFee)
  return {
    initialValues: {
      fee: minFee
    },
    account: auth.account,
    asset: asset.selectedAsset,
    isPostingSendBalance: balances.isPostingSendBalance,
    hasPostedSendBalance: balances.hasPostedSendBalance,
    postSendBalanceError: balances.postSendBalanceError,
    postSendBalanceSuccess: balances.postSendBalanceSuccess,
    sendBalanceStep: balances.sendBalanceStep,
    advancedOptionsOpen: state.site.advancedOptionsOpen,
    quantity,
    recipient,
    fee,
    qrCode
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(SendBalanceForm))
