import { createAction, handleActions } from 'redux-actions'
import { sendRequest } from 'redux/utils/api'
import { exchange } from 'config.json'
import {
  convertQNTToQuantity,
  convertDQTToPrice,
  convertQuantityToQNT
} from 'redux/utils/nrs'
import BigNumber from 'bignumber.js'

export const GET_BID_ORDERS = 'orders.GET_BID_ORDERS'
export const getBidOrders = (assetId, pageNumber, pageSize) => {
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
    lastIndex,
    showExpectedCancellations: true
  }
  return dispatch => {
    dispatch(createAction(GET_BID_ORDERS)())
    return Promise.all([
      sendRequest('getExpectedBidOrders', data),
      sendRequest('getBidOrders', data)
    ]).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          return dispatch(getBidOrdersError(result.error))
        }
        let bidOrders = [
          ...result[0].bidOrders,
          ...result[1].bidOrders
        ]
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(bidOrders) && bidOrders.length > pageSize) {
          payload.hasNext = true
          bidOrders = bidOrders.slice(0, pageSize)
        }
        payload.payload = bidOrders
        payload.pageNumber = pageNumber
        dispatch(getBidOrdersSuccess(payload))
      }
    })
  }
}

export const GET_BID_ORDERS_SUCCESS = 'orders.GET_BID_ORDERS_SUCCESS'
export const getBidOrdersSuccess = createAction(GET_BID_ORDERS_SUCCESS)

export const GET_BID_ORDERS_ERROR = 'orders.GET_BID_ORDERS_ERROR'
export const getBidOrdersError = createAction(GET_BID_ORDERS_ERROR)

export const GET_USER_BID_ORDERS = 'orders.GET_USER_BID_ORDERS'
export const getUserBidOrders = (assetId, account, pageNumber, pageSize) => {
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
    lastIndex,
    account
  }
  return dispatch => {
    dispatch(createAction(GET_USER_BID_ORDERS)())
    return Promise.all([
      sendRequest('getExpectedBidOrders', {
        asset: assetId,
        firstIndex,
        lastIndex
      }),
      sendRequest('getAccountCurrentBidOrders', data)
    ]).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          return dispatch(getUserBidOrdersError(result.error))
        }
        let bidOrders = [
          ...result[0].bidOrders,
          ...result[1].bidOrders
        ]
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(bidOrders) && bidOrders.length > pageSize) {
          payload.hasNext = true
          bidOrders = bidOrders.slice(0, pageSize)
        }
        payload.payload = bidOrders
        payload.pageNumber = pageNumber
        dispatch(getUserBidOrdersSuccess(payload))
      }
    })
  }
}

export const GET_USER_BID_ORDERS_SUCCESS = 'orders.GET_USER_BID_ORDERS_SUCCESS'
export const getUserBidOrdersSuccess = createAction(GET_USER_BID_ORDERS_SUCCESS)

export const GET_USER_BID_ORDERS_ERROR = 'orders.GET_USER_BID_ORDERS_ERROR'
export const getUserBidOrdersError = createAction(GET_USER_BID_ORDERS_ERROR)

export const GET_ASK_ORDERS = 'orders.GET_ASK_ORDERS'
export const getAskOrders = (assetId, pageNumber, pageSize) => {
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
    lastIndex,
    showExpectedCancellations: true
  }
  return dispatch => {
    dispatch(createAction(GET_ASK_ORDERS)())
    return Promise.all([
      sendRequest('getExpectedAskOrders', data),
      sendRequest('getAskOrders', data)
    ]).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          return dispatch(getAskOrdersError(result.error))
        }
        let askOrders = [
          ...result[0].askOrders,
          ...result[1].askOrders
        ]
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(askOrders) && askOrders.length > pageSize) {
          payload.hasNext = true
          askOrders = askOrders.slice(0, pageSize)
        }
        payload.payload = askOrders
        payload.pageNumber = pageNumber
        dispatch(getAskOrdersSuccess(payload))
      }
    })
  }
}

export const GET_ASK_ORDERS_SUCCESS = 'orders.GET_ASK_ORDERS_SUCCESS'
export const getAskOrdersSuccess = createAction(GET_ASK_ORDERS_SUCCESS)

export const GET_ASK_ORDERS_ERROR = 'orders.GET_ASK_ORDERS_ERROR'
export const getAskOrdersError = createAction(GET_ASK_ORDERS_ERROR)

