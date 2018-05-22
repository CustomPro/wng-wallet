import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl'
import { getFormValues, change } from 'redux-form'
import { tokenName } from 'config.json'

import {
  startForging,
  stopForging,
  setForgerNode
} from '../modules/Forging'

import ForgingForm from '../forms/ForgingForm'

const mapActionCreators = (dispatch) => ({
  ...bindActionCreators({
    startForging,
    stopForging
  }, dispatch),
  setForgerNode: (value) => {
    dispatch(setForgerNode(value))
    dispatch(change('forging', 'node', value))
  }
})

const mapStateToProps = (state) => {
  const account = state.auth.account
  let effectiveBalanceDBN = 0
  if (account[`effectiveBalance${tokenName.toUpperCase()}`]) {
    effectiveBalanceDBN = account[`effectiveBalance${tokenName.toUpperCase()}`]
  } else if (account.effectiveBalanceDBN) {
    effectiveBalanceDBN = account.effectiveBalanceDBN
  }

  return {
    initialValues: {
      node: state.forging.defaultNode
    },
    defaultNode: state.forging.defaultNode,
    formValues: getFormValues('forging')(state),
    status: state.forging.status,
    effectiveBalanceDBN,
    coinName: state.site.coinName,
    nodes: state.forging.nodes
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(ForgingForm))
