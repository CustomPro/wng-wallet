import { createAction, handleActions } from 'redux-actions'
import { sendRequest } from 'redux/utils/api'

export const GET_BLOCK_INFORMATION = 'GET_BLOCK_INFORMATION'
export const getBlockInformation = (blockId) => {
  return (dispatch, getState) => {
    dispatch(createAction(GET_BLOCK_INFORMATION))
    return Promise.all([
      sendRequest('getBlock', { block: blockId }),
      sendRequest('getBlock', { height: blockId })
    ]).then((result) => {
      if (result[0].hasOwnProperty('errorCode') && result[1].hasOwnProperty('errorCode')) {
        return dispatch(getBlockInformationError(result[0]))
      } else {
        if (result[0].hasOwnProperty('block')) {
          return dispatch(getBlockInformationSuccess(result[0]))
        }
        if (result[1].hasOwnProperty('block')) {
          return dispatch(getBlockInformationSuccess(result[1]))
        }
      }
    })
  }
}

export const GET_BLOCK_INFORMATION_ERROR = 'GET_BLOCK_INFORMATION_ERROR'
export const getBlockInformationError = createAction(GET_BLOCK_INFORMATION_ERROR)

export const GET_BLOCK_INFORMATION_SUCCESS = 'GET_BLOCK_INFORMATION_SUCCESS'
export const getBlockInformationSuccess = createAction(GET_BLOCK_INFORMATION_SUCCESS)

export const OPEN_BLOCK_DIALOG = 'OPEN_BLOCK_DIALOG'
export const openBlockDialog = (blockId) => {
  return (dispatch) => {
    dispatch(openBlockDialogSuccess(blockId))
  }
}

export const OPEN_BLOCK_DIALOG_SUCCESS = 'OPEN_BLOCK_DIALOG_SUCCESS'
export const openBlockDialogSuccess = createAction(OPEN_BLOCK_DIALOG_SUCCESS)

export const CLOSE_BLOCK_DIALOG = 'CLOSE_BLOCK_DIALOG'
export const closeBlockDialog = createAction(CLOSE_BLOCK_DIALOG)

const initialState = {
  isLoadingBlockInformation: false,
  blockInformation: {},
  blockDialogIsOpen: false,
  blockInformationId: ''
}

export default handleActions({
  [GET_BLOCK_INFORMATION]: (state) => ({
    ...state,
    isLoadingBlockInformation: true
  }),

  [GET_BLOCK_INFORMATION_SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoadingBlockInformation: false,
    blockInformation: payload
  }),

  [OPEN_BLOCK_DIALOG_SUCCESS]: (state, { payload }) => ({
    ...state,
    blockDialogIsOpen: true,
    blockInformationId: payload
  }),

  [CLOSE_BLOCK_DIALOG]: (state) => ({
    ...state,
    blockDialogIsOpen: false,
    blockInformationId: ''
  })
}, initialState)
