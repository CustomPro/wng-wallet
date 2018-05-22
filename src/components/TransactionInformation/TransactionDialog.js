import React, { PropTypes } from 'react'
import TransactionInformationContainer from './TransactionInformationContainer'
import { Dialog, FlatButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  close: {
    id: 'close',
    defaultMessage: 'Close'
  },
  transaction_title: {
    id: 'transaction_title',
    defaultMessage: 'Transaction {transaction} info'
  }
})

export class TransactionDialog extends React.Component {
  render () {
    const {
      show,
      transaction
    } = this.props
    const actions = (<FlatButton onClick={this.props.closeDialog}>{renderFormattedMessage(messages.close)}</FlatButton>)
    const title = (
      <div>{renderFormattedMessage(messages.transaction_title, { transaction: (<strong>{transaction}</strong>) })}
        <div style={{
          float: 'right',
          paddingRight: '10px',
          fontWeight: 100,
          cursor: 'pointer'
        }}>
          <a onClick={this.props.closeDialog}>x</a>
        </div>
      </div>)
    return (
      <Dialog
        open={show}
        title={title}
        repositionOnUpdate={false}
        autoDetectWindowHeight={false}
        modal={false}
        actions={actions}
        onRequestClose={this.props.closeDialog}
        contentStyle={{width: '100%', transform: 'translate(0, 0)', maxWidth: 'auto'}}
        bodyStyle={{padding: '0px 20px'}}
        style={{paddingTop: 0, height: '100vh', overflow: 'auto'}} >
        <TransactionInformationContainer
          transaction={this.props.transaction}
          asset={this.props.asset}
          closeDialog={this.props.closeDialog}
          openBlockDialog={this.props.openBlockDialog}
          openAccountDialog={this.props.openAccountDialog}
          openTransactionDialog={this.props.openTransactionDialog} />
      </Dialog>
    )
  }
}

TransactionDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeDialog: PropTypes.func,
  transaction: PropTypes.string,
  asset: PropTypes.object,
  openAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  openBlockDialog: PropTypes.func
}

export default TransactionDialog
