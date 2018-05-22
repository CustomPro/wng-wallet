import React, { PropTypes } from 'react'
import ResponsiveTable from 'components/ResponsiveTable'
import { RaisedButton } from 'material-ui'
import OnClick from 'components/OnClick'
import { FormattedNumber, defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'
import { convertQNTToQuantity } from 'redux/utils/nrs'

const messages = defineMessages({
  select_asset_button: {
    id: 'select_asset_button',
    defaultMessage: 'Select {asset}'
  }
})

class AssetsTable extends React.Component {

  componentDidMount () {
    const { getAssets } = this.props
    getAssets()
  }

  handleSelectAsset = (id) => {
    const { getAsset } = this.props
    getAsset(id)
  }

  filterData (responseKeys, response) {
    if (response) {
      const rows = []
      response.map((item) => {
        let row = {}
        responseKeys.map((key) => {
          if (item[key]) {
            switch (key) {
              case 'balanceQNT':
              case 'quantityQNT':
                const qt = convertQNTToQuantity(item[key], item.decimals)
                row[key] = <FormattedNumber value={qt} />
                break
              default:
                row[key] = item[key]
            }
          } else if (key === 'select_asset') {
            const label = renderFormattedMessage(messages.select_asset_button, {asset: item.name})
            row[key] = (
              <OnClick callback={this.handleSelectAsset} value={item.asset}>
                <RaisedButton
                  ref={item.name}
                  label={label}
                  primary />
              </OnClick>)
          } else { row[key] = '' }
        })
        rows.push(row)
      })
      return rows
    }
    return null
  }

  processResponse (headers, responseKeys, response) {
    const rows = this.filterData(responseKeys, response)
    const data = { headers, rows }
    return data
  }

  render () {
    const { selectedAssets, isMobile, isLoadingAssets } = this.props
    const headers = [
      { name: 'name', 'label': 'Name', messageId: 'name' },
      { name: 'quantityQNT', 'label': 'Total Quantity', 'messageId': 'total_quantity' },
      { name: 'select_asset', 'label': 'Select Asset', 'messsageId': 'select_asset' }
    ]
    const responseKeys = ['name', 'quantityQNT', 'select_asset']
    const balancesData = this.processResponse(headers, responseKeys, selectedAssets)

    return (
      <div>
        <ResponsiveTable
          data={balancesData}
          isLoading={isLoadingAssets}
          isMobile={isMobile} />
      </div>
    )
  }
}

AssetsTable.propTypes = {
  selectedAssets: PropTypes.array,
  getAssets: PropTypes.func,
  getAsset: PropTypes.func,
  isLoadingAssets: PropTypes.bool,
  isMobile: PropTypes.bool
}

export default AssetsTable
