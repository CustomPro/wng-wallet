import { createAction, handleActions } from 'redux-actions'
import { generateToken } from 'nxt-crypto'
import { sendRequest, get } from 'redux/utils/api'
import { balances } from 'config.json'
import {
  convertQuantityToQNT,
  convertPriceToDQT,
  convertDBNToDQT
} from 'redux/utils/nrs'

export const GET_ASSETS = 'GET_ASSETS'
export const getAssets = () => {
  return (dispatch, getState) => {
    const { secretPhrase, accountRS } = getState().auth.account
    dispatch(createAction(GET_ASSETS)())
    const params = '&accountRS='+accountRS+'&assets=' + balances.assetIds.join('&assets=')

    sendRequest('getAssets', {}, true, params).then((result) => {
      if (result && result.assets) {
        dispatch(getAssetsSuccess(result.assets))
      }
    })
  }
}

export const GET_ASSETS_SUCCESS = 'GET_ASSETS_SUCCESS'
export const getAssetsSuccess = createAction(GET_ASSETS_SUCCESS)

export const OPEN_SEND_BALANCE_DIALOG = 'OPEN_SEND_BALANCE_DIALOG'
export const openSendBalanceDialog = (assetId) => {
  return (dispatch) => {
    dispatch(openSendBalanceDialogSuccess(assetId))
  }
}

export const OPEN_SEND_BALANCE_DIALOG_SUCCESS = 'OPEN_SEND_BALANCE_DIALOG_SUCCESS'
export const openSendBalanceDialogSuccess = createAction(OPEN_SEND_BALANCE_DIALOG_SUCCESS)

export const CLOSE_SEND_BALANCE_DIALOG = 'CLOSE_SEND_BALANCE_DIALOG'
export const closeSendBalanceDialog = createAction(CLOSE_SEND_BALANCE_DIALOG)

export const OPEN_WITHDRAW_BALANCE_DIALOG = 'OPEN_WITHDRAW_BALANCE_DIALOG'
export const openWithdrawBalanceDialog = (assetId) => {
  return (dispatch) => {
    dispatch(openWithdrawBalanceDialogSuccess(assetId))
  }
}

export const OPEN_WITHDRAW_BALANCE_DIALOG_SUCCESS = 'OPEN_WITHDRAW_BALANCE_DIALOG_SUCCESS'
export const openWithdrawBalanceDialogSuccess = createAction(OPEN_WITHDRAW_BALANCE_DIALOG_SUCCESS)

export const CLOSE_WITHDRAW_BALANCE_DIALOG = 'CLOSE_WITHDRAW_BALANCE_DIALOG'
export const closeWithdrawBalanceDialog = createAction(CLOSE_WITHDRAW_BALANCE_DIALOG)

export const OPEN_DEPOSIT_BALANCE_DIALOG = 'OPEN_DEPOSIT_BALANCE_DIALOG'
export const openDepositBalanceDialog = (assetId) => {
  return (dispatch) => {
    dispatch(openDepositBalanceDialogSuccess(assetId))
  }
}

export const OPEN_DEPOSIT_BALANCE_DIALOG_SUCCESS = 'OPEN_DEPOSIT_BALANCE_DIALOG_SUCCESS'
export const openDepositBalanceDialogSuccess = createAction(OPEN_DEPOSIT_BALANCE_DIALOG_SUCCESS)

export const CLOSE_DEPOSIT_BALANCE_DIALOG = 'CLOSE_DEPOSIT_BALANCE_DIALOG'
export const closeDepositBalanceDialog = createAction(CLOSE_DEPOSIT_BALANCE_DIALOG)

