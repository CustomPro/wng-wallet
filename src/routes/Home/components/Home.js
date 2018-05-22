import React, { PropTypes } from 'react'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText,
  FlatButton,
  RaisedButton
} from 'material-ui'
import InputIcon from 'material-ui/svg-icons/file/file-download'
import OutputIcon from 'material-ui/svg-icons/file/file-upload'
import ActionAutorenew from 'material-ui/svg-icons/action/autorenew'
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle'
import { tokenName } from 'config.json'
import { defineMessages } from 'react-intl'

import PageTitle from 'components/PageTitle'
import SendFormContainer from 'components/SendForm/SendFormContainer'
import ReceiveModal from 'components/ReceiveModal'
import TransactionModal from 'components/TransactionModal'
import GetNewVersionModal from 'components/GetNewVersionModal'
import AccountDialog from 'components/AccountInformation/AccountDialog'
import TransactionDialog from 'components/TransactionInformation/TransactionDialog'
import TransactionsContainer from 'components/Transactions/TransactionsContainer'
import CopyToClipboard from 'react-copy-to-clipboard'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'

import style from './Home.css'

import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  website_name: {
    id: 'website_name',
    defaultMessage: '{currency} Wallet'
  },
  website_subtitle: {
    id: 'website_subtitle',
    defaultMessage: 'Send and receive {currency}'
  },
  balance_and_currency: {
    id: 'balance_and_currency',
    defaultMessage: 'Balance: {balance} {currency}'
  },
  receive_currency: {
    id: 'receive_currency',
    defaultMessage: 'Receive {currency}'
  },
  send_currency: {
    id: 'send_currency',
    defaultMessage: 'Send {currency}'
  },
  transactions: {
    id: 'transactions',
    defaultMessage: 'Transactions'
  },
  account: {
    id: 'account',
    defaultMessage: 'Account'
  },
  transaction: {
    id: 'transaction',
    defaultMessage: 'Transaction'
  },
  update_balance_title: {
    id: 'update_balance_title',
    defaultMessage: 'Click to update your balance'
  },
  click_to_copy_account: {
    id: 'click_to_copy_account',
    defaultMessage: 'Click to copy your account number'
  },
  copied_to_clipboard: {
    id: 'copied_to_clipboard',
    defaultMessage: 'Copied to clipboard'
  }
})