export const GET_USER_ASK_ORDERS = 'orders.GET_USER_ASK_ORDERS'
export const getUserAskOrders = (assetId, account, pageNumber, pageSize) => {
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
    lastIndex,
    account
  }
  return dispatch => {
    dispatch(createAction(GET_USER_ASK_ORDERS)())
    return Promise.all([
      sendRequest('getExpectedAskOrders',
        { asset: assetId,
          firstIndex,
          lastIndex }),
      sendRequest('getAccountCurrentAskOrders', data)
    ]).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          return dispatch(getUserAskOrdersError(result.error))
        }
        let askOrders = [
          ...result[0].askOrders,
          ...result[1].askOrders
        ]
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(askOrders) && askOrders.length > pageSize) {
          payload.hasNext = true
          askOrders = askOrders.slice(0, pageSize)
        }
        payload.payload = askOrders
        payload.pageNumber = pageNumber
        dispatch(getUserAskOrdersSuccess(payload))
      }
    })
  }
}

export const GET_USER_ASK_ORDERS_ERROR = 'orders.GET_USER_ASK_ORDERS_ERROR'
export const getUserAskOrdersError = createAction(GET_USER_ASK_ORDERS_ERROR)

export const GET_USER_ASK_ORDERS_SUCCESS = 'orders.GET_USER_ASK_ORDERS_SUCCESS'
export const getUserAskOrdersSuccess = createAction(GET_USER_ASK_ORDERS_SUCCESS)

export const CANCEL_ORDER_CONFIRM = 'orders.CANCEL_ORDER_CONFIRM'
export const cancelOrderConfirm = createAction(CANCEL_ORDER_CONFIRM)

export const CANCEL_ORDER_CLOSE = 'orders.CANCEL_ORDER_CLOSE'
export const cancelOrderClose = createAction(CANCEL_ORDER_CLOSE)

export const CANCEL_ASK_ORDER = 'orders.CANCEL_ASK_ORDER'
export const cancelAskOrder = (orderID) => {
  return (dispatch, getState) => {
    dispatch(createAction(CANCEL_ASK_ORDER)())
    const url = 'cancelAskOrder'
    const secretPhrase = getState().auth.account.secretPhrase
    const data = {
      order: orderID,
      secretPhrase
    }
    return sendRequest(url, data).then((result) => {
      if (result) {
        if (result.error) {
          return dispatch(cancelAskOrderError(result))
        }
        const payload = { result: result }
        payload.order = orderID
        dispatch(cancelAskOrderSuccess(payload))
        dispatch(updatePage('askOrders', 1))
        dispatch(updatePage('userAskOrders', 1))
      }
    })
  }
}

export const CANCEL_ASK_ORDER_SUCCESS = 'orders.CANCEL_ASK_ORDER_SUCCESS'
export const cancelAskOrderSuccess = createAction(CANCEL_ASK_ORDER_SUCCESS)

export const CANCEL_ASK_ORDER_ERROR = 'orders.CANCEL_ASK_ORDER_ERROR'
export const cancelAskOrderError = createAction(CANCEL_ASK_ORDER_ERROR)

export const CANCEL_ASK_ORDER_CONFIRM = 'orders.CANCEL_ASK_ORDER_CONFIRM'
export const cancelAskOrderConfirm = createAction(CANCEL_ASK_ORDER_CONFIRM)

export const CANCEL_ASK_ORDER_CLOSE = 'orders.CANCEL_ASK_ORDER_CLOSE'
export const cancelAskOrderClose = createAction(CANCEL_ASK_ORDER_CLOSE)

export const CANCEL_BID_ORDER = 'orders.CANCEL_BID_ORDER'
export const cancelBidOrder = (orderID) => {
  return (dispatch, getState) => {
    dispatch(createAction(CANCEL_BID_ORDER)())
    const url = 'cancelBidOrder'
    const secretPhrase = getState().auth.account.secretPhrase
    const data = {
      order: orderID,
      secretPhrase
    }
    return sendRequest(url, data).then((result) => {
      if (result) {
        if (result.error) {
          return dispatch(cancelBidOrderError(result))
        }
        const payload = { result: result }
        payload.order = orderID
        dispatch(cancelBidOrderSuccess(payload))
        dispatch(updatePage('bidOrders', 1))
        dispatch(updatePage('userBidOrders', 1))
      }
    })
  }
}

