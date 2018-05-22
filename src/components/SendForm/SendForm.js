import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { reduxForm, Field, propTypes, change } from 'redux-form'
import { FlatButton, RaisedButton, Toggle } from 'material-ui'
import { TextField } from 'redux-form-material-ui'

import NxtAddress from 'redux/utils/nxtAddress'

import formStyle from '../Form.scss'
import { renderFormattedMessage } from 'redux/utils/intl'
import { tokenName, minimumFee } from 'config.json'
import { convertDQTToDBN } from 'redux/utils/nrs'
import style from 'components/AccountInformation/AccountInformation.css'
import QRScannerButton from 'components/QRScanner/QRScannerButton'

const messages = defineMessages({
  send_success: {
    id: 'send_form.send_success',
    defaultMessage: 'Successfully sent!'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  recipient: {
    id: 'recipient',
    defaultMessage: 'Recipient'
  },
  recipient_hint: {
    id: 'send_form.recipient_hint',
    defaultMessage: 'Enter recipient in this format: {token}-XXXX-XXXX-XXXX-XXXX'
  },
  amount: {
    id: 'send_form.amount',
    defaultMessage: 'Amount'
  },
  cancel: {
    id: 'send_form.cancel',
    defaultMessage: 'Cancel'
  },
  next: {
    id: 'send_form.next',
    defaultMessage: 'Next'
  },
  confirm_send_money_amount: {
    id: 'send_form.confirm_send_money_amount',
    defaultMessage: 'Please confirm that you want to send {amount} {tokenName}'
  },
  confirm_send_money_account: {
    id: 'send_form.confirm_send_money_account',
    defaultMessage: 'to the following account: {account}'
  },
  confirm_send_money_fee: {
    id: 'send_form.confirm_send_money_fee',
    defaultMessage: 'Please note that this transaction has a fee of {fee} {token}'
  },
  previous: {
    id: 'send_form.previous',
    defaultMessage: 'Previous'
  },
  submit: {
    id: 'send_form.submit',
    defaultMessage: 'Submit'
  },
  required_error: {
    id: 'send_form.required_error',
    defaultMessage: 'This field is required'
  },
  invalid_account: {
    id: 'send_form.invalid_account',
    defaultMessage: 'This account number is not valid'
  },
  send_error: {
    id: 'send_form.send_error',
    defaultMessage: 'Your transaction could not be made.'
  },
  send_error_description: {
    id: 'send_form.send_error_description',
    defaultMessage: 'The server produced the following error' +
    ' description: {errorDescription}, error code: {errorCode}'
  },
  fee: {
    id: 'send_form.fee',
    defaultMessage: 'Fee in {tokenName}'
  },
  minimum_fee_error_description: {
    id: 'send_form.minimum_fee_error_description',
    defaultMessage: 'The minimum fee is {minimumFee} {tokenName}'
  },
  advanced_options: {
    id: 'send_form.advanced_options',
    defaultMessage: 'Advanced options'
  },
  authorized_user: {
    id: 'send_form.authorized_user',
    defaultMessage: 'Authorized User'
  },
  unauthorized_user: {
    id: 'send_form.unauthorized_user',
    defaultMessage: 'Unauthorized User'
  },
  scan_qr_code: {
    id: 'send_form.scan_qr_code',
    defaultMessage: 'Scan QR Code'
  }
})

export class SendForm extends React.Component {

  componentDidMount () {
    this.props.setStep(0)
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

  handleSubmit = (data) => {
    const { sendMoney } = this.props
    sendMoney(data)
  }

  componentWillReceiveProps = (nextProps) => {
    const { setStep, refreshTransactions, formValues, dispatch } = this.props
    const { isSending, sendSuccess, submitSucceeded, sendStep, qrCode } = nextProps

    if (this.props.isSending && !isSending && sendSuccess && refreshTransactions) {
      refreshTransactions()
    }
    if (submitSucceeded === true) {
      setStep(2)
    }
    if (sendStep === 1) {
      this.props.getAccountInformationProperties(formValues.recipient)
    }
    if (qrCode) {
      dispatch(change('transaction', 'recipient', qrCode))
    }
  }

  onNextStep = (step) => {
    const { setStep } = this.props
    setStep(1)
  }

  onPreviousStep = (step) => {
    const { setStep } = this.props
    setStep(0)
  }

  onHide = () => {
    const { hideModal, refreshTransactions } = this.props
    hideModal()
    if (refreshTransactions) {
      refreshTransactions()
    }
  }

  handleRecipientChange = (e) => {
    this.props.clearQRCode()
  }

  renderForm () {
    const { invalid, isSending, advancedOptionsOpen, hideModal, showModal } = this.props
    const recipientLabel = renderFormattedMessage(messages.recipient)
    const recipientHintLabel = renderFormattedMessage(messages.recipient_hint, { token: tokenName })
    let feeField

    if (advancedOptionsOpen === true) {
      feeField = (
        <div>
          <Field
            name='fee'
            component={TextField}
            type='number'
            floatingLabelText={renderFormattedMessage(messages.fee, { tokenName })}
            fullWidth />
          <br />
        </div>
      )
    }

    return (
      <div>
        <Toggle
          label={renderFormattedMessage(messages.advanced_options)}
          onToggle={this.handleOptionsToggle}
          defaultToggled={advancedOptionsOpen}
        />
        <Field
          name='recipient'
          component={TextField}
          hintText={recipientLabel}
          errorText={validate.recipient}
          floatingLabelText={recipientHintLabel}
          id='send-recipient'
          onChange={this.handleRecipientChange}
          fullWidth />
        <QRScannerButton
          hideModal={hideModal}
          showModal={showModal}
        />
        <br />
        <Field
          name='amount'
          component={TextField}
          type='number'
          floatingLabelText={renderFormattedMessage(messages.amount)}
          fullWidth />
        <br />
        {feeField}
        <div className={formStyle.actions}>
          <FlatButton
            onClick={this.onHide}
            label={renderFormattedMessage(messages.cancel)} />
          <RaisedButton
            onClick={this.onNextStep}
            primary
            label={renderFormattedMessage(messages.next)}
            disabled={invalid || isSending} />
        </div>
      </div>
    )
  }

  renderAuthorizedFlag () {
    let authorizedFlag
    const { accountInformationProperties, isAdmin } = this.props
    if (isAdmin) {
      if (accountInformationProperties) {
        authorizedFlag = (
          <div className={style.AccountInformation_AuthorizedUserDiv}>
            <span className={accountInformationProperties.authorized
              ? style.AccountInformation_AuthorizedUser : style.AccountInformation_UnauthorizedUser}>
              {accountInformationProperties.authorized
                ? <span>{renderFormattedMessage(messages.authorized_user)}</span>
                : <span>{renderFormattedMessage(messages.unauthorized_user)}</span>
              }
            </span>
          </div>
        )
      }
    }
    return authorizedFlag
  }

  renderConfirm () {
    const {
      formValues,
      invalid,
      isSending
    } = this.props
    const authorizedFlag = this.renderAuthorizedFlag()
    const fee = formValues.fee || convertDQTToDBN(minimumFee)
    return (
      <div>
        <p>
          {renderFormattedMessage(messages.confirm_send_money_amount,
            { amount: formValues.amount, tokenName })}
          <br />
          {renderFormattedMessage(messages.confirm_send_money_account,
            { account: formValues.recipient })}
            {authorizedFlag}
        </p>
        <p>
          <small>{renderFormattedMessage(messages.confirm_send_money_fee,
            { fee, token: tokenName })}</small>
        </p>
        <div className={formStyle.actions}>
          <FlatButton
            onClick={this.onPreviousStep}
            label={renderFormattedMessage(messages.previous)} />
          <RaisedButton
            type='submit'
            primary
            label={renderFormattedMessage(messages.submit)}
            disabled={invalid || isSending} />
        </div>
      </div>
    )
  }

  renderMessages () {
    if (this.props.submitSucceeded) {
      const {
        sendError,
        sendSuccess
      } = this.props
      let message
      if (sendError) {
        const renderError = renderFormattedMessage(messages.send_error_description, {
          errorCode: sendError.errorCode,
          errorDescription: sendError.errorDescription
        })
        message = (
          <div>
            <p>
              {renderFormattedMessage(messages.send_error)}
            </p>
            <p>
              {renderError}
            </p>
          </div>
        )
      } else if (sendSuccess) {
        message = renderFormattedMessage(messages.send_success)
      }
      return (
        <div>
          {message}
          <div className={formStyle.actions}>
            <FlatButton
              onClick={this.onHide}
              label={renderFormattedMessage(messages.close)} />
          </div>
        </div>
      )
    }
  }

  render () {
    const {
      handleSubmit,
      sendStep
    } = this.props

    let renderedStep
    if (sendStep === 0) {
      renderedStep = this.renderForm()
    }
    if (sendStep === 1) {
      renderedStep = this.renderConfirm()
    }
    if (sendStep === 2) {
      renderedStep = this.renderMessages()
    }
    return (
      <div>
        <form name='sendForm' onSubmit={handleSubmit(this.handleSubmit)}>
          {renderedStep}
        </form>
      </div>
    )
  }
}

SendForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  formValues: PropTypes.object,
  hideModal: PropTypes.func.isRequired,
  refreshTransactions: PropTypes.func,
  setStep: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  sendSuccess: PropTypes.bool.isRequired,
  sendError: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  sendStep: PropTypes.number.isRequired
}
const validate = (values, state) => {
  const errors = {}

  const requiredErrorText = renderFormattedMessage(messages.required_error)
  const invalidAddressText = renderFormattedMessage(messages.invalid_account)
  const minFee = convertDQTToDBN(minimumFee)
  const minimumFeeErrorMessage = renderFormattedMessage(messages.minimum_fee_error_description, {
    minimumFee: minFee, tokenName
  })

  if (!values.recipient) {
    errors.recipient = requiredErrorText
  } else {
    const nxtAddress = new NxtAddress()
    if (!nxtAddress.set(values.recipient)) {
      errors.recipient = invalidAddressText
    }
  }

  if (!values.amount) {
    errors.amount = requiredErrorText
  }

  if (values.fee < minFee) {
    errors.fee = minimumFeeErrorMessage
  }

  return errors
}

export default reduxForm({
  form: 'transaction',
  validate
})(SendForm)
