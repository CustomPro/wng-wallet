import React, { PropTypes } from 'react'
import { Dialog } from 'material-ui'
import SendBalanceFormContainer from './SendBalanceFormContainer'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  send_balance: {
    id: 'sendbalancedialog.title',
    defaultMessage: 'Send {name}'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  }
})

export class SendBalanceDialog extends React.Component {
  render () {
    const {
      show,
      asset,
      isMobile
    } = this.props
    let assetId
    let name
    if (asset) {
      assetId = asset.assetId
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
        <SendBalanceFormContainer
          openSendBalanceDialog={this.props.openSendBalanceDialog}
          closeSendBalanceDialog={this.props.closeSendBalanceDialog}
          assetId={assetId}
          closeDialog={this.props.closeDialog} />
      </Dialog>
    )
  }
}

SendBalanceDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  closeDialog: PropTypes.func,
  asset: PropTypes.object,
  isMobile: PropTypes.bool,
  openSendBalanceDialog: PropTypes.func,
  closeSendBalanceDialog: PropTypes.func
}

export default SendBalanceDialog
