import React, { PropTypes } from 'react'
import {
  Card,
  CardTitle,
  CardText,
  RaisedButton
} from 'material-ui'
import PageTitle from 'components/PageTitle'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import VouchersTable from './VouchersTable'
import VoucherFormDialog from './VoucherFormDialog'

const messages = defineMessages({
  title: {
    id: 'vouchers.title',
    defaultMessage: 'Vouchers'
  },
  subtitle: {
    id: 'vouchers.subtitle',
    defaultMessage: 'List of current vouchers'
  },
  account: {
    id: 'vouchers.account',
    defaultMessage: 'Account'
  },
  create_new_voucher: {
    id: 'vouchers.create_new_voucher',
    defaultMessage: 'Create new voucher'
  }
})

export class Vouchers extends React.Component {

  handleCreateVoucher = (e) => {
    this.props.openVoucherDialog()
  }

  handleCloseVoucherDialog = () => {
    const { closeVoucherDialog,
      getVouchers, vouchersPageSize,
      vouchersPageNumber } = this.props
    closeVoucherDialog()
    getVouchers(vouchersPageNumber, vouchersPageSize)
  }

  render () {
    const {
      getVouchers,
      vouchers,
      intl,
      hasLoadedVouchers,
      isLoadingVouchers,
      vouchersHasPrev,
      vouchersHasNext,
      voucherDialogIsOpen,
      vouchersPageSize,
      vouchersPageNumber,
      updateVouchersPage
    } = this.props
    return (
      <PageTitle pageName='vouchers'>
        <Card>
          <CardTitle
            title={renderFormattedMessage(messages.title)} />
          <CardText>
            <RaisedButton
              primary
              onClick={this.handleCreateVoucher}
              label={renderFormattedMessage(messages.create_new_voucher)}
            />
          </CardText>
        </Card>
        <div style={{
          marginTop: 30
        }}>
          <Card>
            <VouchersTable
              getVouchers={getVouchers}
              vouchers={vouchers}
              intl={intl}
              hasLoadedVouchers={hasLoadedVouchers}
              isLoadingVouchers={isLoadingVouchers}
              UI={'vouchersTable'}
              vouchersHasNext={vouchersHasNext}
              vouchersHasPrev={vouchersHasPrev}
              vouchersPageSize={vouchersPageSize}
              vouchersPageNumber={vouchersPageNumber}
              updateVouchersPage={updateVouchersPage}
            />
          </Card>
        </div>
        <VoucherFormDialog
          show={voucherDialogIsOpen}
          closeDialog={this.handleCloseVoucherDialog}
        />
      </PageTitle>
    )
  }
}

Vouchers.propTypes = {
  intl: PropTypes.object,
  getVouchers: PropTypes.func,
  vouchersHasNext: PropTypes.bool,
  vouchersHasPrev: PropTypes.bool,
  accountInformationId: PropTypes.string,
  accountDialogIsOpen: PropTypes.bool,
  closeAccountDialog: PropTypes.func,
  asset: PropTypes.object,
  vouchers: PropTypes.array,
  voucherDialogIsOpen: PropTypes.bool,
  openVoucherDialog: PropTypes.func,
  closeVoucherDialog: PropTypes.func,
  isLoadingVouchers: PropTypes.bool,
  hasLoadedVouchers: PropTypes.bool,
  vouchersPageSize: PropTypes.number,
  vouchersPageNumber: PropTypes.number,
  updateVouchersPage: PropTypes.func
}

export default Vouchers
