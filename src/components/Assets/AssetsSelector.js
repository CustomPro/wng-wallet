import React, { PropTypes } from 'react'
import { RaisedButton } from 'material-ui'
import OnClick from 'components/OnClick'
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import style from './AssetsSelector.css'

const messages = defineMessages({
  select_asset_button: {
    id: 'select_asset_button',
    defaultMessage: 'Select {asset}'
  }
})

class AssetsSelector extends React.Component {

  componentDidMount () {
    const { getAssets } = this.props
    getAssets()
  }

  handleSelectAsset = (id) => {
    const { getAsset, isLoadingAsset } = this.props
    if (!isLoadingAsset) { getAsset(id) }
  }

  renderSelectors (response) {
    const selectors = response.map((item) => {
      const label = renderFormattedMessage(messages.select_asset_button, {
        asset: renderFormattedMessage({ id: item.name })
      })

      return (
        <div key={item.asset} className={style.AssetsSelector_Asset}>
          <OnClick
            callback={this.handleSelectAsset}
            value={item.asset}>
            <RaisedButton
              ref={item.name}
              label={label}
              style={{ width: 125 }}
              primary />
          </OnClick>
        </div>)
    })
    return selectors
  }

  render () {
    const { selectedAssets, isMobile } = this.props
    let selectorsStyle = style.AssetsSelector_Assets
    if (isMobile) { selectorsStyle = style.AssetsSelector_Assets_Mobile }
    const selectors = this.renderSelectors(selectedAssets)

    if (selectedAssets.length < 2) {
      return null
    }

    return (
      <div className={selectorsStyle}>
          {selectors}
      </div>
    )
  }
}

AssetsSelector.propTypes = {
  selectedAssets: PropTypes.array,
  getAssets: PropTypes.func,
  getAsset: PropTypes.func,
  isLoadingAsset: PropTypes.bool,
  isMobile: PropTypes.bool
}

export default AssetsSelector
