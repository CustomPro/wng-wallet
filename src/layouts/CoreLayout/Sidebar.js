import React, { PropTypes } from 'react'
import { defineMessages, injectIntl, FormattedNumber } from 'react-intl'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Drawer, Divider, MenuItem } from 'material-ui'
import {
  tokenName,
  exchange,
  balances,
  blocks,
  accountVerification,
  vouchers
} from 'config.json'
import { closeSidebar, openMoreBalancesSection, closeMoreBalancesSection } from 'redux/modules/site'
import { getAssets } from 'redux/modules/balances'
import { getAvailableDevices } from 'redux/modules/qrreader'
import { openRedeemVoucherDialog, closeRedeemVoucherDialog } from 'routes/Vouchers/modules/Vouchers'
import { convertDQTToDBN, convertQNTToQuantity } from 'redux/utils/nrs'
import { renderFormattedMessage } from 'redux/utils/intl'
import OnClick from 'components/OnClick'
import Collapse from 'react-collapse'
import ConfirmAlert from 'components/ConfirmAlert'
import ReactDOM from 'react-dom'
import CustomTheme from 'layouts/CoreLayout/CustomTheme'
import style from './Sidebar.css'
import RedeemVoucherDialog from 'routes/Vouchers/components/RedeemVoucherDialog'

const messages = defineMessages({
  home: {
    id: 'home',
    defaultMessage: 'Home'
  },
  accounts: {
    id: 'accounts',
    defaultMessage: 'Accounts'
  },
  verifications: {
    id: 'verifications',
    defaultMessage: 'Verifications'
  },
  forging: {
    id: 'forging',
    defaultMessage: 'Forging'
  },
  balances: {
    id: 'balances',
    defaultMessage: 'Balances'
  },
  exchange: {
    id: 'exchange',
    defaultMessage: 'Exchange'
  },
  blocks: {
    id: 'blocks',
    defaultMessage: 'Blocks'
  },
  settings: {
    id: 'settings',
    defaultMessage: 'Settings'
  },
  account_verification: {
    id: 'account_verification',
    defaultMessage: 'Account Verification'
  },
  logout: {
    id: 'logout',
    defaultMessage: 'Logout'
  },
  logout_confirmation: {
    id: 'logout_confirmation',
    defaultMessage: 'Are you sure you want to logout?'
  },
  view_more_balances: {
    id: 'sidebar.view_more_balances',
    defaultMessage: 'View more balances'
  },
  login: {
    id: 'sidebar.login',
    defaultMessage: 'Login'
  },
  register: {
    id: 'sidebar.register',
    defaultMessage: 'Register'
  },
  authorized_user: {
    id: 'sidebar.authorized_user',
    defaultMessage: 'Authorized User'
  },
  unauthorized_user: {
    id: 'sidebar.unauthorized_user',
    defaultMessage: 'Unauthorized User'
  },
  vouchers: {
    id: 'sidebar.vouchers',
    defaultMessage: 'Vouchers'
  },
  redeem_voucher: {
    id: 'sidebar.redeem_voucher',
    defaultMessage: 'Redeem Voucher'
  },
  changepassword: {
    id: 'changepassword',
    defaultMessage: 'Change Password'
  },
  changepassword_confirmation: {
    id: 'changepassword_confirmation',
    defaultMessage: 'Are you sure you want to change password?'
  }
})
class Sidebar extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      confirmAlertIsOpen: false,
      confirmPasswordAlertIsOpen: false
    }
  }

  componentDidMount () {
    const { getAssets } = this.props
    getAssets()
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.path !== this.props.path) {
      this.props.closeSidebar()
    }
  }

  _onRequestChange = () => {
    const { closeSidebar } = this.props
    closeSidebar()
  }

  _onLogoutClick = () => {
    this.setState({ confirmAlertIsOpen: true })
  }

