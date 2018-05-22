import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getFormValues } from 'redux-form'
import RedeemVoucherForm from './RedeemVoucherForm'
import {
  getVoucherByCode,
  closeRedeemVoucherDialog,
  openRedeemVoucherDialog,
  redeemVoucher,
  clearVoucherByCode
} from '../modules/Vouchers'

const mapActionCreators = {
  getVoucherByCode,
  closeRedeemVoucherDialog,
  openRedeemVoucherDialog,
  redeemVoucher,
  clearVoucherByCode
}

const mapStateToProps = (state) => {
  const {
    isLoadingRedemptionVoucher,
    hasLoadedRedemptionVoucher,
    voucherToRedeem,
    redeemVoucherError,
    redeemVoucherSuccess,
    voucherHasBeenRedeemed,
    voucherToRedeemError
  } = state.vouchers
  return {
    formValues: getFormValues('redeemVoucherForm')(state),
    advancedOptionsOpen: state.site.advancedOptionsOpen,
    accountRS: state.auth.account.accountRS,
    isLoadingRedemptionVoucher,
    hasLoadedRedemptionVoucher,
    voucherToRedeem,
    redeemVoucherError,
    redeemVoucherSuccess,
    voucherHasBeenRedeemed,
    voucherToRedeemError
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(RedeemVoucherForm))
