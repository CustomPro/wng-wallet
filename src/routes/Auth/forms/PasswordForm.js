import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { reduxForm, Field, propTypes } from 'redux-form'
import {
  Checkbox,
  RaisedButton,
  LinearProgress,
  FlatButton,
  RadioButtonGroup,
  RadioButton
} from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye'


const messages = defineMessages({
  username: {
    id: 'username',
    defaultMessage: 'Username'
  },
  email: {
    id: 'email',
    defaultMessage: 'Email'
  },
  newpassword: {
    id: 'newpassword',
    defaultMessage: 'New Password'
  },
  oldpassword: {
    id: 'oldpassword',
    defaultMessage: 'Currently Password'
  },
  strength: {
    id: 'strength',
    defaultMessage: 'Strength:'
  },
  password_strength_0: {
    id: 'password_strength_0',
    defaultMessage: 'Weak'
  },
  password_strength_1: {
    id: 'password_strength_1',
    defaultMessage: 'Okay'
  },
  password_strength_2: {
    id: 'password_strength_2',
    defaultMessage: 'Good'
  },
  password_strength_3: {
    id: 'password_strength_3',
    defaultMessage: 'Strong'
  },
  password_strength_4: {
    id: 'password_strength_4',
    defaultMessage: 'Great'
  },
  confirm_password: {
    id: 'confirm_password',
    defaultMessage: 'Confirm password'
  },
  submit: {
    id: 'submit',
    defaultMessage: 'Submit'
  },
  canchel: {
    id: 'canchel',
    defaultMessage: 'Canchel'
  },
  required_error: {
    id: 'required_error',
    defaultMessage: 'This field is required'
  },
  passwords_should_equal: {
    id: 'passwords_should_equal',
    defaultMessage: 'Passwords should be the same in both fields'
  },
  next_step: {
    id: 'next_step',
    defaultMessage: 'Next Step'
  },
  go_back: {
    id: 'go_back',
    defaultMessage: 'Go Back'
  },
  registration_help: {
    id: 'registration_help',
    defaultMessage: 'For security reasons, the username and password you are about to choose ' +
    'can not be modified later, and can not be recovered if you lose them.'
  },
  secretPhrase_help: {
    id: 'secretPhrase_help',
    defaultMessage: 'Select your secretphrase option'
  },
  random_secretPhrase: {
    id: 'random_secretPhrase',
    defaultMessage: 'Generate random secretphrase (recommended)'
  },
  select_file_secretPhrase: {
    id: 'select_file_secretPhrase',
    defaultMessage: 'Select unencrypted backup file'
  },
  input_own_secretPhrase: {
    id: 'input_own_secretPhrase',
    defaultMessage: 'Input your own secretphrase'
  },
  confirm_information: {
    id: 'confirm_information',
    defaultMessage: 'I confirm that all information is correct and ' +
    'I acknowledge that I can\'t retrieve my username and password if it\'s lost'
  },
  choose_file: {
    id: 'choose_file',
    defaultMessage: 'Choose file'
  }
})

import style from './RegisterForm.scss'
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

export class PasswordForm extends React.Component {
  constructor () {
    super()
    this.state = {
      oldPasswordFieldType: 'password',
      passwordFieldType: 'password',
      confirmFieldType: 'password',
      secretPhraseFieldType: 'password',
      step: 1,
      secretPhraseOption: 'random', // input_own, select_file
      secretPhrase: null,
      file: null,
      confirm: false
    }
  }

