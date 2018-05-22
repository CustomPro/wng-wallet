import React, { PropTypes } from 'react'
import { FormattedNumber, defineMessages } from 'react-intl'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText,
  Tabs,
  Tab
} from 'material-ui'
import { tokenName } from 'config.json'

import PageTitle from 'components/PageTitle'
import AskOrdersContainer from 'components/Orders/AskOrdersContainer'
import BidOrdersContainer from 'components/Orders/BidOrdersContainer'
import UserAskOrdersContainer from 'components/Orders/UserAskOrdersContainer'
import UserBidOrdersContainer from 'components/Orders/UserBidOrdersContainer'
import OrderFormContainer from 'components/OrderForm/OrderFormContainer'
import PublicHistoryContainer from 'components/History/PublicHistoryContainer'
import AccountHistoryContainer from 'components/History/AccountHistoryContainer'
import AccountDialog from 'components/AccountInformation/AccountDialog'
import TransactionDialog from 'components/TransactionInformation/TransactionDialog'
import AssetsSelector from 'components/Assets/AssetsSelector'
import style from './Exchange.css'

import { renderFormattedMessage } from 'redux/utils/intl'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'
import { Element } from 'react-scroll'

const messages = defineMessages({
  exchange: {
    id: 'exchange.exchange',
    defaultMessage: 'EXCHANGE'
  },
  exchange_title: {
    id: 'exchange.title',
    defaultMessage: 'Asset Exchange'
  },
  exchange_subtitle: {
    id: 'exchange.subtitle',
    defaultMessage: 'Exchange {asset} for {token}'
  },
  assets: {
    id: 'assets',
    defaultMessage: 'Assets'
  },
  account: {
    id: 'account',
    defaultMessage: 'Account'
  },
  transactions: {
    id: 'transactions',
    defaultMessage: 'Transactions'
  },
  your_balance: {
    id: 'your_balance',
    defaultMessage: 'Your Balance'
  },
  orders: {
    id: 'orders',
    defaultMessage: 'Orders'
  },
  sell_orders: {
    id: 'sell_orders',
    defaultMessage: 'Sell Orders'
  },
  buy_orders: {
    id: 'buy_orders',
    defaultMessage: 'Buy Orders'
  },
  my_orders: {
    id: 'my_orders',
    defaultMessage: 'My Orders'
  },
  history: {
    id: 'history',
    defaultMessage: 'History'
  },
  public: {
    id: 'public',
    defaultMessage: 'Public'
  },
  personal: {
    id: 'personal',
    defaultMessage: 'Personal'
  }
})

export class Exchange extends React.Component {

  openAccountDialog = (account) => {
    this.props.closeTransactionDialog()
    this.props.openAccountDialog(account)
  }

  openTransactionDialog = (transaction) => {
    this.props.closeAccountDialog()
    this.props.openTransactionDialog(transaction)
  }

  componentDidMount () {
    const { getAsset, getAccountBalance, account } = this.props
    if (!this.props.asset.asset) {
      getAsset()
    }
    const { accountRS } = account
    getAccountBalance(accountRS)
  }

  renderAssetInformation (asset, getAssets, getAsset, selectedAssets, isLoadingAsset, isMobile) {
    let descriptionMobileStyle
    if (isMobile) { descriptionMobileStyle = { paddingTop: 20 } }
    return (
      <div className={style.Exchange_Widget}>
        <div className={style.AssetInformation_Body}>
          <div className={style.AssetInformation_Body__Description} style={descriptionMobileStyle}>
            {renderFormattedMessage({ id: asset.name })}
          </div>
          <div className={style.AssetInformation_Body__Number}>
            &nbsp;{renderFormattedMessage(messages.exchange)}
          </div>
          <div className={style.AssetInformation_Selector}>
            <AssetsSelector
              getAssets={getAssets}
              getAsset={getAsset}
              selectedAssets={selectedAssets}
              isLoadingAsset={isLoadingAsset}
              isMobile={isMobile}
                />
          </div>
        </div>
      </div>
    )
  }

