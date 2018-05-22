import React, { PropTypes } from 'react'
import { defineMessages, FormattedNumber } from 'react-intl'
import { reduxForm, Field, propTypes } from 'redux-form'
import { Row, Col } from 'react-flexbox-grid'
import { RaisedButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'

import ForgerNodeMenu from '../components/ForgerNodeMenu'

import formStyle from 'components/Form.scss'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  is_forging: {
    id: 'is_forging',
    defaultMessage: 'Forging'
  },
  stop_forging: {
    id: 'stop_forging',
    defaultMessage: 'Stop Forging'
  },
  start_forging: {
    id: 'start_forging',
    defaultMessage: 'Start Forging'
  },
  manual_forging_node: {
    id: 'manual_forging_node',
    defaultMessage: 'Input forging node URL manually'
  },
  forging_balance: {
    id: 'forging_balance',
    defaultMessage: 'Balance available for forging:'
  }
})

export class ForgingForm extends React.Component {
  handleSubmit = (data) => {
    const { status, stopForging, startForging } = this.props
    if (status === 'is_forging') {
      return stopForging(data)
    }
    return startForging(data)
  }

  render () {
    const {
      handleSubmit,
      setForgerNode,
      nodes,
      status,
      effectiveBalanceDBN,
      coinName,
      defaultNode,
      formValues,
      invalid
    } = this.props

    let effectiveBalance

    if (effectiveBalanceDBN === undefined) {
      effectiveBalance = 0
    } else {
      effectiveBalance = effectiveBalanceDBN
    }

    const disableButton = invalid || effectiveBalance < 2000
    const buttonText = status === 'is_forging'
      ? renderFormattedMessage(messages.stop_forging)
      : renderFormattedMessage(messages.start_forging)

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <Row>
          <Col xs={12} md={6}>
            <ForgerNodeMenu
              onChange={setForgerNode}
              selectedNode={formValues ? formValues.node : defaultNode}
              nodes={nodes} />
          </Col>
          <Col xs={12} md={6}>
            <Field
              name='node'
              component={TextField}
              floatingLabelText={renderFormattedMessage(messages.manual_forging_node)}
              fullWidth />
          </Col>
        </Row>
        <br />
        <br />
        <div>
          <div>
            {renderFormattedMessage(messages.forging_balance)}&nbsp;
            <FormattedNumber value={effectiveBalance} /> {coinName}
          </div>
          <div className={formStyle.actions} style={{ paddingTop: 10 }}>
            <RaisedButton
              type='submit'
              primary
              label={buttonText}
              disabled={Boolean(disableButton)} />
          </div>
        </div>
      </form>
    )
  }
}

ForgingForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  formValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  startForging: PropTypes.func.isRequired,
  stopForging: PropTypes.func.isRequired,
  setForgerNode: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  effectiveBalanceDBN: PropTypes.number,
  coinName: PropTypes.string.isRequired
}

const validate = (values, state) => {
  const { formatMessage } = state.intl
  const errors = {}

  if (!values.node) {
    errors.node = formatMessage({ id: 'required_error' })
  }

  return errors
}

export default reduxForm({
  form: 'forging',
  validate
})(ForgingForm)
