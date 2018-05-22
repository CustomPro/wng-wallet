export function storeSecretPhrase (username, secretPhrase) {
  if (localStorage.getItem(`${username}_secretPhrase`)) {
    return false
  }

  if (typeof secretPhrase === 'object') {
    secretPhrase = JSON.stringify(secretPhrase)
  }

  localStorage.setItem(`${username}_secretPhrase`, secretPhrase)
  return true
}

export function getSecretPhrase (username) {
  const secretPhrase = localStorage.getItem(`${username}_secretPhrase`)

  if (!secretPhrase) {
    return null
  }

  return JSON.parse(secretPhrase)
}
