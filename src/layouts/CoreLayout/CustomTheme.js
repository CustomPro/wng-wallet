import logo from 'static/logo.png'
import {
  cyan500, cyan700, grey100,
  grey400, white, darkBlack,
  fullBlack
} from 'material-ui/styles/colors'
import { fade } from 'material-ui/utils/colorManipulator'

const colors = {
  blue: '#2196F3',
  blue_darker: '#1976D2',
  orange_darker: '#c37a00',
  orange_darkest: '#985f00',
  green_darker: '#0293a6',
  pink: 'rgb(255, 64, 129)',
  yellow: '#FECE1A',
  yellow_darker: '#E4B401'
}

const CustomTheme = {
  colors: colors,
  logo: false,
  headerLogo: true,
  headerLogoImage: logo,
  backgroundColor: '#e4b401',
  palette: {
    primary1Color: darkBlack,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: fade(darkBlack, 0.9),
    accent2Color: grey100,
    accent3Color: darkBlack,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: colors.yellow,
    borderColor: darkBlack,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  },
  menuActiveColor: colors.yellow_darker,
  order_form: {
    color: colors.yellow,
    textColor: 'black',
    headerColor: colors.yellow
  },
  responsive_tables: {
    blocks_table: {
      color: colors.yellow,
      textColor: 'black',
      inkBarColor: colors.pink
    },
    transactions: {
      color: colors.yellow,
      textColor: 'black',
      inkBarColor: colors.pink
    },
    balances_table: {
      color: colors.yellow,
      textColor: 'black',
      inkBarColor: colors.pink
    },
    orders: {
      tabColor: colors.yellow,
      headerColor: colors.yellow,
      textColor: 'black',
      inkBarColor: colors.pink
    },
    history: {
      color: colors.yellow,
      tabColor: colors.yellow,
      textColor: 'black',
      inkBarColor: colors.pink
    },
    vouchers_table: {
      color: colors.yellow,
      textColor: 'black'
    }
  }
}

export default CustomTheme
