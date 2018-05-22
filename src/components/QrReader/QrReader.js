import React, { PropTypes } from 'react'
import { SelectField, MenuItem } from 'material-ui'
const QrCode = require('qrcode-reader')
import NxtAddress from 'redux/utils/nxtAddress'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  scan: {
    id: 'qrReader.scan',
    defaultMessage: 'Scan'
  },
  clear: {
    id: 'qrReader.clear',
    defaultMessage: 'Clear'
  },
  device: {
    id: 'qrReader.device',
    defaultMessage: 'Device'
  }
})

export class QrReader extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      qrError: '',
      scanIntervalTime: 1000
    }
  }

  componentDidMount () {
    this.props.clearQrCode()
    const self = this
    const video = document.querySelector('video')
    if (this.props.hasDevices === true) {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => {
          track.stop()
        })
      }
      const deviceId = this.props.devices[this.props.selectedDevice].id
      const constraints = {
        video: {
          deviceId
        }
      }
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        window.localStream = stream
        if ('srcObject' in video) {
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(stream)
        }
        video.onloadedmetadata = function (e) {
          video.play()
          window.scanInterval = setInterval(function () {
            self.handleScanClick()
          }, self.state.scanIntervalTime)
        }
      })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const video = document.querySelector('video')
    const self = this
    if (this.props.selectedDevice !== prevProps.selectedDevice &&
        this.props.hasDevices === true) {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => {
          track.stop()
        })
      }
      const deviceId = this.props.devices[this.props.selectedDevice].id
      const constraints = {
        video: {
          deviceId
        }
      }
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        window.localStream = stream
        if ('srcObject' in video) {
          video.srcObject = stream
        } else {
          video.src = window.URL.createObjectURL(stream)
        }
        video.onloadedmetadata = function (e) {
          video.play()
          window.scanInterval = setInterval(function () {
            self.handleScanClick()
          }, self.state.scanIntervalTime)
        }
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.qrCode !== nextProps.qrCode && nextProps.qrCode !== undefined && nextProps.qrCode !== '') {
      const nxtAddress = new NxtAddress()
      if (nxtAddress.set(nextProps.qrCode)) {
        window.clearInterval(window.scanInterval)
        this.props.closeQrReaderDialog()
      }
    }
  }

  componentWillUnmount () {
    window.localStream.getTracks().forEach((track) => {
      track.stop()
    })
    window.clearInterval(window.scanInterval)
  }

  handleClearClick = () => {
    const video = document.querySelector('video')
    const canvas = document.getElementById('canvas')
    video.style.opacity = 100
    video.style.position = 'relative'
    canvas.style.opacity = 0
    canvas.style.position = 'absolute'
    this.setState({ qrError: '' })
    window.clearInterval(window.scanInterval)
  }

  handleScanClick = () => {
    this.setState({ qrError: '' })
    const video = document.querySelector('video')
    const canvas = document.getElementById('canvas')
    if (video.videoWidth !== 0 && video.videoHeight !== 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      if (ctx) {
        const qrData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const qr = new QrCode()
        qr.debug = true
        qr.decode(qrData)
        const decodedCode = qr.result
        if (qr.error) {
          this.setState({ qrError: qr.error })
        }
        this.props.setQrCode(decodedCode)
      }
    }
  }

  handleSelectChange = (event, index, value) => {
    this.handleClearClick()
    this.props.switchInputDevice(value)
  }

  handleFileUpload = (e) => {
    const file = e.target.files[0]
    this.decodeFromFile(file)
  }

  decodeFromFile = (file) => {
    const reader = new FileReader()
    const qr = new QrCode()
    const image = document.getElementById('qrImage')
    qr.debug = true
    qr.callback = function (result) {
      const decodedCode = result
      const video = document.querySelector('video')
      const canvas = document.getElementById('canvas')
      video.style.opacity = 0
      video.style.position = 'absolute'
      canvas.style.opacity = 0
      canvas.style.position = 'absolute'
      this.props.setQrCode(decodedCode)
    }
    if (file) {
      reader.readAsDataURL(file)
    }
    reader.addEventListener('load', function () {
      image.src = reader.result
      qr.decode(reader.result)
    }, false)
  }

  renderCameraSelect (devices, selectedDevice, hasLoadedDevices) {
    if (hasLoadedDevices === true && selectedDevice !== '') {
      const options = devices.map((device, index) => {
        return (
          <MenuItem
            primaryText={device.label}
            key={index}
            value={index}
          />
        )
      })
      return (
        <SelectField
          floatingLabelText={renderFormattedMessage(messages.device)}
          value={selectedDevice}
          onChange={this.handleSelectChange}
          name='devices'
        >
          {options}
        </SelectField>
      )
    }
  }

  render () {
    let renderFileUpload
    const { devices, selectedDevice, hasLoadedDevices, hasDevices } = this.props
    const renderSelect = this.renderCameraSelect(devices, selectedDevice, hasLoadedDevices)
    if (hasDevices === false) {
      renderFileUpload = (<input id='fileField' type='file' onChange={this.handleFileUpload} />)
    }
    return (
      <div>
        {renderSelect}
        <div style={{ maxWidth: '250px' }}>
          <video width='100%' height={200} />
          <canvas id='canvas' style={{ position: 'absolute', objectFit: 'contain', opacity: 0 }} />
          <img id='qrImage' />
        </div>
        {renderFileUpload}
        <div>
          {this.state.qrError}
          {this.props.qrCode}
        </div>
      </div>
    )
  }
}

QrReader.propTypes = {
  devices: PropTypes.array,
  getAvailableDevices: PropTypes.func,
  hasLoadedDevices: PropTypes.bool,
  hasDevices: PropTypes.bool,
  selectedDevice: PropTypes.number,
  switchInputDevice: PropTypes.func,
  qrDialogIsOpen: PropTypes.bool,
  qrCode: PropTypes.string,
  setQrCode: PropTypes.func,
  clearQrCode: PropTypes.func,
  closeQrReaderDialog: PropTypes.func
}

export default QrReader