  componentWillMount () {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.3.0/zxcvbn.js'
    script.async = true

    document.body.appendChild(script)
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.fields && this.props.fields.password &&
      this.props.fields.password !== nextProps.fields.password) {
      try {
        const { setPasswordStrength } = this.props
        const { value } = nextProps.fields.password
        setPasswordStrength(zxcvbn(value).score) // eslint-disable-line
      } catch (e) {
        console.log(e)
      }
    }
  }

  _onOptionChange = (e, value) => {
    this.setState({
      secretPhraseOption: value,
      secretPhrase: null
    })
  }

  _onInputChange = (e, value) => {
    this.setState({
      secretPhrase: value
    })
  }

  _onConfirm = (e, value) => {
    this.setState({
      confirm: value
    })
  }

  _handleFile = (e) => {
    try {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = (e) => {
        const { result } = e.target
        const parsed = JSON.parse(result)
        if (parsed && parsed.secretPhrase) {
          this.setState({
            secretPhrase: parsed.secretPhrase,
            file: file
          })
        }
      }
      reader.readAsText(file)
    } catch (e) {
      console.log(e)
    }
  }

  handleSubmit = (data) => {
    const { changePassword } = this.props
    changePassword(data)
  }

  handleViewOldPassword = () => {
    if (this.state.oldPasswordFieldType === 'password') {
      this.setState({ oldPasswordFieldType: 'text' })
    } else {
      this.setState({ oldPasswordFieldType: 'password' })
    }
  }

  handleViewPassword = () => {
    if (this.state.passwordFieldType === 'password') {
      this.setState({ passwordFieldType: 'text' })
    } else {
      this.setState({ passwordFieldType: 'password' })
    }
  }

  handleViewConfirm = () => {
    if (this.state.confirmFieldType === 'password') {
      this.setState({ confirmFieldType: 'text' })
    } else {
      this.setState({ confirmFieldType: 'password' })
    }
  }

  handleViewSecretPhrase = () => {
    console.log(this.state.secretPhraseFieldType)
    if (this.state.secretPhraseFieldType === 'password') {
      this.setState({ secretPhraseFieldType: 'text' })
    } else {
      this.setState({ secretPhraseFieldType: 'password' })
    }
  }


  renderStepOne = () => {
    const {
      handleSubmit,
      passwordStrength,
      invalid
    } = this.props

    const passwordStrengthString = `password_strength_${passwordStrength}`

    const getPasswordStrengthColor = (strength) => {
      switch (strength) {
        case 0:
          return 'red'
        case 1:
          return 'orange'
        case 2:
        case 3:
        case 4:
        default:
          return 'green'
      }
    }

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
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
          name='oldpassword'
          component={TextField}
          type={this.state.oldPasswordFieldType}
          hintText={renderFormattedMessage(messages.oldpassword)}
          floatingLabelText={renderFormattedMessage(messages.oldpassword)}
          fullWidth />
        <div className={style.viewPassword_button}
          onClick={this.handleViewOldPassword}><ImageRemoveRedEye /></div>
        <br />
        <Field
          name='newpassword'
          component={TextField}
          type={this.state.passwordFieldType}
          hintText={renderFormattedMessage(messages.newpassword)}
          floatingLabelText={renderFormattedMessage(messages.newpassword)}
          fullWidth />
        <div className={style.viewPassword_button}
          onClick={this.handleViewPassword}><ImageRemoveRedEye /></div>
        <LinearProgress
          mode='determinate'
          value={Number(passwordStrength * 25)}
          color={getPasswordStrengthColor(passwordStrength)} />
        <small>
          {renderFormattedMessage(messages.strength)}
          {renderFormattedMessage(messages[passwordStrengthString])}
        </small>
        <br />
        <Field
          name='confirmPassword'
          component={TextField}
          type={this.state.confirmFieldType}
          hintText={renderFormattedMessage(messages.confirm_password)}
          floatingLabelText={renderFormattedMessage(messages.confirm_password)}
          fullWidth />
        <div className={style.viewPassword_button}
          onClick={this.handleViewConfirm}><ImageRemoveRedEye /></div>
        <br />
        <br />
        <div className={style.submitContainer}>
          <div className={style.submitContainer_button}>
            <RaisedButton
              type='submit'
              primary
              label={renderFormattedMessage(messages.submit)}
              disabled={invalid} />
          </div>
          <div className={style.submitContainer_button}>
            <Link to='/'>
              <FlatButton label={renderFormattedMessage(messages.canchel)} />
            </Link>
          </div>
        </div>
      </form>
    )
  }

/*  renderStepTwo = () => {
    const { handleSubmit, invalid } = this.props
    const { secretPhraseOption, secretPhrase, confirm, file } = this.state

    let disableSubmit = false
    if (secretPhraseOption === 'select_file' && !secretPhrase) {
      disableSubmit = true
    }

    if (secretPhraseOption === 'input_own' && !secretPhrase) {
      disableSubmit = true
    }

    if (!confirm) {
      disableSubmit = true
    }

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <strong>{renderFormattedMessage(messages.secretPhrase_help)}</strong>
        <RadioButtonGroup
          name='secretPhraseOption'
          onChange={this._onOptionChange}
          defaultSelected={this.state.secretPhraseOption}>
          <RadioButton
            value='random'
            label={renderFormattedMessage(messages.random_secretPhrase)} />
          <RadioButton
            value='select_file'
            label={renderFormattedMessage(messages.select_file_secretPhrase)} />
          <RadioButton
            value='input_own'
            label={renderFormattedMessage(messages.input_own_secretPhrase)} />
        </RadioButtonGroup>
        <br />
                 
        {secretPhraseOption === 'select_file' && <div>
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
        {secretPhraseOption === 'input_own' && <div>
          <TextField
            onChange={this._onInputChange}
            hintText={renderFormattedMessage(messages.input_own_secretPhrase)}
            floatingLabelText={renderFormattedMessage(messages.input_own_secretPhrase)}
            type={this.state.secretPhraseFieldType}
            fullWidth />
          <div className={style.viewPassword_button}
            onClick={this.handleViewSecretPhrase}><ImageRemoveRedEye /></div>
        </div>}

        <br />
        <Checkbox
          label={renderFormattedMessage(messages.confirm_information)}
          onCheck={this._onConfirm}
          checked={confirm}
        />
        <div className={style.submitContainer}>
          <div className={style.submitContainer_button}>
            <RaisedButton
              type='submit'
              primary
              label={renderFormattedMessage(messages.submit)}
              disabled={invalid || disableSubmit} />
            <RaisedButton
              secondary
              label={renderFormattedMessage(messages.go_back)}
              onClick={this.goBack}
              style={{ marginLeft: 10 }}
              />
          </div>
          <div className={style.submitContainer_button}>
            <Link to='/'>
              <FlatButton label={renderFormattedMessage(messages.canchel)} />
            </Link>
          </div>
        </div>
      </form>
    )
  }
*/
  render () {    
      return this.renderStepOne()   
  }
}

PasswordForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  setPasswordStrength: PropTypes.func.isRequired,
  passwordStrength: PropTypes.number.isRequired
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

  if (!values.oldpassword) {
    errors.oldpassword = requiredErrorText
  }

  if (!values.newpassword) {
    errors.newpassword = requiredErrorText
  }

  if (values.newpassword !== values.confirmPassword) {
    errors.confirmPassword = renderFormattedMessage(messages.passwords_should_equal)
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = requiredErrorText
  }

  return errors
}

export default reduxForm({
  form: 'login',
  validate
})(PasswordForm)
