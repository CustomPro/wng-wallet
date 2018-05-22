import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Dialog } from 'material-ui'

export class TransactionModal extends React.Component {
  render () {
    const {
      show,
      title,
      form,
      isMobile
    } = this.props
    const transactionTitle = (<div>{title}
      <div style={{
        float: 'right',
        paddingRight: '10px',
        fontWeight: 100,
        cursor: 'pointer'
      }}><a onClick={this.props.onSendClose}>x</a></div>
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
        title={transactionTitle}
        repositionOnUpdate={false}
        autoDetectWindowHeight={false}
        modal={false}
        contentStyle={dialogContentStyle}
        bodyStyle={dialogBodyStyle}
        style={dialogStyle}
        onRequestClose={this.props.onSendClose}>
        <div>{form}</div>
      </Dialog>
    )
  }
}

TransactionModal.propTypes = {
  intl: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  onSendClose: PropTypes.func,
  isMobile: PropTypes.bool
}

export default injectIntl(TransactionModal)
