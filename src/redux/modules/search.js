import { createAction, handleActions } from 'redux-actions'
import {
  getAccountInformation,
  openAccountDialog
} from 'redux/modules/accountinformation'

import {
  openTransactionDialog,
  getTransactionInformation
} from 'redux/modules/transactioninformation'

import {
  openBlockDialog,
  getBlockInformation
} from 'redux/modules/blockinformation'

export const CHANGE_SEARCH_TYPE = 'search.CHANGE_SEARCH_TYPE'
export const changeSearchType = (value) => {
  return dispatch => {
    dispatch(changeSearchTypeSuccess(value))
  }
}

export const CHANGE_SEARCH_TYPE_SUCCESS = 'search.CHANGE_SEARCH_TYPE_SUCCESS'
export const changeSearchTypeSuccess = createAction(CHANGE_SEARCH_TYPE_SUCCESS)

export const GET_SEARCH_BLOCKS = 'search.GET_SEARCH_BLOCKS'
export const getSearchBlocks = (value) => {
  return dispatch => {
    dispatch(createAction(GET_SEARCH_ACCOUNTS)())
    dispatch(getBlockInformation(value)).then((result) => {
      if (result.payload.errorCode) {
        dispatch(getSearchBlocksError(result.payload.errorCode))
      } else {
        dispatch(openBlockDialog(value))
      }
    })
  }
}

export const GET_SEARCH_BLOCKS_SUCCESS = 'search.GET_SEARCH_BLOCKS_SUCCESS'
export const getSearchBlocksSuccess = createAction(GET_SEARCH_BLOCKS_SUCCESS)

export const GET_SEARCH_BLOCKS_ERROR = 'search.GET_SEARCH_BLOCKS_ERROR'
export const getSearchBlocksError = createAction(GET_SEARCH_BLOCKS_ERROR)

export const GET_SEARCH_ACCOUNTS = 'search.GET_SEARCH_ACCOUNTS'
export const getSearchAccounts = (value) => {
  return dispatch => {
    dispatch(createAction(GET_SEARCH_ACCOUNTS)())
    dispatch(getAccountInformation(value)).then((result) => {
      if (result.payload.accountRS || result.payload.account) {
        dispatch(openAccountDialog(value))
      } else if (result.payload.errorCode) {
        dispatch(getSearchAccountsError(result.payload.errorCode))
      }
    })
  }
}

export const GET_SEARCH_ACCOUNTS_SUCCESS = 'search.GET_SEARCH_ACCOUNTS_SUCCESS'
export const getSearchAccountsSuccess = createAction(GET_SEARCH_ACCOUNTS_SUCCESS)

export const GET_SEARCH_ACCOUNTS_ERROR = 'search.GET_SEARCH_ACCOUNTS_ERROR'
export const getSearchAccountsError = createAction(GET_SEARCH_ACCOUNTS_ERROR)

export const GET_SEARCH_TRANSACTIONS = 'search.GET_SEARCH_TRANSACTIONS'
export const getSearchTransactions = (value) => {
  return dispatch => {
    dispatch(createAction(GET_SEARCH_TRANSACTIONS)())
    dispatch(getTransactionInformation(value)).then((result) => {
      if (result.payload.errorCode) {
        dispatch(getSearchTransactionsError(result.payload.errorCode))
      } else {
        dispatch(openTransactionDialog(value))
      }
    })
  }
}

export const GET_SEARCH_TRANSACTIONS_SUCCESS = 'search.GET_SEARCH_TRANSACTIONS_SUCCESS'
export const getSearchTransactionsSuccess = createAction(GET_SEARCH_TRANSACTIONS_SUCCESS)

export const GET_SEARCH_TRANSACTIONS_ERROR = 'search.GET_SEARCH_TRANSACTIONS_ERROR'
export const getSearchTransactionsError = createAction(GET_SEARCH_TRANSACTIONS_ERROR)

export const OPEN_SEARCH = 'search.OPEN_SEARCH'
export const openSearch = createAction(OPEN_SEARCH)

export const CLOSE_SEARCH = 'search.CLOSE_SEARCH'
export const closeSearch = createAction(CLOSE_SEARCH)

const initialState = {
  searchIsOpen: false,
  searchType: 'accounts',
  isLoadingSearchBlocks: false,
  isLoadingSearchTransactions: false,
  isLoadingSearchAccounts: false,
  searchBlock: {},
  searchTransaction: {},
  searchAccounts: [],
  searchError: {}
}

export default handleActions({
  [OPEN_SEARCH]: (state, { payload }) => ({
    ...state,
    searchIsOpen: true
  }),

  [CLOSE_SEARCH]: (state, { payload }) => ({
    ...state,
    searchIsOpen: false
  }),

  [CHANGE_SEARCH_TYPE_SUCCESS]: (state, { payload }) => ({
    ...state,
    searchType: payload
  }),

  [GET_SEARCH_BLOCKS]: (state, { payload }) => ({
    ...state,
    isLoadingSearchBlocks: true,
    searchError: {}
  }),

  [GET_SEARCH_BLOCKS_SUCCESS]: (state, { payload }) => ({
    ...state,
    searchBlock: payload
  }),

  [GET_SEARCH_BLOCKS_ERROR]: (state, { payload }) => {
    const searchError = {
      type: 'blocks',
      code: payload
    }
    return {
      ...state,
      searchError
    }
  },

  [GET_SEARCH_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    isLoadingSearchAccounts: true,
    searchError: {}
  }),

  [GET_SEARCH_ACCOUNTS_SUCCESS]: (state, { payload }) => ({
    ...state,
    searchAccounts: payload
  }),

  [GET_SEARCH_ACCOUNTS_ERROR]: (state, { payload }) => {
    const searchError = {
      type: 'accounts',
      code: payload
    }
    return {
      ...state,
      searchError
    }
  },

  [GET_SEARCH_TRANSACTIONS]: (state, { payload }) => ({
    ...state,
    isLoadingSearchTransactions: true
  }),

  [GET_SEARCH_TRANSACTIONS_SUCCESS]: (state, { payload }) => ({
    ...state,
    searchTransaction: payload
  }),

  [GET_SEARCH_TRANSACTIONS_ERROR]: (state, { payload }) => {
    const searchError = {
      type: 'transactions',
      code: payload
    }
    return {
      ...state,
      searchError
    }
  }
}, initialState)
