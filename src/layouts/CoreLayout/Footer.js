import React, { PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import { Toolbar, ToolbarGroup } from 'material-ui'

import ChangeLocaleMenu from 'components/ChangeLocaleMenu'

class Footer extends React.Component {
  render () {
    const style = {
      backgroundColor: 'white',
      flex: 'none'
    }

    return (
      <Toolbar style={style}>
        <ToolbarGroup firstChild />
        <ToolbarGroup lastChild>
          <ChangeLocaleMenu />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

Footer.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(Footer)
