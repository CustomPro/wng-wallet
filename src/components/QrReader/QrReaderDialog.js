import React, { PropTypes } from 'react'
import { Dialog, FlatButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import QrReaderContainer from './QrReaderContainer'

const messages = defineMessages({
  qrReader: {
    id: 'qrReader.qrReader',
    defaultMessage: 'QR Reader'
  },
  info: {
    id: 'info',
    defaultMessage: 'info'
  },
  close: {
    id: 'qrReader.close',
    defaultMessage: 'Close'
  }
})

export class QrReaderDialog extends React.Component {

  render () {
    const {
      show
    } = this.props
    const qrReaderMessage = renderFormattedMessage(messages.qrReader)
    const title = (<div>{qrReaderMessage} <span style={{fontWeight: 'bold'}}></span>
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
        onRequestClose={this.props.closeDialog}>
        <QrReaderContainer />
      </Dialog>
    )
  }
}

QrReaderDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  closeDialog: PropTypes.func,
  asset: PropTypes.object
}

export default QrReaderDialog
