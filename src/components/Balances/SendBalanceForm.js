import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes, change } from 'redux-form'
import {
  RaisedButton,
  Toggle
} from 'material-ui'
import {
  TextField
} from 'redux-form-material-ui'
import style from './SendBalanceForm.css'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import NxtAddress from 'redux/utils/nxtAddress'
import { tokenName, minimumFee } from 'config.json'
import { convertDQTToDBN } from 'redux/utils/nrs'
import QRScannerButton from 'components/QRScanner/QRScannerButton'

const messages = defineMessages({
  transfer_success: {
    id: 'transfer_success',
    defaultMessage: 'Your transfer has been successfully made'
  },
  transfer_error: {
    id: 'transfer_error',
    defaultMessage: 'Your transfer could not be made.'
  },
  transfer_error_description: {
    id: 'transfer_error_description',
    defaultMessage: 'The server produced the following error' +
    ' description: {errorDescription}, error code: {errorCode}'
  },
  quantity: {
    id: 'quantity',
    defaultMessage: 'Quantity {asset}'
  },
  next: {
    id: 'next',
    defaultMessage: 'Next'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  recipient: {
    id: 'recipient',
    defaultMessage: 'Recipient'
  },
  recipient_hint: {
    id: 'sendbalance.recipient_hint',
    defaultMessage: 'Enter recipient in this format: {token}-XXXX-XXXX-XXXX-XXXX'
  },
  confirm_send: {
    id: 'confirm_send',
    defaultMessage: 'Confirm send'
  },
  clear_values: {
    id: 'clear_values',
    defaultMessage: 'Clear values'
  },
  recipient_error: {
    id: 'recipient_error',
    defaultMessage: 'Please enter a recipient'
  },
  invalid_recipient_error: {
    id: 'invalid_recipient_error',
    defaultMessage: 'This account number is invalid'
  },
  number_error: {
    id: 'number_error',
    defaultMessage: 'Please enter a number'
  },
  confirm_send_balance_amount: {
    id: 'confirm_send_balance_amount',
    defaultMessage: 'Please confirm that you want to send {amount} {asset}'
  },
  confirm_send_balance_account: {
    id: 'confirm_send_balance_account',
    defaultMessage: 'to the following account: {account}'
  },
  confirm_send_money_fee: {
    id: 'sendbalance.confirm_send_money_fee',
    defaultMessage: 'Please note that this transaction has a fee of {fee} {token}'
  },
  fee: {
    id: 'send_balance_form.fee',
    defaultMessage: 'Fee in {tokenName}'
  },
  minimum_fee_error_description: {
    id: 'send_balance_form.minimum_fee_error_description',
    defaultMessage: 'The minimum fee is {minimumFee} {tokenName}'
  },
  advanced_options: {
    id: 'send_balance_form.advanced_options',
    defaultMessage: 'Advanced options'
  }
})

export class SendBalanceForm extends React.Component {

  componentDidMount () {
    const { getAsset, assetId } = this.props
    getAsset(assetId)
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, sendBalanceSetPage } = this.props
    const { qrCode, hasPostedSendBalance } = nextProps
    if (qrCode) {
      dispatch(change('sendBalanceForm', 'recipient', qrCode))
    }
    if (hasPostedSendBalance !== this.props.hasPostedSendBalance) {
      if (hasPostedSendBalance === true) {
        sendBalanceSetPage(3)
      }
    }
  }

  handleOptionsToggle = () => {
    const {
      advancedOptionsOpen,
      openAdvancedOptions,
      closeAdvancedOptions
    } = this.props
    if (advancedOptionsOpen === false) {
      openAdvancedOptions()
    } else {
      closeAdvancedOptions()
    }
  }

  handleSubmit = (values) => {
  }

  handleSubmitClick = () => {
    this.handlePostSendBalance()
  }

  onPrevStep = () => {
    const nextStep = this.props.sendBalanceStep - 1
    this.props.sendBalanceSetPage(nextStep)
  }

  onNextStep = () => {
    const nextStep = this.props.sendBalanceStep + 1
    this.props.sendBalanceSetPage(nextStep)
  }

  handleConfirmStep = () => {
    this.props.sendBalanceSetPage(2)
  }

  handlePostSendBalance = () => {
    const {
      postSendBalance,
      assetId,
      account,
      asset,
      quantity,
      recipient,
      fee
     } = this.props
    postSendBalance(assetId, account.secretPhrase, recipient, quantity, asset.decimals, fee)
  }

  handleCloseDialog = () => {
    this.props.closeDialog()
    this.props.reset()
    this.props.sendBalanceSetPage(1)
  }

  handleRecipientChange = (e) => {
    this.props.clearQRCode()
  }

  renderForm () {
    const {
      asset,
      validate,
      pristine,
      invalid,
      advancedOptionsOpen
    } = this.props
    const quantityLabel = renderFormattedMessage(messages.quantity, {
      asset: renderFormattedMessage({ id: asset.name })
    })
    const recipientLabel = renderFormattedMessage(messages.recipient)
    const recipientHintLabel = renderFormattedMessage(messages.recipient_hint, { token: tokenName,
      asset: renderFormattedMessage({ id: asset.name }) })
    const feeLabel = renderFormattedMessage(messages.fee, { tokenName })
    const formStyle = { width: '100%' }
    let feeField

    if (advancedOptionsOpen === true) {
      feeField = (
        <div className={style.SendBalanceForm_Body__Fieldrow}>
          <Field
            style={formStyle}
            inputStyle={formStyle}
            floatingLabelStyle={formStyle}
            errorStyle={formStyle}
            name='fee'
            component={TextField}
            type='number'
            hintText={feeLabel}
            floatingLabelText={feeLabel} />
        </div>
      )
    }
    return (
      <div>
        <Toggle
          labelStyle={formStyle}
          label={renderFormattedMessage(messages.advanced_options)}
          onToggle={this.handleOptionsToggle}
          defaultToggled={advancedOptionsOpen}
        />
        <div className={style.SendBalanceForm_Body__Fieldrow}>
          <Field
            style={formStyle}
            inputStyle={formStyle}
            floatingLabelFocusStyle={formStyle}
            errorStyle={formStyle}
            name='recipient'
            component={TextField}
            type='text'
            onChange={this.handleRecipientChange}
            hintText={recipientLabel}
            errorText={validate.recipient}
            floatingLabelText={recipientHintLabel} />
          <QRScannerButton
            showModal={this.props.openSendBalanceDialog}
            hideModal={this.props.closeSendBalanceDialog}
          />
        </div>
        <div className={style.SendBalanceForm_Body__Fieldrow}>
          <Field
            style={formStyle}
            inputStyle={formStyle}
            floatingLabelFocusStyle={formStyle}
            errorStyle={formStyle}
            name='quantity'
            component={TextField}
            type='number'
            hintText={quantityLabel}
            errorText={validate.quantity}
            floatingLabelText={quantityLabel} />
        </div>
        {feeField}
        <div className={style.SendBalanceForm_Body__FieldrowSubmit}>
          <div className={style.SendBalanceForm_Body__Submit}>
            <RaisedButton
              onClick={this.handleCloseDialog}
              label={renderFormattedMessage(messages.cancel)}
              primary />
          </div>
          <div className={style.SendBalanceForm_Body__Submit}>
            <RaisedButton
              onClick={this.handleConfirmStep}
              disabled={pristine || invalid}
              label={renderFormattedMessage(messages.next)}
              primary />
          </div>
        </div>
      </div>
    )
  }

  renderConfirm () {
    const {
      pristine,
      submitting,
      asset,
      quantity,
      recipient,
      fee
    } = this.props
    const sendFee = fee || convertDQTToDBN(minimumFee)
    return (
      <div>
        {renderFormattedMessage(messages.confirm_send_balance_amount, {
          amount: quantity,
          asset: renderFormattedMessage({ id: asset.name })
        })}<br />
        {renderFormattedMessage(messages.confirm_send_balance_account, {
          account: recipient
        })}
        <p>
          <small>{renderFormattedMessage(messages.confirm_send_money_fee,
            { fee: sendFee, token: tokenName })}</small>
        </p>
        <div className={style.SendBalanceForm_Body__FieldrowSubmit}>
          <div className={style.SendBalanceForm_Body__Submit}>
            <RaisedButton
              onClick={this.onPrevStep}
              label={renderFormattedMessage(messages.cancel)}
              primary />
          </div>
          <div className={style.SendBalanceForm_Body__Submit}>
            <RaisedButton type='submit'
              disabled={pristine || submitting}
              onClick={this.handleSubmitClick}
              label={renderFormattedMessage(messages.confirm_send)}
              primary />
          </div>
        </div>
      </div>
    )
  }

  renderMessages () {
    const {
      postSendBalanceError,
      postSendBalanceSuccess
    } = this.props
    let message
    if (postSendBalanceSuccess && postSendBalanceSuccess.transaction) {
      message = renderFormattedMessage(messages.transfer_success)
    } else if (postSendBalanceError) {
      const renderError = renderFormattedMessage(messages.transfer_error_description, {
        errorCode: postSendBalanceError.errorCode,
        errorDescription: postSendBalanceError.errorDescription
      })
      message = (
        <div>
          {renderFormattedMessage(messages.transfer_error)}
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

  render () {
    const {
      form,
      handleSubmit,
      sendBalanceStep
    } = this.props
    let renderedForm
    if (sendBalanceStep === 1) {
      renderedForm = this.renderForm()
    }
    if (sendBalanceStep === 2) {
      renderedForm = this.renderConfirm()
    }
    if (sendBalanceStep === 3) {
      renderedForm = this.renderMessages()
    }

    return (
      <div className={style.SendBalanceForm_Body__Form}>
        <form ref='sendBalanceForm'
          onSubmit={handleSubmit(this.handleSubmit)}>
          {renderedForm}
        </form>
      </div>
    )
  }
}

SendBalanceForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired
}

const validate = (values, state) => {
  const errors = {}
  const minFee = convertDQTToDBN(minimumFee)
  if (!values.recipient) {
    errors.recipient = renderFormattedMessage(messages.recipient_error)
  } else {
    const nxtAddress = new NxtAddress()
    if (!nxtAddress.set(values.recipient)) {
      errors.recipient = renderFormattedMessage(messages.invalid_recipient_error)
    }
  }
  if (!values.quantity) {
    errors.price = renderFormattedMessage(messages.number_error)
  }
  if (values.fee < minFee) {
    errors.fee = renderFormattedMessage(messages.minimum_fee_error_description, {
      minimumFee: minFee,
      tokenName
    })
  }
  return errors
}

export default reduxForm({
  form: 'sendBalanceForm',
  validate
})(SendBalanceForm)
