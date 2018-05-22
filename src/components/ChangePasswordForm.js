import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
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
import formStyle from 'routes/Auth/forms/RegisterForm.scss'
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye'

const messages = defineMessages({
  submit: {
    id: 'submit',
    defaultMessage: 'SUBMIT'
  },
  oldpassword: {
    id: 'oldpassword',
    defaultMessage: 'Old Password'
  },
  newpassword: {
    id: 'newpassword',
    defaultMessage: 'New Password'
  },
  confirmpassword: {
    id: 'confirmpassword',
    defaultMessage: 'Confirm Password'
  }
})


class ChangePasswordForm extends React.Component {
  constructor () {
    super()
    this.state = {
      passwordFieldType: 'password',
      confirmFieldType: 'password',
      confirm: false
    }
  }
   handleSubmit = (data) => {
 //   const { register } = this.props

  }

  render () {
    const { handleSubmit, invalid} = this.props
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <Field
          name='oldpassword'
          component={TextField}
          type={this.state.passwordFieldType}
          hintText={renderFormattedMessage(messages.oldpassword)}
          floatingLabelText={renderFormattedMessage(messages.oldpassword)}
          fullWidth />
        <div className={formStyle.viewPassword_button}
          ><ImageRemoveRedEye /></div>
       
        <br />
        <Field
          name='password'
          component={TextField}
          type={this.state.passwordFieldType}
          hintText={renderFormattedMessage(messages.newpassword)}
          floatingLabelText={renderFormattedMessage(messages.newpassword)}
          fullWidth />
        <div className={formStyle.viewPassword_button}
          ><ImageRemoveRedEye /></div>
       
        <br />
        <Field
          name='confirmPassword'
          component={TextField}
          type={this.state.confirmFieldType}
          hintText={renderFormattedMessage(messages.confirmpassword)}
          floatingLabelText={renderFormattedMessage(messages.confirmpassword)}
          fullWidth />
        <div className={formStyle.viewPassword_button}
          ><ImageRemoveRedEye /></div>
        <br />
        <br />
        <div>          
          <div className={formStyle.submitContainer}>
            <div className={formStyle.submitContainer_button}>
              <RaisedButton
                type='submit'
                primary
                label={renderFormattedMessage(messages.next_step)}
                disabled={invalid} />
            </div>
          </div>
        </div>
      </form>
    )
  }
}

ChangePasswordForm.propTypes = {
 
}

export default reduxForm({
  form: 'changepassword'
})(ChangePasswordForm)
