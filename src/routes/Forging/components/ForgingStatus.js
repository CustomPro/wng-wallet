import React, { PropTypes } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { FlatButton } from 'material-ui'

import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  unknown: {
    id: 'unknown',
    defaultMessage: 'Unknown'
  },
  is_forging: {
    id: 'is_forging',
    defaultMessage: 'Forging'
  },
  not_forging: {
    id: 'not_forging',
    defaultMessage: 'Not forging'
  },
  forging_status: {
    id: 'forging_status',
    defaultMessage: 'Forging status:'
  },
  click_here_to_check: {
    id: 'click_here_to_check',
    defaultMessage: 'Click here to check'
  }
})

class ForgingStatus extends React.Component {
  _onGetStatusClick = () => {
    const { getForging, node } = this.props
    getForging(node)
  }
  render () {
    const {
      status,
      node
    } = this.props

    const style = {}

    switch (status) {
      case 'unknown':
        style.color = 'gray'
        break
      case 'is_forging':
        style.color = 'green'
        break
      case 'not_forging':
        style.color = 'red'
        break
      default:
        style.color = 'gray'
    }

    const disableButton = !node

    return (
      <div>
        <strong>{renderFormattedMessage(messages.forging_status)}&nbsp;</strong>
        {status !== 'unknown' && <span style={style}>
          {renderFormattedMessage(messages[status])}
        </span>}
        <FlatButton label={renderFormattedMessage(messages.click_here_to_check)}
          onTouchTap={this._onGetStatusClick}
          disabled={Boolean(disableButton)} />
      </div>
    )
  }
}

ForgingStatus.propTypes = {
  intl: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  node: PropTypes.string.isRequired,
  getForging: PropTypes.func.isRequired
}

export default injectIntl(ForgingStatus)
