import React, { PropTypes } from 'react'
import {
  RaisedButton
} from 'material-ui'
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { defineMessages, injectIntl } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import OutputIcon from 'material-ui/svg-icons/file/file-upload'
import style from '../components/AccountVerification.css'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import {
  verifyAccount,
  getVerification
} from 'routes/Auth/modules/Auth'

const messages = defineMessages({
  full_name: {
    id: 'account_verification_form.full_name',
    defaultMessage: 'Full Name'
  },
  address: {
    id: 'account_verification_form.address',
    defaultMessage: 'Address'
  },
  comments: {
    id: 'account_verification_form.comments',
    defaultMessage: 'Comments'
  },
  identity_proof: {
    id: 'account_verification_form.identity_proof',
    defaultMessage: 'Upload proof of identity'
  },
  identity_proof_example: {
    id: 'account_verification_form.identity_proof_example',
    defaultMessage: 'Proof of identity / passport'
  },
  address_proof: {
    id: 'account_verification_form.address_proof',
    defaultMessage: 'Upload proof of address'
  },
  clear: {
    id: 'account_verification_form.clear',
    defaultMessage: 'Clear'
  },
  submit: {
    id: 'account_verification_form.submit',
    defaultMessage: 'Submit'
  },
  application_processing: {
    id: 'account_verification_form.application_processing',
    defaultMessage: 'Your application is currently being processed'
  },
  application_rejected: {
    id: 'account_verification_form.application_rejected',
    defaultMessage: 'Your application has been rejected. Please reapply below.'
  },
  application_approved: {
    id: 'account_verification_form.application_approved',
    defaultMessage: 'Your application has been approved.'
  },
  required_field: {
    id: 'account_verification_form.required_field',
    defaultMessage: 'This field is required.'
  },
  application_acknowledgement: {
    id: 'account_verification_form.application_acknowledgement',
    defaultMessage: 'Thank you for your application. We will be in touch.'
  }
})

const dropzoneStyle = {
  height: 'auto',
  width: 'auto',
  cursor: 'pointer',
  border: 'none',
  display: 'inline-block'
}

