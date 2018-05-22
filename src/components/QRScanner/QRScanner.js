import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
// import ImageCameraFront from 'material-ui/svg-icons/image/camera-front'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { FlatButton } from 'material-ui'
import QrReaderDialog from 'components/QrReader/QrReaderDialog'

export class QRScanner extends React.Component {

  componentDidMount () {
    this.props.deviceCheck()
    document.addEventListener('deviceready', this.onDeviceReady, false)
  }

  onDeviceReady = () => {
    if (this.props.device === 'Android') {
      this.props.startQRScanner(window.QRScanner)
    }
  }

  handleCameraClick = (e) => {
    const { status: { currentCamera } } = this.props
    let cameraSwitch
    if (currentCamera === 0) {
      cameraSwitch = 1
    } else if (currentCamera === 1) {
      cameraSwitch = 0
    }
    window.QRScanner.useCamera(cameraSwitch)
  }

  handleCloseClick = (e) => {
    this.props.hideQRScanner(window.QRScanner, this.props.showModal)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.qrCode !== this.props.qrCode && this.props.qrCode !== '') {
      this.props.hideQRScanner(window.QRScanner, this.props.showModal)
    }
  }

  renderOverlay () {
    const {
      show
      // status
    } = this.props
    // let cameraChangeButton
    const QROverlayStyle = {
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2000,
      display: 'none'
    }
    if (show) {
      QROverlayStyle.display = 'block'
    }
    // if (status && status.canChangeCamera === true) {
    //   cameraChangeButton = (
    //     <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
    //       <FlatButton style={{ width: '100%', height: '50%' }}
    //         icon={(<ImageCameraFront style={{ height: '120px', width: '120px', padding: '10px 0px' }} />)}
    //         onClick={this.handleCameraClick}
    //       />
    //     </div>)
    // }
    return (
      <div style={QROverlayStyle} id='QROverlay'>
        <div style={{ position: 'fixed', top: 0, width: '100%', textAlign: 'right' }}>
          <FlatButton
            style={{ width: '30%', height: '50%' }}
            icon={(<NavigationClose style={{ height: '120px', width: '120px', padding: '10px 0px' }} />)}
            onClick={this.handleCloseClick}
          />
        </div>
      </div>
    )
  }

  renderMobileReader () {
    return (
      <QrReaderDialog
        show={this.props.qrDialogIsOpen}
        closeDialog={this.props.closeQrReaderDialog}
      />
    )
  }

  render () {
    let content
    if (this.props.device === 'Mobile Browser') {
      content = this.renderMobileReader()
    } else {
      content = this.renderOverlay()
    }
    return content
  }
}

QRScanner.propTypes = {
  startQRScanner: PropTypes.func,
  showQRScanner: PropTypes.func,
  scanQRScanner: PropTypes.func,
  hideQRScanner: PropTypes.func,
  cancelScanQRScanner: PropTypes.func,
  started: PropTypes.bool,
  show: PropTypes.bool,
  isScanning: PropTypes.bool,
  qrCode: PropTypes.string,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  status: PropTypes.object,
  isMobile: PropTypes.bool,
  qrDialogIsOpen: PropTypes.bool,
  closeQrReaderDialog: PropTypes.func,
  deviceCheck: PropTypes.func,
  device: PropTypes.string
}

import {
  deviceCheck
} from 'redux/modules/site'

import {
  startQRScanner,
  showQRScanner,
  scanQRScanner,
  hideQRScanner,
  cancelScanQRScanner,
  setQRCode,
  clearQRCode
} from 'redux/modules/qrscanner'

import {
  openQrReaderDialog,
  closeQrReaderDialog
} from 'redux/modules/qrreader'

const mapActionCreators = {
  startQRScanner,
  showQRScanner,
  scanQRScanner,
  hideQRScanner,
  cancelScanQRScanner,
  setQRCode,
  clearQRCode,
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
    status,
    showModal,
    hideModal
  } = state.qrscanner
  const isMobile = state.browser.lessThanOrEqual.medium
  return {
    started,
    qrCode,
    show,
    status,
    showModal,
    hideModal,
    isMobile,
    device,
    qrDialogIsOpen: state.qrreader.qrDialogIsOpen
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(QRScanner))
