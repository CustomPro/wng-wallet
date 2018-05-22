import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import {
  getVerificationApplications,
  postVerificationStatus,
  updateVerificationsPage
} from '../modules/Verifications'

import VerificationsTable from '../components/VerificationsTable'

const mapActionCreators = {
  getVerificationApplications,
  postVerificationStatus,
  updateVerificationsPage
}

const mapStateToProps = (state) => {
  const {
    applications,
    totalApplications,
    isLoadingApplications,
    isUpdatingApplications,
    applicationsPageSize,
    applicationsPageNumber,
    applicationsHasNext,
    applicationsHasPrev
  } = state.verifications

  const { secretPhrase } = state.auth.account

  const isMobile = state.browser.lessThanOrEqual.medium

  return {
    applications,
    totalApplications,
    isLoadingApplications,
    isUpdatingApplications,
    applicationsPageSize,
    applicationsPageNumber,
    applicationsHasNext,
    applicationsHasPrev,
    isMobile,
    secretPhrase
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(VerificationsTable))
