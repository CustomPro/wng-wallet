import { createAction, handleActions } from 'redux-actions'
import { get } from 'redux/utils/api'
import { generateToken } from 'nxt-crypto'

export const GET_ACCOUNTS = 'accounts.GET_ACCOUNTS'
export const getAccounts = (pageNumber, pageSize) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    const { search } = getState().accounts
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
    if (search) {
      data.search = search
    }
    dispatch(createAction(GET_ACCOUNTS)())
    return get('accounts', data).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          return dispatch(getAccountsError(result.error))
        }
        let accounts = result.accounts
        const payload = {}
        payload.hasPrev = true
        payload.hasNext = false
        if (pageNumber === 1) {
          payload.hasPrev = false
        }
        if (Array.isArray(accounts) && accounts.length > pageSize) {
          payload.hasNext = true
          accounts = accounts.slice(0, pageSize)
        }
        payload.payload = accounts
        payload.pageNumber = pageNumber
        dispatch(getAccountsSuccess(payload))
      }
    })
  }
}

export const GET_ACCOUNTS_SUCCESS = 'accounts.GET_ACCOUNTS_SUCCESS'
export const getAccountsSuccess = createAction(GET_ACCOUNTS_SUCCESS)

export const GET_ACCOUNTS_ERROR = 'accounts.GET_ACCOUNTS_ERROR'
export const getAccountsError = createAction(GET_ACCOUNTS_ERROR)

export const SET_SEARCH = 'accounts.SET_SEARCH'
export const setSearch = createAction(SET_SEARCH)

export const UPDATE_ACCOUNTS_PAGE = 'accounts.UPDATE_ACCOUNTS_PAGE'
export const updateAccountsPage = (pageNumber) => {
  return (dispatch, getState) => {
    if (pageNumber >= 1) {
      dispatch(updateAccountsPageSuccess(pageNumber))
      dispatch(getAccounts(pageNumber, getState().accounts.accountsPageSize))
    }
  }
}

export const UPDATE_ACCOUNTS_PAGE_SUCCESS = 'accounts.UPDATE_ACCOUNTS_PAGE_SUCCESS'
export const updateAccountsPageSuccess = createAction(UPDATE_ACCOUNTS_PAGE_SUCCESS)

export const RESET_PAGINATION = 'accounts.RESET_PAGINATION'
export const resetPagination = createAction(RESET_PAGINATION)

const initialState = {
  accounts: [],
  search: '',
  isLoadingAccounts: false,
  accountsPageSize: 5,
  accountsPageNumber: 1,
  accountsHasNext: false,
  accountsHasPrev: true,
  loadingAccountsError: {}
}

export default handleActions({
  [GET_ACCOUNTS]: state => {
    return {
      ...state,
      isLoadingAccounts: true
    }
  },

  [GET_ACCOUNTS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoadingAccounts: false,
      accounts: payload.payload,
      accountsHasNext: payload.hasNext,
      accountsHasPrev: payload.hasPrev
    }
  },

  [SET_SEARCH]: (state, { payload }) => {
    return {
      ...state,
      search: payload
    }
  },

  [GET_ACCOUNTS_ERROR]: (state, { payload }) => ({
    ...state,
    isLoadingAccounts: false,
    loadingAccountsError: payload
  }),

  [UPDATE_ACCOUNTS_PAGE_SUCCESS]: (state, { payload }) => ({
    ...state,
    accountsPageNumber: payload
  })
}, initialState)
