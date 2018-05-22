import React, { PropTypes } from 'react'
import PageTitle from 'components/PageTitle'
import {
  Card
} from 'material-ui'
import BlocksTableContainer from 'components/Blocks/BlocksTableContainer'
import { defineMessages } from 'react-intl'
import AccountDialog from 'components/AccountInformation/AccountDialog'
import TransactionDialog from 'components/TransactionInformation/TransactionDialog'
import BlockDialog from 'components/BlockInformation/BlockDialog'
import style from './Blocks.css'

const messages = defineMessages({
  blocks: {
    id: 'blocks.blocks',
    defaultMessage: 'Blocks'
  },
  account: {
    id: 'account',
    defaultMessage: 'Account'
  },
  transaction: {
    id: 'transaction',
    defaultMessage: 'Transaction'
  },
  block: {
    id: 'blocks.block',
    defaultMessage: 'Block'
  }
})

export class Blocks extends React.Component {

  componentDidMount () {
    const { getAsset } = this.props
    getAsset()
  }

  openAccountDialog = (account) => {
    this.props.closeTransactionDialog()
    this.props.closeBlockDialog()
    this.props.openAccountDialog(account)
  }

  openTransactionDialog = (transaction) => {
    this.props.closeAccountDialog()
    this.props.closeBlockDialog()
    this.props.openTransactionDialog(transaction)
  }

  openBlockDialog = (block) => {
    this.props.closeAccountDialog()
    this.props.closeTransactionDialog()
    this.props.openBlockDialog(block)
  }

  render () {
    const {
      intl: { formatMessage }
    } = this.props
    return (
      <PageTitle pageName='blocks'>
        <div className={style.Blocks_Widget}>
          <Card>
            <BlocksTableContainer
              title={formatMessage(messages.blocks)}
              openAccountDialog={this.openAccountDialog}
              openTransactionDialog={this.openTransactionDialog}
              openBlockDialog={this.openBlockDialog}
              UI={'blocksTable'}
            />
          </Card>
        </div>
        <AccountDialog title={formatMessage(messages.account)}
          account={this.props.accountInformationId}
          show={this.props.accountDialogIsOpen}
          closeDialog={this.props.closeAccountDialog}
          asset={this.props.asset} />
        <TransactionDialog title={formatMessage(messages.transaction)}
          transaction={this.props.transactionInformationId}
          asset={this.props.asset}
          show={this.props.transactionDialogIsOpen}
          closeDialog={this.props.closeTransactionDialog}
          openAccountDialog={this.openAccountDialog}
          openTransactionDialog={this.openTransactionDialog} />
        <BlockDialog
          title={formatMessage(messages.block)}
          block={this.props.blockInformationId}
          show={this.props.blockDialogIsOpen}
          closeDialog={this.props.closeBlockDialog}
          openTransactionDialog={this.openTransactionDialog}
          openAccountDialog={this.openAccountDialog} />
      </PageTitle>
    )
  }
}

Blocks.propTypes = {
  intl: PropTypes.object,
  getBlocks: PropTypes.func,
  selectedBlocks: PropTypes.array,
  isLoadingBlocks: PropTypes.bool,
  loadingBlocksError: PropTypes.object,
  isMobile: PropTypes.bool,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  accountDialogIsOpen: PropTypes.bool,
  accountInformationId: PropTypes.string,
  openTransactionDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  transactionDialogIsOpen: PropTypes.bool,
  transactionInformationId: PropTypes.string,
  blockInformationId: PropTypes.string,
  blockDialogIsOpen: PropTypes.bool,
  closeBlockDialog: PropTypes.func,
  openBlockDialog: PropTypes.func,
  getAsset: PropTypes.func,
  asset: PropTypes.object
}

export default Blocks
