import React, { PropTypes } from 'react'
import { injectIntl, defineMessages } from 'react-intl'
import { SelectField, MenuItem } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  default_forging_node: {
    id: 'default_forging_node',
    defaultMessage: 'Select default node'
  }
})

class ForgerNodeMenu extends React.Component {
  _onChange = (e, index, value) => {
    const { onChange } = this.props
    onChange(value)
  }

  render () {
    const {
      selectedNode,
      nodes
    } = this.props

    const items = nodes.map((node) => {
      return <MenuItem value={node} primaryText={node} key={node} />
    })

    return (
      <SelectField
        value={selectedNode}
        onChange={this._onChange}
        floatingLabelText={renderFormattedMessage(messages.default_forging_node)}
        fullWidth>
          {items}
      </SelectField>
    )
  }
}

ForgerNodeMenu.propTypes = {
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedNode: PropTypes.string.isRequired,
  nodes: PropTypes.array.isRequired
}

export default injectIntl(ForgerNodeMenu)
