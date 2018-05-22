import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Vouchers from './Vouchers'
import {
  getVouchers,
  openVoucherDialog,
  closeVoucherDialog,
  updateVouchersPage
} from '../modules/Vouchers'
const mapActionCreators = {
  getVouchers,
  openVoucherDialog,
  closeVoucherDialog,
  updateVouchersPage
}

const mapStateToProps = (state) => {
  const {
    vouchers,
    vouchersHasNext,
    vouchersHasPrev,
    voucherDialogIsOpen,
    vouchersPageSize,
    vouchersPageNumber
  } = state.vouchers
  return {
    vouchers,
    vouchersHasNext,
    vouchersHasPrev,
    voucherDialogIsOpen,
    vouchersPageSize,
    vouchersPageNumber
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Vouchers))
