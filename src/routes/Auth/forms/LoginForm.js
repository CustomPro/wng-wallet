import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field, propTypes } from 'redux-form'
import { Checkbox, RaisedButton, FlatButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye'

const messages = defineMessages({
  secretPhrase: {
    id: 'secretPhrase',
    defaultMessage: 'Secret phrase'
  },
  username: {
    id: 'username',
    defaultMessage: 'Username'
  },
  email: {
    id: 'email',
    defaultMessage: 'Email'
  },
  password: {
    id: 'password',
    defaultMessage: 'Password'
  },
  import_backup: {
    id: 'import_backup',
    defaultMessage: 'Restore wallet'
  },
  submit: {
    id: 'submit',
    defaultMessage: 'Submit'
  },
  register: {
    id: 'register',
    defaultMessage: 'Register'
  },
  required_error: {
    id: 'required_error',
    defaultMessage: 'This field is required'
  },
  login_normal: {
    id: 'login_normal',
    defaultMessage: 'Login with an account'
  },
  login_secret_phrase: {
    id: 'login_secret_phrase',
    defaultMessage: 'Login with a secret phrase'
  },
  choose_file: {
    id: 'choose_file',
    defaultMessage: 'Choose file'
  }
})

import style from './LoginForm.scss'
const styles = {
  uploadButton: {
    verticalAlign: 'middle'
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  }
}

export class LoginForm extends React.Component {
  constructor () {
    super()

    this.state = {
      secretPhraseLogin: false,
      passwordFieldType: 'password',
      secretPhraseFieldType: 'password',
      file: null
    }
  }

  _toggleSecretPhraseLogin = () => {
    this.setState({
      secretPhraseLogin: !this.state.secretPhraseLogin
    })
  }

  _handleFile = (e) => {
    try {
      const { login, setBackupFile } = this.props
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = (e) => {
        const { result } = e.target
        console.log(result)
        try {
          const parsed = JSON.parse(result)
          console.log(parsed)
          if (parsed && parsed.secretPhrase) {
            login({
              secretPhraseLogin: true,
              secretPhrase: parsed.secretPhrase
            })
          } else {
            setBackupFile(parsed)
            this.setState({
              file
            })
          }
        } catch (e) {}
      }

      reader.readAsText(file)
    } catch (e) {}
  }

  _onImportCheck = () => {
    const { toggleImportBackup } = this.props
    toggleImportBackup()
  }

  handleSubmit = (data) => {
    const { isAdmin, login } = this.props
    const { secretPhraseLogin } = this.state
    data.isAdmin = isAdmin
    data.secretPhraseLogin = secretPhraseLogin
    login(data)
  }

  handleViewPassword = () => {
    if (this.state.passwordFieldType === 'password') {
      this.setState({ passwordFieldType: 'text' })
    } else {
      this.setState({ passwordFieldType: 'password' })
    }
  }

  handleViewSecretPhrase = () => {
    if (this.state.secretPhraseFieldType === 'password') {
      this.setState({ secretPhraseFieldType: 'text' })
    } else {
      this.setState({ secretPhraseFieldType: 'password' })
    }
  }

  render () {
    const {
      importBackup,
      handleSubmit,
      invalid
    } = this.props
    const { file } = this.state
    const { secretPhraseLogin } = this.state
   
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        {secretPhraseLogin
          ? <div>
            <Field
              name='secretPhrase'
              component={TextField}
              type={this.state.secretPhraseFieldType}
              hintText={renderFormattedMessage(messages.secretPhrase)}
              floatingLabelText={renderFormattedMessage(messages.secretPhrase)}
              fullWidth />
            <div className={style.viewPassword_button}
              onClick={this.handleViewSecretPhrase}><ImageRemoveRedEye /></div>
          </div>
          : <div>
            <Field
              name='username'
              component={TextField}
              hintText={renderFormattedMessage(messages.username)}
              floatingLabelText={renderFormattedMessage(messages.username)}
              fullWidth />
            <br />
            <Field
              name='email'
              component={TextField}
              hintText={renderFormattedMessage(messages.email)}
              floatingLabelText={renderFormattedMessage(messages.email)}
              fullWidth />
            <br />
            <Field
              name='password'
              component={TextField}
              type={this.state.passwordFieldType}
              hintText={renderFormattedMessage(messages.password)}
              floatingLabelText={renderFormattedMessage(messages.password)}
              fullWidth />
            <div className={style.viewPassword_button}
              onClick={this.handleViewPassword}><ImageRemoveRedEye /></div>
            <br />
            <br />

            <Checkbox
              label={renderFormattedMessage(messages.import_backup)}
              defaultChecked={importBackup}
              onCheck={this._onImportCheck} />
            <br />
            {importBackup && <div>
              <FlatButton
                label={renderFormattedMessage(messages.choose_file)}
                labelPosition='before'
                style={styles.uploadButton}
                containerElement='label'>
                <input
                  onChange={this._handleFile}
                  type='file'
                  style={styles.uploadInput} />
              </FlatButton>
              {file && file.name}
            </div>}
          </div>}
        <div className={style.submitContainer}>
          <div className={style.submitContainer_button}>
            <RaisedButton
              type='submit'
              primary
              label={renderFormattedMessage(messages.submit)}
              disabled={invalid} />
          </div>
          <div className={style.submitContainer_button}>
            {secretPhraseLogin
              ? <FlatButton onClick={this._toggleSecretPhraseLogin}
                label={renderFormattedMessage(messages.login_normal)} />
              : <FlatButton onClick={this._toggleSecretPhraseLogin}
                label={renderFormattedMessage(messages.login_secret_phrase)} />
            }
          </div>
          <div className={style.submitContainer_button}>
            <Link to='register'>
              <FlatButton label={renderFormattedMessage(messages.register)} />
            </Link>
          </div>
        </div>
      </form>
    )
  }
}

LoginForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  toggleImportBackup: PropTypes.func.isRequired,
  setBackupFile: PropTypes.func.isRequired,
  importBackup: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool
}

const validate = (values, state) => {
  const errors = {}

  const requiredErrorText = renderFormattedMessage(messages.required_error)

  if (!values.username) {
    errors.username = requiredErrorText
  }

  if (!values.email) {
    errors.email = requiredErrorText
  }

  if (!values.password) {
    errors.password = requiredErrorText
  }

  return errors
}

export default reduxForm({
  form: 'login',
  validate
})(LoginForm)
