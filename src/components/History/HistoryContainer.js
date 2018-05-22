import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import History from './History'

import {
  getHistory,
  getAccountHistory,
  updateHistoryPage
} from 'redux/modules/history'

const mapActionCreators = {
  getHistory,
  getAccountHistory,
  updateHistoryPage
}

const mapStateToProps = (state) => {
  const {
    isLoadingHistory,
    isLoadingAccountHistory,
    history,
    accountHistory
  } = state.history
  const isMobile = state.browser.lessThanOrEqual.medium

  return {
    isLoadingHistory,
    isLoadingAccountHistory,
    history,
    accountHistory,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(History))
