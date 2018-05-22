import { createAction, handleActions } from 'redux-actions'
import { sendRequest } from 'redux/utils/api'
import { exchange } from 'config.json'

export const GET_ASSET = 'GET_ASSET'
export const getAsset = (assetId) => {
  if (!assetId) assetId = exchange.assetId
  return (dispatch, getState) => {
    dispatch(createAction(GET_ASSET)())
    return sendRequest('getAsset', {
      asset: assetId,
      includeCounts: true
    }).then((result) => {
      if (result && result.asset) {
        return dispatch(getAssetSuccess(result))
      }
      if (result.error) {
        return dispatch(getAssetError())
      }
    }).fail((jqXHR, textStatus, err) => {
      return dispatch(getAssetError(err))
    })
  }
}

export const GET_ASSET_SUCCESS = 'GET_ASSET_SUCCESS'
export const getAssetSuccess = createAction(GET_ASSET_SUCCESS)

export const GET_ASSET_ERROR = 'GET_ASSET_ERROR'
export const getAssetError = createAction(GET_ASSET_ERROR)

export const GET_ASSET_CLEAR = 'GET_ASSET_CLEAR'
export const getAssetClear = createAction(GET_ASSET_CLEAR)

const initialState = {
  isLoadingAsset: false,
  selectedAssetError: {},
  selectedAsset: {}
}

export default handleActions({
  [GET_ASSET]: (state, { payload }) => ({
    ...state,
    isLoadingAsset: true
  }),

  [GET_ASSET_SUCCESS]: (state, { payload }) => ({
    ...state,
    selectedAsset: payload,
    isLoadingAsset: false
  }),

  [GET_ASSET_ERROR]: (state, { payload }) => ({
    ...state,
    selectedAssetError: payload,
    isLoadingAsset: false
  }),

  [GET_ASSET_CLEAR]: (state) => ({
    ...state,
    selectedAsset: {},
    isLoadingAsset: false
  })
}, initialState)
