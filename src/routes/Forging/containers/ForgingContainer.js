import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import { getForging } from '../modules/Forging'
import { convertDQTToDBN } from 'redux/utils/nrs'

import Forging from '../components/Forging'

const mapActionCreators = {
  getForging
}

const mapStateToProps = (state) => ({
  status: state.forging.status,
  node: state.form.forging && state.form.forging.values.node || state.forging.defaultNode,
  forgedBalance: convertDQTToDBN(state.auth.account.forgedBalanceDQT)
})

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Forging))
