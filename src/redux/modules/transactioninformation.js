import { createAction, handleActions } from 'redux-actions'
import { sendRequest } from 'redux/utils/api'

export const GET_TRANSACTION_INFORMATION = 'GET_TRANSACTION_INFORMATION'
export const getTransactionInformation = (transactionId) => {
  return (dispatch, getState) => {
    dispatch(createAction(GET_TRANSACTION_INFORMATION))
    return sendRequest('getTransaction', {
      transaction: transactionId
    }).then((result) => {
      if (result) {
        if (result.error) {
          return dispatch(getTransactionInformationError(result))
        }
        return dispatch(getTransactionInformationSuccess(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      return dispatch(getTransactionInformationError(err))
    })
  }
}

export const GET_TRANSACTION_INFORMATION_ERROR = 'GET_TRANSACTION_INFORMATION_ERROR'
export const getTransactionInformationError = createAction(GET_TRANSACTION_INFORMATION_ERROR)

export const GET_TRANSACTION_INFORMATION_SUCCESS = 'GET_TRANSACTION_INFORMATION_SUCCESS'
export const getTransactionInformationSuccess = createAction(GET_TRANSACTION_INFORMATION_SUCCESS)

export const OPEN_TRANSACTION_DIALOG = 'OPEN_TRANSACTION_DIALOG'
export const openTransactionDialog = (transactionId) => {
  return (dispatch) => {
    dispatch(openTransactionDialogSuccess(transactionId))
  }
}

export const OPEN_TRANSACTION_DIALOG_SUCCESS = 'OPEN_TRANSACTION_DIALOG_SUCCESS'
export const openTransactionDialogSuccess = createAction(OPEN_TRANSACTION_DIALOG_SUCCESS)

export const CLOSE_TRANSACTION_DIALOG = 'CLOSE_TRANSACTION_DIALOG'
export const closeTransactionDialog = createAction(CLOSE_TRANSACTION_DIALOG)

const initialState = {
  isLoadingTransactionInformation: false,
  transactionInformation: {},
  transactionDialogIsOpen: false,
  transactionInformationId: ''
}

export default handleActions({
  [GET_TRANSACTION_INFORMATION]: (state) => ({
    ...state,
    isLoadingTransactionInformation: true
  }),

  [GET_TRANSACTION_INFORMATION_SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoadingTransactionInformation: false,
    transactionInformation: payload
  }),

  [OPEN_TRANSACTION_DIALOG_SUCCESS]: (state, { payload }) => ({
    ...state,
    transactionDialogIsOpen: true,
    transactionInformationId: payload
  }),

  [CLOSE_TRANSACTION_DIALOG]: (state) => ({
    ...state,
    transactionDialogIsOpen: false,
    transactionInformationId: ''
  })
}, initialState)