export class Home extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      copySuccess: false
    }
  }

  componentDidMount () {
    this.props.getAsset()
  }

  _onSendClick = () => {
    const { onSendClick } = this.props

    onSendClick()
  }

  _onReceiveClick = () => {
    const { onReceiveClick } = this.props

    onReceiveClick()
  }

  openAccountDialog = (account) => {
    this.props.closeTransactionDialog()
    this.props.openAccountDialog(account)
  }

  openTransactionDialog = (transaction) => {
    this.props.closeAccountDialog()
    this.props.openTransactionDialog(transaction)
  }

  closeAccountDialog = () => {
    const { closeAccountDialog, accountRS } = this.props
    closeAccountDialog()
    this.props.updateBlockchainTransactionsPage(1, accountRS)
  }

  updateBalance = () => {
    this.props.getAccount()
  }

  onCopy = () => {
    this.setState({ copySuccess: true })
    this.setCopyTimeout = setTimeout(() => {
      this.setState({ copySuccess: false })
    }, 3000)
  }

  render () {
    const {
      intl: { formatNumber, formatMessage },
      balance,
      accountRS,
      publicKey,
      showModal,
      showReceiveModal,
      handleReceiveClose,
      isMobile
    } = this.props

    let copySuccessMessage

    const buttonStyle = { margin: 10, height: 45 }
    const balanceMessage = renderFormattedMessage(messages.balance_and_currency,
      { balance: formatNumber(balance), currency: tokenName })

    if (this.state.copySuccess) {
      copySuccessMessage = (
        <span className={style.Home_CopySuccess}>
          {renderFormattedMessage(messages.copied_to_clipboard)}
        </span>
      )
    }
    let renderedLogo
    let centeredLogoStyle
    if (CustomTheme.logo && CustomTheme.logoImage) {
      renderedLogo = (
        <Col md={3} style={{ margin: '0 auto' }}>
          <img src={CustomTheme.logoImage} style={{ maxWidth: 200 }} />
        </Col>
      )
      if (CustomTheme.centeredLogo) {
        centeredLogoStyle = { textAlign: 'center', marginTop: 10 }
      }
    }
    return (
      <PageTitle pageName='home'>
        <Row>
          <Col xs={12} md={12}>
            <Card>
              <CardTitle
                title={<div>
                  {renderFormattedMessage(messages.website_name, {currency: tokenName})}
                  <FlatButton
                    onClick={this.updateBalance}
                    label={balanceMessage}
                    icon={<ActionAutorenew />}
                    title={formatMessage(messages.update_balance_title)}
                    style={{ float: 'right' }} />
                </div>}
                subtitle={renderFormattedMessage(messages.website_subtitle, {currency: tokenName})} />
              <CardText style={centeredLogoStyle}>
                {renderedLogo}
                <div>
                  <CopyToClipboard text={accountRS} onCopy={this.onCopy}
                    title={formatMessage(messages.click_to_copy_account)}>
                    <FlatButton label={accountRS} icon={<ActionAccountCircle />} />
                  </CopyToClipboard>
                  {copySuccessMessage}
                </div>
                <RaisedButton
                  onClick={this._onReceiveClick}
                  icon={<InputIcon />}
                  label={renderFormattedMessage(messages.receive_currency, {currency: tokenName})}
                  primary
                  style={buttonStyle} />
                <RaisedButton
                  onClick={this._onSendClick}
                  icon={<OutputIcon />}
                  label={renderFormattedMessage(messages.send_currency, {currency: tokenName})}
                  secondary
                  style={buttonStyle} />
              </CardText>
            </Card>
          </Col>
        </Row>
        <ReceiveModal
          show={showReceiveModal}
          handleClose={handleReceiveClose}
          accountRS={accountRS}
          publicKey={publicKey}
          isMobile={isMobile} />
        <TransactionModal show={showModal}
          onSendClose={this.props.onSendClose}
          isMobile={isMobile}
          title={formatMessage(messages.send_currency, {currency: tokenName})}
          form={<SendFormContainer refreshTransactions={this.refreshTransactions} />} />
        <GetNewVersionModal />

        <div className={style.Home_Widget}>
          <Card>
            <TransactionsContainer
              asset={this.props.asset}
              selectedAccount={this.props.accountRS}
              isMobile={this.props.isMobile}
              UI={'transactions'}
              openAccountDialog={this.openAccountDialog}
              openTransactionDialog={this.openTransactionDialog}
              tokenName={tokenName}
              title={formatMessage(messages.transactions)}
            />
          </Card>
        </div>

        <AccountDialog title={formatMessage(messages.account)}
          account={this.props.accountInformationId}
          show={this.props.accountDialogIsOpen}
          closeDialog={this.closeAccountDialog}
          asset={this.props.asset} />
        <TransactionDialog title={formatMessage(messages.transaction)}
          transaction={this.props.transactionInformationId}
          asset={this.props.asset}
          show={this.props.transactionDialogIsOpen}
          closeDialog={this.props.closeTransactionDialog}
          openAccountDialog={this.openAccountDialog}
          openTransactionDialog={this.openTransactionDialog} />
      </PageTitle>
    )
  }
}

Home.propTypes = {
  intl: PropTypes.object.isRequired,
  accountRS: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  publicKey: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  showReceiveModal: PropTypes.bool.isRequired,
  onSendClick: PropTypes.func.isRequired,
  onSendClose: PropTypes.func,
  onReceiveClick: PropTypes.func.isRequired,
  handleReceiveClose: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  getAsset: PropTypes.func,
  getAccount: PropTypes.func,
  accountInformationId: PropTypes.string,
  transactionInformationId: PropTypes.string,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  accountDialogIsOpen: PropTypes.bool,
  transactionDialogIsOpen: PropTypes.bool,
  updateBlockchainTransactionsPage: PropTypes.func,
  asset: PropTypes.object
}

export default Home
