import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { getFormValues } from 'redux-form'
import {
  hideModal,
  showModal,
  setStep,
  sendMoney
} from 'redux/modules/transaction'
import {
  getAccountInformationProperties
} from 'redux/modules/accountinformation'
import {
  openAdvancedOptions,
  closeAdvancedOptions
} from 'redux/modules/site'
import { convertDQTToDBN } from 'redux/utils/nrs'
import { minimumFee } from 'config.json'
import SendForm from './SendForm'
import { clearQRCode } from 'redux/modules/qrscanner'

const mapActionCreators = {
  hideModal,
  showModal,
  setStep,
  sendMoney,
  openAdvancedOptions,
  closeAdvancedOptions,
  getAccountInformationProperties,
  clearQRCode
}

const mapStateToProps = (state) => {
  const minFee = convertDQTToDBN(minimumFee)
  const { isAdmin } = state.auth
  const {
    isLoadingAccountInformation,
    accountInformationProperties
  } = state.accountinformation
  const { qrCode } = state.qrscanner
  return {
    isSending: state.transaction.isSending,
    sendStep: state.transaction.sendStep,
    sendSuccess: state.transaction.sendSuccess,
    sendError: state.transaction.sendError,
    formValues: getFormValues('transaction')(state),
    advancedOptionsOpen: state.site.advancedOptionsOpen,
    initialValues: {
      recipient: state.transaction.recipient,
      fee: minFee
    },
    isLoadingAccountInformation,
    accountInformationProperties,
    isAdmin,
    qrCode
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(SendForm))
