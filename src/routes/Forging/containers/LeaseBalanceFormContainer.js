import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl'
import { minimumFee } from 'config.json'
import { convertDQTToDBN } from 'redux/utils/nrs'
import { leaseBalance } from '../modules/Forging'
import {
  openAdvancedOptions,
  closeAdvancedOptions
} from 'redux/modules/site'
import LeaseBalanceForm from '../forms/LeaseBalanceForm'
import { clearQRCode } from 'redux/modules/qrscanner'

const mapActionCreators = (dispatch) => ({
  ...bindActionCreators({
    leaseBalance,
    openAdvancedOptions,
    closeAdvancedOptions,
    clearQRCode
  }, dispatch)
})

const mapStateToProps = (state) => {
  const minFee = convertDQTToDBN(minimumFee)
  const { qrCode } = state.qrscanner
  return {
    advancedOptionsOpen: state.site.advancedOptionsOpen,
    qrCode,
    initialValues: {
      fee: minFee
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(LeaseBalanceForm))
