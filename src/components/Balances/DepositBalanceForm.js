import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes } from 'redux-form'
import {
  RaisedButton,
  Snackbar
} from 'material-ui'
import {
  TextField
} from 'redux-form-material-ui'
import style from './DepositBalanceForm.css'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  transfer_success: {
    id: 'transfer_success',
    defaultMessage: 'Your transfer has been successfully made'
  },
  quantity: {
    id: 'quantity',
    defaultMessage: 'Quantity {asset}'
  },
  price: {
    id: 'depositbalance.price',
    defaultMessage: 'Price'
  },
  price_hint: {
    id: 'depositbalance.price_hint',
    defaultMessage: 'Price of {asset}'
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
  number_error: {
    id: 'number_error',
    defaultMessage: 'Please enter a number'
  }
})

export class DepositBalanceForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      snackbarOpen: false,
      message: ''
    }
  }

  componentDidMount () {
    const { getAsset, assetId } = this.props
    getAsset(assetId)
  }

  handleSubmit = (values) => {
    this.handlePostDepositBalance(values)
  }

  handlePostBuyOrder = (values) => {
    const {
      postBuyOrder,
      assetId,
      account,
      asset
     } = this.props
    const { quantity, price } = values
    postBuyOrder(assetId, account.secretPhrase, quantity, price, asset.decimals)
  }

  componentWillReceiveProps (nextProps) {
    const { reset } = this.props
    if (this.props.submitSucceeded) {
      reset()
      if (nextProps.postDepositBalanceError &&
        nextProps.postDepositBalanceError.errorDescription) {
        this.setState({ message: nextProps.postDepositBalanceError.errorDescription, snackbarOpen: true })
      } else if (this.props.postDepositBalanceSuccess !== nextProps.postDepositBalanceSuccess) {
        this.setState({ message: renderFormattedMessage(messages.transfer_success), snackbarOpen: true })
      }
    } else {
      this.setState({ message: '', snackbarOpen: false })
    }
  }

  render () {
    const {
      form,
      asset,
      validate,
      handleSubmit,
      pristine,
      reset,
      submitting
    } = this.props

    const quantityLabel = renderFormattedMessage(messages.quantity, {
      asset: renderFormattedMessage({ id: asset.name })
    })
    const priceLabel = renderFormattedMessage(messages.price)
    const priceHintLabel = renderFormattedMessage(messages.price_hint, {
      asset: renderFormattedMessage({ id: asset.name })
    })
    const message = this.state.message
    const snackbarOpen = this.state.snackbarOpen
    const formStyle = { width: '100%' }

    return (
      <div className={style.DepositBalanceForm_Body__Form}>
        <form ref='depositBalanceForm' onSubmit={handleSubmit(this.handleSubmit)}>
          <Snackbar open={snackbarOpen} message={message}
            onRequestClose={this.handleRequestClose} />
          <div className={style.DepositBalanceForm_Body__Fieldrow}>
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
          <div className={style.DepositBalanceForm_Body__Fieldrow}>
            <Field
              style={formStyle}
              inputStyle={formStyle}
              floatingLabelFocusStyle={formStyle}
              errorStyle={formStyle}
              name='price'
              component={TextField}
              type='number'
              hintText={priceLabel}
              errorText={validate.price}
              floatingLabelText={priceHintLabel} />
          </div>
          <div className={style.DepositBalanceForm_Body__FieldrowSubmit}>
            <div className={style.DepositBalanceForm_Body__Submit}>
              <RaisedButton type='submit'
                disabled={pristine || submitting}
                onClick={this.handleSubmit}
                label={renderFormattedMessage(messages.confirm_send)}
                primary />
            </div>
            <div className={style.DepositBalanceForm_Body__Clear}>
              <RaisedButton type='button'
                disabled={pristine || submitting}
                onClick={reset}
                label={renderFormattedMessage(messages.clear_values)} />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

DepositBalanceForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired
}

const validate = (values, state) => {
  const errors = {}
  if (!values.recipient) {
    errors.recipient = renderFormattedMessage(messages.recipient_error)
  }
  if (!values.quantity) {
    errors.quantity = renderFormattedMessage(messages.number_error)
  }
  if (!values.price) {
    errors.price = renderFormattedMessage(messages.number_error)
  }
  return errors
}

export default reduxForm({
  form: 'depositBalanceForm',
  validate
})(DepositBalanceForm)
