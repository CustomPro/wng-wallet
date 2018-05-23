import crypto from 'crypto'
import { createAction, handleActions } from 'redux-actions'
import { push } from 'react-router-redux'
import $ from 'jquery'
import {
  generateSecretPhrase,
  getPublicKey,
  getAccountRSFromSecretPhrase,
  encrypt,
  decrypt,
  generateToken
} from 'nxt-crypto'
import {
  storeSecretPhrase,
  getSecretPhrase
} from 'redux/utils/storage'
import { getTransactions } from 'redux/modules/transaction'
import { connectionError } from 'redux/modules/site'
import { get, post, sendRequest, postFormData } from 'redux/utils/api'
import { tokenName } from 'config.json'


export const LOGIN = 'LOGIN'
export const login = (data) => {
  return (dispatch, getState) => {
    dispatch(createAction(LOGIN)())

    const { importBackup, backupFile } = getState().auth
    const { isLocalhost } = getState().site
    let username
    if (data.username) {
      username = crypto.createHash('sha256').update(data.username).digest('hex')
    }
    const handleDecryption = (encrypted) => {
      let decrypted = encrypted.secretPhrase
      console.log('login')
      console.log(encrypted)
      if (!decrypted) {
        decrypted = decrypt(encrypted, JSON.stringify({
          username: data.username.toLowerCase(),
          email: data.email.toLowerCase(),
          password: data.password
        }))
      }
      console.log(decrypted)
      
      if (!decrypted) {
        return dispatch(loginError('could_not_decrypt'))
      }
      const accountRS = getAccountRSFromSecretPhrase(decrypted, tokenName)
      const publicKey = getPublicKey(decrypted)
      const encryptedSecretPhrase = data.secretPhrase || encrypted
      const accountData = {
        encryptedSecretPhrase,
        secretPhrase: decrypted,
        accountRS,
        publicKey,
        isAdmin: data.isAdmin
      }

      if (!data.secretPhrase) {
        storeSecretPhrase(username, encrypted)
      }

      console.log(`Logged in account ${accountRS} with publicKey ${publicKey}`)

      const dispatchSuccess = (redirect = '/') => {
        dispatch(loginSuccess(accountData))        
        dispatch(getAccount(accountData.accountRS))
        dispatch(getAccountProperties(accountData.accountRS))
        dispatch(getTransactions(accountData.accountRS))
        dispatch(push(redirect))
      }
      if (data.isAdmin) {
        return isAdmin(decrypted)
          .then(dispatchSuccess.bind(this, '/accounts'))
          .fail(() => {
            dispatch(loginError('is_not_admin'))
          })
      }

      dispatchSuccess()
    }
    const findLocalWallet = (username) => {
      const encrypted = getSecretPhrase(username)
      if (!encrypted) {
        return dispatch(loginError('could_not_find_secretphrase'))
      }
      handleDecryption(encrypted)
    }

    if (data.secretPhraseLogin) {
      return handleDecryption(data)
    }

    if (importBackup && backupFile) {
      return handleDecryption(backupFile)
    }

    if (isLocalhost) {
      return findLocalWallet(username)
    }
   console.log(`username=${username}`)
    get('account', {
      username,
      email: data.email
    }).then((result, textStatus, jqXHR) => {
      if (result && result.errorDescription) {
        return $.Deferred().reject(jqXHR, textStatus, result.errorDescription)
      }
      const encrypted = result.account.secretPhrase
      handleDecryption(encrypted)
    }).fail((jqXHR, textStatus, err) => {
     //console.log(err)
      return findLocalWallet(username)
    })
  }
}

