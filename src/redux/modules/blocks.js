import { createAction, handleActions } from 'redux-actions'
import { sendRequest } from 'redux/utils/api'

export const GET_BLOCKS = 'blocks.GET_BLOCKS'
export const getBlocks = (pageNumber, pageSize) => {
  let firstIndex = null
  let lastIndex = null
  if (pageNumber && pageSize) {
    firstIndex = (pageNumber - 1) * pageSize
    lastIndex = firstIndex + pageSize + 1
  }
  const data = {
    firstIndex,
    lastIndex
  }
  return dispatch => {
    dispatch(createAction(GET_BLOCKS)())
    sendRequest('getBlocks', data).then((result) => {
      if (result) {
        if (result.error) {
          dispatch(getBlocksError(result.error))
        }
        let blocks = result.blocks
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(blocks) && blocks.length > pageSize) {
          payload.hasNext = true
          blocks = blocks.slice(0, pageSize)
        }
        payload.payload = blocks
        payload.pageNumber = pageNumber
        dispatch(getBlocksSuccess(payload))
      }
    }).fail((jqXHR, textStatus, err) => {
      dispatch(getBlocksError(err))
    })
  }
}

export const GET_BLOCKS_SUCCESS = 'blocks.GET_BLOCKS_SUCCESS'
export const getBlocksSuccess = createAction(GET_BLOCKS_SUCCESS)

export const GET_BLOCKS_ERROR = 'blocks.GET_BLOCKS_ERROR'
export const getBlocksError = createAction(GET_BLOCKS_ERROR)

export const UPDATE_BLOCKS_PAGE = 'blocks.UPDATE_BLOCKS_PAGE'
export const updateBlocksPage = (pageNumber) => {
  return (dispatch, getState) => {
    if (pageNumber >= 1) {
      dispatch(updateBlocksPageSuccess(pageNumber))
      dispatch(getBlocks(pageNumber, getState().transaction.blockchainTransactionsPageSize))
    }
  }
}

export const UPDATE_BLOCKS_PAGE_SUCCESS = 'blocks.UPDATE_BLOCKS_PAGE_SUCCESS'
export const updateBlocksPageSuccess = createAction(UPDATE_BLOCKS_PAGE_SUCCESS)

const initialState = {
  isLoadingBlocks: false,
  blocksPageSize: 5,
  blocksPageNumber: 1,
  blocksHasNext: false,
  blocksHasPrev: true,
  loadingBlocksError: {},
  selectedBlocks: []
}

export default handleActions({
  [GET_BLOCKS]: (state, { payload }) => ({
    ...state,
    isLoadingBlocks: true
  }),

  [GET_BLOCKS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingBlocks: false,
      selectedBlocks: payload.payload,
      blocksHasNext: payload.hasNext,
      blocksHasPrev: payload.hasPrev
    }
  },

  [GET_BLOCKS_ERROR]: (state, { payload }) => ({
    ...state,
    isLoadingBlocks: false,
    loadingBlocksError: payload
  }),

  [UPDATE_BLOCKS_PAGE_SUCCESS]: (state, { payload }) => ({
    ...state,
    blocksPageNumber: payload
  })

}, initialState)
