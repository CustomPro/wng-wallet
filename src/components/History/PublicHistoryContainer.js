import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import PublicHistory from './PublicHistory'

import {
  getHistory,
  updateHistoryPage
} from 'redux/modules/history'

const mapActionCreators = {
  getHistory,
  updateHistoryPage
}

const mapStateToProps = (state) => {
  const {
    isLoadingHistory,
    history,
    historyPageSize,
    historyPageNumber,
    historyHasNext,
    historyHasPrev
  } = state.history

  const {
    accountRS
  } = state.auth.account

  const isMobile = state.browser.lessThanOrEqual.medium

  return {
    accountRS,
    isLoadingHistory,
    history,
    historyPageSize,
    historyPageNumber,
    historyHasNext,
    historyHasPrev,
    isMobile
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(PublicHistory))
