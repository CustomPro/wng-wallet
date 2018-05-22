import { createAction, handleActions } from 'redux-actions'

export const GET_AVAILABLE_DEVICES = 'GET_AVAILABLE_DEVICES'
export const getAvailableDevices = () => {
  return dispatch => {
    dispatch(createAction(GET_AVAILABLE_DEVICES)())
    navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
      const devicesArray = []
      let selectedDevice
      let hasDevices = false
      devices.forEach(function (device) {
        if (device.kind === 'videoinput') {
          const deviceItem = { id: device.deviceId, type: device.kind, label: device.label }
          devicesArray.push(deviceItem)
        }
      })
      selectedDevice = devicesArray.length - 1
      if (devices.length > 0) {
        hasDevices = true
      }
      const payload = { devices: devicesArray, selectedDevice, hasDevices }
      dispatch(getAvailableDevicesSuccess(payload))
    })
  }
}

export const GET_AVAILABLE_DEVICES_SUCCESS = 'GET_AVAILABLE_DEVICES_SUCCESS'
export const getAvailableDevicesSuccess = createAction(GET_AVAILABLE_DEVICES_SUCCESS)

export const SWITCH_INPUT_DEVICE = 'SWITCH_INPUT_DEVICE'
export const switchInputDevice = (id) => {
  return dispatch => {
    dispatch(createAction(SWITCH_INPUT_DEVICE)())
    dispatch(switchInputDeviceSuccess(id))
  }
}

export const SWITCH_INPUT_DEVICE_SUCCESS = 'SWITCH_INPUT_DEVICE_SUCCESS'
export const switchInputDeviceSuccess = createAction(SWITCH_INPUT_DEVICE_SUCCESS)

export const OPEN_QRREADER_DIALOG = 'OPEN_QRREADER_DIALOG'
export const openQrReaderDialog = () => {
  return (dispatch) => {
    dispatch(createAction(OPEN_QRREADER_DIALOG)())
  }
}

export const CLOSE_QRREADER_DIALOG = 'CLOSE_QRREADER_DIALOG'
export const closeQrReaderDialog = createAction(CLOSE_QRREADER_DIALOG)

export const SET_QRCODE = 'SET_QRCODE'
export const setQrCode = (qrCode) => {
  return (dispatch) => {
    dispatch(createAction(SET_QRCODE)(qrCode))
  }
}

export const CLEAR_QRCODE = 'CLEAR_QRCODE'
export const clearQrCode = createAction(CLEAR_QRCODE)

const initialState = {
  devices: [],
  hasLoadedDevices: false,
  hasDevices: false,
  selectedDevice: -1,
  qrDialogIsOpen: false,
  qrCode: ''
}

export default handleActions({
  [GET_AVAILABLE_DEVICES_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      devices: payload.devices,
      hasLoadedDevices: true,
      selectedDevice: payload.selectedDevice,
      hasDevices: payload.hasDevices
    }
  },

  [SWITCH_INPUT_DEVICE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      selectedDevice: payload
    }
  },

  [OPEN_QRREADER_DIALOG]: (state, { payload }) => {
    return {
      ...state,
      qrDialogIsOpen: true
    }
  },

  [CLOSE_QRREADER_DIALOG]: (state, { payload }) => {
    return {
      ...state,
      qrDialogIsOpen: false
    }
  },

  [SET_QRCODE]: (state, { payload }) => {
    return {
      ...state,
      qrCode: payload
    }
  },

  [CLEAR_QRCODE]: (state, { payload }) => {
    return {
      ...state,
      qrCode: ''
    }
  }
}, initialState)
