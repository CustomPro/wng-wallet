import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { SelectField, MenuItem } from 'material-ui'

import { changeLocale } from 'redux/modules/intl'

class ChangeLocaleMenu extends React.Component {
  _handleChange = (e, index, value) => {
    const { onChange } = this.props
    onChange(value)
  }

  render () {
    const { locale, labelStyle } = this.props
    return (
      <SelectField
        onChange={this._handleChange}
        value={locale}
        labelStyle={labelStyle}
        style={{ maxWidth: 140, float: 'left' }}
        >
        <MenuItem value='en' primaryText='English' />
        <MenuItem value='zh' primaryText='中文' />
        <MenuItem value='bm' primaryText='Bahasa Melayu' />
        <MenuItem value='ta' primaryText='தமிழ்' />
      </SelectField>
    )
  }
}

ChangeLocaleMenu.propTypes = {
  onChange: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  labelStyle: PropTypes.object
}

export default connect((state) => {
  const { locale } = state.intl

  return {
    locale
  }
}, {
  onChange: changeLocale
})(ChangeLocaleMenu)
