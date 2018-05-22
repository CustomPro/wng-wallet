import React, { PropTypes } from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import '../../styles/core.scss'

import Header from './Header'
import Sidebar from './Sidebar'
import QRScanner from 'components/QRScanner/QRScanner'
import QrReaderContainer from 'components/QrReader/QrReaderContainer'
import SearchContainer from 'components/Search/SearchContainer'
import PageTitle from 'components/PageTitle'
import CustomTheme from './CustomTheme'

const theme = getMuiTheme(CustomTheme)

import style from './CoreLayout.scss'

function CoreLayout ({ children }) {
  let bgStyle
  if (CustomTheme.backgroundColor) {
    bgStyle = { backgroundColor: CustomTheme.backgroundColor }
  }
  return (
    <MuiThemeProvider muiTheme={theme}>
      <PageTitle pageName='home'>
        <QRScanner />
        {/* <QrReaderContainer /> */}
        <Header />
        <div id='mainContainer' className={style.mainContainer} style={bgStyle}>
          <Sidebar />
          <SearchContainer />
          {children}
        </div>
      </PageTitle>
    </MuiThemeProvider>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element
}

export default CoreLayout
