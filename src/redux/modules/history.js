import { createAction, handleActions } from 'redux-actions'
import { sendRequest, insecureSendRequest, nrsUrl } from 'redux/utils/api'
import { exchange } from 'config.json'

export const GET_HISTORY = 'history.GET_HISTORY'
export const getHistory = (assetId, pageNumber, pageSize) => {
  if (!assetId) assetId = exchange.assetId
  let firstIndex = null
  let lastIndex = null
  if (pageNumber && pageSize) {
    firstIndex = (pageNumber - 1) * pageSize
    lastIndex = firstIndex + pageSize + 1
  }
  const data = {
    asset: assetId,
    firstIndex,
    lastIndex
  }
  return dispatch => {
    dispatch(createAction(GET_HISTORY)())
    sendRequest('getTrades', data).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          dispatch(getHistoryError(result.error))
        }
        let trades = result.trades
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(trades) && trades.length > pageSize) {
          payload.hasNext = true
          trades = trades.slice(0, pageSize)
        }
        payload.payload = trades
        payload.pageNumber = pageNumber
        dispatch(getHistorySuccess(payload))
      }
    }).fail((jqXHR, textStatus, err) => {
      dispatch(getHistoryError(err))
    })
  }
}

export const GET_HISTORY_SUCCESS = 'history.GET_HISTORY_SUCCESS'
export const getHistorySuccess = createAction(GET_HISTORY_SUCCESS)

export const GET_HISTORY_ERROR = 'history.GET_HISTORY_ERROR'
export const getHistoryError = createAction(GET_HISTORY_ERROR)

export const GET_ACCOUNT_HISTORY = 'history.GET_ACCOUNT_HISTORY'
export const getAccountHistory = (assetId, pageNumber, pageSize, account) => {
  if (!assetId) assetId = exchange.assetId
  let firstIndex = null
  let lastIndex = null
  if (pageNumber && pageSize) {
    firstIndex = (pageNumber - 1) * pageSize
    lastIndex = firstIndex + pageSize
  }
  return (dispatch, getState) => {
    if (!account) account = getState().auth.account.accountRS
    dispatch(createAction(GET_ACCOUNT_HISTORY)())
    const data = {
      asset: assetId,
      firstIndex,
      lastIndex,
      account
    }
    return sendRequest('getTrades', data).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          dispatch(getAccountHistoryError(result.error))
        }
        let trades = result.trades
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(trades) && trades.length > pageSize) {
          payload.hasNext = true
          trades = trades.slice(0, pageSize)
        }
        payload.payload = trades
        payload.pageNumber = pageNumber
        dispatch(getAccountHistorySuccess(payload))
      }
    }).fail((jqXHR, textStatus, err) => {
      dispatch(getAccountHistoryError(err))
    })
  }
}
export const GET_ACCOUNT_HISTORY_SUCCESS = 'history.GET_ACCOUNT_HISTORY_SUCCESS'
export const getAccountHistorySuccess = createAction(GET_ACCOUNT_HISTORY_SUCCESS)

export const GET_ACCOUNT_HISTORY_ERROR = 'history.GET_ACCOUNT_HISTORY_ERROR'
export const getAccountHistoryError = createAction(GET_ACCOUNT_HISTORY_ERROR)

export const UPDATE_HISTORY_PAGE = 'history.UPDATE_HISTORY_PAGE'
export const updateHistoryPage = (type, pageNumber, pageSize, assetId, account) => {
  return (dispatch, getState) => {
    if (!assetId) assetId = exchange.assetId
    if (!account) account = getState().auth.account.accountRS
    if (pageNumber >= 1) {
      if (type === 'history') {
        dispatch(updateHistoryPageSuccess(pageNumber))
        dispatch(getHistory(assetId, pageNumber, pageSize))
      }
      if (type === 'accountHistory') {
        dispatch(updateAccountHistoryPageSuccess(pageNumber))
        dispatch(getAccountHistory(assetId, pageNumber, pageSize, account))
      }
    }
  }
}

export const UPDATE_HISTORY_PAGE_SUCCESS = 'history.UPDATE_HISTORY_PAGE_SUCCESS'
export const updateHistoryPageSuccess = createAction(UPDATE_HISTORY_PAGE_SUCCESS)

export const UPDATE_ACCOUNT_HISTORY_PAGE_SUCCESS = 'history.UPDATE_ACCOUNT_HISTORY_PAGE_SUCCESS'
export const updateAccountHistoryPageSuccess = createAction(UPDATE_ACCOUNT_HISTORY_PAGE_SUCCESS)

export const GET_ORDER_TRADES = 'history.GET_ORDER_TRADES'
export const getOrderTrades = (type, orderID, asset) => {
  return (dispatch, getState) => {
    dispatch(createAction(GET_ORDER_TRADES)())
    let data
    if (type === 'askOrder') {
      data = { askOrder: orderID, asset }
    }
    if (type === 'bidOrder') {
      data = { bidOrder: orderID, asset }
    }
    return insecureSendRequest(nrsUrl, 'getOrderTrades', data).then((result) => {
      console.log(result)
      if (result && result.trades) {
        const payload = {}
        payload.payload = result.trades
        return dispatch(getOrderTradesSuccess(payload))
      }
    })
  }
}

export const GET_ORDER_TRADES_SUCCESS = 'history.GET_ORDER_TRADES_SUCCESS'
export const getOrderTradesSuccess = createAction(GET_ORDER_TRADES_SUCCESS)

const initialState = {
  isLoadingHistory: false,
  isLoadingAccountHistory: false,
  history: [],
  accountHistory: [],
  orderTrades: [],
  historyPageNumber: 1,
  historyPageSize: 5,
  accountHistoryPageNumber: 1,
  accountHistoryPageSize: 5,
  historyHasNext: false,
  historyHasPrev: true,
  accountHistoryHasNext: false,
  accountHistoryHasPrev: true
}

export default handleActions({
  [GET_HISTORY]: (state, { payload }) => ({
    ...state,
    isLoadingHistory: true
  }),

  [GET_ACCOUNT_HISTORY]: (state, { payload }) => ({
    ...state,
    isLoadingAccountHistory: true
  }),

  [GET_HISTORY_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingHistory: false,
      history: payload.payload,
      historyHasNext: payload.hasNext,
      historyHasPrev: payload.hasPrev
    }
  },

  [GET_ACCOUNT_HISTORY_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingAccountHistory: false,
      accountHistory: payload.payload,
      accountHistoryHasNext: payload.hasNext,
      accountHistoryHasPrev: payload.hasPrev
    }
  },

  [GET_ORDER_TRADES_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      orderTrades: payload.payload
    }
  },

  [UPDATE_HISTORY_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      historyPageNumber: payload
    }
  },

  [UPDATE_ACCOUNT_HISTORY_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      accountHistoryPageNumber: payload
    }
  }
}, initialState)
