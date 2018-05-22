import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { reduxForm, Field, propTypes } from 'redux-form'
import { FlatButton, RaisedButton, DatePicker, Toggle } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import formStyle from 'components/Form.scss'
import { renderFormattedMessage } from 'redux/utils/intl'
import shortid from 'shortid'
import NxtAddress from 'redux/utils/nxtAddress'
import { tokenName } from 'config.json'

const messages = defineMessages({
  value: {
    id: 'voucher_create_form.value',
    defaultMessage: 'Value'
  },
  amount_of_vouchers: {
    id: 'voucher_create_form.amount_of_vouchers',
    defaultMessage: 'Amount of vouchers'
  },
  code: {
    id: 'voucher_create_form.code',
    defaultMessage: 'Code'
  },
  recipient: {
    id: 'voucher_create_form.recipient',
    defaultMessage: 'Recipient (optional)'
  },
  voucher_will_expire: {
    id: 'voucher_create_form.voucher_will_expire',
    defaultMessage: 'Voucher will expire'
  },
  expiration_date: {
    id: 'voucher_create_form.expiration_date',
    defaultMessage: 'Expiration date'
  },
  cancel: {
    id: 'voucher_create_form.cancel',
    defaultMessage: 'Cancel'
  },
  next: {
    id: 'voucher_create_form.next',
    defaultMessage: 'Next'
  },
  value_is_required: {
    id: 'voucher_create_form.value_is_required',
    defaultMessage: 'Value is required'
  },
  voucher_create_confirm: {
    id: 'voucher_create_form.voucher_create_confirm',
    defaultMessage: 'You are creating a voucher with the following attributes:'
  },
  voucher_create_multiple_confirm: {
    id: 'voucher_create_form.voucher_create_multiple_confirm',
    defaultMessage: 'You are creating {amount} vouchers with the following attributes:'
  },
  submit: {
    id: 'voucher_create_form.submit',
    defaultMessage: 'Submit'
  },
  prev: {
    id: 'voucher_create_form.prev',
    defaultMessage: 'Prev'
  },
  close: {
    id: 'voucher_create_form.close',
    defaultMessage: 'Close'
  },
  voucher_create_success: {
    id: 'voucher_create_form.voucher_create_success',
    defaultMessage: 'Your vouchers have been created'
  },
  voucher_create_error: {
    id: 'voucher_create_form.voucher_create_error',
    defaultMessage: 'Your vouchers have not been created'
  },
  invalid_account: {
    id: 'voucher_create_form.invalid_account',
    defaultMessage: 'This account number is not valid'
  },
  multiple_vouchers: {
    id: 'voucher_create_form.multiple_vouchers',
    defaultMessage: 'Generate multiple vouchers'
  }
})

