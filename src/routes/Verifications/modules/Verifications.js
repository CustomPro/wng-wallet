import { createAction, handleActions } from 'redux-actions'
import { get, post, sendRequest, apiUrl } from 'redux/utils/api'
import { generateToken } from 'nxt-crypto'

export const GET_VERIFICATION_APPLICATIONS = 'verifications.GET_VERIFICATION_APPLICATIONS'
export const getVerificationApplications = (pageNumber, pageSize) => {
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
    dispatch(createAction(GET_VERIFICATION_APPLICATIONS)())
    return get('admin/verifications', data).then((result) => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          return dispatch(getVerificationApplicationsError(result.error))
        } else if (result.status === 'success') {
          let applications = result.applications
          const payload = {}
          payload.hasPrev = true
          payload.hasNext = false
          if (pageNumber === 1) {
            payload.hasPrev = false
          }
          if (Array.isArray(applications) && applications.length > pageSize) {
            payload.hasNext = true
            applications = applications.slice(0, pageSize)
          }
          payload.payload = applications
          payload.pageNumber = pageNumber
          dispatch(getVerificationApplicationsSuccess(payload))
        }
      }
    })
  }
}

export const GET_VERIFICATION_APPLICATIONS_SUCCESS = 'verifications.GET_VERIFICATION_APPLICATIONS_SUCCESS'
export const getVerificationApplicationsSuccess = createAction(GET_VERIFICATION_APPLICATIONS_SUCCESS)

export const GET_VERIFICATION_APPLICATIONS_ERROR = 'verifications.GET_VERIFICATION_APPLICATIONS_ERROR'
export const getVerificationApplicationsError = createAction(GET_VERIFICATION_APPLICATIONS_ERROR)

export const POST_VERIFICATION_STATUS = 'verifications.POST_VERIFICATION_STATUS'
export const postVerificationStatus = (data) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    const token = generateToken('admin', secretPhrase)
    data.token = token
    const { id, accountRS, status } = data
    const url = `admin/verification/${id}/status`
    dispatch(createAction(POST_VERIFICATION_STATUS)())
    post(url, data).then((result) => {
      if (result.status === 'success') {
        dispatch(postVerificationStatusSuccess(result))
        let property
        if (status === 'approved') {
          property = {
            property: 'authorized',
            value: true,
            recipient: accountRS
          }
        }
        if (status === 'rejected') {
          property = {
            property: 'authorized',
            value: false,
            recipient: accountRS
          }
        }
        dispatch(postSetAccountProperty(property))
      }
    })
  }
}

export const POST_VERIFICATION_STATUS_SUCCESS = 'verifications.POST_VERIFICATION_STATUS_SUCCESS'
export const postVerificationStatusSuccess = createAction(POST_VERIFICATION_STATUS_SUCCESS)

export const POST_SET_ACCOUNT_PROPERTY = 'verifications.POST_SET_ACCOUNT_PROPERTY'
export const postSetAccountProperty = (property) => {
  return (dispatch, getState) => {
    const { secretPhrase } = getState().auth.account
    const sendData = {
      secretPhrase
    }
    const data = Object.assign(sendData, property)
    sendRequest('setAccountProperty', data).then((result) => {
    })
  }
}

export const UPDATE_VERIFICATIONS_PAGE = 'verifications.UPDATE_VERIFICATIONS_PAGE'
export const updateVerificationsPage = (pageNumber) => {
  return (dispatch, getState) => {
    if (pageNumber >= 1) {
      dispatch(updateVerificationsPageSuccess(pageNumber))
      dispatch(getVerificationApplications(pageNumber, getState().verifications.applicationsPageSize))
    }
  }
}

export const UPDATE_VERIFICATIONS_PAGE_SUCCESS = 'verifications.UPDATE_VERIFICATIONS_PAGE_SUCCESS'
export const updateVerificationsPageSuccess = createAction(UPDATE_VERIFICATIONS_PAGE_SUCCESS)

const initialState = {
  applications: [],
  isLoadingApplications: false,
  isUpdatingApplications: false,
  applicationsPageSize: 5,
  applicationsPageNumber: 1,
  applicationsHasNext: false,
  applicationsHasPrev: true,
  loadingApplicationsError: {}
}

export default handleActions({

  [GET_VERIFICATION_APPLICATIONS]: (state) => {
    return {
      ...state,
      isLoadingApplications: true
    }
  },

  [GET_VERIFICATION_APPLICATIONS_SUCCESS]: (state, { payload }) => {
    const applications = payload.payload
    applications.map((application, index) => {
      const fileArray = []
      const files = application.files.split(',')
      files.map((file) => {
        const url = `${apiUrl}/verification/img/${application.accountRS}/${file}`
        fileArray.push({file, url})
      })
      applications[index]['fileURLS'] = fileArray
    })
    return {
      ...state,
      applications: applications,
      isLoadingApplications: false,
      applicationsHasNext: payload.hasNext,
      applicationsHasPrev: payload.hasPrev
    }
  },

  [POST_VERIFICATION_STATUS]: (state) => {
    return {
      ...state,
      isUpdatingApplications: true
    }
  },

  [POST_VERIFICATION_STATUS_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isUpdatingApplications: false
    }
  },

  [GET_VERIFICATION_APPLICATIONS_ERROR]: (state, { payload }) => ({
    ...state,
    isLoadingApplications: false,
    loadingApplicationsError: payload
  }),

  [UPDATE_VERIFICATIONS_PAGE_SUCCESS]: (state, { payload }) => ({
    ...state,
    applicationsPageNumber: payload
  })

}, initialState)
