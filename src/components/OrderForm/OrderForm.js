import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes, change } from 'redux-form'
import {
  RaisedButton,
  MenuItem,
  Toggle
} from 'material-ui'
import {
  TextField,
  SelectField
} from 'redux-form-material-ui'
import { tokenName, minimumFee } from 'config.json'
import { convertDQTToDBN } from 'redux/utils/nrs'
import style from './OrderForm.css'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages, FormattedNumber } from 'react-intl'
import OrderFormDialog from './OrderFormDialog'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'

const messages = defineMessages({
  order_success: {
    id: 'order_success',
    defaultMessage: 'Your order has been successfully placed'
  },
  buy: {
    id: 'order.buy',
    defaultMessage: 'Get {asset}'
  },
  sell: {
    id: 'order.sell',
    defaultMessage: 'Give {asset}'
  },
  quantity: {
    id: 'order.quantity',
    defaultMessage: 'Quantity {asset}'
  },
  price: {
    id: 'order.price',
    defaultMessage: 'Price {asset} / {token}'
  },
  token_per_asset_label: {
    id: 'order.token_per_asset_label',
    defaultMessage: '1 {token}:'
  },
  total: {
    id: 'order.total',
    defaultMessage: 'Total {token}:'
  },
  confirm_order: {
    id: 'confirm_order',
    defaultMessage: 'Confirm Order'
  },
  clear_values: {
    id: 'clear_values',
    defaultMessage: 'Clear values'
  },
  number_error: {
    id: 'number_error',
    defaultMessage: 'Please enter a number'
  },
  fee: {
    id: 'order_form.fee',
    defaultMessage: 'Fee in {tokenName}'
  },
  minimum_fee_error_description: {
    id: 'order_form.minimum_fee_error_description',
    defaultMessage: 'The minimum fee is {minimumFee} {tokenName}'
  },
  advanced_options: {
    id: 'order_form.advanced_options',
    defaultMessage: 'Advanced options'
  }
})