export class AccountVerificationForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      identity_files: [],
      address_files: []
    }
  }

  componentDidMount () {
    const { getVerification, accountRS } = this.props
    getVerification(accountRS)
  }

  onIdentityDrop = (files) => {
    this.setState({
      identity_files: files
    })
  }

  onAddressDrop = (files) => {
    this.setState({
      address_files: files
    })
  }
  handleSubmit = () => {
    const {
      full_name,
      address,
      comments,
      accountRS,
      verifyAccount
    } = this.props
    const fields = { full_name, address, comments, accountRS }
    const { identity_files, address_files } = this.state
    const files = { identity_files, address_files }
    verifyAccount(fields, files)
  }

  renderForm = () => {
    const {
      handleSubmit,
      pristine,
      submitting,
      reset,
      invalid
    } = this.props
    let identityIsRequired
    let addressIsRequired
    let filesInvalid = true
    const { identity_files, address_files } = this.state
    const renderedIdentityFiles = identity_files.map((file) => {
      return (
        <div key={file.name} className={style.AccountVerificationForm_FileItem}>
          {file.name}
        </div>
      )
    })
    const renderedAddressFiles = address_files.map((file) => {
      return (
        <div key={file.name} className={style.AccountVerificationForm_FileItem}>
          {file.name}
        </div>
      )
    })
    if (!pristine) {
      if (identity_files.length === 0) {
        identityIsRequired = (
          <div className={style.AccountVerificationForm_FileValidation}>
            {renderFormattedMessage(messages.required_field)}
          </div>
        )
      }
      if (address_files.length === 0) {
        addressIsRequired = (
          <div className={style.AccountVerificationForm_FileValidation}>
            {renderFormattedMessage(messages.required_field)}
          </div>
        )
      }
      if (identity_files.length !== 0 && address_files.length !== 0) {
        filesInvalid = false
      }
    }

    const renderedForm = (
      <form encType='multipart/form-data'
        ref='accountVerification'
        onSubmit={handleSubmit(this.handleSubmit)}>
        <Field
          name='full_name'
          component={TextField}
          hintText={renderFormattedMessage(messages.full_name)}
          floatingLabelText={renderFormattedMessage(messages.full_name)}
          fullWidth />
        <Field
          name='address'
          multiLine
          rows={2}
          component={TextField}
          hintText={renderFormattedMessage(messages.address)}
          floatingLabelText={renderFormattedMessage(messages.address)}
          fullWidth />
        <Field
          name='comments'
          multiLine
          rows={2}
          component={TextField}
          hintText={renderFormattedMessage(messages.comments)}
          floatingLabelText={renderFormattedMessage(messages.comments)}
          fullWidth />
        <div>
          <br />
          <br />
          {renderedIdentityFiles}
          <Dropzone
            onDrop={this.onIdentityDrop}
            style={dropzoneStyle}>
            <RaisedButton
              name='identity-proof'
              secondary
              label={renderFormattedMessage(messages.identity_proof)}
              icon={<OutputIcon />}
             />
          </Dropzone>
          <br />
          <small style={{ marginTop: 5 }}>
            {renderFormattedMessage(messages.identity_proof_example)}
          </small>
          {identityIsRequired}
          <br />
          <br />
        </div>
        <div>
          {renderedAddressFiles}
          <Dropzone
            onDrop={this.onAddressDrop}
            name='address_upload'
            style={dropzoneStyle}>
            <RaisedButton
              secondary
              name='address-proof'
              label={renderFormattedMessage(messages.address_proof)}
              icon={<OutputIcon />}
            />
          </Dropzone>
          {addressIsRequired}
        </div>
        <div className={style.AccountVerificationForm_Body__FieldrowSubmit}>
          <div className={style.AccountVerificationForm_Body__Clear}>
            <RaisedButton type='button'
              disabled={pristine || submitting}
              onClick={reset}
              label={renderFormattedMessage(messages.clear)} />
          </div>
          <div className={style.AccountVerificationForm_Body__Submit}>
            <RaisedButton type='button'
              disabled={pristine || submitting || invalid || filesInvalid}
              onClick={this.handleSubmit}
              label={renderFormattedMessage(messages.submit)}
              primary />
          </div>
        </div>
      </form>
    )

    const formComplete = (
      <div>
        {renderFormattedMessage(messages.application_acknowledgement)}
      </div>
    )

    if (this.props.hasPostedVerification) {
      return formComplete
    } else {
      return renderedForm
    }
  }

  renderRejected () {
    return (
      <div>
        {renderFormattedMessage(messages.application_rejected)}
        {this.renderForm()}
      </div>
    )
  }

  renderApproved () {
    return (
      <div>
        {renderFormattedMessage(messages.application_approved)}
      </div>
    )
  }

  renderProcessing () {
    return (
      <div>
        {renderFormattedMessage(messages.application_processing)}
      </div>
    )
  }

  render () {
    let content
    const {
      hasVerificationApplication,
      currentVerificationApplication
    } = this.props
    if (hasVerificationApplication) {
      const { status } = currentVerificationApplication
      if (status === 'rejected') {
        content = this.renderRejected()
      } else if (status === 'approved') {
        content = this.renderApproved()
      } else {
        content = this.renderProcessing()
      }
    } else {
      content = this.renderForm()
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}

AccountVerificationForm.propTypes = {
  ...propTypes,
  intl: PropTypes.object.isRequired
}

const validate = (values, state) => {
  const errors = {}
  if (!values.full_name) {
    errors.full_name = renderFormattedMessage(messages.required_field)
  }
  if (!values.address) {
    errors.address = renderFormattedMessage(messages.required_field)
  }
  return errors
}

const selector = formValueSelector('accountVerification')
const mapStateToProps = (state) => {
  const { accountRS } = state.auth.account
  const { hasVerificationApplication,
  currentVerificationApplication,
  isPostingVerification,
  hasPostedVerification } = state.auth
  const {
    full_name,
    address,
    comments
  } = selector(state,
    'full_name', 'address', 'comments')

  return {
    full_name,
    address,
    comments,
    accountRS,
    hasVerificationApplication,
    currentVerificationApplication,
    isPostingVerification,
    hasPostedVerification
  }
}

const mapActionCreators = {
  verifyAccount,
  getVerification
}

const onSubmit = () => {
}

const AccountVerificationFormContainer = reduxForm({
  form: 'accountVerification',
  validate,
  onSubmit
})(AccountVerificationForm)

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(AccountVerificationFormContainer))
