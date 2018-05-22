import React, { PropTypes } from 'react'
import { Dialog } from 'material-ui'
import VoucherCreateFormContainer from './VoucherCreateFormContainer'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  create_voucher: {
    id: 'voucher_create_form.create_voucher',
    defaultMessage: 'Create new voucher'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  }
})

export class VoucherFormDialog extends React.Component {
  render () {
    const {
      show,
      isMobile
    } = this.props
    const createVoucherMessage = renderFormattedMessage(messages.create_voucher)
    const title = (<div>{createVoucherMessage}
      <div style={{
        float: 'right',
        paddingRight: '10px',
        fontWeight: 100,
        cursor: 'pointer'
      }}><a onClick={this.props.closeDialog}>x</a></div>
    </div>)
    let dialogContentStyle
    let dialogBodyStyle
    let dialogStyle

    if (isMobile) {
      dialogContentStyle = { width: '100%', transform: 'translate(0, 0)', maxWidth: 'auto' }
      dialogBodyStyle = { padding: '0px 20px' }
      dialogStyle = { paddingTop: 0, height: '100vh', overflow: 'auto' }
    }
    return (
      <Dialog
        open={show}
        title={title}
        repositionOnUpdate={false}
        autoDetectWindowHeight={false}
        modal={false}
        contentStyle={dialogContentStyle}
        bodyStyle={dialogBodyStyle}
        style={dialogStyle}
        onRequestClose={this.props.closeDialog}>
        <VoucherCreateFormContainer closeDialog={this.props.closeDialog} />
      </Dialog>
    )
  }
}

VoucherFormDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  closeDialog: PropTypes.func,
  asset: PropTypes.object,
  isMobile: PropTypes.bool
}

export default VoucherFormDialog
