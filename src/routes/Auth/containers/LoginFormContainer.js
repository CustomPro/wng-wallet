import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import {
  login,
  toggleImportBackup,
  setBackupFile,
  verifyMessage
} from '../modules/Auth'

import LoginForm from '../forms/LoginForm'

const mapActionCreators = {
  login,
  toggleImportBackup,
  setBackupFile,
  verifyMessage
}

const mapStateToProps = (state) => ({
  initialValues: {
    username: state.auth.username,
    email: state.auth.email
  },
  importBackup: state.auth.importBackup
})

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(LoginForm))
