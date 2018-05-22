import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Search from './Search'

const mapStateToProps = (state) => {
  const { searchIsOpen } = state.search
  return {
    searchIsOpen
  }
}

export default connect(
  mapStateToProps
)(injectIntl(Search))
