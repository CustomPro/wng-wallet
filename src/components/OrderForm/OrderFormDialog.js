import React, { PropTypes } from 'react'
import { Dialog, RaisedButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import { minimumFee } from 'config.json'
import { convertDQTToDBN } from 'redux/utils/nrs'

const messages = defineMessages({
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  confirm_order_amount: {
    id: 'confirm_order_amount',
    defaultMessage: 'Please confirm that you want to {type} {quantity} {token} for {total} {asset}'
  },
  confirm_order_buy_amount: {
    id: 'confirm_order_buy_amount',
    defaultMessage: 'Please confirm that you want to buy {quantity} {token} for {total} {asset}'
  },
  confirm_order_sell_amount: {
    id: 'confirm_order_sell_amount',
    defaultMessage: 'Please confirm that you want to sell {quantity} {token} for {total} {asset}'
  },
  confirm_order: {
    id: 'confirm_order',
    defaultMessage: 'Confirm order'
  },
  next: {
    id: 'orderform.next',
    defaultMessage: 'Next'
  },
  order_success: {
    id: 'order_success',
    defaultMessage: 'Your order has been successfully made'
  },
  order_error: {
    id: 'order_error',
    defaultMessage: 'Your order could not be made.'
  },
  order_error_description: {
    id: 'order_error_description',
    defaultMessage: 'The server produced the following error' +
    ' description: {errorDescription}, error code: {errorCode}'
  },
  confirm_order_fee: {
    id: 'orderform.confirm_order_fee',
    defaultMessage: 'Please note that this transaction has a fee of {fee} {token}'
  }
})

export class OrderFormDialog extends React.Component {

  handleConfirmClick = () => {
    this.props.handleSubmit()
  }

  renderConfirm (values, token, asset, total) {
    const { orderType, quantity, fee } = values

    let confirmMessage
    if (orderType === 'buy') {
      confirmMessage = renderFormattedMessage(messages.confirm_order_buy_amount, {
        quantity: quantity,
        token: token,
        asset: renderFormattedMessage({ id: asset }),
        total: total
      })
    } else {
      confirmMessage = renderFormattedMessage(messages.confirm_order_sell_amount, {
        quantity: quantity,
        token: token,
        asset: renderFormattedMessage({ id: asset }),
        total: total
      })
    }
    const orderFee = fee || convertDQTToDBN(minimumFee)
    const feeMessage = renderFormattedMessage(messages.confirm_order_fee, { fee: orderFee, token: token })
    return (
      <div>
        <p>
          {confirmMessage}
        </p>
        <p>
          <small>{feeMessage}</small>
        </p>
      </div>
    )
  }

  renderMessages () {
    if (this.props.submitSucceeded) {
      const {
        postOrderError,
        postOrderSuccess
      } = this.props
      let message
      if (postOrderSuccess && postOrderSuccess.transaction) {
        message = renderFormattedMessage(messages.order_success)
      } else if (postOrderError && postOrderError.errorCode) {
        const renderError = renderFormattedMessage(messages.order_error_description, {
          errorCode: postOrderError.errorCode,
          errorDescription: postOrderError.errorDescription
        })
        message = (
          <div>
            {renderFormattedMessage(messages.order_error)}
            <br />
            {renderError}
          </div>
        )
      }
      return (
        <div>
          {message}
        </div>
      )
    }
  }

  render () {
    let confirmMessage
    let renderedStep
    let actions
    if (this.props.values) {
      confirmMessage = this.renderConfirm(this.props.values,
      this.props.token, this.props.asset, this.props.total)
    }

    if (this.props.step === 1) {
      renderedStep = confirmMessage
      actions =
      (<div>
        <RaisedButton
          label={renderFormattedMessage(messages.cancel)}
          onClick={this.props.closeDialog}
        />
        <RaisedButton
          label={renderFormattedMessage(messages.confirm_order)}
          onClick={this.handleConfirmClick}
          primary
        />
      </div>)
    }

    if (this.props.step === 2) {
      renderedStep = this.renderMessages()
      actions =
      (<div>
        <RaisedButton onClick={this.props.closeDialog}>
          {renderFormattedMessage(messages.close)}
        </RaisedButton>
      </div>)
    }
    const titleMessage = renderFormattedMessage(messages.confirm_order)
    const title = (<div>{titleMessage}
      <div style={{
        float: 'right',
        paddingRight: '10px',
        fontWeight: 100,
        cursor: 'pointer'
      }}><a onClick={this.props.closeDialog}>x</a></div>
    </div>)

    return (
      <Dialog
        title={title}
        open={this.props.open}
        onRequestClose={this.props.closeDialog}
        actions={actions}
        >
        {renderedStep}
      </Dialog>
    )
  }
}

OrderFormDialog.propTypes = {
  open: PropTypes.bool,
  closeDialog: PropTypes.func,
  values: PropTypes.object,
  asset: PropTypes.string,
  token: PropTypes.string,
  total: PropTypes.string,
  submitSucceeded: PropTypes.bool,
  postOrderSuccess: PropTypes.object,
  postOrderError: PropTypes.object,
  step: PropTypes.number,
  onNextStep: PropTypes.func,
  onPrevStep: PropTypes.func,
  handleSubmit: PropTypes.func
}

export default OrderFormDialog