/*  _onPasswordClick = () => {
    this.setState({ confirmPasswordAlertIsOpen: true })
  }

  handldConfirmPassword = () => {
    this.setState({ confirmPasswordAlertIsOpen: false })
    window.location.href = '/changepassword'
  }

  handleClosePassword = () => {
    this.setState({ confirmPasswordAlertIsOpen: false })
  }
*/
  handleConfirmLogout = () => {
    this.setState({ confirmAlertIsOpen: false })
    window.location.href = '/'
  }

  handleCloseLogout = () => {
    this.setState({ confirmAlertIsOpen: false })
  }

  handleOpenRedeemVoucher = () => {
    this.props.openRedeemVoucherDialog()
  }

  componentDidUpdate (prevProps, prevState) {
    let highlightColor = '#efefef'
    if (CustomTheme.menuActiveColor) {
      highlightColor = CustomTheme.menuActiveColor
    }
    if (prevProps.path) {
      const prevMenuItem = ReactDOM.findDOMNode(this.refs[prevProps.path])
      if (prevMenuItem !== null) {
        prevMenuItem.setAttribute('style', 'background-color: transparent')
      }
    }
    if (this.props.path) {
      const menuItem = ReactDOM.findDOMNode(this.refs[this.props.path])
      if (menuItem !== null) {
        menuItem.setAttribute('style', 'background-color: ' + highlightColor)
      }
    }
  }

  handleMoreBalancesClick = () => {
    if (this.props.moreBalancesSectionOpen) {
      this.props.closeMoreBalancesSection()
    } else {
      this.props.openMoreBalancesSection()
    }
  }

  combineData (selectedAssets, assetBalances = []) {
    const combinedData = selectedAssets.map((asset) => {
      let balanceQNT = '0'
      assetBalances.map((balance) => {
        if (balance.asset === asset.asset) {
          const qt = convertQNTToQuantity(balance.balanceQNT, asset.decimals)
          balanceQNT = <FormattedNumber value={qt} />
        }
      })
      asset.balanceQNT = balanceQNT
      return asset
    })
    return combinedData
  }

  renderMyBalances (balances) {
    let menuTextColorStyle
    if (CustomTheme.menuTextColor) {
      menuTextColorStyle = { color: CustomTheme.menuTextColor }
    }
    const renderedBalances = balances.map((balance) => {
      if (balance.name) {
        return (
          <div key={balance.name}>
            {balance.balanceQNT}&nbsp;
            {renderFormattedMessage({ id: balance.name })}
          </div>
        )
      }
      return null
    })
    return (
      <div className={style.Sidebar_BalancesList} style={menuTextColorStyle}>
        {renderedBalances}
      </div>
    )
  }

  renderBalancesMenu (handleMoreBalancesClick,
    formatNumber, selectedAssets, assetBalances, balance, isAuthorized) {
    let menuTextColorStyle
    if (CustomTheme.menuTextColor) {
      menuTextColorStyle = { color: CustomTheme.menuTextColor }
    }
    const balanceHeader = (<strong>{`${formatNumber(balance)} ${tokenName}`}</strong>)
    const authorizedFlag = accountVerification.enabled && (
      <div className={style.Sidebar_AuthorizedUserDiv}>
        <span className={isAuthorized ? style.Sidebar_AuthorizedUser : style.Sidebar_UnauthorizedUser}>
          {isAuthorized
            ? <span>{renderFormattedMessage(messages.authorized_user)}</span>
            : <Link to={'/account-verification'}>
              {renderFormattedMessage(messages.unauthorized_user)}
            </Link>
          }
        </span>
      </div>
    )

    if (selectedAssets.length > 0) {
      const combinedData = this.combineData(selectedAssets, assetBalances)
      const balanceDiv = (
        <div className={style.Sidebar_BalancesHeader} style={menuTextColorStyle}>
          {balanceHeader}
          {authorizedFlag}
          <Divider className={style.Sidebar_BalancesHeader__Divider} />
          <div className={style.Sidebar_MoreBalances}>
            <OnClick callback={handleMoreBalancesClick}>
              <div className={style.Sidebar_ViewMoreBalances}>
                {renderFormattedMessage(messages.view_more_balances)}
              </div>
            </OnClick>
            <Collapse isOpened={this.props.moreBalancesSectionOpen}>
              {this.renderMyBalances(combinedData)}
            </Collapse>
          </div>
        </div>)
      return balanceDiv
    }
    return (
      <div className={style.Sidebar_BalancesHeader}>
        {balanceHeader}
        {authorizedFlag}
      </div>
    )
  }

  getBlocksMenuItem () {
    let menuTextColorStyle
    if (CustomTheme.menuTextColor) {
      menuTextColorStyle = { color: CustomTheme.menuTextColor }
    }
    if (blocks.enabled) {
      return (
        <MenuItem
          style={menuTextColorStyle}
          ref='blocks'
          key='blocks'
          containerElement={<Link to='/blocks' />}>
          {renderFormattedMessage(messages.blocks)}
        </MenuItem>
      )
    }
  }

  renderLoggedIn () {
    let balancesMenuItem
    let exchangeMenuItem
    let accountVerificationMenuItem
    let redeemVouchersMenuItem
    let blocksMenuItem = this.getBlocksMenuItem()
    let menuTextColorStyle
    if (CustomTheme.menuTextColor) {
      menuTextColorStyle = { color: CustomTheme.menuTextColor }
    }

    const { isAuthorized } = this.props

    if (balances.enabled) {
      balancesMenuItem = (
        <MenuItem
          style={menuTextColorStyle}
          ref='balances'
          key='balances'
          containerElement={<Link to='/balances' />}>
          {renderFormattedMessage(messages.balances)}
        </MenuItem>
      )
    }
    if (exchange.enabled) {
      exchangeMenuItem = (
        <MenuItem
          style={menuTextColorStyle}
          ref='exchange'
          key='exchange'
          containerElement={<Link to='/exchange' />}>
          {renderFormattedMessage(messages.exchange)}
        </MenuItem>
      )
    }

    if (vouchers.enabled) {
      redeemVouchersMenuItem = (
        <MenuItem
          style={menuTextColorStyle}
          onClick={this.handleOpenRedeemVoucher}
          ref='redeem-voucher'
          key='redeem-voucher'>
          {renderFormattedMessage(messages.redeem_voucher)}
        </MenuItem>
      )
    }

    if (!isAuthorized && accountVerification.enabled) {
      accountVerificationMenuItem = (
        <MenuItem
          style={menuTextColorStyle}
          ref='account-verification'
          key='account-verification'
          containerElement={<Link to='/account-verification' />}>
          {renderFormattedMessage(messages.account_verification)}
        </MenuItem>
      )
    }

    return (
      <div>
        <MenuItem
          style={menuTextColorStyle}
          ref='home'
          key='home'
          containerElement={<Link to='/' />}>
          {renderFormattedMessage(messages.home)}
        </MenuItem>
        {blocksMenuItem}
        <MenuItem
          style={menuTextColorStyle}
          ref='forging'
          key='forging'
          containerElement={<Link to='/forging' />}>
          {renderFormattedMessage(messages.forging)}
        </MenuItem>
        {balancesMenuItem}
        {exchangeMenuItem}
        <Divider className={style.Sidebar_BalancesHeader__Divider} />
        {redeemVouchersMenuItem}
        <MenuItem
          style={menuTextColorStyle}
          ref='settings'
          key='settings'
          containerElement={<Link to='/settings' />}>
          {renderFormattedMessage(messages.settings)}
        </MenuItem>
        {accountVerificationMenuItem}
        <MenuItem
          style={menuTextColorStyle}
          ref='changepassword'
          key='changepassword'
          containerElement={<Link to='/changepassword' />}>
          {renderFormattedMessage(messages.changepassword)}
        </MenuItem>
        <MenuItem
          style={menuTextColorStyle}
          ref='logout'
          key='logout'
          onClick={this._onLogoutClick}>
          {renderFormattedMessage(messages.logout)}
        </MenuItem>
      </div>
    )
  }

  renderLoggedOut () {
    let blocksMenuItem = this.getBlocksMenuItem()
    let menuTextColorStyle
    if (CustomTheme.menuTextColor) {
      menuTextColorStyle = { color: CustomTheme.menuTextColor }
    }
    return (
      <div>
        <MenuItem
          style={menuTextColorStyle}
          ref='login'
          key='login'
          containerElement={<Link to='/login' />}>
          {renderFormattedMessage(messages.login)}
        </MenuItem>
        <MenuItem
          style={menuTextColorStyle}
          ref='register'
          key='register'
          containerElement={<Link to='/register' />}>
          {renderFormattedMessage(messages.register)}
        </MenuItem>
        {blocksMenuItem}
      </div>
    )
  }

  renderAdmin () {
    let vouchersMenuItem
    if (vouchers.enabled) {
      vouchersMenuItem = (
        <MenuItem containerElement={<Link to='vouchers' />}>
          {renderFormattedMessage(messages.vouchers)}
        </MenuItem>
      )
    }
    return (
      <div>
        <MenuItem containerElement={<Link to='accounts' />}>
          {renderFormattedMessage(messages.accounts)}
        </MenuItem>
        <MenuItem containerElement={<Link to='verifications' />}>
          {renderFormattedMessage(messages.verifications)}
        </MenuItem>
        {vouchersMenuItem}
        <Divider className={style.Sidebar_BalancesHeader__Divider} />
      </div>
    )
  }

  render () {
    const {
      intl: { formatNumber },
      balance,
      open,
      isAdmin,
      isBigScreen,
      isLoggedIn,
      isChecked2FA,
      assetBalances,
      selectedAssets,
      isAuthorized
    } = this.props
    const handleMoreBalancesClick = this.handleMoreBalancesClick
    const balanceDiv = this.renderBalancesMenu(handleMoreBalancesClick,
      formatNumber, selectedAssets, assetBalances, balance, isAuthorized)
    let menu
    let adminMenu
    if (isLoggedIn && isChecked2FA) {
      menu = this.renderLoggedIn()
    }
    if (!isChecked2FA) {
      menu = this.renderLoggedOut()
    }
    if (isAdmin) {
      adminMenu = this.renderAdmin()
    }
    return (
      <div>
        <Drawer
          width={isBigScreen ? 180 : 250}
          docked={isBigScreen}
          open={open || isBigScreen}
          onRequestChange={this._onRequestChange}>
          {isChecked2FA && balanceDiv}
          {isChecked2FA && <Divider style={{ marginTop: 8, marginBottom: 8 }} />}
          {adminMenu}
          {menu}
        </Drawer>
        <ConfirmAlert
          confirmCallback={this.handleConfirmLogout}
          closeCallback={this.handleCloseLogout}
          message={renderFormattedMessage(messages.logout_confirmation)}
          open={this.state.confirmAlertIsOpen}
        />

        <RedeemVoucherDialog
          intl={this.props.intl}
          show={this.props.redeemVoucherDialogIsOpen}
          closeDialog={this.props.closeRedeemVoucherDialog}
        />
      </div>
    )
  }
}

