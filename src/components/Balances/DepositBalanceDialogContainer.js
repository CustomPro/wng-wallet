import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import DepositBalanceDialog from './DepositBalanceDialog'

import { getBitcoinAddress } from 'redux/modules/balances'

const mapActionCreators = {
  getBitcoinAddress
}

const mapStateToProps = (state) => {
  const { bitcoinAddress } = state.balances

  return {
    bitcoinAddress
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(DepositBalanceDialog))
