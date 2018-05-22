import React, { PropTypes } from 'react'
import {
  FlatButton,
  RaisedButton,
  Dialog
} from 'material-ui'

import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  confirm: {
    id: 'confirmalert.confirm',
    defaultMessage: 'Confirm'
  },
  cancel: {
    id: 'confirmalert.cancel',
    defaultMessage: 'Cancel'
  }
})

class ConfirmAlert extends React.Component {

  handleConfirm = () => {
    this.props.confirmCallback(this.props.value)
  }

  handleCancel = () => {
    if (this.props.cancelCallback) {
      this.props.cancelCallback()
    }
    this.props.closeCallback()
  }

  handleClose = () => {
    this.props.closeCallback()
  }

  render () {
    const actions = [
      <FlatButton
        label={renderFormattedMessage(messages.cancel)}
        primary
        onTouchTap={this.handleCancel}
      />,
      <RaisedButton
        label={renderFormattedMessage(messages.confirm)}
        primary
        onTouchTap={this.handleConfirm}
      />
    ]
    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose}>
        {this.props.message}
      </Dialog>
    )
  }
}

ConfirmAlert.propTypes = {
  confirmCallback: PropTypes.func,
  cancelCallback: PropTypes.func,
  closeCallback: PropTypes.func,
  open: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  children: PropTypes.object,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default ConfirmAlert
