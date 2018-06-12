import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import QRCode from 'qrcode.react'
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
import randomwords from 'random-words'


const messages = defineMessages({
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
  login: {
    id: 'login',
    defaultMessage: 'Login'
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
  },
  required_email: {
    id: 'required_email',
    defaultMessage: 'It is incorrect email address.'
  },
  verification_help: {
    id: 'verification_help',
    defaultMessage: 'Please enter verification code from your email.'
  },
  verification_code: {
    id:'verification_code',
    defaultMessage: 'Verification code'
  },
  resend_email: {
    id: 'resend_email',
    defaultMessage: 'Resend'
  },
  go_print: {
    id: 'go_print',
    defaultMessage: 'Print'
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

export class RegisterForm extends React.Component {
  constructor () {
    super()
    this.state = {
      passwordFieldType: 'password',
      confirmFieldType: 'password',
      secretPhraseFieldType: 'password',
      secretPhraseOption: 'random', // input_own, select_file
      step: 1,
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
    const jspdfscript = document.createElement('script')
    jspdfscript.src = 'https://unpkg.com/jspdf@latest/dist/jspdf.min.js'
    jspdfscript.async = true
    document.body.appendChild(jspdfscript)
    const canvasscript = document.createElement('script')
    canvasscript.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js'
    canvasscript.async = true
    document.body.appendChild(canvasscript)

  }

  componentWillReceiveProps = (nextProps) => {
        

    this.setState({
          step: nextProps.registerStep         
    })
    if(nextProps.registerStep === 3){
      const phrase = randomwords({exactly: 12, maxLength: 8, join: ' '})
      this.setState({
          secretPhrase: phrase
      })
    }

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
    if(value == 'random'){
      const phrase = randomwords({exactly: 12, maxLength: 8, join: ' '})
      this.setState({
        secretPhrase: phrase
      })

      
    }

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
    const { register } = this.props
    const { secretPhrase } = this.state
    data.secretPhrase = secretPhrase
    register(data)
  }

  handleEmailSubmit = (data) => {

    const { verifyEmail } = this.props
    verifyEmail(data)
  }

  handleCodeSubmit = (data) => {

    const { verifyCode } = this.props
    verifyCode(data)
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
    if (this.state.secretPhraseFieldType === 'password') {
      this.setState({ secretPhraseFieldType: 'text' })
    } else {
      this.setState({ secretPhraseFieldType: 'password' })
    }
  }

  goBack = (e) => {
    e.preventDefault()

    this.setState({
      step: this.state.step - 1
    })
  }

  printQRCode = () => {
    const input = document.getElementById('qrcodeDiv')
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'JPEG', 30, 30)
      pdf.save('QRCode.pdf')
    })

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
      <form onSubmit={handleSubmit(this.handleEmailSubmit)}>
        <strong>{renderFormattedMessage(messages.registration_help)}</strong>
        <br />
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
              label={renderFormattedMessage(messages.next_step)}
              disabled={invalid} />
          </div>
          <div className={style.submitContainer_button}>
            <Link to='login'>
              <FlatButton label={renderFormattedMessage(messages.login)} />
            </Link>
          </div>
        </div>
      </form>
    )
  }

  renderStepTwo = () => {
    const {
      handleSubmit,
      invalid
    } = this.props

    return (
      <form onSubmit={handleSubmit(this.handleCodeSubmit)}>
        <strong>{renderFormattedMessage(messages.verification_help)}</strong>
        <br />
        <Field
          name='code'
          component={TextField}
          hintText={renderFormattedMessage(messages.verification_code)}
          floatingLabelText={renderFormattedMessage(messages.verification_code)}
          fullWidth />
        <br />
        <div className={style.submitContainer}>
          <div className={style.submitContainer_button}>
            <RaisedButton
              type='submit'
              primary
              label={renderFormattedMessage(messages.next_step)}
              disabled={invalid} />
            <RaisedButton
              secondary
              label={renderFormattedMessage(messages.resend_email)}
              onClick={handleSubmit(this.handleEmailSubmit)}
              style={{ marginLeft: 10 }}
              />
          </div>
          <div className={style.submitContainer_button}>
            <Link to='login'>
              <FlatButton label={renderFormattedMessage(messages.login)} />
            </Link>
          </div>
        </div>
      </form>
    )
  }

  renderStepThree = () => {
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
            selected='false'
            value='random'
            label={renderFormattedMessage(messages.random_secretPhrase)} />
          <RadioButton
            selected='false'
            value='select_file'
            label={renderFormattedMessage(messages.select_file_secretPhrase)} />
          <RadioButton
            selected='false'
            value='input_own'
            label={renderFormattedMessage(messages.input_own_secretPhrase)} />
        </RadioButtonGroup>
        <br />
        {secretPhraseOption === 'random' && secretPhrase  && <div id='qrcodeDiv'>
          <h3>Secret phrase</h3>
          <span>
            {secretPhrase}
          </span>
          <h3>QR</h3>
          <div>
            <QRCode value={secretPhrase} />
          </div>
        </div>}      
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
            {secretPhraseOption === 'random' && secretPhrase  && <RaisedButton
              secondary
              label={renderFormattedMessage(messages.go_print)}
              onClick={this.printQRCode}
              style={{ marginLeft: 10 }}
              />}
          </div>
          <div className={style.submitContainer_button}>
            <Link to='login'>
              <FlatButton label={renderFormattedMessage(messages.login)} />
            </Link>
          </div>
        </div>
      </form>
    )
  }


  render () {

    const { step } = this.state

    if (step === 3) {
      return this.renderStepThree()
    } else if(step === 2) {
      return this.renderStepTwo()
    }

    return this.renderStepOne()
  }
}

RegisterForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired,
  setPasswordStrength: PropTypes.func.isRequired,
  passwordStrength: PropTypes.number.isRequired,

}

const validate = (values, state) => {
  const errors = {}

  const requiredErrorText = renderFormattedMessage(messages.required_error)
  const requiredCorrectEmail = renderFormattedMessage(messages.required_email)

  if (!values.username) {
    errors.username = requiredErrorText
  }

  if (!values.email) {
    errors.email = requiredErrorText
  }
 
  if (!values.password) {
    errors.password = requiredErrorText
  }

  if (values.password !== values.confirmPassword) {
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
})(RegisterForm)
