import React, { PropTypes } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages, injectIntl } from 'react-intl'
import { withdraw } from 'config.json'

const messages = defineMessages({
  send_balance: {
    id: 'withdrawbalancedialog.title',
    defaultMessage: 'Withdraw {name}'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  withdraw_balance_message: {
    id: 'withdrawbalancedialog.message',
    defaultMessage: 'To withdraw {asset} please contact our licensed agent at the following email address: {email}'
  },
  'withdraw_subject': {
    id: 'withdrawbalancedialog.withdraw_subject',
    defaultMessage: 'Withdrawal request for {asset} from {account}'
  }
})

export class WithdrawBalanceDialog extends React.Component {
  render () {
    const {
      show,
      asset,
      accountRS,
      isMobile,
      intl: { formatMessage }
    } = this.props
    const { email } = withdraw
    let name
    if (asset) {
      name = renderFormattedMessage({ id: asset.name })
    }
    const sendBalanceMessage = renderFormattedMessage(messages.send_balance, { name })
    const title = (<div>{sendBalanceMessage}
      <div style={{
        float: 'right',
        paddingRight: '10px',
        fontWeight: 100,
        cursor: 'pointer'
      }}><a onClick={this.props.closeDialog}>x</a></div>
    </div>)
    const actions = (<FlatButton onClick={this.props.closeDialog}>{renderFormattedMessage(messages.close)}</FlatButton>)
    const subject = formatMessage(messages.withdraw_subject, { asset: name, account: accountRS })
    const mailto = `mailto:${email}?subject=${subject}`
    const link = (<a href={mailto}>{email}</a>)
    const message = renderFormattedMessage({ id: 'withdrawbalancedialog.message' }, { asset: name, email: link })
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
        actions={actions}
        contentStyle={dialogContentStyle}
        bodyStyle={dialogBodyStyle}
        style={dialogStyle}
        onRequestClose={this.props.closeDialog}>
        {message}
      </Dialog>
    )
  }
}

WithdrawBalanceDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  closeDialog: PropTypes.func,
  asset: PropTypes.object,
  intl: PropTypes.object,
  accountRS: PropTypes.string,
  isMobile: PropTypes.bool
}

export default injectIntl(WithdrawBalanceDialog)
