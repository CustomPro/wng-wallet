import React, { PropTypes } from 'react'
import { defineMessages, FormattedNumber } from 'react-intl'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui'
import { tokenName } from 'config.json'
import { renderFormattedMessage } from 'redux/utils/intl'

import LeaseBalanceFormContainer from '../containers/LeaseBalanceFormContainer'

const messages = defineMessages({
  lease_balance: {
    id: 'forging.lease_balance',
    defaultMessage: 'Lease Balance'
  },
  current_lease: {
    id: 'forging.current_lease',
    defaultMessage: 'Your balance is leased out to {account} until block {block}.'
  },
  lease_end: {
    id: 'forging.lease_end',
    defaultMessage: 'Estimated date for leasing to end:'
  },
  lease_out: {
    id: 'forging.lease_out',
    defaultMessage: 'You can lease out'
  },
  lease_success: {
    id: 'forging.lease_success',
    defaultMessage: 'Succesfully leased out your balance. The leased balance will become effective after one block.'
  },
  lease_error: {
    id: 'forging.lease_error',
    defaultMessage: 'The recipient needs at least one outgoing transaction before balance can be leased to it.'
  }
})

export class LeaseBalance extends React.Component {
  render () {
    const {
      numberOfBlocks,
      currentLesseeRS,
      currentLeasingHeightTo,
      guaranteedBalance,
      leaseBalanceSuccess,
      leaseBalanceError
    } = this.props

    let blockEstimationDate

    if (numberOfBlocks && currentLeasingHeightTo) {
      const blocksRemaining = currentLeasingHeightTo - numberOfBlocks
      const secondsRemaining = blocksRemaining * 60

      blockEstimationDate = new Date()
      blockEstimationDate.setSeconds(blockEstimationDate.getSeconds() + secondsRemaining)
    }

    return (
      <Card>
        <CardTitle
          title={renderFormattedMessage(messages.lease_balance)} />
        <CardText>
          {leaseBalanceSuccess && <div>
            {renderFormattedMessage(messages.lease_success)}
          </div>}
          {leaseBalanceError && <div style={{ color: 'red' }}>
            {renderFormattedMessage(messages.lease_error)}
          </div>}
          <br />
          <Row>
            <Col xs={12}>
              {currentLeasingHeightTo && <div>
                <p>
                  {renderFormattedMessage(messages.current_lease, {
                    account: currentLesseeRS,
                    block: currentLeasingHeightTo
                  })}
                </p>
                <p>
                  {renderFormattedMessage(messages.lease_end)}&nbsp;
                  <strong>{blockEstimationDate.toLocaleString()}</strong>.
                </p>
              </div>}
              {!currentLeasingHeightTo && !leaseBalanceSuccess && <div>
                {renderFormattedMessage(messages.lease_out)}
                &nbsp;<FormattedNumber value={guaranteedBalance} /> {tokenName}
                <LeaseBalanceFormContainer />
              </div>}
            </Col>
          </Row>
        </CardText>
      </Card>
    )
  }
}

LeaseBalance.propTypes = {
  intl: PropTypes.object.isRequired,
  numberOfBlocks: PropTypes.number.isRequired,
  currentLesseeRS: PropTypes.string,
  currentLeasingHeightTo: PropTypes.number,
  guaranteedBalance: PropTypes.string,
  leaseBalanceError: PropTypes.string,
  leaseBalanceSuccess: PropTypes.bool
}

export default LeaseBalance
