import { createAction, handleActions } from 'redux-actions'
import { get, post, put } from 'redux/utils/api'
import { generateToken } from 'nxt-crypto'
import { convertDBNToDQT, convertDQTToDBN } from 'redux/utils/nrs'
import { getBlockchainTransactions } from 'redux/modules/transaction'

export const GET_VOUCHERS = 'vouchers.GET_VOUCHERS'
export const getVouchers = (pageNumber, pageSize) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    const token = generateToken('admin', secretPhrase)
    let firstIndex = null
    let lastIndex = null
    if (pageNumber && pageSize) {
      firstIndex = (pageNumber - 1) * pageSize
      lastIndex = firstIndex + pageSize + 1
    }
    const data = {
      token,
      offset: firstIndex,
      limit: lastIndex
    }
    dispatch(createAction(GET_VOUCHERS)())
    return get('admin/vouchers', data).then((result) => {
      if (result) {
        if (result.status === 'error') {
          return dispatch(getVouchersError(result.error))
        } else if (result.status === 'success') {
          let vouchers = result.vouchers
          const payload = {}
          payload.hasPrev = true
          payload.hasNext = false
          if (pageNumber === 1) {
            payload.hasPrev = false
          }
          if (Array.isArray(vouchers) && vouchers.length > pageSize) {
            payload.hasNext = true
            vouchers = vouchers.slice(0, pageSize)
          }
          payload.payload = vouchers
          payload.pageNumber = pageNumber
          dispatch(getVouchersSuccess(payload))
        }
      }
    })
  }
}

export const GET_VOUCHERS_SUCCESS = 'vouchers.GET_VOUCHERS_SUCCESS'
export const getVouchersSuccess = createAction(GET_VOUCHERS_SUCCESS)

export const GET_VOUCHERS_ERROR = 'vouchers.GET_VOUCHERS_ERROR'
export const getVouchersError = createAction(GET_VOUCHERS_ERROR)

