import React, { PropTypes } from 'react'
import { MenuItem, SelectField, TextField, RaisedButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'
import ActionSearch from 'material-ui/svg-icons/action/search'
import AccountDialog from 'components/AccountInformation/AccountDialog'
import TransactionDialog from 'components/TransactionInformation/TransactionDialog'
import BlockDialog from 'components/BlockInformation/BlockDialog'

const messages = defineMessages({
  search: {
    id: 'search_form.search',
    defaultMessage: 'Search'
  },
  accounts: {
    id: 'search_form.accounts',
    defaultMessage: 'Accounts'
  },
  blocks: {
    id: 'search_form.blocks',
    defaultMessage: 'Blocks'
  },
  account: {
    id: 'search_form.account',
    defaultMessage: 'Account'
  },
  transaction: {
    id: 'search_form.transaction',
    defaultMessage: 'Transaction'
  },
  block: {
    id: 'search_form.block',
    defaultMessage: 'Block'
  },
  transactions: {
    id: 'search_form.transactions',
    defaultMessage: 'Transactions'
  },
  error_search_term: {
    id: 'search_form.error_search_term',
    defaultMessage: 'Please enter a search term'
  },
  error_accounts: {
    id: 'search_form.error_accounts',
    defaultMessage: 'This account number is invalid, please try again.'
  },
  error_blocks: {
    id: 'search_form.error_blocks',
    defaultMessage: 'This block ID is invalid, please try again.'
  },
  error_transactions: {
    id: 'search_form.error_transactions',
    defaultMessage: 'This transaction ID is invalid, please try again.'
  }
})

export class SearchForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      searchTerm: '',
      searchErrorMessage: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    const { intl: { formatMessage } } = this.props
    if (nextProps.searchError !== this.props.searchError) {
      switch (nextProps.searchError.type) {
        case 'accounts':
          this.setState({ searchErrorMessage: formatMessage(messages.error_accounts) })
          break
        case 'blocks':
          this.setState({ searchErrorMessage: formatMessage(messages.error_blocks) })
          break
        case 'transactions':
          this.setState({ searchErrorMessage: formatMessage(messages.error_transactions) })
          break
      }
    }
    if (nextProps.searchType !== this.props.searchType) {
      this.setState({ searchErrorMessage: '' })
    }
  }

  handleSearchClick = () => {
    const {
      searchType,
      getSearchBlocks,
      getSearchAccounts,
      getSearchTransactions,
      intl: { formatMessage }
    } = this.props
    const { searchTerm } = this.state
    if (searchTerm !== '') {
      switch (searchType) {
        case 'blocks':
          getSearchBlocks(searchTerm)
          break
        case 'accounts':
          getSearchAccounts(searchTerm)
          break
        case 'transactions':
          getSearchTransactions(searchTerm)
          break
      }
    } else {
      this.setState({ searchErrorMessage: formatMessage(messages.error_search_term) })
    }
  }

  handleSelectChange = (event, index, value) => {
    const { changeSearchType } = this.props
    changeSearchType(value)
  }

  handleTextChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
      searchErrorMessage: ''
    })
  }

  render () {
    const formStyle = { width: '100%' }
    const {
      searchType,
      intl: {
        formatMessage
      }
     } = this.props
    const errorMessage = this.state.searchErrorMessage
    return (
      <div>
        <div>
          <SelectField
            onChange={this.handleSelectChange}
            name='searchType'
            value={searchType}
            style={formStyle}
            >
            <MenuItem value='accounts'
              primaryText={renderFormattedMessage(messages.accounts)} />
            <MenuItem value='blocks'
              primaryText={renderFormattedMessage(messages.blocks)} />
            <MenuItem value='transactions'
              primaryText={renderFormattedMessage(messages.transactions)} />
          </SelectField>
        </div>
        <div>
          <TextField
            style={formStyle}
            inputStyle={formStyle}
            floatingLabelFocusStyle={formStyle}
            errorStyle={formStyle}
            name='search'
            hintText={renderFormattedMessage(messages.search)}
            floatingLabelText={renderFormattedMessage(messages.search)}
            onChange={this.handleTextChange}
            errorText={errorMessage}
          />
        </div>
        <div style={{ textAlign: 'right' }}>
          <RaisedButton
            type='button'
            onClick={this.handleSearchClick}
            icon={<ActionSearch />}
            label={renderFormattedMessage(messages.search)}
            primary
          />
        </div>
        <AccountDialog
          title={formatMessage(messages.account)}
          account={this.props.accountInformationId}
          show={this.props.accountDialogIsOpen}
          closeDialog={this.props.closeAccountDialog}
          openTransactionDialog={this.props.openTransactionDialog}
          openAccountDialog={this.props.openAccountDialog}
          openBlockDialog={this.props.openBlockDialog} />
        <TransactionDialog
          title={formatMessage(messages.transaction)}
          transaction={this.props.transactionInformationId}
          show={this.props.transactionDialogIsOpen}
          closeDialog={this.props.closeTransactionDialog}
          openTransactionDialog={this.props.openTransactionDialog}
          openAccountDialog={this.props.openAccountDialog}
          openBlockDialog={this.props.openBlockDialog} />
        <BlockDialog
          title={formatMessage(messages.block)}
          block={this.props.blockInformationId}
          show={this.props.blockDialogIsOpen}
          closeDialog={this.props.closeBlockDialog}
          openTransactionDialog={this.props.openTransactionDialog}
          openAccountDialog={this.props.openAccountDialog}
          openBlockDialog={this.props.openBlockDialog} />
      </div>
    )
  }
}

SearchForm.propTypes = {
  intl: PropTypes.object,
  searchType: PropTypes.string,
  changeSearchType: PropTypes.func,
  dataSource: PropTypes.array,
  getSearchBlocks: PropTypes.func,
  getSearchTransactions: PropTypes.func,
  getSearchAccounts: PropTypes.func,
  isLoading: PropTypes.bool,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  openBlockDialog: PropTypes.func,
  closeBlockDialog: PropTypes.func,
  accountInformationId: PropTypes.string,
  accountDialogIsOpen: PropTypes.bool,
  transactionInformationId: PropTypes.string,
  transactionDialogIsOpen: PropTypes.bool,
  blockInformationId: PropTypes.string,
  blockDialogIsOpen: PropTypes.bool,
  searchError: PropTypes.object
}
export default SearchForm
