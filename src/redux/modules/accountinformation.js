import { createAction, handleActions } from 'redux-actions'
import { sendRequest } from 'redux/utils/api'

export const GET_ACCOUNT_INFORMATION = 'GET_ACCOUNT_INFORMATION'
export const getAccountInformation = (accountId) => {
  return (dispatch, getState) => {
    dispatch(createAction(GET_ACCOUNT_INFORMATION))
    return sendRequest('getAccount', {
      account: accountId,
      includeAssets: true,
      includeLessors: true,
      includeCurrencies: true,
      includeEffectiveBalance: true
    }).then((result) => {
      if (result) {
        if (result.error) {
          return dispatch(getAccountInformationError(result))
        }
        return dispatch(getAccountInformationSuccess(result))
      }
    }).fail((jqXHR, textStatus, err) => {
      return dispatch(getAccountInformationError(err))
    })
  }
}

export const GET_ACCOUNT_INFORMATION_ERROR = 'GET_ACCOUNT_INFORMATION_ERROR'
export const getAccountInformationError = createAction(GET_ACCOUNT_INFORMATION_ERROR)

export const GET_ACCOUNT_INFORMATION_SUCCESS = 'GET_ACCOUNT_INFORMATION_SUCCESS'
export const getAccountInformationSuccess = createAction(GET_ACCOUNT_INFORMATION_SUCCESS)

export const GET_ACCOUNT_INFORMATION_PROPERTIES = 'GET_ACCOUNT_INFORMATION_PROPERTIES'
export const getAccountInformationProperties = (account) => {
  return (dispatch, getState) => {
    console.log('getAccountInformation')
    if (!account) {
      account = getState().auth.account.accountRS
    }
    dispatch(createAction(GET_ACCOUNT_INFORMATION_PROPERTIES)())
    sendRequest('getAccountProperties', {
      recipient: account
    }).then((result) => {
      console.log(result)
      let properties = {}
      if (result && result.properties) {
        if (result.properties.length > 0) {
          result.properties.map((property) => {
            properties[property.property] = property.value
          })
        }
      }
      console.log(properties)
      dispatch(getAccountInformationPropertiesSuccess(properties))
    }).fail(() => {
    })
  }
}

export const GET_ACCOUNT_INFORMATION_PROPERTIES_SUCCESS = 'GET_ACCOUNT_INFORMATION_PROPERTIES_SUCCESS'
export const getAccountInformationPropertiesSuccess = createAction(GET_ACCOUNT_INFORMATION_PROPERTIES_SUCCESS)

export const OPEN_ACCOUNT_DIALOG = 'OPEN_ACCOUNT_DIALOG'
export const openAccountDialog = (accountId) => {
  return (dispatch) => {
    dispatch(openAccountDialogSuccess(accountId))
  }
}

export const OPEN_ACCOUNT_DIALOG_SUCCESS = 'OPEN_ACCOUNT_DIALOG_SUCCESS'
export const openAccountDialogSuccess = createAction(OPEN_ACCOUNT_DIALOG_SUCCESS)

export const CLOSE_ACCOUNT_DIALOG = 'CLOSE_ACCOUNT_DIALOG'
export const closeAccountDialog = createAction(CLOSE_ACCOUNT_DIALOG)

const initialState = {
  isLoadingAccountInformation: false,
  accountInformation: {},
  accountInformationProperties: {},
  accountDialogIsOpen: false,
  accountInformationId: ''
}

export default handleActions({
  [GET_ACCOUNT_INFORMATION]: (state) => ({
    ...state,
    isLoadingAccountInformation: true
  }),

  [GET_ACCOUNT_INFORMATION_SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoadingAccountInformation: false,
    accountInformation: payload
  }),

  [GET_ACCOUNT_INFORMATION_PROPERTIES_SUCCESS]: (state, { payload }) => ({
    ...state,
    accountInformationProperties: payload
  }),

  [OPEN_ACCOUNT_DIALOG_SUCCESS]: (state, { payload }) => ({
    ...state,
    accountDialogIsOpen: true,
    accountInformationId: payload
  }),

  [CLOSE_ACCOUNT_DIALOG]: (state) => ({
    ...state,
    accountDialogIsOpen: false,
    accountInformationId: ''
  })
}, initialState)