export const CANCEL_BID_ORDER_SUCCESS = 'orders.CANCEL_BID_ORDER_SUCCESS'
export const cancelBidOrderSuccess = createAction(CANCEL_BID_ORDER_SUCCESS)

export const CANCEL_BID_ORDER_ERROR = 'orders.CANCEL_BID_ORDER_ERROR'
export const cancelBidOrderError = createAction(CANCEL_BID_ORDER_ERROR)

export const CANCEL_BID_ORDER_CONFIRM = 'orders.CANCEL_BID_ORDER_CONFIRM'
export const cancelBidOrderConfirm = createAction(CANCEL_BID_ORDER_CONFIRM)

export const CANCEL_BID_ORDER_CLOSE = 'orders.CANCEL_BID_ORDER_CLOSE'
export const cancelBidOrderClose = createAction(CANCEL_BID_ORDER_CLOSE)

export const UPDATE_PAGE = 'orders.UPDATE_PAGE'
export const updatePage = (type, pageNumber) => {
  return (dispatch, getState) => {
    if (pageNumber >= 1) {
      const assetId = getState().asset.selectedAsset.asset
      const account = getState().auth.account.accountRS
      switch (type) {
        case 'askOrders':
          dispatch(updateAskOrdersPageSuccess(pageNumber))
          dispatch(getAskOrders(assetId, pageNumber, getState().orders.askOrdersPageSize))
          break
        case 'bidOrders':
          dispatch(updateBidOrdersPageSuccess(pageNumber))
          dispatch(getBidOrders(assetId, pageNumber, getState().orders.bidOrdersPageSize))
          break
        case 'userAskOrders':
          dispatch(updateUserAskOrdersPageSuccess(pageNumber))
          dispatch(getUserAskOrders(assetId, account, pageNumber, getState().orders.userAskOrdersPageSize))
          break
        case 'userBidOrders':
          dispatch(updateUserBidOrdersPageSuccess(pageNumber))
          dispatch(getUserBidOrders(assetId, account, pageNumber, getState().orders.userBidOrdersPageSize))
          break
      }
    }
  }
}

export const UPDATE_ASK_ORDERS_PAGE_SUCCESS = 'orders.UPDATE_ASK_ORDERS_PAGE_SUCCESS'
export const updateAskOrdersPageSuccess = createAction(UPDATE_ASK_ORDERS_PAGE_SUCCESS)

export const UPDATE_BID_ORDERS_PAGE_SUCCESS = 'orders.UPDATE_BID_ORDERS_PAGE_SUCCESS'
export const updateBidOrdersPageSuccess = createAction(UPDATE_BID_ORDERS_PAGE_SUCCESS)

export const UPDATE_USER_ASK_ORDERS_PAGE_SUCCESS = 'orders.UPDATE_USER_ASK_ORDERS_PAGE_SUCCESS'
export const updateUserAskOrdersPageSuccess = createAction(UPDATE_USER_ASK_ORDERS_PAGE_SUCCESS)

export const UPDATE_USER_BID_ORDERS_PAGE_SUCCESS = 'orders.UPDATE_USER_BID_ORDERS_PAGE_SUCCESS'
export const updateUserBidOrdersPageSuccess = createAction(UPDATE_USER_BID_ORDERS_PAGE_SUCCESS)

export const SELECT_EXISTING_ORDER = 'orders.SELECT_EXISTING_ORDER'
export const selectExistingOrder = (value) => {
  return (dispatch, getState) => {
    createAction(SELECT_EXISTING_ORDER)
    const lastIndex = value.index
    const firstIndex = 0
    const asset = getState().asset.selectedAsset.asset
    const decimals = getState().asset.selectedAsset.decimals
    if (lastIndex !== 0) {
      let url
      if (value.type === 'askOrders') {
        url = 'getAskOrders'
      } else if (value.type === 'bidOrders') {
        url = 'getBidOrders'
      }
      const data = {
        firstIndex,
        lastIndex,
        asset
      }
      sendRequest(url, data).then((result) => {
        if (result && result[value.type]) {
          const combinedTotals = result[value.type].map((item) => {
            const qnt = convertQNTToQuantity(item['quantityQNT'], decimals)
            const dqt = convertDQTToPrice(item['priceDQT'], decimals)
            const bigQuantity = new BigNumber(qnt)
            const bigPrice = new BigNumber(dqt)
            const total = bigQuantity.times(bigPrice).toString(10)
            return parseFloat(total)
          })
          const totalSum = combinedTotals.reduce((a, b) => a + b, 0)
          const combinedQuantity = result[value.type].map((item) => {
            const qnt = convertQNTToQuantity(item['quantityQNT'], decimals)
            return parseFloat(qnt)
          })
          const totalQnt = combinedQuantity.reduce((a, b) => a + b, 0)
          value.total = totalSum
          value.quantity = totalQnt
          dispatch(selectExistingOrderSuccess(value))
        }
      })
    } else {
      dispatch(selectExistingOrderSuccess(value))
    }
  }
}

