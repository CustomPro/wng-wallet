import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getFormValues } from 'redux-form'
import VoucherCreateForm from './VoucherCreateForm'
import { createVoucher } from '../modules/Vouchers'

const mapActionCreators = {
  createVoucher
}

const mapStateToProps = (state) => {
  const { isAdmin } = state.auth
  const {
    hasCreatedVoucher,
    isCreatingVoucher,
    createVoucherError,
    createVoucherSuccess
  } = state.vouchers
  return {
    formValues: getFormValues('voucherCreateForm')(state),
    advancedOptionsOpen: state.site.advancedOptionsOpen,
    adminRS: state.auth.account.accountRS,
    isAdmin,
    hasCreatedVoucher,
    isCreatingVoucher,
    createVoucherError,
    createVoucherSuccess
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(VoucherCreateForm))
