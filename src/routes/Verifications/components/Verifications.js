import React, { PropTypes } from 'react'
import VerificationsTableContainer from '../components/VerificationsTableContainer'
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui'
import PageTitle from 'components/PageTitle'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import AccountDialog from 'components/AccountInformation/AccountDialog'

const messages = defineMessages({
  title: {
    id: 'verifications.title',
    defaultMessage: 'Account Verification Applications'
  },
  subtitle: {
    id: 'verifications.subtitle',
    defaultMessage: 'List of applications'
  },
  account: {
    id: 'account',
    defaultMessage: 'Account'
  }
})

export class Verifications extends React.Component {

  render () {
    const { formatMessage } = this.props.intl
    return (
      <PageTitle pageName='verifications'>
        <Card>
          <CardTitle
            title={renderFormattedMessage(messages.title)}
            subtitle={renderFormattedMessage(messages.subtitle)} />
          <CardText>
            <VerificationsTableContainer
              openAccountDialog={this.props.openAccountDialog}
              closeAccountDialog={this.props.closeAccountDialog}
            />
            <AccountDialog title={formatMessage(messages.account)}
              account={this.props.accountInformationId}
              show={this.props.accountDialogIsOpen}
              closeDialog={this.props.closeAccountDialog}
              asset={this.props.asset} />
          </CardText>
        </Card>
      </PageTitle>
    )
  }
}

Verifications.propTypes = {
  intl: PropTypes.object,
  accountInformationId: PropTypes.string,
  accountDialogIsOpen: PropTypes.bool,
  closeAccountDialog: PropTypes.func,
  asset: PropTypes.object
}

export default Verifications
