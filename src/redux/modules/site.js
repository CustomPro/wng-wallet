import { createAction, handleActions } from 'redux-actions'
import { isLocalhost, tokenName } from 'config.json'
import { version } from '../../../package.json'

import { get, getRequest } from 'redux/utils/api'

export const OPEN_SIDEBAR = 'OPEN_SIDEBAR'
export const openSidebar = createAction(OPEN_SIDEBAR)

export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR'
export const closeSidebar = createAction(CLOSE_SIDEBAR)

export const OPEN_DIALOG = 'OPEN_DIALOG'
export const openDialog = createAction(OPEN_DIALOG)

export const CLOSE_DIALOG = 'CLOSE_DIALOG'
export const closeDialog = createAction(CLOSE_DIALOG)

export const OPEN_ALERT = 'OPEN_ALERT'
export const openAlert = createAction(OPEN_ALERT)

export const CLOSE_ALERT = 'CLOSE_ALERT'
export const closeAlert = createAction(CLOSE_ALERT)

export const CONNECTION_ERROR = 'CONNECTION_ERROR'
export const connectionError = createAction(CONNECTION_ERROR)

export const OPEN_MORE_BALANCES_SECTION = 'OPEN_MORE_BALANCES_SECTION'
export const openMoreBalancesSection = createAction(OPEN_MORE_BALANCES_SECTION)

export const CLOSE_MORE_BALANCES_SECTION = 'CLOSE_MORE_BALANCES_SECTION'
export const closeMoreBalancesSection = createAction(CLOSE_MORE_BALANCES_SECTION)

export const OPEN_ADVANCED_OPTIONS = 'OPEN_ADVANCED_OPTIONS'
export const openAdvancedOptions = createAction(OPEN_ADVANCED_OPTIONS)

export const CLOSE_ADVANCED_OPTIONS = 'CLOSE_ADVANCED_OPTIONS'
export const closeAdvancedOptions = createAction(CLOSE_ADVANCED_OPTIONS)

export const getVersion = () => {
  return dispatch => {
    if (isLocalhost) {
      return
    }

    get('constants')
      .then((result) => {
        if (result && result.walletVersion) {
          dispatch(getVersionSuccess(result.walletVersion))
        }
      })
  }
}

export const GET_CONSTANTS = 'GET_CONSTANTS'
export const getConstants = () => {
  return dispatch => {
    dispatch(createAction(GET_CONSTANTS)())
    return getRequest('getConstants').then((result) => {
      if (result) {
        return dispatch(getConstantsSuccess(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      return dispatch(getConstantsError(err))
    })
  }
}

export const GET_BLOCKCHAIN_STATUS = 'GET_BLOCKCHAIN_STATUS'
export const getBlockchainStatus = () => {
  return dispatch => {
    dispatch(createAction(GET_BLOCKCHAIN_STATUS)())
    return getRequest('getBlockchainStatus').then((result) => {
      if (result) {
        dispatch(getBlockchainStatusSuccess(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      return dispatch(getBlockchainStatusError(err))
    })
  }
}

export const GET_CONSTANTS_SUCCESS = 'GET_CONSTANTS_SUCCESS'
export const getConstantsSuccess = createAction(GET_CONSTANTS_SUCCESS)

export const GET_CONSTANTS_ERROR = 'GET_CONSTANTS_ERROR'
export const getConstantsError = createAction(GET_CONSTANTS_ERROR)

export const GET_BLOCKCHAIN_STATUS_SUCCESS = 'GET_BLOCKCHAIN_STATUS_SUCCESS'
export const getBlockchainStatusSuccess = createAction(GET_BLOCKCHAIN_STATUS_SUCCESS)

export const GET_BLOCKCHAIN_STATUS_ERROR = 'GET_BLOCKCHAIN_STATUS_ERROR'
export const getBlockchainStatusError = createAction(GET_BLOCKCHAIN_STATUS_ERROR)

export const GET_VERSION_SUCCESS = 'GET_VERSION_SUCCESS'
export const getVersionSuccess = createAction(GET_VERSION_SUCCESS)

export const HIDE_NEW_VERSION_MODAL = 'HIDE_NEW_VERSION_MODAL'
export const hideNewVersionModal = createAction(HIDE_NEW_VERSION_MODAL)

export const DEVICE_CHECK = 'DEVICE_CHECK'
export const deviceCheck = () => {
  return (dispatch, getState) => {
    const isMobile = getState().browser.lessThanOrEqual.medium
    let device = 'Desktop'
    if (window.hasOwnProperty('cordova')) {
      if (window.cordova.platformId && window.cordova.platformId === 'android') {
        device = 'Android'
      }
      if (window.cordova.platformId && window.cordova.platformId === 'browser') {
        device = 'Browser'
      }
    } else if (isMobile === true) {
      device = 'Mobile Browser'
    }
    dispatch(createAction(DEVICE_CHECK)(device))
  }
}

const initialState = {
  connectionError: false,
  sidebarOpen: false,
  dialogOpen: false,
  alertOpen: false,
  moreBalancesSectionOpen: false,
  advancedOptionsOpen: false,
  coinName: tokenName,
  isLocalhost,
  version,
  newVersion: version,
  hideNewVersionModal: false,
  constants: {},
  devices: [],
  hasLoadedDevices: false,
  selectedDevice: 'file',
  device: ''
}

export default handleActions({
  [OPEN_SIDEBAR]: state => {
    return {
      ...state,
      sidebarOpen: true
    }
  },

  [CLOSE_SIDEBAR]: state => {
    return {
      ...state,
      sidebarOpen: false
    }
  },

  [OPEN_DIALOG]: state => {
    return {
      ...state,
      dialogOpen: true
    }
  },

  [CLOSE_DIALOG]: state => {
    return {
      ...state,
      dialogOpen: false
    }
  },

  [OPEN_ALERT]: state => {
    return {
      ...state,
      alertOpen: true
    }
  },

  [CLOSE_ALERT]: state => {
    return {
      ...state,
      alertOpen: false
    }
  },

  [OPEN_MORE_BALANCES_SECTION]: state => {
    return {
      ...state,
      moreBalancesSectionOpen: true
    }
  },

  [CLOSE_MORE_BALANCES_SECTION]: state => {
    return {
      ...state,
      moreBalancesSectionOpen: false
    }
  },

  [CONNECTION_ERROR]: state => {
    return {
      ...state,
      connectionError: true
    }
  },

  [GET_VERSION_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      newVersion: payload
    }
  },

  [GET_CONSTANTS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      constants: payload
    }
  },

  [GET_BLOCKCHAIN_STATUS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      blockchainStatus: payload
    }
  },

  [HIDE_NEW_VERSION_MODAL]: state => {
    return {
      ...state,
      hideNewVersionModal: true
    }
  },

  [OPEN_ADVANCED_OPTIONS]: state => {
    return {
      ...state,
      advancedOptionsOpen: true
    }
  },

  [CLOSE_ADVANCED_OPTIONS]: state => {
    return {
      ...state,
      advancedOptionsOpen: false
    }
  },

  [DEVICE_CHECK]: (state, { payload }) => {
    return {
      ...state,
      device: payload
    }
  }
}, initialState)
