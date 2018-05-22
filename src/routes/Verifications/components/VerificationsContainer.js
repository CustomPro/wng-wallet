import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Verifications from './Verifications'
import {
  openAccountDialog,
  closeAccountDialog
} from 'redux/modules/accountinformation'
const mapActionCreators = {
  openAccountDialog,
  closeAccountDialog
}

const mapStateToProps = (state) => {
  const {
    accountDialogIsOpen,
    accountInformationId
  } = state.accountinformation
  return {
    accountDialogIsOpen,
    accountInformationId,
    asset: state.exchange.selectedAsset
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(Verifications))
