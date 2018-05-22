import React, { PropTypes } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import {
  RaisedButton
} from 'material-ui'

const messages = defineMessages({
  scan_qr_code: {
    id: 'qr_scanner_button.scan_qr_code',
    defaultMessage: 'Scan QR Code'
  },
  allow_camera_access: {
    id: 'qr_scanner_button.allow_camera_access',
    defaultMessage: 'Please allow camera access to scan a QR code'
  }
})

export class QRScannerButton extends React.Component {

  constructor (props) {
    super(props)
    this.state = { qrError: '' }
  }

  componentDidMount () {
    this.props.attachQRModal(this.props.showModal, this.props.hideModal)
  }

  handleOpenCamera = (e) => {
    const { status, intl, clearQRCode, device, hideModal } = this.props
    const { formatMessage } = intl
    const { authorized, canOpenSettings } = status
    clearQRCode()
    if (device === 'Mobile Browser') {
      if (hideModal) {
        hideModal()
      }
      this.props.openQrReaderDialog()
    } else {
      if (status && authorized === false) {
        confirm(formatMessage(messages.allow_camera_access))
        if (canOpenSettings === true) {
          window.QRScanner.openSettings()
        }
      } else {
        this.props.showQRScanner(window.QRScanner, this.props.hideModal)
      }
    }
  }
  render () {
    return (
      <div>
        <RaisedButton
          onClick={this.handleOpenCamera}
          label={renderFormattedMessage(messages.scan_qr_code)} />
        <div>
          <small>{this.state.qrError}</small>
        </div>
      </div>
    )
  }
}

QRScannerButton.propTypes = {
  startQRScanner: PropTypes.func,
  showQRScanner: PropTypes.func,
  scanQRScanner: PropTypes.func,
  hideQRScanner: PropTypes.func,
  cancelScanQRScanner: PropTypes.func,
  clearQRCode: PropTypes.func,
  started: PropTypes.bool,
  show: PropTypes.bool,
  isScanning: PropTypes.bool,
  qrCode: PropTypes.string,
  attachQRModal: PropTypes.func,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  status: PropTypes.object,
  intl: PropTypes.object,
  isMobile: PropTypes.bool,
  device: PropTypes.string,
  openQrReaderDialog: PropTypes.func
}

import { connect } from 'react-redux'

import {
  startQRScanner,
  showQRScanner,
  scanQRScanner,
  hideQRScanner,
  cancelScanQRScanner,
  setQRCode,
  clearQRCode,
  attachQRModal
} from 'redux/modules/qrscanner'

import {
  openQrReaderDialog,
  closeQrReaderDialog
} from 'redux/modules/qrreader'

import {
  deviceCheck
} from 'redux/modules/site'

const mapActionCreators = {
  startQRScanner,
  showQRScanner,
  scanQRScanner,
  hideQRScanner,
  cancelScanQRScanner,
  setQRCode,
  clearQRCode,
  attachQRModal,
  openQrReaderDialog,
  closeQrReaderDialog,
  deviceCheck
}

const mapStateToProps = (state) => {
  const { device } = state.site
  const {
    started,
    qrCode,
    show,
    status
  } = state.qrscanner
  const isMobile = state.browser.lessThanOrEqual.medium
  return {
    started,
    qrCode,
    show,
    status,
    isMobile,
    device,
    qrDialogIsOpen: state.qrreader.qrDialogIsOpen
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(QRScannerButton))
