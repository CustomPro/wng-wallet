import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import Login from '../components/Login'

import {
  openQrReaderDialog,
  closeQrReaderDialog
} from 'redux/modules/qrreader'

const mapActionCreators = {
  openQrReaderDialog,
  closeQrReaderDialog
}

const mapStateToProps = (state) => ({
  registerSuccess: state.auth.registerSuccess,
  loginError: state.auth.loginError,
  connectionError: state.site.connectionError,
  qrDialogIsOpen: state.qrreader.qrDialogIsOpen,
  loginStep: state.auth.loginStep
})

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Login))
