import { createAction, handleActions } from 'redux-actions'
import { addLocaleData } from 'react-intl'
import zhLocaleData from 'react-intl/locale-data/zh'
import bmLocaleData from 'react-intl/locale-data/bm'
import taLocaleData from 'react-intl/locale-data/ta'
import en from '../../translations/locales/en'
import zh from '../../translations/locales/zh-cn'
import bm from '../../translations/locales/bm'
import ta from '../../translations/locales/tm'

addLocaleData([
  ...zhLocaleData,
  ...bmLocaleData,
  ...taLocaleData
])

let locale = 'en'
let messages = {
  en,
  zh: { ...en, ...zh },
  bm: { ...en, ...bm },
  ta: { ...en, ...ta }
}

const language = localStorage.getItem('wallet_locale') ||
  window.navigator.userLanguage || window.navigator.language

if (language.indexOf('zh') !== -1) {
  locale = 'zh'
}
if (language.indexOf('bm') !== -1) {
  locale = 'bm'
}
if (language.indexOf('ta') !== -1) {
  locale = 'ta'
}

export const CHANGE_LOCALE = 'CHANGE_LOCALE'
export const changeLocale = (locale) => {
  return dispatch => {
    localStorage.setItem('wallet_locale', locale)
    dispatch(createAction(CHANGE_LOCALE)(locale))
  }
}

const initialState = {
  defaultLocale: 'en',
  locale,
  messages: messages[locale]
}

export default handleActions({
  [CHANGE_LOCALE]: (state, { payload }) => {
    return {
      ...state,
      locale: payload,
      messages: messages[payload]
    }
  }
}, initialState)
