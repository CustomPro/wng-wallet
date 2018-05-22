import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText,
  Snackbar
} from 'material-ui'

import PageTitle from 'components/PageTitle'
import LoginFormContainer from '../containers/LoginFormContainer'
import { renderFormattedMessage } from 'redux/utils/intl'
import { tokenName } from 'config.json'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'
import QrReaderDialog from 'components/QrReader/QrReaderDialog'

const messages = defineMessages({
  admin_login: {
    id: 'admin_login',
    defaultMessage: 'Admin login'
  },
  login: {
    id: 'login',
    defaultMessage: 'Login'
  },
  login_subtitle: {
    id: 'login_subtitle',
    defaultMessage: 'Login into {website_name} now'
  },
  successfully_registered: {
    id: 'successfully_registered',
    defaultMessage: 'Successfully registered your account. You can now login.'
  },
  connection_error: {
    id: 'connection_error',
    defaultMessage: 'Could not connect. Please try again later'
  },
  could_not_decrypt: {
    id: 'could_not_decrypt',
    defaultMessage: 'We could not log you in with this information'
  },
  could_not_find_secretphrase: {
    id: 'could_not_find_secretphrase',
    defaultMessage: 'Your username and / or email does not exist, we could not find the secretphrase.'
  },
  is_not_admin: {
    id: 'login.is_not_admin',
    defaultMessage: 'You do not have sufficient permissions to access this page.'
  },
  username_email_exists: {
    id: 'username_email_exists',
    defaultMessage: 'This username or email already exists and cannot be used.'
  },
  website_name: {
    id: 'website_name',
    defaultMessage: 'DBN Wallet'
  }
})

export class Login extends React.Component {
  render () {
    const {
      loginError,
      registerSuccess,
      connectionError,
      intl: {
        formatMessage
      }
    } = this.props

    const isAdmin = window.location.pathname.includes('/admin')
    const pageName = isAdmin ? 'admin_login' : 'login'
    const pageTitle = isAdmin ? formatMessage(messages.admin_login) : formatMessage(messages.login)
    const adminMessage = renderFormattedMessage(messages[pageName])

    const openSnackbar = registerSuccess || connectionError
    let snackbarMessage
    if (registerSuccess) {
      snackbarMessage = renderFormattedMessage(messages.successfully_registered)
    } else {
      snackbarMessage = renderFormattedMessage(messages.connection_error)
    }
    const websiteName = renderFormattedMessage(messages.website_name, { currency: tokenName })
    let renderedLogo
    if (CustomTheme.logo && CustomTheme.logoImage) {
      let centeredStyle
      if (CustomTheme.centeredLogo) {
        centeredStyle = { textAlign: 'center' }
      }
      renderedLogo = (
        <div style={centeredStyle}>
          <img src={CustomTheme.logoImage} style={{ maxWidth: 200 }} />
        </div>
      )
    }

    return (
      <PageTitle pageName={pageTitle}>
        <Row>
          <Col xs={12} sm={12} md={12}>
            <Card>
              <CardTitle
                title={adminMessage}
                subtitle={renderFormattedMessage(messages.login_subtitle, { website_name: websiteName })} />
              <CardText>
                {renderedLogo}
                {loginError && <div style={{ color: 'red' }}>
                  {renderFormattedMessage(messages[loginError])}
                </div>}
                {registerSuccess && <div>
                  {renderFormattedMessage(messages.successfully_registered)}
                </div>}
                <LoginFormContainer isAdmin={isAdmin} />
              </CardText>
            </Card>
          </Col>
        </Row>
        <Snackbar
          open={openSnackbar}
          message={snackbarMessage}
        />
      </PageTitle>
    )
  }
}

Login.propTypes = {
  intl: PropTypes.object.isRequired,
  loginError: PropTypes.string.isRequired,
  registerSuccess: PropTypes.bool.isRequired,
  connectionError: PropTypes.bool.isRequired
}

export default Login