export const CREATE_VOUCHER = 'vouchers.CREATE_VOUCHER'
export const createVoucher = (data) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    const token = generateToken('admin', secretPhrase)
    data.token = token
    data.value = parseFloat(convertDBNToDQT(data.value))
    const url = 'admin/voucher'
    dispatch(createAction(CREATE_VOUCHER)())
    post(url, data).then((result) => {
      if (result) {
        dispatch(createVoucherSuccess(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      dispatch(createVoucherError(err))
    })
  }
}

export const CREATE_VOUCHER_SUCCESS = 'vouchers.CREATE_VOUCHER_SUCCESS'
export const createVoucherSuccess = createAction(CREATE_VOUCHER_SUCCESS)

export const CREATE_VOUCHER_ERROR = 'vouchers.CREATE_VOUCHER_ERROR'
export const createVoucherError = createAction(CREATE_VOUCHER_ERROR)

export const OPEN_VOUCHER_DIALOG = 'vouchers.OPEN_VOUCHER_DIALOG'
export const openVoucherDialog = createAction(OPEN_VOUCHER_DIALOG)

export const CLOSE_VOUCHER_DIALOG = 'vouchers.CLOSE_VOUCHER_DIALOG'
export const closeVoucherDialog = createAction(CLOSE_VOUCHER_DIALOG)

export const UPDATE_VOUCHERS_PAGE = 'vouchers.UPDATE_VOUCHERS_PAGE'
export const updateVouchersPage = (pageNumber) => {
  return (dispatch, getState) => {
    if (pageNumber >= 1) {
      dispatch(updateVouchersPageSuccess(pageNumber))
      dispatch(getVouchers(pageNumber, getState().vouchers.vouchersPageSize))
    }
  }
}

export const UPDATE_VOUCHERS_PAGE_SUCCESS = 'vouchers.UPDATE_VOUCHERS_PAGE_SUCCESS'
export const updateVouchersPageSuccess = createAction(UPDATE_VOUCHERS_PAGE_SUCCESS)

export const OPEN_REDEEM_VOUCHER_DIALOG = 'vouchers.OPEN_REDEEM_VOUCHER_DIALOG'
export const openRedeemVoucherDialog = createAction(OPEN_REDEEM_VOUCHER_DIALOG)

export const CLOSE_REDEEM_VOUCHER_DIALOG = 'vouchers.CLOSE_REDEEM_VOUCHER_DIALOG'
export const closeRedeemVoucherDialog = createAction(CLOSE_REDEEM_VOUCHER_DIALOG)

export const GET_VOUCHER_BY_CODE = 'vouchers.GET_VOUCHER_BY_CODE'
export const getVoucherByCode = (code) => {
  return (dispatch, getState) => {
    const {
      accountRS,
      secretPhrase
    } = getState().auth.account
    const token = generateToken(accountRS, secretPhrase)
    const url = 'voucher'
    const data = {
      accountRS,
      token,
      code
    }
    dispatch(createAction(GET_VOUCHER_BY_CODE)())
    return post(url, data).then((result) => {
      if (result) {
        if (result.status === 'error') {
          dispatch(getVoucherByCodeError(result))
        } else if (result.status === 'success') {
          dispatch(getVoucherByCodeSuccess(result))
        }
      }
    })
  }
}

export const GET_VOUCHER_BY_CODE_SUCCESS = 'vouchers.GET_VOUCHER_BY_CODE_SUCCESS'
export const getVoucherByCodeSuccess = createAction(GET_VOUCHER_BY_CODE_SUCCESS)

export const GET_VOUCHER_BY_CODE_ERROR = 'vouchers.GET_VOUCHER_BY_CODE_ERROR'
export const getVoucherByCodeError = createAction(GET_VOUCHER_BY_CODE_ERROR)

export const CLEAR_VOUCHER_BY_CODE = 'vouchers.CLEAR_VOUCHER_BY_CODE'
export const clearVoucherByCode = createAction(CLEAR_VOUCHER_BY_CODE)

export const REDEEM_VOUCHER = 'vouchers.REDEEM_VOUCHER'
export const redeemVoucher = (code) => {
  return (dispatch, getState) => {
    dispatch(createAction(REDEEM_VOUCHER)())
    const {
      accountRS,
      secretPhrase
    } = getState().auth.account
    const token = generateToken(accountRS, secretPhrase)
    const url = 'voucher'
    const data = {
      accountRS,
      token,
      code: code.code
    }
    const { blockchainTransactionsPageSize,
      blockchainTransactionsPageNumber } = getState().transaction
    closeVoucherDialog()
    return put(url, data).then((result) => {
      if (result) {
        if (result.status === 'error') {
          dispatch(redeemVoucherError(result))
        } else if (result.status === 'success') {
          dispatch(redeemVoucherSuccess(result))
          dispatch(getBlockchainTransactions(accountRS,
            blockchainTransactionsPageNumber, blockchainTransactionsPageSize))
        }
      }
    })
  }
}

export const REDEEM_VOUCHER_SUCCESS = 'vouchers.REDEEM_VOUCHER_SUCCESS'
export const redeemVoucherSuccess = createAction(REDEEM_VOUCHER_SUCCESS)

export const REDEEM_VOUCHER_ERROR = 'vouchers.REDEEM_VOUCHER_ERROR'
export const redeemVoucherError = createAction(REDEEM_VOUCHER_ERROR)

const initialState = {
  isCreatingVoucher: false,
  hasCreatedVoucher: false,
  isLoadingVouchers: false,
  hasLoadedVouchers: false,
  createVoucherSuccess: {},
  createVoucherError: '',
  vouchers: [],
  vouchersPageSize: 5,
  vouchersPageNumber: 1,
  vouchersHasNext: false,
  vouchersHasPrev: true,
  voucherDialogIsOpen: false,
  redeemVoucherDialogIsOpen: false,
  isLoadingRedemptionVoucher: false,
  hasLoadedRedemptionVoucher: false,
  voucherToRedeem: {},
  voucherToRedeemError: '',
  redeemVoucherError: '',
  redeemVoucherSuccess: {},
  voucherHasBeenRedeemed: false
}

export default handleActions({
  [GET_VOUCHERS]: (state) => {
    return {
      ...state,
      isLoadingVouchers: true
    }
  },

  [GET_VOUCHERS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingVouchers: false,
      hasLoadedVouchers: true,
      vouchers: payload.payload,
      vouchersHasNext: payload.hasNext,
      vouchersHasPrev: payload.hasPrev
    }
  },

  [GET_VOUCHERS_ERROR]: (state, { payload }) => {
    return {
      ...state,
      isLoadingVouchers: false,
      hasLoadedVouchers: false,
      createVoucherError: payload.errorDescription
    }
  },

  [CREATE_VOUCHER]: (state) => {
    return {
      ...state,
      isCreatingVoucher: true
    }
  },

  [CREATE_VOUCHER_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isCreatingVoucher: false,
      hasCreatedVoucher: true,
      createVoucherSuccess: payload
    }
  },

  [CREATE_VOUCHER_ERROR]: (state, { payload }) => {
    return {
      ...state,
      isCreatingVoucher: false,
      hasCreatedVoucher: true,
      createVoucherError: payload
    }
  },

  [OPEN_VOUCHER_DIALOG]: (state) => {
    return {
      ...state,
      voucherDialogIsOpen: true
    }
  },

  [CLOSE_VOUCHER_DIALOG]: (state) => {
    return {
      ...state,
      voucherDialogIsOpen: false,
      hasCreatedVoucher: false,
      createVoucherError: '',
      createVoucherSuccess: {}
    }
  },

  [UPDATE_VOUCHERS_PAGE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      vouchersPageNumber: payload
    }
  },

  [OPEN_REDEEM_VOUCHER_DIALOG]: (state) => {
    return {
      ...state,
      redeemVoucherDialogIsOpen: true
    }
  },

  [CLOSE_REDEEM_VOUCHER_DIALOG]: (state) => {
    return {
      ...state,
      redeemVoucherDialogIsOpen: false,
      voucherHasBeenRedeemed: false,
      redeemVoucherSuccess: {},
      redeemVoucherError: '',
      voucherToRedeem: {},
      voucherToRedeemError: ''
    }
  },

  [GET_VOUCHER_BY_CODE]: (state) => {
    return {
      ...state,
      isLoadingRedemptionVoucher: true,
      voucherToRedeem: {}
    }
  },

  [GET_VOUCHER_BY_CODE_SUCCESS]: (state, { payload }) => {
    payload.voucher.value = convertDQTToDBN(payload.voucher.value)
    return {
      ...state,
      isLoadingRedemptionVoucher: false,
      hasLoadedRedemptionVoucher: true,
      voucherToRedeem: payload.voucher
    }
  },

  [GET_VOUCHER_BY_CODE_ERROR]: (state, { payload }) => {
    return {
      ...state,
      isLoadingRedemptionVoucher: false,
      hasLoadedRedemptionVoucher: true,
      voucherToRedeemError: payload.errorMessage || payload.errorDescription
    }
  },

  [CLEAR_VOUCHER_BY_CODE]: (state) => {
    return {
      ...state,
      isLoadingRedemptionVoucher: false,
      hasLoadedRedemptionVoucher: false,
      voucherToRedeem: {},
      voucherToRedeemError: ''
    }
  },

  [REDEEM_VOUCHER_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      voucherHasBeenRedeemed: true,
      redeemVoucherSuccess: payload.voucher
    }
  },

  [REDEEM_VOUCHER_ERROR]: (state, { payload }) => {
    return {
      ...state,
      voucherHasBeenRedeemed: true,
      redeemVoucherError: payload.errorMessage || payload.errorDescription
    }
  }
}, initialState)
