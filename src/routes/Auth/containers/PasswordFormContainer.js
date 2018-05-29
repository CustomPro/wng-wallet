import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { changePassword, setPasswordStrength } from '../modules/Auth'

import PasswordForm from '../forms/PasswordForm'

const mapActionCreators = {
  changePassword,
  setPasswordStrength
}

const mapStateToProps = (state) => ({
  passwordStrength: state.auth.passwordStrength
})

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(PasswordForm))
