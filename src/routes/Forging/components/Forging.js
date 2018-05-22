import React, { PropTypes } from 'react'
import { defineMessages, FormattedNumber } from 'react-intl'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { tokenName } from 'config.json'

import PageTitle from 'components/PageTitle'
import ForgingFormContainer from '../containers/ForgingFormContainer'
import ForgingStatus from './ForgingStatus'
import LeaseBalanceContainer from '../containers/LeaseBalanceContainer'

const messages = defineMessages({
  forging: {
    id: 'forging',
    defaultMessage: 'Forging'
  },
  total_earned_forging: {
    id: 'total_earned_forging',
    defaultMessage: 'Total earned from forging:'
  },
  forging_explanation: {
    id: 'forging_explanation',
    defaultMessage: 'Forging is used to validate transactions. ' +
    'Each time you forge you create a new block which allows you to collect ' +
    'all transaction fees in this block. If there are no transactions in a block ' +
    'you will get no fees. The more {tokenName} you have, the higher chance of forging a block.' +
    ' To forge you must have had a minimum of 2,000 {tokenName} in your account for at least 1 day.'
  },
  warning: {
    id: 'warning',
    defaultMessage: 'WARNING:'
  },
  forging_help: {
    id: 'forging_help',
    defaultMessage: 'Submitting this form will send your private key to the specified node.'
  }
})

export class Forging extends React.Component {
  render () {
    const {
      status,
      getForging,
      node,
      forgedBalance
    } = this.props

    return (
      <PageTitle pageName='forging'>
        <Card>
          <CardTitle
            title={renderFormattedMessage(messages.forging)} />
          <CardText>
            <Row>
              <Col xs={12} md={12}>
                <p>
                  <strong>{renderFormattedMessage(messages.total_earned_forging)}&nbsp;</strong>
                  <FormattedNumber value={forgedBalance} />&nbsp;{tokenName}
                </p>
                <ForgingStatus status={status} node={node} getForging={getForging} />
                <div style={{ marginTop: 10 }}>
                  {renderFormattedMessage(messages.forging_explanation, { tokenName })}
                  <p style={{ color: 'red' }}>
                    {renderFormattedMessage(messages.warning)}&nbsp;
                    {renderFormattedMessage(messages.forging_help)}
                  </p>
                </div>
                <ForgingFormContainer />
              </Col>
            </Row>
          </CardText>
        </Card>
        <Row style={{ marginTop: 24 }}>
          <Col xs={12}>
            <LeaseBalanceContainer />
          </Col>
        </Row>
      </PageTitle>
    )
  }
}

Forging.propTypes = {
  intl: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  node: PropTypes.string.isRequired,
  getForging: PropTypes.func.isRequired,
  forgedBalance: PropTypes.string.isRequired
}

export default Forging