Sidebar.propTypes = {
  intl: PropTypes.object.isRequired,
  balance: PropTypes.string.isRequired,
  isBigScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isChecked2FA: PropTypes.bool.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  assetBalances: PropTypes.array,
  selectedAssets: PropTypes.array,
  getAssets: PropTypes.func,
  moreBalancesSectionOpen: PropTypes.bool,
  openMoreBalancesSection: PropTypes.func,
  closeMoreBalancesSection: PropTypes.func,
  path: PropTypes.string,
  getAvailableDevices: PropTypes.func,
  redeemVoucherDialogIsOpen: PropTypes.bool,
  closeRedeemVoucherDialog: PropTypes.func,
  openRedeemVoucherDialog: PropTypes.func
}

export default injectIntl(connect((state) => {
  //console.log(state)
  const open = state.site.sidebarOpen
  const moreBalancesSectionOpen = state.site.moreBalancesSectionOpen
  const { isAdmin } = state.auth
  const isLoggedIn = !!state.auth.account.secretPhrase
  const isChecked2FA = !!state.auth.account.isChecked2FA
  const isBigScreen = state.browser.greaterThan.medium
  const balance = convertDQTToDBN(state.auth.account.unconfirmedBalanceDQT)
  const { selectedAssets } = state.balances
  const { assetBalances, properties } = state.auth.account
  const { redeemVoucherDialogIsOpen } = state.vouchers
  let path
  let isAuthorized = false
  if (state.router.locationBeforeTransitions.pathname) {
    if (state.router.locationBeforeTransitions.pathname === '/') {
      path = 'home'
    } else {
      path = state.router.locationBeforeTransitions.pathname.replace('/', '')
    }
  }
  if (properties && properties.authorized) {
    if (properties.authorized === 'true') {
      isAuthorized = true
    }
  }

  return {
    account: state.auth.account,
    balance,
    open,
    moreBalancesSectionOpen,
    isAdmin,
    isLoggedIn,
    isChecked2FA,
    isBigScreen,
    selectedAssets,
    assetBalances,
    path,
    isAuthorized,
    redeemVoucherDialogIsOpen,
    isMobile: state.browser.lessThanOrEqual.medium
  }
}, (dispatch) => {
  return {
    closeSidebar: () => {
      dispatch(closeSidebar())
    },
    openMoreBalancesSection: () => {
      dispatch(openMoreBalancesSection())
    },
    closeMoreBalancesSection: () => {
      dispatch(closeMoreBalancesSection())
    },
    getAssets: () => {
      dispatch(getAssets())
    },
    getAvailableDevices: () => {
      dispatch(getAvailableDevices())
    },
    openRedeemVoucherDialog: () => {
      dispatch(openRedeemVoucherDialog())
    },
    closeRedeemVoucherDialog: () => {
      dispatch(closeRedeemVoucherDialog())
    }
  }
})(Sidebar))