export const isAdmin = (secretPhrase) => {
  return get('is-admin', {
    token: generateToken('admin', secretPhrase)
  }).then((result, textStatus, jqXHR) => {
    if (result.errorCode || result.errorDescription) {
      return $.Deferred().reject(jqXHR, textStatus, result.errorDescription)
    }
    return result
  })
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const loginSuccess = createAction(LOGIN_SUCCESS)

export const LOGIN_ERROR = 'LOGIN_ERROR'
export const loginError = createAction(LOGIN_ERROR)

export const REGISTER = 'REGISTER'
export const register = (data) => {
  return (dispatch, getState) => {
    console.log("this is register")
    console.log("data")
    dispatch(createAction(REGISTER)())
    const { isLocalhost } = getState().site
    let secretPhrase = data.secretPhrase
    if (!secretPhrase) {
      secretPhrase = generateSecretPhrase()
    }
    //console.log(getPublicKey(secretPhrase))
    const encrypted = encrypt(secretPhrase, JSON.stringify({
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      password: data.password
    }))
    const username = crypto.createHash('sha256').update(data.username).digest('hex')
    if (storeSecretPhrase(username, encrypted)) {
      if (isLocalhost) {
        dispatch(registerSuccess(data))
        return dispatch(push('/login'))
      }

      post('register', {
        username: username,
        email: data.email.toLowerCase(),
        secretPhrase: JSON.stringify(encrypted),
        accountRS: getAccountRSFromSecretPhrase(secretPhrase, tokenName)
      }).then((result) => {
        dispatch(registerSuccess(data))
        return dispatch(push('/login'))
      }).fail((jqXHR, textStatus, err) => {
        dispatch(registerError('username_email_exists'))
      })
    } else {
      dispatch(registerError('username_email_exists'))
    }
  }
}

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const registerSuccess = createAction(REGISTER_SUCCESS)

export const REGISTER_ERROR = 'REGISTER_ERROR'
export const registerError = createAction(REGISTER_ERROR)

export const GET_ACCOUNT = 'GET_ACCOUNT'
export const getAccount = (account) => {
  return (dispatch, getState) => {
    if (!account) {
      account = getState().auth.account.accountRS
    }

    dispatch(createAction(GET_ACCOUNT)())
    sendRequest('getAccount', {
      account,
      includeEffectiveBalance: true,
      includeAssets: true
    }).then((result) => {
      dispatch(getAccountSuccess(result))
    }).fail(() => {
      dispatch(push('/login'))
      dispatch(connectionError())
    })
  }
}

export const VERIFY_MESSAGE_SUCCESS = 'VERIFY_MESSAGE_SUCCESS'
export const verifyMessageSuccess = createAction(VERIFY_MESSAGE_SUCCESS)

export const VERIFY_MESSAGE_ERROR = 'VERIFY_MESSAGE_ERROR'
export const verifyMessageError = createAction(VERIFY_MESSAGE_ERROR)

export const VERIFY_MESSAGE = 'VERIFY_MESSAGE'
export const verifyMessage = (data) => {

  return (dispatch, getState) => {
    dispatch(createAction(VERIFY_MESSAGE)())
    post('verifyMessage', {
        username:data.username.toLowerCase(),
        email: data.email.toLowerCase()
      }).then((result) => {
        console.log(result)
        if(result.code == 1){
          dispatch(verifyMessageSuccess())
        }
        else {
          dispatch(verifyMessageError('incorrect_verify_code'))
        }
      }).fail((jqXHR, textStatus, err) => {
        dispatch(verifyMessageError('incorrect_verify_code'))
      })
  }
}
export const VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS'
export const verifyEmailSuccess = createAction(VERIFY_EMAIL_SUCCESS)

export const VERIFY_EMAIL_ERROR = 'VERIFY_EMAIL_ERROR'
export const verifyEmailError = createAction(VERIFY_EMAIL_ERROR)

export const VERIFY_EMAIL = 'VERIFY_EMAIL'
export const verifyEmail = (data) => {

  return (dispatch, getState) => {
    dispatch(createAction(VERIFY_EMAIL)())
    post('verifyEmail', {
        email: data.email.toLowerCase()
      }).then((result) => {
        console.log(result)
        if(result.code == 1){
          dispatch(verifyEmailSuccess())
        }
        else {
          dispatch(verifyEmailError('username_email_exists'))
        }
      }).fail((jqXHR, textStatus, err) => {
        dispatch(verifyEmailError('username_email_exists'))
      })
  }
}

export const VERIFY_CODE_SUCCESS = 'VERIFY_CODE_SUCCESS'
export const verifyCodeSuccess = createAction(VERIFY_CODE_SUCCESS)

export const VERIFY_CODE_ERROR = 'VERIFY_CODE_ERROR'
export const verifyCodeError = createAction(VERIFY_CODE_ERROR)

export const VERIFY_CODE = 'VERIFY_CODE'
export const verifyCode = (data) => {
  console.log('this is verifyCode')
  console.log(data)
  return (dispatch, getState) => {
    dispatch(createAction(VERIFY_CODE)())
    post('verifyCode', {
        email: data.email.toLowerCase(),
        code: data.code
      }).then((result) => {
        console.log(result)
        if(result.code == 1){
          dispatch(verifyCodeSuccess())
        }
        else {
          dispatch(verifyCodeError('incorrect_verify_code'))
        }
      }).fail((jqXHR, textStatus, err) => {
        dispatch(verifyEmailError('incorrect_verify_code'))
      })
  }
}



export const CHANGEPASSWORD_SUCCESS = 'CHANGEPASSWORD_SUCCESS'
export const changePasswordSuccess = createAction(CHANGEPASSWORD_SUCCESS)

export const CHANGEPASSWORD_ERROR = 'CHANGEPASSWORD_ERROR'
export const changePasswordError = createAction(CHANGEPASSWORD_ERROR)

export const CHANGEPASSWORD = 'CHANGEPASSWORD'
export const changePassword = (data) =>{
  return (dispatch, getState) => {    
    const account = getState().auth.account
    
    dispatch(createAction(CHANGEPASSWORD)())
    const { isLocalhost } = getState().site

    let accountRS = account.accountRS
    let secretPhrase = account.secretPhrase
    let encrypted = account.encryptedSecretPhrase 

    const check_secretPhrase = decrypt(encrypted, JSON.stringify({
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      password: data.oldpassword
    }))

    if(!check_secretPhrase){
      dispatch(changePasswordError('invalid_username_email'))
      return
    }
    const username = crypto.createHash('sha256').update(data.username).digest('hex')
    const new_encrypted = encrypt(secretPhrase, JSON.stringify({
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      password: data.newpassword
      }))

   // if (storeSecretPhrase(username, new_encrypted)) {
      if (isLocalhost) {
        dispatch(changePasswordSuccess())
        return dispatch(push('/login'))
      }
      post('changePassword', {
        username: username,
        email: data.email.toLowerCase(),
        secretPhrase: JSON.stringify(new_encrypted),
        accountRS: accountRS
      }).then((result) => {
        dispatch(changePasswordSuccess())        
        return dispatch(window.location.href = '/')
      }).fail((jqXHR, textStatus, err) => {
        dispatch(changePasswordError('invalid_username_email'))
      }) 
   // }  else {
   //   console.log('failed storeSecretPhrase')
    //}
  }
}

export const GET_ACCOUNT_SUCCESS = 'GET_ACCOUNT_SUCCESS'
export const getAccountSuccess = createAction(GET_ACCOUNT_SUCCESS)

export const GET_ACCOUNT_ERROR = 'GET_ACCOUNT_ERROR'
export const getAccountError = createAction(GET_ACCOUNT_ERROR)

export const GET_ACCOUNT_PROPERTIES = 'GET_ACCOUNT_PROPERTIES'
export const getAccountProperties = (account) => {
  return (dispatch, getState) => {
    if (!account) {
      account = getState().auth.account.accountRS
    }
    dispatch(createAction(GET_ACCOUNT_PROPERTIES)())
    sendRequest('getAccountProperties', {
      recipient: account
    }).then((result) => {
      //console.log(result)
      let properties = {}
      if (result && result.properties) {
        if (result.properties.length > 0) {
          result.properties.map((property) => {
            properties[property.property] = property.value
          })
        }
      }
      dispatch(getAccountPropertiesSuccess(properties))
    }).fail(() => {
    })
  }
}

export const GET_ACCOUNT_PROPERTIES_SUCCESS = 'GET_ACCOUNT_PROPERTIES_SUCCESS'
export const getAccountPropertiesSuccess = createAction(GET_ACCOUNT_PROPERTIES_SUCCESS)

export const SHOW_RECEIVE_MODAL = 'SHOW_RECEIVE_MODAL'
export const showReceiveModal = createAction(SHOW_RECEIVE_MODAL)

export const HIDE_RECEIVE_MODAL = 'HIDE_RECEIVE_MODAL'
export const hideReceiveModal = createAction(HIDE_RECEIVE_MODAL)

export const TOGGLE_IMPORT_BACKUP = 'TOGGLE_IMPORT_BACKUP'
export const toggleImportBackup = createAction(TOGGLE_IMPORT_BACKUP)

export const SET_BACKUP_FILE = 'SET_BACKUP_FILE'
export const setBackupFile = createAction(SET_BACKUP_FILE)

export const SET_PASSWORD_STRENGTH = 'SET_PASSWORD_STRENGTH'
export const setPasswordStrength = createAction(SET_PASSWORD_STRENGTH)

export const VERIFY_ACCOUNT = 'VERIFY_ACCOUNT'
export const verifyAccount = (fields, files) => {
  return (dispatch, getState) => {
    dispatch(createAction(VERIFY_ACCOUNT)())
    const formData = new FormData()
    files.identity_files.map((file) => {
      const type = file.type.split('/')[1]
      const fileName = `identity_proof.${type}`
      formData.append(fileName, file)
    })
    files.address_files.map((file) => {
      const type = file.type.split('/')[1]
      const fileName = `address_proof.${type}`
      formData.append(fileName, file)
    })
    for (let prop in fields) {
      formData.append(prop, fields[prop])
    }
    postFormData('verification', formData).then((result) => {
      dispatch(verifyAccountSuccess(result))
    })
  }
}

export const VERIFY_ACCOUNT_SUCCESS = 'VERIFY_ACCOUNT_SUCCESS'
export const verifyAccountSuccess = createAction(VERIFY_ACCOUNT_SUCCESS)

export const VERIFY_ACCOUNT_ERROR = 'VERIFY_ACCOUNT_ERROR'
export const verifyAccountError = createAction(VERIFY_ACCOUNT_ERROR)

export const GET_VERIFICATION = 'GET_VERIFICATION'
export const getVerification = (accountRS) => {
  return (dispatch, getState) => {
    dispatch(createAction(GET_VERIFICATION)())
    const { secretPhrase } = getState().auth.account
    const token = generateToken(accountRS, secretPhrase)

    const url = `verification/${accountRS}?token=${token}`
    get(url).then((result) => {
      if (result.status === 'success') {
        dispatch(getVerificationSuccess(result))
      } else {
        dispatch(getVerificationError('application_does_not_exist'))
      }
    }).fail((jqXHR, textStatus, err) => {
      dispatch(getVerificationError('application_does_not_exist'))
    })
  }
}

export const GET_VERIFICATION_SUCCESS = 'GET_VERIFICATION_SUCCESS'
export const getVerificationSuccess = createAction(GET_VERIFICATION_SUCCESS)

export const GET_VERIFICATION_ERROR = 'GET_VERIFICATION_ERROR'
export const getVerificationError = createAction(GET_VERIFICATION_ERROR)

export const initialState = {
  isLoggingIn: false,
  isRegistering: false,
  isRetrievingAccount: false,
  isChangingPassword: false,
  isVerifyingCode: false,
  isVerifyingEmail: false,
  isVerifyingMessage: false,
  loginError: '',
  registerSuccess: false,
  registerError: '',
  registerStep: 1,
  loginStep: 1,
  showReceiveModal: false,
  account: {
    encryptedSecretPhrase: '',
    secretPhrase: '',
    accountRS: '',
    publicKey: '',
    unconfirmedBalanceDQT: 0,
    assetBalances: [],
    properties: {}
  },
  username: '',
  importBackup: false,
  backupFile: '',
  isAdmin: false,
  passwordStrength: 0,
  hasVerificationApplication: false,
  currentVerificationApplication: {},
  isPostingVerification: false,
  hasPostedVerification: false
}

export default handleActions({
  [LOGIN]: state => {
    return {
      ...state,
      isLoggingIn: true,
      loginError: '',
      account: {
        ...state.account,
        secretPhrase: ''
      }
    }
  },

  [LOGIN_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoggingIn: false,
      account: {
        ...state.account,
        encryptedSecretPhrase: payload.encryptedSecretPhrase,
        secretPhrase: payload.secretPhrase,
        accountRS: payload.accountRS,
        publicKey: payload.publicKey,
        assetBalances: payload.assetBalances
      },
      isAdmin: payload.isAdmin
    }
  },

  [LOGIN_ERROR]: (state, { payload }) => {
    return {
      ...state,
      isLoggingIn: false,
      loginError: payload
    }
  },

  [REGISTER]: state => {
    return {
      ...state,
      isRegistering: true,
      registerError: '',
      loginError: ''
    }
  },

  [REGISTER_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isRegistering: false,
      registerSuccess: true,
      username: payload.username,
      email: payload.email
    }
  },

  [REGISTER_ERROR]: (state, { payload }) => {
    return {
      ...state,
      isRegistering: false,
      registerError: payload
    }
  },

  [CHANGEPASSWORD]: state => {
    return {
       ...state,
       registerError: '',
       isChangingPassword: true
    }
  },

  [CHANGEPASSWORD_SUCCESS]: state => {
    return {
      ...state,
      isChangingPassword: false
    }
  },

  [CHANGEPASSWORD_ERROR]: (state, { payload }) => {
    return {
      ...state,
      isChangingPassword: false,
      registerError: payload
    }
  },

[VERIFY_MESSAGE]: state => {
    return {
      ...state,
      loginError: '',
      isVerifyingMessage: true,
      registerStep: 1
    }
  },
  [VERIFY_MESSAGE_SUCCESS]: state => {
    return {
      ...state,
      loginError: '',
      isVerifyingMessage: false,
      loginStep: 2,

    }
  },
  [VERIFY_MESSAGE_ERROR]: (state, {payload}) => {
    return {
      ...state,
      isVerifyingMessage: false,
      loginError: payload
    }
  },

[VERIFY_EMAIL]: state => {
    return {
      ...state,
      registerError: '',
      isVerifyingEmail: true,
      registerStep: 1
    }
  },
  [VERIFY_EMAIL_SUCCESS]: state => {
    return {
      ...state,
      registerError: '',
      isVerifyingEmail: false,
      registerStep: 2,

    }
  },
  [VERIFY_EMAIL_ERROR]: (state, {payload}) => {
    return {
      ...state,
      isVerifyingEmail: false,
      registerError: payload
    }
  },
  [VERIFY_CODE]: state => {
    return {
      ...state,
      registerError: '',
      isVerifyingCode: true,
      registerStep: 2
    }
  },
  [VERIFY_CODE_SUCCESS]: state => {
    return {
      ...state,
      registerError: '',
      isVerifyingCode: false,
      registerStep: 3
    }
  },
  [VERIFY_CODE_ERROR]: (state, {payload}) => {
    return {
      ...state,
      isVerifyingCode: false,
      registerError: payload
    }
  },

  [GET_ACCOUNT]: state => {
    return {
      ...state,
      isRetrievingAccount: true
    }
  },

  [GET_ACCOUNT_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isRetrievingAccount: false,
      account: {
        ...state.account,
        ...payload
      }
    }
  },

  [GET_ACCOUNT_PROPERTIES_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      account: {
        ...state.account,
        properties: payload
      }
    }
  },

  [GET_ACCOUNT_ERROR]: state => {
    return {
      ...state,
      isRetrievingAccount: false
    }
  },

  [SHOW_RECEIVE_MODAL]: state => {
    return {
      ...state,
      showReceiveModal: true
    }
  },

  [HIDE_RECEIVE_MODAL]: state => {
    return {
      ...state,
      showReceiveModal: false
    }
  },

  [TOGGLE_IMPORT_BACKUP]: state => {
    return {
      ...state,
      importBackup: !state.importBackup
    }
  },

  [SET_BACKUP_FILE]: (state, { payload }) => {
    return {
      ...state,
      backupFile: payload
    }
  },

  [SET_PASSWORD_STRENGTH]: (state, { payload }) => {
    return {
      ...state,
      passwordStrength: payload
    }
  },

  [GET_VERIFICATION_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      hasVerificationApplication: true,
      currentVerificationApplication: payload.account
    }
  },

  [VERIFY_ACCOUNT]: (state, { payload }) => {
    return {
      ...state,
      isPostingVerification: true,
      hasPostedVerification: false
    }
  },

  [VERIFY_ACCOUNT_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isPostingVerification: false,
      hasPostedVerification: true
    }
  }
}, initialState)