export const SELECT_EXISTING_ORDER_SUCCESS = 'orders.SELECT_EXISTING_ORDER_SUCCESS'
export const selectExistingOrderSuccess = createAction(SELECT_EXISTING_ORDER_SUCCESS)

export const CLEAR_EXISTING_ORDER = 'orders.CLEAR_EXISTING_ORDER'
export const clearExistingOrder = createAction(CLEAR_EXISTING_ORDER)

export const RETRIEVE_ORDER_TOTAL = 'orders.RETRIEVE_ORDER_TOTAL'
export const retrieveOrderTotal = (data) => {
  function getTotalQuantity (url, sendData, resultType, decimals) {
    return new Promise(resolve => {
      sendRequest(url, sendData).then((result) => {
        if (result && result[resultType]) {
          const quantityArray = result[resultType].map((item) => {
            const qnt = convertQNTToQuantity(item['quantityQNT'], decimals)
            const dqt = convertDQTToPrice(item['priceDQT'], decimals)
            const bigQuantity = new BigNumber(qnt)
            const bigPrice = new BigNumber(dqt)
            const total = bigQuantity.times(bigPrice).toString(10)
            return parseFloat(total)
          })
          quantityArray.splice(-1, 1)
          const total = quantityArray.reduce((a, b) => a + b, 0)
          resolve(total)
        }
      })
    })
  }
  return async (dispatch, getState) => {
    const { quantity, orderType } = data
    const asset = getState().asset.selectedAsset.asset
    const decimals = getState().asset.selectedAsset.decimals
    let url
    let resultType
    if (orderType === 'buy') {
      url = 'getAskOrders'
      resultType = 'askOrders'
    } else if (orderType === 'sell') {
      url = 'getBidOrders'
      resultType = 'bidOrders'
    }
    let lastIndex = 1
    let formQuantity = parseFloat(convertQuantityToQNT(quantity, decimals))
    for (; lastIndex < 20; lastIndex++) {
      const sendData = {
        firstIndex: 0,
        lastIndex,
        asset
      }
      let totalQnt = await getTotalQuantity(url, sendData, resultType, decimals)
      if (totalQnt >= formQuantity) { dispatch(retrieveOrderTotalSuccess(totalQnt)); break }
    }
  }
}

export const RETRIEVE_ORDER_TOTAL_SUCCESS = 'orders.RETRIEVE_ORDER_TOTAL_SUCCESS'
export const retrieveOrderTotalSuccess = createAction(RETRIEVE_ORDER_TOTAL_SUCCESS)

const initialState = {
  cancelAskOrderDialogIsOpen: false,
  cancelAskOrderDialogOrderId: '',
  cancelledAskOrdersIds: [],
  cancelBidOrderDialogIsOpen: false,
  cancelBidOrderDialogOrderId: '',
  cancelledBidOrdersIds: [],
  isLoadingAskOrders: false,
  isLoadingBidOrders: false,
  isLoadingUserAskOrders: false,
  isLoadingUserBidOrders: false,
  isCancellingAskOrder: false,
  isCancellingBidOrder: false,
  bidOrdersError: {},
  askOrdersError: {},
  bidOrders: [],
  askOrders: [],
  userBidOrders: [],
  userAskOrders: [],
  askOrdersHasNext: false,
  askOrdersHasPrev: true,
  bidOrdersHasNext: false,
  bidOrdersHasPrev: true,
  userAskOrdersHasNext: false,
  userAskOrdersHasPrev: true,
  userBidOrdersHasNext: false,
  userBidOrdersHasPrev: true,
  askOrdersPageSize: 5,
  askOrdersPageNumber: 1,
  bidOrdersPageSize: 5,
  bidOrdersPageNumber: 1,
  userAskOrdersPageSize: 5,
  userAskOrdersPageNumber: 1,
  userBidOrdersPageSize: 5,
  userBidOrdersPageNumber: 1,
  selectedOrder: {}
}

