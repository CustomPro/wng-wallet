import React, { PropTypes } from 'react'
import AccountInformationContainer from './AccountInformationContainer'
import { Dialog, FlatButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  account: {
    id: 'account',
    defaultMessage: 'Account'
  },
  info: {
    id: 'info',
    defaultMessage: 'info'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  }
})

export class AccountDialog extends React.Component {

  render () {
    const {
      show,
      asset,
      account
    } = this.props

    const accountMessage = renderFormattedMessage(messages.account)
    const infoMessage = renderFormattedMessage(messages.info)
    const title = (<div>{accountMessage} <span style={{fontWeight: 'bold'}}>{account}</span> {infoMessage}
      <div style={{
        float: 'right',
        paddingRight: '10px',
        fontWeight: 100,
        cursor: 'pointer'
      }}><a onClick={this.props.closeDialog}>x</a></div>
    </div>)
    const actions = (<FlatButton onClick={this.props.closeDialog}>{renderFormattedMessage(messages.close)}</FlatButton>)
    return (
      <Dialog
        open={show}
        title={title}
        repositionOnUpdate={false}
        autoDetectWindowHeight={false}
        modal={false}
        actions={actions}
        onRequestClose={this.props.closeDialog}
        contentStyle={{width: '100%', transform: 'translate(0, 0)', maxWidth: 'auto'}}
        bodyStyle={{padding: '0px 20px'}}
        style={{paddingTop: 0, height: '100vh', overflow: 'auto'}} >
        <AccountInformationContainer asset={asset} account={account} />
      </Dialog>
    )
  }
}

AccountDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeDialog: PropTypes.func,
  account: PropTypes.string,
  asset: PropTypes.object
}

export default AccountDialog
