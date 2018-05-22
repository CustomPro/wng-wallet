import React, { PropTypes } from 'react'
import { Dialog } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import RedeemVoucherFormContainer from './RedeemVoucherFormContainer'

const messages = defineMessages({
  redeem_voucher: {
    id: 'redeem_voucher_dialog.redeem_voucher',
    defaultMessage: 'Redeem voucher'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  }
})

export class RedeemVoucherDialog extends React.Component {
  render () {
    const {
      show,
      isMobile
    } = this.props
    const title = (<div>{renderFormattedMessage(messages.redeem_voucher)}
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
        <RedeemVoucherFormContainer intl={this.props.intl} closeDialog={this.props.closeDialog} />
      </Dialog>
    )
  }
}

RedeemVoucherDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  closeDialog: PropTypes.func,
  asset: PropTypes.object,
  isMobile: PropTypes.bool,
  intl: PropTypes.object
}

export default RedeemVoucherDialog
