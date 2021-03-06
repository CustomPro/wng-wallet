import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui'

import PageTitle from 'components/PageTitle'
import RegisterFormContainer from '../containers/RegisterFormContainer'
import { renderFormattedMessage } from 'redux/utils/intl'
const messages = defineMessages({
  register: {
    id: 'register',
    defaultMessage: 'Register'
  },
  register_subtitle: {
    id: 'register_subtitle',
    defaultMessage: 'Register now'
  },
  screenshot_help: {
    id: 'screenshot_help',
    defaultMessage: 'Consider taking a ' +
    '<a href="http://www.howtogeek.com/205375/how-to-take-screenshots-on-almost-any-device/" ' +
    'target="_blank">screenshot</a> of your registration screen before submitting your data.'
  },
  username_email_exists: {
    id: 'username_email_exists',
    defaultMessage: 'This username or email already exists and cannot be used.'
  },
  incorrect_code: {
    id: 'incorrect_verify_code',
    defaultMessage: 'The verify code is incorrect. Please check your email again.'
  }
})

export class Register extends React.Component {
  render () {
    const {
      registerError,
      registerStep
    } = this.props

    return (
      <PageTitle pageName='register'>
        <Row>
          <Col xs={12} sm={12} smOffset={12} md={12}>
            <Card>
              <CardTitle
                title={renderFormattedMessage(messages.register)}
                subtitle={renderFormattedMessage(messages.register_subtitle)} />
              <CardText>
                {registerError && <div style={{ color: 'red' }}>
                  {renderFormattedMessage(messages[registerError])}
                </div>}
                <RegisterFormContainer registerStep={registerStep}/>
              </CardText>
            </Card>
          </Col>
        </Row>
      </PageTitle>
    )
  }
}

Register.propTypes = {
  intl: PropTypes.object.isRequired,
  registerError: PropTypes.string.isRequired,
  registerStep: PropTypes.number.isRequired
}

export default Register
