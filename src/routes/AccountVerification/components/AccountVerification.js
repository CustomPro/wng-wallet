import React, { PropTypes } from 'react'
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui'
import PageTitle from 'components/PageTitle'
import AccountVerificationForm from '../forms/AccountVerificationForm'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  account_verification_title: {
    id: 'account_verification.account_verification_title',
    defaultMessage: 'Account Verification'
  }
})

export class AccountVerification extends React.Component {

  render () {
    return (
      <PageTitle pageName='account-verification'>
        <Card>
          <CardTitle
            title={renderFormattedMessage(messages.account_verification_title)} />
          <CardText>
            <AccountVerificationForm intl={this.props.intl} />
          </CardText>
        </Card>
      </PageTitle>
    )
  }
}

AccountVerification.propTypes = {
  intl: PropTypes.object
}

export default AccountVerification
