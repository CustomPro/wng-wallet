import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui'

import PageTitle from 'components/PageTitle'
import PasswordFormContainer from '../containers/PasswordFormContainer'
import { renderFormattedMessage } from 'redux/utils/intl'
const messages = defineMessages({
  changepassword: {
    id: 'changepassword',
    defaultMessage: 'Change Password'
  },
  changepassword_subtitle: {
    id: 'changepassword_subtitle',
    defaultMessage: 'Chagne password now'
  },
  invalid_username_email: {
    id: 'invalild_username_email',
    defaultMessage: 'Currently username, email and password are not matched.'
  }
})

export class Password extends React.Component {
  render () {
    const {
      registerError
    } = this.props
    return (
      <PageTitle pageName='changepassword'>
        <Row>
          <Col xs={12} sm={12} smOffset={12} md={12}>
            <Card>
              <CardTitle
                title={renderFormattedMessage(messages.changepassword)}
                subtitle={renderFormattedMessage(messages.changepassword_subtitle)} />
              <CardText>
                {registerError && <div style={{ color: 'red' }}>
                  {renderFormattedMessage(messages[registerError])}
                </div>}
                <PasswordFormContainer />
              </CardText>
            </Card>
          </Col>
        </Row>
      </PageTitle>
    )
  }
}

Password.propTypes = {
  intl: PropTypes.object.isRequired,
  registerError: PropTypes.string.isRequired
}

export default Password
