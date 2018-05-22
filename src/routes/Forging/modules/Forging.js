import { createAction, handleActions } from 'redux-actions'
import { nrsUrl, forgingNodes, sendRequest, insecureSendRequest } from 'redux/utils/api'
import { actionTypes } from 'redux-form'
import { getAccount } from 'routes/Auth/modules/Auth'
import { convertDBNToDQT } from 'redux/utils/nrs'
const { CHANGE } = actionTypes

export const GET_FORGING = 'GET_FORGING'
export const getForging = (data) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    dispatch(createAction(GET_FORGING)())
    const node = data || nrsUrl

    insecureSendRequest(node, 'getForging', { secretPhrase })
      .then((result) => {
        if (result && result.accountRS &&
          result.hitTime !== 0 && result.deadline !== 0) {
          return dispatch(setForgingStatus('is_forging'))
        }
        return dispatch(setForgingStatus('not_forging'))
      })
      .fail((jqXHR, textStatus, err) => {
        return dispatch(setForgingStatus('not_forging'))
      })
  }
}

export const SET_FORGING_STATUS = 'SET_FORGING_STATUS'
export const setForgingStatus = createAction(SET_FORGING_STATUS)

export const START_FORGING = 'START_FORGING'
export const startForging = (data) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    const node = data.node || nrsUrl

    dispatch(createAction(START_FORGING)())
    insecureSendRequest(node, 'startForging', { secretPhrase })
      .then((result) => {
        if (result && !result.errorDescription &&
          result.hitTime !== 0 && result.deadline !== 0) {
          return dispatch(setForgingStatus('is_forging'))
        }
        return dispatch(setForgingStatus('not_forging'))
      })
      .fail((jqXHR, textStatus, err) => {
        return dispatch(setForgingStatus('not_forging'))
      })
  }
}

export const STOP_FORGING = 'STOP_FORGING'
export const stopForging = (data) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    const node = data.node || nrsUrl

    dispatch(createAction(STOP_FORGING)())
    insecureSendRequest(node, 'stopForging', { secretPhrase })
      .then((result) => {
        if (result && result.foundAndStopped) {
          return dispatch(setForgingStatus('not_forging'))
        }
        return dispatch(setForgingStatus('unknown'))
      })
  }
}

export const SET_FORGER_NODE = 'SET_FORGER_NODE'
export const setForgerNode = createAction(SET_FORGER_NODE)

export const LEASE_BALANCE = 'LEASE_BALANCE'
export const leaseBalance = ({ recipient, period, fee }) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account

    dispatch(createAction(LEASE_BALANCE)())
    return sendRequest('leaseBalance', {
      secretPhrase,
      recipient,
      period,
      feeDQT: convertDBNToDQT(fee)
    }).then((result) => {
      if (result && result.transaction) {
        dispatch(leaseBalanceSuccess(result))
        dispatch(getAccount())
      } else {
        dispatch(leaseBalanceError(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      dispatch(leaseBalanceError(err))
    })
  }
}

export const LEASE_BALANCE_SUCCESS = 'LEASE_BALANCE_SUCCESS'
export const leaseBalanceSuccess = createAction(LEASE_BALANCE_SUCCESS)

export const LEASE_BALANCE_ERROR = 'LEASE_BALANCE_ERROR'
export const leaseBalanceError = createAction(LEASE_BALANCE_ERROR)

const initialState = {
  defaultNode: nrsUrl,
  nodes: forgingNodes,
  status: 'unknown',
  leaseBalanceSuccess: false,
  leaseBalanceError: null
}

export default handleActions({
  [SET_FORGING_STATUS]: (state, { payload }) => {
    return {
      ...state,
      status: payload
    }
  },

  [SET_FORGER_NODE]: (state, { payload }) => {
    return {
      ...state,
      defaultNode: payload,
      status: 'unknown'
    }
  },

  [CHANGE]: (state, { field, form, payload }) => {
    if (field !== 'node' && form !== 'form') {
      return state
    }

    return {
      ...state,
      status: 'unknown'
    }
  },

  [LEASE_BALANCE]: (state) => {
    return {
      ...state,
      leaseBalanceSuccess: null,
      leaseBalanceError: null
    }
  },

  [LEASE_BALANCE_SUCCESS]: (state) => {
    return {
      ...state,
      leaseBalanceSuccess: true,
      leaseBalanceError: null
    }
  },

  [LEASE_BALANCE_ERROR]: (state, { payload }) => {
    return {
      ...state,
      leaseBalanceSuccess: false,
      leaseBalanceError: payload.errorDescription
    }
  }
}, initialState)
