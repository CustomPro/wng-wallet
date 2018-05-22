import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import AccountHistory from './AccountHistory'

import {
  getAccountHistory,
  updateHistoryPage
} from 'redux/modules/history'

const mapActionCreators = {
  getAccountHistory,
  updateHistoryPage
}

const mapStateToProps = (state) => {
  const {
    isLoadingAccountHistory,
    accountHistory,
    accountHistoryPageSize,
    accountHistoryPageNumber,
    accountHistoryHasNext,
    accountHistoryHasPrev
  } = state.history

  const {
    accountRS
  } = state.auth.account

  const isMobile = state.browser.lessThanOrEqual.medium

  return {
    accountRS,
    isLoadingAccountHistory,
    accountHistory,
    accountHistoryPageSize,
    accountHistoryPageNumber,
    accountHistoryHasNext,
    accountHistoryHasPrev,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(AccountHistory))
