import React from 'react'
import { FormattedMessage } from 'react-intl'

export function renderFormattedMessagesArray (id, messages, values) {
  let el = (
    <FormattedMessage
      key={id}
      id={id}
    />
  )
  if (messages.hasOwnProperty(id)) {
    el = Object.keys(messages).map(key => {
      if (key === id) {
        return (
          <FormattedMessage
            key={key}
            id={id}
            values={values}
            {...messages[key]}
          />
        )
      }
    })
  }
  return el
}

export function renderFormattedMessage (obj, values) {
  if (obj) {
    let vals = {}
    if (values) { vals = values }
    return (
      <FormattedMessage
        key={obj.id}
        {...obj}
        values={vals}
      />
    )
  }
  return null
}
