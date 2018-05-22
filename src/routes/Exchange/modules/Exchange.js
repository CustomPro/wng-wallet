import { createAction, handleActions } from 'redux-actions'
import { sendRequest } from 'redux/utils/api'
import { exchange } from 'config.json'
import {
  convertQuantityToQNT,
  convertPriceToDQT,
  convertDBNToDQT
} from 'redux/utils/nrs'

export const POST_ORDER = 'exchange.POST_ORDER'
export const postOrder = (assetId, secretPhrase, type, quantity, price, decimals, fee) => {
  if (!assetId) assetId = exchange.assetId
  let url
  if (type === 'buy') {
    url = 'placeBidOrder'
  }
  if (type === 'sell') {
    url = 'placeAskOrder'
  }
  /*const sendingdata = {
    assetId: assetId,
    secretPhrase: secretPhrase,
    type: type,
    quantity: quantity,
    price: price,
    decimals: decimals,
    fee: fee
  }
  console.log(sendingdata)*/
  return (dispatch, getState) => {
    dispatch(createAction(POST_ORDER)())
    return sendRequest(url, {
      asset: assetId,
      secretPhrase,
      quantityQNT: convertQuantityToQNT(quantity, decimals),
      priceDQT: convertPriceToDQT(price, decimals),
      feeDQT: convertDBNToDQT(fee)
    }).then((result) => {
      if (result) {
        if (result.errorCode) {
          return dispatch(postOrderError(result))
        }
        return dispatch(postOrderSuccess(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      if (err) {
        return dispatch(postOrderError(err))
      } else {
        const error = { errorCode: 0, errorDescription: 'An unknown error occured' }
        return dispatch(postOrderError(error))
      }
    })
  }
}

export const POST_ORDER_SUCCESS = 'exchange.POST_ORDER_SUCCESS'
export const postOrderSuccess = createAction(POST_ORDER_SUCCESS)

export const POST_ORDER_ERROR = 'exchange.POST_ORDER_ERROR'
export const postOrderError = createAction(POST_ORDER_ERROR)

export const GET_ACCOUNT_BALANCE = 'exchange.GET_ACCOUNT_BALANCE'
export const getAccountBalance = (account) => {
  return (dispatch, getState) => {
    dispatch(createAction(GET_ACCOUNT_BALANCE)())
    return sendRequest('getAccount', {
      account,
      includeAssets: true
    }).then((result) => {
      if (result) {
        if (result.error) {
          return dispatch(getAccountBalanceError(result))
        }
        return dispatch(getAccountBalanceSuccess(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      const error = { errorCode: 0, errorDescription: 'An unknown error occured' }
      return dispatch(getAccountBalanceError(error))
    })
  }
}

export const GET_ACCOUNT_BALANCE_ERROR = 'exchange.GET_ACCOUNT_BALANCE_ERROR'
export const getAccountBalanceError = createAction(GET_ACCOUNT_BALANCE_ERROR)

export const GET_ACCOUNT_BALANCE_SUCCESS = 'exchange.GET_ACCOUNT_BALANCE_SUCCESS'
export const getAccountBalanceSuccess = createAction(GET_ACCOUNT_BALANCE_SUCCESS)

export const OPEN_ORDER_DIALOG = 'OPEN_ORDER_DIALOG'
export const openOrderDialog = (values) => {
  return (dispatch) => {
    dispatch(openOrderDialogSuccess(values))
  }
}

export const OPEN_ORDER_DIALOG_SUCCESS = 'exchange.OPEN_ORDER_DIALOG_SUCCESS'
export const openOrderDialogSuccess = createAction(OPEN_ORDER_DIALOG_SUCCESS)

export const CLOSE_ORDER_DIALOG = 'exchange.CLOSE_ORDER_DIALOG'
export const closeOrderDialog = createAction(CLOSE_ORDER_DIALOG)

const initialState = {
  isPostingOrder: false,
  hasPostedOrder: false,
  postOrderSuccess: {},
  postOrderError: {},
  orderDialogIsOpen: false,
  orderValues: {},
  order: {
    type: 'buy'
  }
}

export default handleActions({

  [POST_ORDER]: (state) => ({
    ...state,
    isPostingOrder: true,
    hasPostedOrder: false
  }),

  [POST_ORDER_SUCCESS]: (state, { payload }) => ({
    ...state,
    isPostingOrder: false,
    hasPostedOrder: true,
    postOrderSuccess: payload
  }),

  [POST_ORDER_ERROR]: (state, { payload }) => ({
    ...state,
    isPostingOrder: false,
    hasPostedOrder: true,
    postOrderError: payload
  }),

  [GET_ACCOUNT_BALANCE]: (state) => ({
    ...state,
    isGettingAccountBalance: true
  }),

  [GET_ACCOUNT_BALANCE_SUCCESS]: (state, { payload }) => ({
    ...state,
    accountBalance: payload
  }),

  [OPEN_ORDER_DIALOG_SUCCESS]: (state, { payload }) => ({
    ...state,
    orderDialogIsOpen: true,
    orderValues: payload
  }),

  [CLOSE_ORDER_DIALOG]: (state) => ({
    ...state,
    orderDialogIsOpen: false,
    orderValues: null
  })
}, initialState)
