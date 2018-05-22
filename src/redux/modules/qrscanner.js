import { createAction, handleActions } from 'redux-actions'

export const START_QRSCANNER = 'START_QRSCANNER'
export const startQRScanner = (QRScanner) => {
  return (dispatch, getState) => {
    QRScanner.prepare(function (err, status) {
      if (err) {
        QRScanner.getStatus(function (status) {
          dispatch(createAction(START_QRSCANNER)(status))
        })
      } else {
        dispatch(createAction(START_QRSCANNER)(status))
      }
    })
  }
}

export const SHOW_QRSCANNER = 'SHOW_QRSCANNER'
export const showQRScanner = (QRScanner, hideModal) => {
  return (dispatch, getState) => {
    document.getElementById('mainContainer').style.display = 'none'
    document.getElementById('header').style.display = 'none'
    if (hideModal) {
      hideModal()
    }
    if (window.hasOwnProperty('cordova') && window.cordova.platformId === 'android') {
      QRScanner.show()
    }
    QRScanner.scan(function (err, text) {
      QRScanner.getStatus(function (status) {
        JSON.stringify(status)
      })
      if (err) {
        console.log(err)
      } else {
        dispatch(createAction(SCAN_QRSCANNER)(text))
      }
    })
    dispatch(createAction(SHOW_QRSCANNER)())
  }
}

export const SCAN_QRSCANNER = 'SCAN_QRSCANNER'

export const CANCELSCAN_QRSCANNER = 'CANCELSCAN_QRSCANNER'
export const cancelScanQRScanner = (QRScanner) => {
  return (dispatch) => {
    QRScanner.destroy()
    dispatch(createAction(CANCELSCAN_QRSCANNER)())
  }
}

export const HIDE_QRSCANNER = 'HIDE_QRSCANNER'
export const hideQRScanner = (QRScanner, showModal) => {
  return (dispatch, getState) => {
    if (window.hasOwnProperty('cordova') && window.cordova.platformId === 'android') {
      QRScanner.cancelScan()
    }
    QRScanner.hide(function (status) {
      document.getElementById('mainContainer').style.display = 'block'
      document.getElementById('header').style.display = 'block'
      if (showModal) {
        showModal()
      }
    })
    dispatch(createAction(HIDE_QRSCANNER)())
  }
}

export const SET_QRCODE = 'SET_QRCODE'
export const setQRCode = (qrCode) => {
  return (dispatch) => {
    dispatch(createAction(SET_QRCODE)(qrCode))
  }
}

export const CLEAR_QRCODE = 'CLEAR_QRCODE'
export const clearQRCode = createAction(CLEAR_QRCODE)

export const ATTACH_QR_MODAL = 'ATTACH_QR_MODAL'
export const attachQRModal = (showModal, hideModal) => {
  return dispatch => {
    dispatch(createAction(ATTACH_QR_MODAL)({ showModal, hideModal }))
  }
}

const initialState = {
  started: false,
  show: false,
  canChangeCamera: false,
  qrCode: '',
  status: {}
}

export default handleActions({
  [START_QRSCANNER]: (state, { payload }) => {
    return {
      ...state,
      started: true,
      status: payload
    }
  },

  [SHOW_QRSCANNER]: (state) => {
    return {
      ...state,
      started: true,
      show: true
    }
  },

  [SCAN_QRSCANNER]: (state, { payload }) => {
    return {
      ...state,
      qrCode: payload
    }
  },

  [HIDE_QRSCANNER]: (state) => {
    return {
      ...state,
      show: false
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
  },

  [ATTACH_QR_MODAL]: (state, { payload }) => {
    const { showModal, hideModal } = payload
    return {
      ...state,
      showModal,
      hideModal
    }
  }
}, initialState)
