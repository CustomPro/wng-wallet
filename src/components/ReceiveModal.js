import React, { PropTypes } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { Dialog, FlatButton } from 'material-ui'
import { Row, Col } from 'react-flexbox-grid'
import CopyToClipboard from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import { renderFormattedMessage } from 'redux/utils/intl'
import { tokenName } from 'config.json'

const messages = defineMessages({
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  receive_currency: {
    id: 'receive_currency',
    defaultMessage: 'Receive {currency}'
  },
  account_number: {
    id: 'account_number',
    defaultMessage: 'Account Number'
  },
  your_account_number_is: {
    id: 'your_account_number_is',
    defaultMessage: 'Your account number is:'
  },
  click_to_copy_account: {
    id: 'click_to_copy_account',
    defaultMessage: 'Click to copy your account number'
  },
  copied_account: {
    id: 'copied_account',
    defaultMessage: 'Successfully copied your account number!'
  },
  account_help_message: {
    id: 'account_help_message',
    defaultMessage: 'Communicate your account number to your interlocutor ' +
    'so they can send you {currency}. It is perfectly safe to make your account number public.'
  },
  account_public_key: {
    id: 'account_public_key',
    defaultMessage: 'Account Public Key'
  },
  public_key_help: {
    id: 'public_key_help',
    defaultMessage: 'In some rare cases the sender might ask for your public key. Normally you do not need this.'
  },
  scan_qr_code: {
    id: 'scan_qr_code',
    defaultMessage: 'Scan QR Code'
  },
  qr_help_message: {
    id: 'qr_help_message',
    defaultMessage: 'This QR code contains your account number. Use a QR scanning mobile app in order to access it.'
  }
})

export class ReceiveModal extends React.Component {
  constructor () {
    super()
    this.state = {
      copySuccess: false
    }
  }

  _onCopy = () => {
    this.setState({
      copySuccess: true
    })
  }

  _handleClose = () => {
    const { handleClose } = this.props
    handleClose()
    this.state = {
      copySuccess: false
    }
  }

  render () {
    const {
      intl: { formatMessage },
      show,
      accountRS,
      publicKey,
      isMobile
    } = this.props
    let renderQRMobile
    let renderQRDesktop
    const renderQR = (<Col xs={12} md={4}>
      <h3>{renderFormattedMessage(messages.scan_qr_code)}</h3>
      <QRCode value={accountRS} />
      <p>{renderFormattedMessage(messages.qr_help_message)}</p>
    </Col>)

    let dialogContentStyle
    let dialogBodyStyle
    let dialogStyle

    if (isMobile) {
      dialogContentStyle = { width: '100%', transform: 'translate(0, 0)', maxWidth: 'auto' }
      dialogBodyStyle = { padding: '0px 20px' }
      dialogStyle = { paddingTop: 0, height: '100vh', overflow: 'auto' }
    }

    if (isMobile) {
      renderQRMobile = renderQR
    } else {
      renderQRDesktop = renderQR
    }

    const { copySuccess } = this.state

    const actions = [<FlatButton
      label={formatMessage({ id: 'cancel' })}
      onTouchTap={this._handleClose}
      />
    ]

    return (
      <Dialog
        open={show}
        actions={actions}
        title={formatMessage(messages.receive_currency, { currency: tokenName })}
        autoDetectWindowHeight={false}
        onRequestClose={this._handleClose}
        contentStyle={dialogContentStyle}
        bodyStyle={dialogBodyStyle}
        style={dialogStyle}
        >
        <Row>
          <Col xs={12} md={8}>
            {renderQRMobile}
            <h3>{renderFormattedMessage(messages.account_number)}</h3>
            {renderFormattedMessage(messages.your_account_number_is)}&nbsp;
            <CopyToClipboard text={accountRS} onCopy={this._onCopy}>
              <FlatButton label={accountRS} />
            </CopyToClipboard> <br />{renderFormattedMessage(messages.click_to_copy_account)}
            {copySuccess
              ? <div style={{ color: 'green' }}>
                {renderFormattedMessage(messages.copied_account)}
              </div>
              : null}
            <p>{renderFormattedMessage(messages.account_help_message, { currency: tokenName })}</p>
            <div>
              <h3>{renderFormattedMessage(messages.account_public_key)}</h3>
              <div style={{
                wordBreak: 'break-all',
                fontFamily: 'monospace, monospace',
                fontSize: '1em' }}>{publicKey}</div>
              <p>{renderFormattedMessage(messages.public_key_help)}</p>
            </div>
          </Col>
          {renderQRDesktop}
        </Row>
      </Dialog>
    )
  }
}

ReceiveModal.propTypes = {
  intl: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  accountRS: PropTypes.string.isRequired,
  publicKey: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
}

export default injectIntl(ReceiveModal)
