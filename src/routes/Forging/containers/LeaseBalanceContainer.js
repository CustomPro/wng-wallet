import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { convertDQTToDBN } from 'redux/utils/nrs'
import { leaseBalance } from '../modules/Forging'

import LeaseBalance from '../components/LeaseBalance'

const mapActionCreators = {
  leaseBalance
}

const mapStateToProps = (state) => ({
  numberOfBlocks: state.site.blockchainStatus.numberOfBlocks,
  currentLesseeRS: state.auth.account.currentLesseeRS,
  currentLeasingHeightTo: state.auth.account.currentLeasingHeightTo,
  guaranteedBalance: convertDQTToDBN(state.auth.account.guaranteedBalanceDQT),
  leaseBalanceSuccess: state.forging.leaseBalanceSuccess,
  leaseBalanceError: state.forging.leaseBalanceError
})

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(LeaseBalance))
