import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import QrReader from './QrReader'

import {
  getAvailableDevices,
  switchInputDevice,
  openQrReaderDialog,
  closeQrReaderDialog,
  setQrCode,
  clearQrCode
} from 'redux/modules/qrreader'

const mapActionCreators = {
  getAvailableDevices,
  switchInputDevice,
  openQrReaderDialog,
  closeQrReaderDialog,
  setQrCode,
  clearQrCode
}

const mapStateToProps = (state) => {
  const {
    devices,
    hasLoadedDevices,
    selectedDevice,
    qrDialogIsOpen,
    qrCode,
    hasDevices
  } = state.qrreader
  return {
    devices,
    hasLoadedDevices,
    selectedDevice,
    qrDialogIsOpen,
    qrCode,
    hasDevices
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(QrReader))