export class OrderForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      snackbarOpen: false,
      message: '',
      step: 1
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
    this.props.submit(values)
    this.handlePostOrder(values)
  }

  handleConfirmSubmit = () => {
    const {
       orderType,
       quantity,
       price,
       fee
     } = this.props
    const values = {
      orderType,
      quantity,
      price,
      fee
    }
    this.handleSubmit(values)
  }

  handleConfirm = () => {
    this.setState({ step: 1 })
    const {
       orderType,
       quantity,
       price,
       fee
     } = this.props
    const values = {
      orderType,
      quantity,
      price,
      fee
    }
    this.props.openOrderDialog(values)
  }

  handlePostOrder = (values) => {
    const {
      postOrder,
      account,
      asset
     } = this.props

    const {
       orderType,
       quantity,
       price,
       fee
     } = values

    postOrder(
     asset.asset,
     account.secretPhrase,
     orderType,
     quantity,
     price,
     asset.decimals,
     fee
   )
  }

  handleClearValues = () => {
    this.props.reset()
    this.props.clearExistingOrder()
  }

  closeOrderDialog = () => {
    this.props.reset()
    this.props.closeOrderDialog()
    if (this.props.orderType === 'buy') {
      this.props.updatePage('bidOrders', 1)
      this.props.updatePage('userBidOrders', 1)
    }
    if (this.props.orderType === 'sell') {
      this.props.updatePage('askOrders', 1)
      this.props.updatePage('userAskOrders', 1)
    }
    this.setState({ step: 1 })
    this.props.clearExistingOrder()
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props
    const { selectedOrder } = nextProps
    if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
      this.setState({ step: 2 })
    }
    if (selectedOrder !== this.props.selectedOrder) {
      if (selectedOrder.type === 'askOrders') {
        dispatch(change('orderForm', 'orderType', 'buy'))
      }
      if (selectedOrder.type === 'bidOrders') {
        dispatch(change('orderForm', 'orderType', 'sell'))
      }
      dispatch(change('orderForm', 'price', selectedOrder.price))
      dispatch(change('orderForm', 'quantity', selectedOrder.quantity))
    }
  }

  onNextStep = () => {
    const { step } = this.state
    const newStep = step + 1
    this.setState({ step: newStep })
  }

  onPrevStep = () => {
    const { step } = this.state
    const newStep = step - 1
    if (newStep >= 1) {
      this.setState({ step: newStep })
    }
  }

  handleChangeFormValues = () => {
    this.props.clearExistingOrder()
  }

  render () {
    const {
      form,
      asset,
      validate,
      pristine,
      handleSubmit,
      submitting,
      advancedOptionsOpen
    } = this.props

    const quantityLabel = renderFormattedMessage(messages.quantity, {
      asset: renderFormattedMessage({ id: asset.name })
    })
    const priceLabel = renderFormattedMessage(messages.price, {
      asset: renderFormattedMessage({ id: asset.name }), token: tokenName
    })
    const totalLabel = renderFormattedMessage(messages.total, { token: tokenName })
    const feeLabel = renderFormattedMessage(messages.fee, { tokenName })
    const tokenPerAssetLabel = renderFormattedMessage(messages.token_per_asset_label, {
      token: tokenName,
      asset: renderFormattedMessage({ id: asset.name })
    })
    const formStyle = { width: '100%' }
    let textColor
    let bgColor
    let feeField
    if (CustomTheme.order_form) {
      if (CustomTheme.order_form.textColor) {
        textColor = CustomTheme.order_form.textColor
        formStyle.color = textColor
      }
      if (CustomTheme.order_form.color) {
        bgColor = CustomTheme.order_form.color
        formStyle.backgroundColor = bgColor
      }
    }
    if (advancedOptionsOpen === true) {
      feeField = (
        <div className={style.OrderForm_Body__Fieldrow}>
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
      <div className={style.OrderForm_Body__Form}>
        <form ref='orderForm' onSubmit={handleSubmit(this.handleSubmit)}>
          <Toggle
            labelStyle={formStyle}
            label={renderFormattedMessage(messages.advanced_options)}
            onToggle={this.handleOptionsToggle}
            defaultToggled={advancedOptionsOpen}
          />
          <div className={style.OrderForm_Body__Fieldrow}>
            <Field
              name='orderType'
              component={SelectField}
              style={formStyle}
              labelStyle={formStyle}
              inputStyle={formStyle}
              floatingLabelFocusStyle={formStyle}
              errorStyle={formStyle}>
              <MenuItem value='buy' primaryText={renderFormattedMessage(messages.buy, {
                asset: renderFormattedMessage({ id: asset.name })
              })} />
              <MenuItem value='sell' primaryText={renderFormattedMessage(messages.sell, {
                asset: renderFormattedMessage({ id: asset.name })
              })} />
            </Field>
          </div>
          <div className={style.OrderForm_Body__Fieldrow}>
            <Field
              min={0}
              style={formStyle}
              inputStyle={formStyle}
              floatingLabelStyle={formStyle}
              errorStyle={formStyle}
              name='quantity'
              component={TextField}
              type='number'
              hintText={quantityLabel}
              errorText={validate.price}
              onChange={this.handleChangeFormValues}
              floatingLabelText={quantityLabel} />
          </div>
          <div className={style.OrderForm_Body__Fieldrow}>
            <Field
              min={0}
              style={formStyle}
              inputStyle={formStyle}
              floatingLabelStyle={formStyle}
              errorStyle={formStyle}
              name='price'
              component={TextField}
              type='number'
              hintText={priceLabel}
              errorText={validate.price}
              onChange={this.handleChangeFormValues}
              floatingLabelText={priceLabel} />
          </div>
          {feeField}
          <div className={style.OrderForm_Body__Fieldrow} style={{ marginTop: 20 }}>
            {totalLabel} <FormattedNumber value={this.props.total} maximumFractionDigits={8} /> {tokenName}
          </div>
          <div className={style.OrderForm_Body__Fieldrow} style={{ marginTop: 20 }}>
            {tokenPerAssetLabel} <FormattedNumber value={this.props.tokenPerAsset} maximumFractionDigits={8} />
            &nbsp;{renderFormattedMessage({ id: asset.name })}
          </div>

          <div className={style.OrderForm_Body__FieldrowSubmit}>
            <div className={style.OrderForm_Body__Clear}>
              <RaisedButton type='button'
                disabled={pristine || submitting}
                onClick={this.handleClearValues}
                label={renderFormattedMessage(messages.clear_values)} />
            </div>
            <div className={style.OrderForm_Body__Submit}>
              <RaisedButton type='button'
                disabled={pristine || submitting}
                onClick={this.handleConfirm}
                label={renderFormattedMessage(messages.confirm_order)}
                primary />
            </div>
          </div>
        </form>
        <OrderFormDialog
          open={this.props.orderDialogIsOpen}
          closeDialog={this.closeOrderDialog}
          values={this.props.orderValues}
          asset={asset.name}
          token={tokenName}
          total={this.props.total}
          step={this.state.step}
          onNextStep={this.onNextStep}
          onPrevStep={this.onPrevStep}
          postOrderError={this.props.postOrderError}
          postOrderSuccess={this.props.postOrderSuccess}
          submitSucceeded={this.props.submitSucceeded}
          handleSubmit={this.handleConfirmSubmit}
        />
      </div>
    )
  }
}

OrderForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired
}

const validate = (values, state) => {
  const errors = {}
  const minFee = convertDQTToDBN(minimumFee)
  if (!values.price) {
    errors.price = renderFormattedMessage(messages.number_error)
  }
  if (!values.quantity) {
    errors.quantity = renderFormattedMessage(messages.number_error)
  }
  if (values.fee < minFee) {
    errors.fee = renderFormattedMessage(messages.minimum_fee_error_description, {
      minimumFee: minFee,
      tokenName
    })
  }
  return errors
}

const onSubmit = () => {
}

export default reduxForm({
  form: 'orderForm',
  validate,
  onSubmit
})(OrderForm)
