import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { reduxForm, propTypes } from 'redux-form'
import { FlatButton, RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import formStyle from 'components/Form.scss'
import { renderFormattedMessage } from 'redux/utils/intl'
import { tokenName } from 'config.json'

const messages = defineMessages({
  value: {
    id: 'voucher_redeem_form.value',
    defaultMessage: 'Value'
  },
  amount: {
    id: 'voucher_redeem_form.amount',
    defaultMessage: 'Amount'
  },
  code: {
    id: 'voucher_redeem_form.code',
    defaultMessage: 'Code'
  },
  recipient: {
    id: 'voucher_redeem_form.recipient',
    defaultMessage: 'Recipient'
  },
  expiration_date: {
    id: 'voucher_redeem_form.expiration_date',
    defaultMessage: 'Expiration date'
  },
  cancel: {
    id: 'voucher_redeem_form.cancel',
    defaultMessage: 'Cancel'
  },
  next: {
    id: 'voucher_redeem_form.next',
    defaultMessage: 'Next'
  },
  voucher_redeem_confirm: {
    id: 'voucher_redeem_form.voucher_redeem_confirm',
    defaultMessage: 'You are redeeming a voucher with the following attributes:'
  },
  submit: {
    id: 'voucher_redeem_form.submit',
    defaultMessage: 'Submit'
  },
  prev: {
    id: 'voucher_redeem_form.prev',
    defaultMessage: 'Prev'
  },
  close: {
    id: 'voucher_redeem_form.close',
    defaultMessage: 'Close'
  },
  voucher_redeem_success: {
    id: 'voucher_redeem_form.voucher_redeem_success',
    defaultMessage: 'Your voucher has been redeemed'
  },
  voucher_redeem_error: {
    id: 'voucher_redeem_form.voucher_redeem_error',
    defaultMessage: 'Your voucher cannot be redeemed'
  },
  voucher_redeem_error_none: {
    id: 'voucher_redeem_form.voucher_redeem_error_none',
    defaultMessage: 'This voucher does not exist'
  },
  voucher_redeem_error_amount: {
    id: 'voucher_redeem_form.voucher_redeem_error_amount',
    defaultMessage: 'This voucher has been fully redeemed'
  },
  voucher_redeem_error_expired: {
    id: 'voucher_redeem_form.voucher_redeem_error_expired',
    defaultMessage: 'This voucher has expired'
  },
  voucher_redeem_error_recipient: {
    id: 'voucher_redeem_form.voucher_redeem_error_recipient',
    defaultMessage: 'You do not have the permission to redeem this voucher'
  },
  invalid_account: {
    id: 'voucher_redeem_form.invalid_account',
    defaultMessage: 'This account number is not valid'
  }
})

export class RedeemVoucherForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      code: '',
      step: 1
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.voucherHasBeenRedeemed === true) {
      this.setState({ step: 3 })
    }
  }

  handleChangeCode = (e) => {
    this.setState({ code: e.target.value })
  }

  handleConfirm = () => {
    this.props.getVoucherByCode(this.state.code)
    this.setState({ step: 2 })
  }

  handlePrev = () => {
    this.setState({ step: 1 })
    this.props.clearVoucherByCode()
  }

  handleSubmit = () => {
    const { code } = this.state
    const data = {
      code
    }
    this.props.onSubmit(data, this.props.redeemVoucher)
  }

  renderForm () {
    const { invalid, isSending } = this.props
    return (
      <div>
        <TextField
          name='code'
          type='text'
          value={this.state.code}
          ref='code'
          onChange={this.handleChangeCode}
          floatingLabelText={renderFormattedMessage(messages.code)}
          fullWidth />
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
    return (
      <div>
        {renderFormattedMessage(messages.voucher_redeem_confirm)}
        <div>
          <strong>{renderFormattedMessage(messages.code)}:</strong> {this.props.voucherToRedeem.code}
        </div>
        <div>
          <strong>{renderFormattedMessage(messages.value)}:</strong> {this.props.voucherToRedeem.value} {tokenName}
        </div>
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
    const { redeemVoucherError } = this.props
    let message
    if (redeemVoucherError) {
      let errorMessage
      switch (redeemVoucherError) {
        case 'none':
          errorMessage = renderFormattedMessage(messages.voucher_redeem_error_none)
          break
        case 'amount':
          errorMessage = renderFormattedMessage(messages.voucher_redeem_error_amount)
          break
        case 'recipient':
          errorMessage = renderFormattedMessage(messages.voucher_redeem_error_recipient)
          break
        case 'expired':
          errorMessage = renderFormattedMessage(messages.voucher_redeem_error_expired)
          break
      }
      message = (<div>
        {renderFormattedMessage(messages.voucher_redeem_error)}
        <div>
          {errorMessage}
        </div>
      </div>)
    } else {
      message = renderFormattedMessage(messages.voucher_redeem_success)
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

  renderNoVoucher () {
    return (
      <div>
        {renderFormattedMessage(messages.voucher_redeem_error_none)}
        <div className={formStyle.actions}>
          <FlatButton
            onClick={this.handlePrev}
            label={renderFormattedMessage(messages.prev)} />
          <RaisedButton
            onClick={this.props.closeDialog}
            label={renderFormattedMessage(messages.close)} />
        </div>
      </div>
    )
  }

  onKeyDown (e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      const { step } = this.state
      if (step === 1) {
        this.handleConfirm()
      }
      if (step === 2) {
        this.setState({ step: 3 })
      }
      if (step === 3) {
        this.props.submit()
      }
    }
  }

  render () {
    const { step } = this.state
    const { voucherToRedeemError, hasLoadedRedemptionVoucher } = this.props
    let content
    if (step === 1) {
      content = this.renderForm()
    }
    if (step === 2) {
      if (hasLoadedRedemptionVoucher) {
        if (voucherToRedeemError) {
          content = this.renderNoVoucher()
        } else {
          content = this.renderConfirm()
        }
      }
    }
    if (step === 3) {
      content = this.renderSubmitted()
    }
    return (
      <form name='voucherCreateForm'
        onKeyDown={this.onKeyDown}>
        {content}
      </form>
    )
  }
}

RedeemVoucherForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  formValues: PropTypes.object
}
const validate = (values, state) => {
  const errors = {}
  return errors
}

const onSubmit = (data, redeemVoucher) => {
  redeemVoucher(data)
}

export default reduxForm({
  form: 'redeemVoucherForm',
  onSubmit,
  validate
})(RedeemVoucherForm)
