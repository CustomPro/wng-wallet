import React, { PropTypes } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import {
  RaisedButton
} from 'material-ui'

const messages = defineMessages({
  open_camera: {
    id: 'mobile_qr_reader.open_camera',
    defaultMessage: 'Open Camera'
  }
})

export class MobileQrReader extends React.Component {

  constructor (props) {
    super(props)
    this.state = { qrError: '' }
  }

  handleOpenCamera = () => {
    this.setState({ qrError: '' })
    this.props.clearQrCode()
    this.openCamera()
  }

  openCamera () {
    const self = this
    const QRScanner = window.QRScanner
    function clearBg (status) {
      document.getElementById('root').style.opacity = 0
      self.props.hideModal()
    }
    function showBg (err, text) {
      console.log(err, text)
      if (text) {
        self.props.setQrCode(text)
        QRScanner.hide(function (status) {
          self.props.showModal()
          document.getElementById('root').style.opacity = 100
        })
      } else if (err) {
        if (err._message) {
          alert(err._message)
        }
      }
    }
    QRScanner.show(clearBg)
    QRScanner.scan(showBg)
  }

  render () {
    return (
      <div>
        <RaisedButton
          onClick={this.handleOpenCamera}
          label={renderFormattedMessage(messages.open_camera)} />
        <div>
          <small>{this.state.qrError}</small>
        </div>
      </div>
    )
  }
}

MobileQrReader.propTypes = {
  setQrCode: PropTypes.func,
  clearQrCode: PropTypes.func,
  qrCode: PropTypes.string,
  hideModal: PropTypes.func
}

import { connect } from 'react-redux'

import {
  setQrCode,
  clearQrCode
} from 'redux/modules/qrreader'

const mapActionCreators = {
  setQrCode,
  clearQrCode
}

const mapStateToProps = (state) => {
  const {
    qrCode
  } = state.qrreader
  return {
    qrCode
  }
}

export default connect(
  mapStateToProps,
  mapActionCreators
)(injectIntl(MobileQrReader))