export const POST_SEND_BALANCE = 'POST_SEND_BALANCE'
export const postSendBalance = (assetId, secretPhrase, recipient, quantity, decimals, fee) => {
  const url = 'transferAsset'
  return (dispatch, getState) => {
    dispatch(createAction(POST_SEND_BALANCE)())
    return sendRequest(url, {
      asset: assetId,
      secretPhrase,
      recipient,
      quantityQNT: parseInt(convertQuantityToQNT(quantity, decimals)),
      feeDQT: convertDBNToDQT(fee)
    }).then((result) => {
      if (result.transaction) {
        dispatch(postSendBalanceSuccess(result))
      } else if (result.errorCode) {
        return dispatch(postSendBalanceError(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      if (err) { return dispatch(postSendBalanceError(err)) } else {
        const error = { errorCode: 0, errorDescription: 'An unknown error occured' }
        return dispatch(postSendBalanceError(error))
      }
    })
  }
}

export const POST_SEND_BALANCE_SUCCESS = 'POST_SEND_BALANCE_SUCCESS'
export const postSendBalanceSuccess = createAction(POST_SEND_BALANCE_SUCCESS)

export const POST_SEND_BALANCE_ERROR = 'POST_SEND_BALANCE_ERROR'
export const postSendBalanceError = createAction(POST_SEND_BALANCE_ERROR)

export const POST_BUY_ORDER = 'POST_BUY_ORDER'
export const postBuyOrder = (assetId, secretPhrase, quantity, price, decimals) => {
  return (dispatch, getState) => {
    dispatch(createAction(POST_BUY_ORDER)())
    return sendRequest('placeBidOrder', {
      asset: assetId,
      secretPhrase,
      quantityQNT: convertQuantityToQNT(quantity, decimals),
      priceDQT: convertPriceToDQT(price, decimals)
    }).then((result) => {
      if (result) {
        if (result.errorCode) {
          return dispatch(postBuyOrderError(result))
        }
        return dispatch(postBuyOrderSuccess(result))
      }
    }).fail(() => {
      const error = { errorCode: 0, errorDescription: 'An unknown error occured' }
      return dispatch(postBuyOrderError(error))
    })
  }
}

export const POST_BUY_ORDER_SUCCESS = 'POST_BUY_ORDER_SUCCESS'
export const postBuyOrderSuccess = createAction(POST_BUY_ORDER_SUCCESS)

export const POST_BUY_ORDER_ERROR = 'POST_BUY_ORDER_ERROR'
export const postBuyOrderError = createAction(POST_BUY_ORDER_ERROR)

export const POST_SELL_ORDER = 'POST_SELL_ORDER'
export const postSellOrder = (assetId, secretPhrase, quantity, price, decimals) => {
  return (dispatch, getState) => {
    dispatch(createAction(POST_SELL_ORDER)())
    return sendRequest('placeBidOrder', {
      asset: assetId,
      secretPhrase,
      quantityQNT: convertQuantityToQNT(quantity, decimals),
      priceDQT: convertPriceToDQT(price, decimals)
    }).then((result) => {
      if (result) {
        if (result.errorCode) {
          return dispatch(postSellOrderError(result))
        }
        return dispatch(postSellOrderSuccess(result))
      }
    }).fail(() => {
      const error = { errorCode: 0, errorDescription: 'An unknown error occured' }
      return dispatch(postSellOrderError(error))
    })
  }
}

export const POST_SELL_ORDER_SUCCESS = 'POST_SELL_ORDER_SUCCESS'
export const postSellOrderSuccess = createAction(POST_SELL_ORDER_SUCCESS)

export const POST_SELL_ORDER_ERROR = 'POST_SELL_ORDER_ERROR'
export const postSellOrderError = createAction(POST_SELL_ORDER_ERROR)

export const SEND_BALANCE_SET_PAGE = 'balances.SEND_BALANCE_SET_PAGE'
export const sendBalanceSetPage = (page) => {
  return (dispatch, getState) => {
    dispatch(createAction(SEND_BALANCE_SET_PAGE)())
    dispatch(sendBalanceSetPageSuccess(page))
  }
}

export const SEND_BALANCE_SET_PAGE_SUCCESS = 'balances.SEND_BALANCE_SET_PAGE_SUCCESS'
export const sendBalanceSetPageSuccess = createAction(SEND_BALANCE_SET_PAGE_SUCCESS)

export const GET_BITCOIN_ADDRESS = 'balances.GET_BITCOIN_ADDRESS'
export const getBitcoinAddress = () => {
  return (dispatch, getState) => {
    const { secretPhrase, accountRS } = getState().auth.account
    const token = generateToken(accountRS, secretPhrase)

    get(`bitcoin/deposit/${accountRS}?token=${token}`)
      .then((result) => {
        if (result) {
          dispatch(getBitcoinAddressSuccess(result.depositAddress))
        }
      })
  }
}

export const GET_BITCOIN_ADDRESS_SUCCESS = 'balances.GET_BITCOIN_ADDRESS_SUCCESS'
export const getBitcoinAddressSuccess = createAction(GET_BITCOIN_ADDRESS_SUCCESS)

const initialState = {
  selectedAssets: [],
  isLoadingAssets: false,
  hasLoadedAssets: false,
  sendBalanceDialogIsOpen: false,
  depositBalanceDialogIsOpen: false,
  withdrawBalanceDialogIsOpen: false,
  selectedBalanceAssetId: null,
  isPostingSendBalance: false,
  isPostingBuyOrder: false,
  isPostingSellOrder: false,
  hasPostedSendBalance: false,
  hasPostedBuyOrder: false,
  hasPostedSellOrder: false,
  postSendBalanceSuccess: {},
  postBuyOrderSuccess: {},
  postSellOrderSuccess: {},
  postSendBalanceError: {},
  postBuyOrderError: {},
  postSellOrderError: {},
  sendBalanceStep: 1,
  bitcoinAddress: ''
}

export default handleActions({

  [GET_ASSETS]: (state, { payload }) => ({
    ...state,
    isLoadingAssets: true
  }),

  [GET_ASSETS_SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoadingAssets: false,
    hasLoadedAssets: true,
    selectedAssets: payload
  }),

  [OPEN_SEND_BALANCE_DIALOG_SUCCESS]: (state, { payload }) => ({
    ...state,
    sendBalanceDialogIsOpen: true,
    selectedBalanceAssetId: payload
  }),

  [CLOSE_SEND_BALANCE_DIALOG]: (state) => ({
    ...state,
    sendBalanceDialogIsOpen: false,
    selectedBalanceAssetId: null,
    sendBalanceStep: 1,
    hasPostedSendBalance: false,
    postSendBalanceSuccess: {},
    postSendBalanceError: {}
  }),

  [OPEN_DEPOSIT_BALANCE_DIALOG_SUCCESS]: (state, { payload }) => ({
    ...state,
    depositBalanceDialogIsOpen: true,
    selectedBalanceAssetId: payload
  }),

  [CLOSE_DEPOSIT_BALANCE_DIALOG]: (state) => ({
    ...state,
    depositBalanceDialogIsOpen: false,
    selectedBalanceAssetId: null
  }),

  [OPEN_WITHDRAW_BALANCE_DIALOG_SUCCESS]: (state, { payload }) => ({
    ...state,
    withdrawBalanceDialogIsOpen: true,
    selectedBalanceAssetId: payload
  }),

  [CLOSE_WITHDRAW_BALANCE_DIALOG]: (state) => ({
    ...state,
    withdrawBalanceDialogIsOpen: false,
    selectedBalanceAssetId: null
  }),

  [POST_SEND_BALANCE]: (state) => ({
    ...state,
    isPostingSendBalance: true,
    hasPostedSendBalance: false
  }),

  [POST_SEND_BALANCE_SUCCESS]: (state, { payload }) => ({
    ...state,
    isPostingSendBalance: false,
    hasPostedSendBalance: true,
    postSendBalanceSuccess: payload
  }),

  [POST_SEND_BALANCE_ERROR]: (state, { payload }) => ({
    ...state,
    isPostingSendBalance: false,
    hasPostedSendBalance: false,
    postSendBalanceError: payload
  }),

  [POST_BUY_ORDER]: (state) => ({
    ...state,
    isPostingBuyOrder: true,
    hasPostedBuyOrder: false
  }),

  [POST_BUY_ORDER_SUCCESS]: (state, { payload }) => ({
    ...state,
    isPostingBuyOrder: true,
    hasPostedBuyOrder: true,
    postBuyOrderSuccess: payload
  }),

  [POST_BUY_ORDER_ERROR]: (state, { payload }) => ({
    ...state,
    isPostingBuyOrder: false,
    hasPostedBuyOrder: false,
    postBuyOrderError: payload
  }),

  [POST_SELL_ORDER]: (state) => ({
    ...state,
    isPostingSellOrder: true,
    hasPostedSellOrder: false
  }),

  [POST_SELL_ORDER_SUCCESS]: (state, { payload }) => ({
    ...state,
    isPostingSellOrder: true,
    hasPostedSellOrder: true,
    postSellOrderSuccess: payload
  }),

  [POST_SELL_ORDER_ERROR]: (state, { payload }) => ({
    ...state,
    isPostingSellOrder: false,
    hasPostedSellOrder: false,
    postSellOrderError: payload
  }),

  [SEND_BALANCE_SET_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      sendBalanceStep: payload
    }
  },

  [GET_BITCOIN_ADDRESS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      bitcoinAddress: payload
    }
  }
}, initialState)
