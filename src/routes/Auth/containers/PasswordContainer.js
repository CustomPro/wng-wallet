import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import Password from '../components/Password'

const mapStateToProps = (state) => ({
  registerError: state.auth.registerError
})

export default connect(
  mapStateToProps
)(injectIntl(Password))