export default handleActions({

  [GET_ASK_ORDERS]: (state, { payload }) => ({
    ...state,
    isLoadingAskOrders: true
  }),

  [GET_ASK_ORDERS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingAskOrders: false,
      askOrders: payload.payload,
      askOrdersHasNext: payload.hasNext,
      askOrdersHasPrev: payload.hasPrev
    }
  },

  [GET_BID_ORDERS]: (state, { payload }) => ({
    ...state,
    isLoadingBidOrders: true
  }),

  [GET_BID_ORDERS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingBidOrders: false,
      bidOrders: payload.payload,
      bidOrdersHasNext: payload.hasNext,
      bidOrdersHasPrev: payload.hasPrev
    }
  },

  [GET_USER_BID_ORDERS]: (state, { payload }) => ({
    ...state,
    isLoadingUserBidOrders: true
  }),

  [GET_USER_BID_ORDERS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingUserBidOrders: false,
      userBidOrders: payload.payload,
      userBidOrdersHasNext: payload.hasNext,
      userBidOrdersHasPrev: payload.hasPrev
    }
  },

  [GET_USER_ASK_ORDERS]: (state, { payload }) => ({
    ...state,
    isLoadingUserAskOrders: true
  }),

  [GET_USER_ASK_ORDERS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingUserAskOrders: false,
      userAskOrders: payload.payload,
      userAskOrdersHasNext: payload.hasNext,
      userAskOrdersHasPrev: payload.hasPrev
    }
  },

  [CANCEL_ASK_ORDER]: (state, { payload }) => ({
    ...state,
    isCancellingAskOrder: true
  }),

  [CANCEL_ASK_ORDER_SUCCESS]: (state, { payload }) => {
    const cancelledOrders = state.cancelledAskOrdersIds
    if (!cancelledOrders.includes(payload.order)) {
      cancelledOrders.push(payload.order)
    }
    return {
      ...state,
      isCancellingAskOrder: false,
      cancelAskOrderDialogIsOpen: false,
      cancelledAskOrdersIds: cancelledOrders
    }
  },

  [CANCEL_BID_ORDER]: (state, { payload }) => ({
    ...state,
    isCancellingBidOrder: true
  }),

  [CANCEL_BID_ORDER_SUCCESS]: (state, { payload }) => {
    const cancelledOrders = state.cancelledBidOrdersIds
    if (!cancelledOrders.includes(payload.order)) {
      cancelledOrders.push(payload.order)
    }
    return {
      ...state,
      isCancellingBidOrder: false,
      cancelBidOrderDialogIsOpen: false,
      cancelledBidOrdersIds: cancelledOrders
    }
  },

  [CANCEL_BID_ORDER_CONFIRM]: (state, { payload }) => ({
    ...state,
    cancelBidOrderDialogIsOpen: true,
    cancelBidOrderDialogOrderId: payload
  }),

  [CANCEL_BID_ORDER_CLOSE]: (state, { payload }) => ({
    ...state,
    cancelBidOrderDialogIsOpen: false,
    cancelBidOrderDialogOrderId: ''
  }),

  [CANCEL_ASK_ORDER_CONFIRM]: (state, { payload }) => ({
    ...state,
    cancelAskOrderDialogIsOpen: true,
    cancelAskOrderDialogOrderId: payload
  }),

  [CANCEL_ASK_ORDER_CLOSE]: (state, { payload }) => ({
    ...state,
    cancelAskOrderDialogIsOpen: false,
    cancelAskOrderDialogOrderId: ''
  }),

  [UPDATE_ASK_ORDERS_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      askOrdersPageNumber: payload
    }
  },

  [UPDATE_BID_ORDERS_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      bidOrdersPageNumber: payload
    }
  },

  [UPDATE_USER_ASK_ORDERS_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      userAskOrdersPageNumber: payload
    }
  },
  [UPDATE_USER_BID_ORDERS_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      userBidOrdersPageNumber: payload
    }
  },

  [SELECT_EXISTING_ORDER_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      selectedOrder: payload
    }
  },

  [CLEAR_EXISTING_ORDER]: (state, { payload }) => {
    return {
      ...state,
      selectedOrder: {}
    }
  },
  [RETRIEVE_ORDER_TOTAL_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      selectedOrder: {
        total: payload
      }
    }
  }
}, initialState)
