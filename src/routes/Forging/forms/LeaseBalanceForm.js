import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { reduxForm, Field, propTypes, change } from 'redux-form'
import { RaisedButton, Toggle } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { minimumFee, tokenName } from 'config.json'
import { convertDQTToDBN } from 'redux/utils/nrs'
import QRScannerButton from 'components/QRScanner/QRScannerButton'

import formStyle from 'components/Form.scss'

const messages = defineMessages({
  lease_period_invalid: {
    id: 'forging.lease_period_invalid',
    defaultMessage: 'The lease period must be between 1440 and 65535 blocks.'
  },
  period_help: {
    id: 'forging.period_help',
    defaultMessage: 'The lease period in amount of blocks. Must be between 1440 and 65535 blocks.'
  },
  fee: {
    id: 'forging.fee',
    defaultMessage: 'Fee in {tokenName}'
  },
  minimum_fee_error_description: {
    id: 'forging.minimum_fee_error_description',
    defaultMessage: 'The minimum fee is {minimumFee} {tokenName}'
  },
  advanced_options: {
    id: 'forging.advanced_options',
    defaultMessage: 'Advanced options'
  },
  lease_out: {
    id: 'forging.lease_out',
    defaultMessage: 'You can lease out'
  }
})

export class LeaseBalanceForm extends React.Component {

  componentWillReceiveProps = (nextProps) => {
    const { dispatch } = this.props
    const { qrCode } = nextProps
    if (qrCode) {
      dispatch(change('leaseBalance', 'recipient', qrCode))
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

  handleSubmit = (data) => {
    const { leaseBalance } = this.props
    leaseBalance(data)
  }

  handleRecipientChange = (e) => {
    this.props.clearQRCode()
  }

  render () {
    const {
      intl: { formatMessage },
      handleSubmit,
      pristine,
      submitting,
      advancedOptionsOpen
    } = this.props
    const feeLabel = renderFormattedMessage(messages.fee, { tokenName })
    let feeField

    if (advancedOptionsOpen === true) {
      feeField = (
        <div>
          <Field
            style={formStyle}
            inputStyle={formStyle}
            floatingLabelStyle={formStyle}
            errorStyle={formStyle}
            name='fee'
            component={TextField}
            type='number'
            hintText={feeLabel}
            floatingLabelText={feeLabel}
            fullWidth />
        </div>
      )
    }
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <br /><br />
        <Toggle
          labelStyle={formStyle}
          label={renderFormattedMessage(messages.advanced_options)}
          onToggle={this.handleOptionsToggle}
          defaultToggled={advancedOptionsOpen}
        />
        <Field
          name='recipient'
          component={TextField}
          onChange={this.handleRecipientChange}
          floatingLabelText={formatMessage({ id: 'recipient' })}
          fullWidth />
        <QRScannerButton />
        <br />
        <Field
          name='period'
          component={TextField}
          type='number'
          floatingLabelText={renderFormattedMessage(messages.period)}
          hintText={renderFormattedMessage(messages.period_help)}
          fullWidth />
        <br />
        {feeField}
        <div className={formStyle.actions} style={{ paddingTop: 10 }}>
          <RaisedButton
            type='submit'
            primary
            label={formatMessage({ id: 'submit' })}
            disabled={pristine || submitting} />
        </div>
      </form>
    )
  }
}

LeaseBalanceForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  formValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired
}

const validate = (values, state) => {
  const { formatMessage } = state.intl
  const errors = {}
  const minFee = convertDQTToDBN(minimumFee)
  if (!values.recipient) {
    errors.recipient = formatMessage({ id: 'required_error' })
  }

  if (!values.period) {
    errors.period = formatMessage({ id: 'required_error' })
  }

  if (values.period && (values.period < 1440 || values.period > 65535)) {
    errors.period = renderFormattedMessage(messages.lease_period_invalid)
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
  form: 'leaseBalance',
  validate
})(LeaseBalanceForm)