  renderOrderForm (asset, balance, assetBalance, getAccountBalance) {
    let titleColor
    let textColor
    let headerColor
    if (CustomTheme.order_form) {
      if (CustomTheme.order_form.textColor) {
        textColor = CustomTheme.order_form.textColor
      }
      if (CustomTheme.order_form.color) {
        titleColor = CustomTheme.order_form.color
      }
      if (CustomTheme.order_form.headerColor) {
        headerColor = CustomTheme.order_form.headerColor
      }
    }
    return (
      <Element name='orderFormWidget' className={style.Exchange_Widget}>
        <Card className={style.OrderForm} style={{ backgroundColor: titleColor, color: textColor }}>
          <CardTitle
            className={style.OrderForm_Header}
            style={{ backgroundColor: headerColor }}
            >
            <div className={style.OrderForm_Header__Title}>
              {renderFormattedMessage(messages.exchange_subtitle, {
                token: tokenName,
                asset: renderFormattedMessage({ id: asset.name })
              })
            }</div>
          </CardTitle>
          <CardText className={style.OrderForm_Body} style={{ color: textColor, backgroundColor: titleColor }}>
            <Row>
              <Col xs={12} md={5}>
                <div className={style.OrderForm_Body__Balance}>
                  <div className={style.OrderForm_Body__BalanceText}>
                    {renderFormattedMessage(messages.your_balance)}
                  </div>
                  <div className={style.OrderForm_Body__CurrencyBalance}>
                    <FormattedNumber value={balance} />
                    <span className={style.OrderForm_Body__BalanceName}> {tokenName}</span>
                  </div>
                  <div className={style.OrderForm_Body__AssetBalance}>
                    <FormattedNumber value={assetBalance} />
                    <span
                      className={style.OrderForm_Body__BalanceName}> {renderFormattedMessage({ id: asset.name })}</span>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={7}>
                <OrderFormContainer
                  getAccountBalance={getAccountBalance}
                  updateOrders={this.updateOrders}
                />
              </Col>
            </Row>
          </CardText>
        </Card>
      </Element>
    )
  }
  render () {
    const {
      asset,
      intl: { formatMessage },
      getAsset,
      isMobile,
      getAccountBalance,
      getAssets,
      selectedAssets,
      isLoadingAsset
    } = this.props

    let balance = 0
    let assetBalance = 0

    if (this.props.balance) {
      balance = this.props.balance
    }
    if (this.props.assetBalance) {
      assetBalance = this.props.assetBalance
    }
    let ordersTextColor
    let ordersHeaderColor
    let ordersTabColor
    let ordersInkBarColor
    if (CustomTheme.responsive_tables && CustomTheme.responsive_tables.orders) {
      if (CustomTheme.responsive_tables.orders.color) {
        ordersHeaderColor = CustomTheme.responsive_tables.orders.color
        ordersTabColor = CustomTheme.responsive_tables.orders.color
      }
      if (CustomTheme.responsive_tables.orders.textColor) {
        ordersTextColor = CustomTheme.responsive_tables.orders.textColor
      }
      if (CustomTheme.responsive_tables.orders.headerColor) {
        ordersHeaderColor = CustomTheme.responsive_tables.orders.headerColor
        ordersTabColor = CustomTheme.responsive_tables.orders.headerColor
      }
      if (CustomTheme.responsive_tables.orders.tabColor) {
        ordersTabColor = CustomTheme.responsive_tables.orders.tabColor
      }
      if (CustomTheme.responsive_tables.orders.inkBarColor) {
        ordersInkBarColor = CustomTheme.responsive_tables.orders.inkBarColor
      }
    }

    let historyTextColor
    let historyHeaderColor
    let historyTabColor
    let historyInkBarColor
    if (CustomTheme.responsive_tables && CustomTheme.responsive_tables.history) {
      if (CustomTheme.responsive_tables.history.color) {
        historyHeaderColor = CustomTheme.responsive_tables.history.color
        historyTabColor = CustomTheme.responsive_tables.history.color
      }
      if (CustomTheme.responsive_tables.history.textColor) {
        historyTextColor = CustomTheme.responsive_tables.history.textColor
      }
      if (CustomTheme.responsive_tables.history.headerColor) {
        historyHeaderColor = CustomTheme.responsive_tables.history.headerColor
        historyTabColor = CustomTheme.responsive_tables.history.headerColor
      }
      if (CustomTheme.responsive_tables.history.tabColor) {
        historyTabColor = CustomTheme.responsive_tables.history.tabColor
      }
      if (CustomTheme.responsive_tables.history.inkBarColor) {
        historyInkBarColor = CustomTheme.responsive_tables.history.inkBarColor
      }
    }

    return (
      <PageTitle pageName='exchange'>
        <AccountDialog title={formatMessage(messages.account)}
          account={this.props.accountInformationId}
          show={this.props.accountDialogIsOpen}
          closeDialog={this.props.closeAccountDialog}
          asset={asset}
          openTransactionDialog={this.openTransactionDialog}
          openAccountDialog={this.openAccountDialog} />
        <TransactionDialog title={formatMessage(messages.transactions)}
          transaction={this.props.transactionInformationId}
          asset={asset}
          show={this.props.transactionDialogIsOpen}
          closeDialog={this.props.closeTransactionDialog}
          openTransactionDialog={this.openTransactionDialog}
          openAccountDialog={this.openAccountDialog} />

        {this.renderAssetInformation(asset, getAssets, getAsset, selectedAssets, isLoadingAsset, isMobile)}
        {this.renderOrderForm(asset, balance, assetBalance, getAccountBalance)}
        <div className={style.Exchange_Widget}>
          <Card>
            <CardTitle
              className={style.OrdersTable_Header}
              style={{ backgroundColor: ordersHeaderColor, color: ordersTextColor }}
              >
              <div className={style.OrdersTable_Header__Title}>
                {renderFormattedMessage(messages.orders)}
              </div>
            </CardTitle>
            <Tabs
              tabItemContainerStyle={{ backgroundColor: ordersTabColor, color: ordersTextColor }}
              inkBarStyle={{ backgroundColor: ordersInkBarColor }}
              >
              <Tab label={renderFormattedMessage(messages.sell_orders, {
                asset: renderFormattedMessage({ id: asset.name })
              })}
                buttonStyle={{ color: ordersTextColor }}>
                <AskOrdersContainer
                  openAccountDialog={this.openAccountDialog}
                  closeAccountDialog={this.props.closeAccountDialog}
                  asset={asset}
                />
              </Tab>
              <Tab label={renderFormattedMessage(messages.buy_orders, {
                asset: renderFormattedMessage({ id: asset.name })
              })}
                buttonStyle={{ color: ordersTextColor }}>
                <BidOrdersContainer
                  openAccountDialog={this.openAccountDialog}
                  closeAccountDialog={this.props.closeAccountDialog}
                  asset={asset}
                />
              </Tab>
            </Tabs>
          </Card>
        </div>
        <div className={style.Exchange_Widget}>
          <Card>
            <CardTitle
              className={style.OrdersTable_Header}
              style={{ backgroundColor: ordersHeaderColor, color: ordersTextColor }}
              >
              <div className={style.OrdersTable_Header__Title}>
                {renderFormattedMessage(messages.my_orders)}
              </div>
            </CardTitle>
            <Tabs
              tabItemContainerStyle={{ backgroundColor: ordersTabColor, color: ordersTextColor }}
              inkBarStyle={{ backgroundColor: ordersInkBarColor }}
              >
              <Tab label={renderFormattedMessage(messages.sell_orders, {
                asset: renderFormattedMessage({ id: asset.name })
              })}
                buttonStyle={{ color: ordersTextColor }}>
                <UserAskOrdersContainer
                  openAccountDialog={this.openAccountDialog}
                  closeAccountDialog={this.props.closeAccountDialog}
                  asset={asset}
                />
              </Tab>
              <Tab label={renderFormattedMessage(messages.buy_orders, {
                asset: renderFormattedMessage({ id: asset.name })
              })}
                buttonStyle={{ color: ordersTextColor }}>
                <UserBidOrdersContainer
                  openAccountDialog={this.openAccountDialog}
                  closeAccountDialog={this.props.closeAccountDialog}
                  asset={asset}
                />
              </Tab>
            </Tabs>
          </Card>
        </div>
        <div className={style.Exchange_Widget}>
          <Card>
            <CardTitle
              className={style.HistoryTable_Header}
              style={{ backgroundColor: historyHeaderColor, color: historyTextColor }}>
              <div className={style.HistoryTable_Header__Title}>
                {renderFormattedMessage(messages.history)}
              </div>
            </CardTitle>
            <Tabs
              tabItemContainerStyle={{ backgroundColor: historyTabColor, color: historyTextColor }}
              inkBarStyle={{ backgroundColor: historyInkBarColor }}
              >
              <Tab
                buttonStyle={{ color: historyTextColor }}
                label={renderFormattedMessage(messages.public)}>
                <PublicHistoryContainer
                  asset={asset}
                  openAccountDialog={this.openAccountDialog}
                  closeAccountDialog={this.props.closeAccountDialog}
                  openTransactionDialog={this.openTransactionDialog}
                  closeTransactionDialog={this.props.closeTransactionDialog} />
              </Tab>
              <Tab
                buttonStyle={{ color: historyTextColor }}
                label={renderFormattedMessage(messages.personal)}>
                <AccountHistoryContainer
                  asset={asset}
                  openAccountDialog={this.openAccountDialog}
                  closeAccountDialog={this.props.closeAccountDialog}
                  openTransactionDialog={this.openTransactionDialog}
                  closeTransactionDialog={this.props.closeTransactionDialog} />
              </Tab>
            </Tabs>
          </Card>
        </div>
      </PageTitle>
    )
  }
}

Exchange.propTypes = {
  intl: PropTypes.object.isRequired,
  account: PropTypes.object,
  balance: PropTypes.string.isRequired,
  assetBalance: PropTypes.string,
  accountBalance: PropTypes.object,
  isLoadingAsset: PropTypes.bool.isRequired,
  isLoadingAccountBalance: PropTypes.bool,
  isLoadingAssets: PropTypes.bool,
  hasLoadedAssets: PropTypes.bool,
  asset: PropTypes.object.isRequired,
  selectedAssets: PropTypes.array,
  getAsset: PropTypes.func.isRequired,
  getAssets: PropTypes.func,
  getAccountBalance: PropTypes.func,
  openAccountDialog: PropTypes.func,
  closeAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  closeTransactionDialog: PropTypes.func,
  isMobile: PropTypes.bool,
  accountDialogIsOpen: PropTypes.bool,
  accountInformationId: PropTypes.string,
  transactionDialogIsOpen: PropTypes.bool,
  transactionInformationId: PropTypes.string,
  isCancellingOrder: PropTypes.bool,
  cancelOrder: PropTypes.func,
  updateOrders: PropTypes.func
}

export default Exchange
