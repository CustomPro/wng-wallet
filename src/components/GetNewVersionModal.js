import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import { Dialog, FlatButton } from 'material-ui'

import { hideNewVersionModal } from 'redux/modules/site'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  update_now: {
    id: 'update_now',
    defaultMessage: 'Update now'
  },
  new_version_available: {
    id: 'new_version_available',
    defaultMessage: 'New version available'
  },
  update_wallet_help: {
    id: 'update_wallet_help',
    defaultMessage: 'Updating will refresh this page'
  }
})

export class GetNewVersionModal extends React.Component {
  _handleClose = () => {
    const { hideNewVersionModal } = this.props
    hideNewVersionModal()
  }

  _refreshPage = () => {
    window.location.reload(true)
  }

  render () {
    const {
      show
    } = this.props

    const actions = [
      <FlatButton
        label={renderFormattedMessage(messages.cancel)}
        primary
        onTouchTap={this._handleClose}
      />,
      <FlatButton
        label={renderFormattedMessage(messages.update_now)}
        primary
        onTouchTap={this._refreshPage}
      />
    ]

    return (
      <Dialog
        open={show}
        title={renderFormattedMessage(messages.new_version_available)}
        actions={actions}
        onRequestClose={this._handleClose}>
        {renderFormattedMessage(messages.update_wallet_help)}
      </Dialog>
    )
  }
}

GetNewVersionModal.propTypes = {
  intl: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  hideNewVersionModal: PropTypes.func.isRequired
}

export default injectIntl(connect(state => {
  const { version, newVersion, hideNewVersionModal } = state.site

  return {
    show: version < newVersion && !hideNewVersionModal
  }
}, {
  hideNewVersionModal
})(GetNewVersionModal))
