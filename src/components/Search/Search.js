import React, { PropTypes } from 'react'
import {
  Card,
  CardText,
  CardTitle
} from 'material-ui'
import SearchFormContainer from './SearchFormContainer'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  search: {
    id: 'search.search',
    defaultMessage: 'Search'
  }
})

export class Search extends React.Component {
  render () {
    const cardStyle = {}
    if (this.props.searchIsOpen) {
      cardStyle.marginBottom = 50
    }
    return (
      <Card
        style={cardStyle}
        expanded={this.props.searchIsOpen}
        onExpandChange={this.handleExpandChange}>
        <CardTitle
          expandable
          title={renderFormattedMessage(messages.search)} />
        <CardText
          expandable
          >
          <SearchFormContainer />
        </CardText>
      </Card>
    )
  }
}

Search.propTypes = {
  intl: PropTypes.object,
  searchIsOpen: PropTypes.bool
}

export default Search
