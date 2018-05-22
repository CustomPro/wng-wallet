import React, { PropTypes } from 'react'
import {
  convertQNTToQuantity,
  getType
} from 'redux/utils/nrs'
import { FormattedNumber } from 'react-intl'
import ResponsiveTable from 'components/ResponsiveTable/ResponsiveTable'

export class AssetIssuanceInformation extends React.Component {
  assetIssuanceInfo (response) {
    const responseKeys = [
      'type',
      'name',
      'decimals',
      'description',
      'initial_quantity',
      'quantity',
      'senderRS'
    ]
    const headers = [
      { name: 'type', messageId: 'type', label: 'Type' },
      { name: 'name', messageId: 'name', label: 'Name' },
      { name: 'decimals', messageId: 'decimals', label: 'Decimals' },
      { name: 'description', messageId: 'description', label: 'Description' },
      { name: 'initial_quantity', messageId: 'initial_quantity', label: 'Initial Quantity' },
      { name: 'quantity', messageId: 'quantity', label: 'Quantity' },
      { name: 'senderRS', messageId: 'sender_RS', label: 'Sender RS' }
    ]
    const { assets } = this.props
    const rows = []
    if (response) {
      response['decimals'] = response.attachment.decimals
      response['name'] = response.attachment.name
      response['description'] = response.attachment.description
      response['quantity'] = <FormattedNumber
        value={convertQNTToQuantity(response.attachment.quantityQNT,
          response.attachment.decimals)} />
      response['initial_quantity'] = assets.map((asset) => {
        if (asset.name === response.attachment.name) {
          return <FormattedNumber
            value={convertQNTToQuantity(asset.initialQuantityQNT,
              response.attachment.decimals)} />
        }
      })
      for (let item in response) {
        const row = {}
        responseKeys.map((key) => {
          if (item === key) {
            switch (item) {
              case 'type': {
                const type = getType(this.props.transactionTypes, response.type, response.subtype)
                row[item] = type.message
                break
              }
              case 'senderRS': {
                row[key] = (
                  <a style={{ cursor: 'pointer' }}
                    onClick={this.props.handleOpenAccountDialog}
                    data-val={response[key]}>{response[key]}
                  </a>)
                break
              }
              default: {
                row[key] = response[key]
              }
            }
            rows.push(row)
          }
        })
      }
    }
    const data = {
      headers,
      rows
    }
    return data
  }

  render () {
    const data = this.assetIssuanceInfo(this.props.transactionInformation)
    return (
      <ResponsiveTable
        data={data}
        isMobile
        hasNext={false}
        hasPrev={false}
      />
    )
  }
}

AssetIssuanceInformation.propTypes = {
  transaction: PropTypes.string,
  getAssetIssuanceInformation: PropTypes.func,
  transactionInformation: PropTypes.object,
  asset: PropTypes.object,
  assets: PropTypes.array,
  closeDialog: PropTypes.func,
  openAccountDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  isLoading: PropTypes.bool,
  transactionTypes: PropTypes.object,
  getOrderTrades: PropTypes.func,
  orderTrades: PropTypes.array,
  handleOpenAccountDialog: PropTypes.func,
  handleOpenTransactionDialog: PropTypes.func
}

export default AssetIssuanceInformation
