import React, { PropTypes } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages, injectIntl } from 'react-intl'
import { deposit } from 'config.json'

const messages = defineMessages({
  send_balance: {
    id: 'depositbalancedialog.title',
    defaultMessage: 'Deposit {name}'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  deposit_balance_message: {
    id: 'depositbalancedialog.message',
    defaultMessage: 'To deposit {asset} please contact our licensed agent at the following email address: {email}'
  },
  stay_tuned: {
    id: 'stay_tuned',
    defaultMessage: 'Stay tuned for more updates.'
  },
  'deposit_subject': {
    id: 'depositbalancedialog.deposit_subject',
    defaultMessage: 'Deposit request for {asset} from {account}'
  },
  'bitcoin_deposit_message': {
    id: 'depositbalancedialog.bitcoin_deposit_message',
    defaultMessage: 'Your bitcoin deposit address is {address}.'
  },
  'bitcoin_deposit_confirmation_message': {
    id: 'depositbalancedialog.bitcoin_deposit_confirmation_message',
    defaultMessage: 'Deposits will be credited after one confirmation. If you didn\'t get your deposit credited please contact {email}.'
  }
})

export class DepositBalanceDialog extends React.Component {
  componentWillReceiveProps = (nextProps) => {
    const { asset, getBitcoinAddress } = nextProps

    if (asset === this.props.asset) {
      return
    }

    if (asset && asset.name === 'BTC') {
      getBitcoinAddress()
    }
  }

  render () {
    const {
      show,
      asset,
      isMobile,
      bitcoinAddress
    } = this.props
    console.log(this.props)
    const { email } = deposit
    let name
    let dialogContentStyle
    let dialogBodyStyle
    let dialogStyle
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
    const mailto = `mailto:${email}`
    const link = (<a href={mailto}>{email}</a>)
    let message = renderFormattedMessage(messages.stay_tuned, { asset: name, email: link })

    if (asset && asset.name === 'BTC') {
      message = <span>
        {renderFormattedMessage(messages.bitcoin_deposit_message, { address: bitcoinAddress })}
        <br />
        <br />
        {renderFormattedMessage(messages.bitcoin_deposit_confirmation_message, { email: link })}
      </span>
    }

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

DepositBalanceDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  closeDialog: PropTypes.func,
  asset: PropTypes.object,
  intl: PropTypes.object,
  isMobile: PropTypes.bool,
  accountRS: PropTypes.string,
  getBitcoinAddress: PropTypes.func,
  bitcoinAddress: PropTypes.string
}

export default injectIntl(DepositBalanceDialog)
