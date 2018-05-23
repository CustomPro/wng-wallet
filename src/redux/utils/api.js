import $ from 'jquery'
import { getPublicKey, signBytes } from 'nxt-crypto'

import config from 'config.json'
export const { nrsUrl, apiUrl, nrsSuffix, forgingNodes } = config

function _parseData (data) {
  if (!data.secretPhrase) return data

  if (typeof data.feeDQT === 'undefined') {
    data.feeDQT = config.minimumFee
  }

  if (typeof data.deadline === 'undefined') {
    data.deadline = 24
  }

  return data
}

function _parseResult (result, textStatus, jqXHR) {
  if (typeof result === 'string') {
    try {
      result = JSON.parse(result)
      //console.log(result)
    } catch (e) {
      return e
    }
  }

  return result
}

export function post (url, data) {
  return $.ajax({
    type: 'POST',
    url: `${apiUrl}/${url}?random=${Math.random()}`,
    data
  }).then(_parseResult)
}

export function postFormData (url, data) {
  return $.ajax({
    type: 'POST',
    url: `${apiUrl}/${url}?random=${Math.random()}`,
    contentType: false,
    data,
    processData: false
  }).then(_parseResult)
}

export function get (url, data) {
  return $.ajax({
    type: 'GET',
    url: `${apiUrl}/${url}`,
    data
  }).then(_parseResult)
}

export function put (url, data) {
  return $.ajax({
    type: 'PUT',
    url: `${apiUrl}/${url}?random=${Math.random()}`,
    data
  }).then(_parseResult)
}

export function insecureSendRequest (nrsUrl, requestType, data, async = true) {
  return $.ajax({
    type: 'POST',
    url: `${nrsUrl}/${nrsSuffix.toLowerCase()}?requestType=${requestType}&random=${Math.random()}`,
    data: data,
    async: async
  }).then(_parseResult)
}

export function sendRequest (requestType, data, async = true, params) {
  data = _parseData(data)
  // no secretphrase, we can just broadcast
  let url = `${nrsUrl}/${nrsSuffix.toLowerCase()}?requestType=${requestType}&random=${Math.random()}`
  if (params) {
    url = `${nrsUrl}/${nrsSuffix.toLowerCase()}?requestType=${requestType}&${params}&random=${Math.random()}`
  }

  if (!data.secretPhrase) {
    return $.ajax({
      type: 'POST',
      url,
      data,
      async
    }).then(_parseResult)
  }

  // sign transactions locally
  let secretPhrase = data.secretPhrase
  delete data.secretPhrase

  return $.ajax({
    type: 'POST',
    url,
    data,
    async
  })
  .then(_parseResult)
  .then(function (result, textStatus, jqXHR) {
    if (result && result.errorDescription) {
      return $.Deferred().reject(jqXHR, textStatus, result)
    }

    try {
      const { unsignedTransactionBytes } = result
      const signature = signBytes(unsignedTransactionBytes, secretPhrase)

      return {
        transactionBytes: unsignedTransactionBytes.substr(0, 192) + signature + unsignedTransactionBytes.substr(320),
        prunableAttachmentJSON: JSON.stringify(result.transactionJSON.attachment)
      }
    } catch (e) {
      return false
    }
  })
  .then((result) => {
    return sendRequest('broadcastTransaction', result)
  })
  
}

export function getRequest (requestType, data) {
  return $.ajax({
    type: 'GET',
    url: `${nrsUrl}/${nrsSuffix.toLowerCase()}?requestType=${requestType}`,
    data
  }).then(_parseResult)
}
