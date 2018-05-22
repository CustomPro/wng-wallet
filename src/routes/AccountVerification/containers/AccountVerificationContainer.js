import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import AccountVerification from '../components/AccountVerification'

const mapActionCreators = {
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(AccountVerification))