export class VoucherCreateForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      multiple: false,
      code: '',
      date: '',
      voucherWillExpire: false,
      step: 1
    }
  }

  componentWillMount () {
    const code = shortid.generate()
    this.setState({ code })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.hasCreatedVoucher === true) {
      this.setState({ step: 3 })
    }
  }

  handleChangeCode = (e) => {
    this.setState({ code: e.target.value })
  }

  handleChangeDate = (e, date) => {
    this.setState({ date })
  }

  handleExpirationToggle = (e) => {
    const { voucherWillExpire } = this.state
    if (voucherWillExpire === false) {
      this.setState({ voucherWillExpire: true })
    } else {
      this.setState({ voucherWillExpire: false })
    }
  }

  handleMultipleToggle = (e) => {
    const { multiple } = this.state
    if (multiple === false) {
      this.setState({ multiple: true })
    } else {
      this.setState({ multiple: false })
    }
  }

  handleConfirm = () => {
    this.setState({ step: 2 })
  }

  handlePrev = () => {
    this.setState({ step: 1 })
  }

  handleSubmit = () => {
    const { adminRS } = this.props
    const { date, code, voucherWillExpire, multiple } = this.state
    const { value, amount, recipient } = this.props.formValues
    const data = {
      code,
      value: parseFloat(value),
      createdBy: adminRS,
      multiple,
      voucherWillExpire
    }
    if (recipient) {
      data.recipient = recipient
    }
    if (voucherWillExpire === true) {
      data.expiration = date
    }
    if (multiple) {
      data.amount = parseFloat(amount)
    } else {
      data.code = code
    }

    this.props.onSubmit(data, this.props.createVoucher)
  }

  renderForm () {
    const { invalid, isSending } = this.props
    const { voucherWillExpire, multiple } = this.state
    let expirationField
    let amountOrCodeField
    if (voucherWillExpire === true) {
      expirationField = (
        <DatePicker
          name='expiration'
          ref='expiration'
          onChange={this.handleChangeDate}
          hintText={renderFormattedMessage(messages.expiration_date)}
          fullWidth
        />
      )
    }
    if (multiple) {
      amountOrCodeField = (
        <Field
          name='amount'
          component={TextField}
          type='number'
          floatingLabelText={renderFormattedMessage(messages.amount_of_vouchers)}
          fullWidth />)
    } else {
      amountOrCodeField = (
        <TextField
          name='code'
          type='text'
          value={this.state.code}
          ref='code'
          onChange={this.handleChangeCode}
          floatingLabelText={renderFormattedMessage(messages.code)}
          fullWidth />
      )
    }
    return (
      <div>
        <Toggle
          label={renderFormattedMessage(messages.multiple_vouchers)}
          onToggle={this.handleMultipleToggle}
          defaultToggled={multiple}
        />
        <Toggle
          label={renderFormattedMessage(messages.voucher_will_expire)}
          onToggle={this.handleExpirationToggle}
          defaultToggled={voucherWillExpire}
        />
        {amountOrCodeField}
        {expirationField}
        <Field
          name='recipient'
          component={TextField}
          errorText={validate.recipient}
          floatingLabelText={renderFormattedMessage(messages.recipient)}
          fullWidth />
        <Field
          name='value'
          component={TextField}
          type='number'
          floatingLabelText={renderFormattedMessage(messages.value)}
          fullWidth />
        <br />
        <br />
        <div className={formStyle.actions}>
          <FlatButton
            onClick={this.props.closeDialog}
            label={renderFormattedMessage(messages.cancel)} />
          <RaisedButton
            onClick={this.handleConfirm}
            primary
            label={renderFormattedMessage(messages.next)}
            disabled={invalid || isSending} />
        </div>
      </div>
    )
  }

  renderConfirm () {
    let expirationDate
    let accountRecipient
    let amountMessage
    let createMessage
    let codeMessage
    const { date, code, voucherWillExpire, multiple } = this.state
    const { value, amount, recipient } = this.props.formValues
    if (voucherWillExpire === true && date) {
      const renderedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
      expirationDate = (
        <div>
          <strong>{renderFormattedMessage(messages.expiration_date)}:</strong> {renderedDate}
        </div>
      )
    }
    if (recipient) {
      accountRecipient = (
        <div>
          <strong>{renderFormattedMessage(messages.recipient)}:</strong> {recipient}
        </div>
      )
    }
    if (multiple) {
      createMessage = renderFormattedMessage(messages.voucher_create_multiple_confirm, {amount})
    } else {
      createMessage = renderFormattedMessage(messages.voucher_create_confirm)
      codeMessage = (
        <div>
          <strong>{renderFormattedMessage(messages.code)}:</strong> {code}
        </div>)
    }
    return (
      <div>
        {createMessage}
        <br /><br />
        <div>
          <strong>{renderFormattedMessage(messages.value)}:</strong> {value} {tokenName}
        </div>
        {codeMessage}
        {amountMessage}
        {expirationDate}
        {accountRecipient}
        <div className={formStyle.actions}>
          <FlatButton
            onClick={this.handlePrev}
            label={renderFormattedMessage(messages.prev)} />
          <RaisedButton
            onClick={this.handleSubmit}
            primary
            label={renderFormattedMessage(messages.submit)} />
        </div>
      </div>
    )
  }

  renderSubmitted () {
    const { createVoucherError } = this.props
    let message
    if (createVoucherError) {
      message = (<div>
        {renderFormattedMessage(messages.voucher_create_error)}
        <br /><br />
        {createVoucherError}
      </div>)
    } else {
      message = renderFormattedMessage(messages.voucher_create_success)
    }
    return (
      <div>
        {message}
        <br /><br />
        <RaisedButton
          onClick={this.props.closeDialog}
          label={renderFormattedMessage(messages.close)} />
      </div>
    )
  }

  render () {
    const { step } = this.state
    let content
    if (step === 1) {
      content = this.renderForm()
    }
    if (step === 2) {
      content = this.renderConfirm()
    }
    if (step === 3) {
      content = this.renderSubmitted()
    }
    return (
      <form name='voucherCreateForm'>
        {content}
      </form>
    )
  }
}

VoucherCreateForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  formValues: PropTypes.object
}
const validate = (values, state) => {
  const errors = {}
  if (!values.value) {
    errors.value = renderFormattedMessage(messages.value_is_required)
  }
  const nxtAddress = new NxtAddress()
  if (values.recipient && values.recipient !== '' && !nxtAddress.set(values.recipient)) {
    errors.recipient = renderFormattedMessage(messages.invalid_account)
  }

  return errors
}

const onSubmit = (data, createVoucher) => {
  createVoucher(data)
}

export default reduxForm({
  form: 'voucherCreateForm',
  onSubmit,
  validate
})(VoucherCreateForm)
