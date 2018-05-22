import BigNumber from 'bignumber.js'
import { tokenDecimals } from 'config.json'
const EPOCH_BEGINNING = 1385294400000
const BIG_DBN = new BigNumber(String(Math.pow(10, tokenDecimals)))
import { defineMessages } from 'react-intl'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  'OrdinaryPayment': {
    'id': 'transactiontypes.OrdinaryPayment',
    'defaultMessage': 'Ordinary Payment'
  },
  'ArbitraryMessage': {
    'id': 'transactiontypes.ArbitraryMessage',
    'defaultMessage': 'Arbitrary Message'
  },
  'AliasAssignment': {
    'id': 'transactiontypes.AliasAssignment',
    'defaultMessage': 'Alias Assignment'
  },
  'PollCreation': {
    'id': 'transactiontypes.PollCreation',
    'defaultMessage': 'Poll Creation'
  },
  'VoteCasting': {
    'id': 'transactiontypes.VoteCasting',
    'defaultMessage': 'Vote Casting'
  },
  'HubAnnouncement': {
    'id': 'transactiontypes.HubAnnouncement',
    'defaultMessage': 'Hub Announcement'
  },
  'AccountInfo': {
    'id': 'transactiontypes.AccountInfo',
    'defaultMessage': 'Account Info'
  },
  'AliasSell': {
    'id': 'transactiontypes.AliasSell',
    'defaultMessage': 'Alias Sell'
  },
  'AliasBuy': {
    'id': 'transactiontypes.AliasBuy',
    'defaultMessage': 'Alias Buy'
  },
  'AliasDelete': {
    'id': 'transactiontypes.AliasDelete',
    'defaultMessage': 'Alias Delete'
  },
  'PhasingVoteCasting': {
    'id': 'transactiontypes.PhasingVoteCasting',
    'defaultMessage': 'Phasing Vote Casting'
  },
  'AccountProperty': {
    'id': 'transactiontypes.AccountProperty',
    'defaultMessage': 'Account Property'
  },
  'AccountPropertyDelete': {
    'id': 'transactiontypes.AccountPropertyDelete',
    'defaultMessage': 'Account Property Delete'
  },
  'AssetIssuance': {
    'id': 'transactiontypes.AssetIssuance',
    'defaultMessage': 'Asset Issuance'
  },
  'AssetTransfer': {
    'id': 'transactiontypes.AssetTransfer',
    'defaultMessage': 'Asset Transfer'
  },
  'AskOrderPlacement': {
    'id': 'transactiontypes.AskOrderPlacement',
    'defaultMessage': 'Ask Order Placement'
  },
  'BidOrderPlacement': {
    'id': 'transactiontypes.BidOrderPlacement',
    'defaultMessage': 'Bid Order Placement'
  },
  'AskOrderCancellation': {
    'id': 'transactiontypes.AskOrderCancellation',
    'defaultMessage': 'Ask Order Cancellation'
  },
  'BidOrderCancellation': {
    'id': 'transactiontypes.BidOrderCancellation',
    'defaultMessage': 'Bid Order Cancellation'
  },
  'DividendPayment': {
    'id': 'transactiontypes.DividendPayment',
    'defaultMessage': 'Dividend Payment'
  },
  'AssetDelete': {
    'id': 'transactiontypes.AssetDelete',
    'defaultMessage': 'Asset Delete'
  },
  'DigitalGoodsListing': {
    'id': 'transactiontypes.DigitalGoodsListing',
    'defaultMessage': 'Digital Goods Listing'
  },
  'DigitalGoodsDelisting': {
    'id': 'transactiontypes.DigitalGoodsDelisting',
    'defaultMessage': 'Digital Goods Delisting'
  },
  'DigitalGoodsPriceChange': {
    'id': 'transactiontypes.DigitalGoodsPriceChange',
    'defaultMessage': 'Digital Goods Price Change'
  },
  'DigitalGoodsQuantityChange': {
    'id': 'transactiontypes.DigitalGoodsQuantityChange',
    'defaultMessage': 'Digital Goods Quantity Change'
  },
  'DigitalGoodsPurchase': {
    'id': 'transactiontypes.DigitalGoodsPurchase',
    'defaultMessage': 'Digital Goods Purchase'
  },
  'DigitalGoodsDelivery': {
    'id': 'transactiontypes.DigitalGoodsDelivery',
    'defaultMessage': 'Digital Goods Delivery'
  },
  'DigitalGoodsFeedback': {
    'id': 'transactiontypes.DigitalGoodsFeedback',
    'defaultMessage': 'Digital Goods Feedback'
  },
  'DigitalGoodsRefund': {
    'id': 'transactiontypes.DigitalGoodsRefund',
    'defaultMessage': 'Digital Goods Refund'
  },
  'EffectiveBalanceLeasing': {
    'id': 'transactiontypes.EffectiveBalanceLeasing',
    'defaultMessage': 'Effective Balance Leasing'
  },
  'SetPhasingOnly': {
    'id': 'transactiontypes.SetPhasingOnly',
    'defaultMessage': 'Set Phasing Only'
  },
  'CurrencyIssuance': {
    'id': 'transactiontypes.CurrencyIssuance',
    'defaultMessage': 'Currency Issuance'
  },
  'ReserveIncrease': {
    'id': 'transactiontypes.ReserveIncrease',
    'defaultMessage': 'Reserve Increase'
  },
  'ReserveClaim': {
    'id': 'transactiontypes.ReserveClaim',
    'defaultMessage': 'Reserve Claim'
  },
  'CurrencyTransfer': {
    'id': 'transactiontypes.CurrencyTransfer',
    'defaultMessage': 'Currency Transfer'
  },
  'PublishExchangeOffer': {
    'id': 'transactiontypes.PublishExchangeOffer',
    'defaultMessage': 'Publish Exchange Offer'
  },
  'ExchangeBuy': {
    'id': 'transactiontypes.ExchangeBuy',
    'defaultMessage': 'Exchange Buy'
  },
  'ExchangeSell': {
    'id': 'transactiontypes.ExchangeSell',
    'defaultMessage': 'Exchange Sell'
  },
  'CurrencyMinting': {
    'id': 'transactiontypes.CurrencyMinting',
    'defaultMessage': 'Currency Minting'
  },
  'CurrencyDeletion': {
    'id': 'transactiontypes.CurrencyDeletion',
    'defaultMessage': 'Currency Deletion'
  },
  'TaggedDataUpload': {
    'id': 'transactiontypes.TaggedDataUpload',
    'defaultMessage': 'Tagged Data Upload'
  },
  'TaggedDataExtend': {
    'id': 'transactiontypes.TaggedDataExtend',
    'defaultMessage': 'Tagged Data Extend'
  },
  'ShufflingCreation': {
    'id': 'transactiontypes.ShufflingCreation',
    'defaultMessage': 'Shuffling Creation'
  },
  'ShufflingRegistration': {
    'id': 'transactiontypes.ShufflingRegistration',
    'defaultMessage': 'Shuffling Registration'
  },
  'ShufflingProcessing': {
    'id': 'transactiontypes.ShufflingProcessing',
    'defaultMessage': 'Shuffling Processing'
  },
  'ShufflingRecipients': {
    'id': 'transactiontypes.ShufflingRecipients',
    'defaultMessage': 'Shuffling Recipients'
  },
  'ShufflingVerification': {
    'id': 'transactiontypes.ShufflingVerification',
    'defaultMessage': 'Shuffling Verification'
  },
  'ShufflingCancellation': {
    'id': 'transactiontypes.ShufflingCancellation',
    'defaultMessage': 'Shuffling Cancellation'
  }
})

export function formatTimestamp (timestamp) {
  const date = new Date(timestamp * 1000 + EPOCH_BEGINNING - 500)
  return date
}

export function convertQuantityToQNT (amount = 0, decimals = 8) {
  const bigAmount = new BigNumber(String(amount))
  const multiplyBy = new BigNumber(String(Math.pow(10, decimals)))
  const QNT = bigAmount.times(multiplyBy)
  return QNT.toString()
}

export function convertPriceToDQT (amount = 0, decimals = 8) {
  const bigAmount = new BigNumber(String(amount))
  const divideBy = new BigNumber(String(Math.pow(10, decimals)))
  const DQT = bigAmount.times(BIG_DBN).dividedBy(divideBy)
  return DQT.toString()
}

export function convertQNTToQuantity (amount = 0, decimals = 8) {
  const bigAmount = new BigNumber(String(amount))
  const divideBy = new BigNumber(String(Math.pow(10, decimals)))
  const quantity = bigAmount.dividedBy(divideBy)
  return quantity.toString()
}

export function convertDQTToPrice (amount = 0, decimals = 8) {
  const bigAmount = new BigNumber(String(amount))
  const multiplyBy = new BigNumber(String(Math.pow(10, decimals)))
  const price = bigAmount.dividedBy(BIG_DBN).times(multiplyBy)
  return price.toString()
}

export function convertDQTToDBN (amount = 0) {
  const bigAmount = new BigNumber(String(amount))
  const price = bigAmount.dividedBy(BIG_DBN)
  return price.toString()
}

export function convertDBNToDQT (amount = 0) {
  const bigAmount = new BigNumber(String(amount))
  const price = bigAmount.times(BIG_DBN)
  return price.toString()
}

export function generateTypeMessages (transactionTypes) {
  const typeObj = {}
  for (let key in transactionTypes) {
    const type = transactionTypes[key]
    for (let subtype in type) {
      const subsubtype = type[subtype]
      for (let item in subsubtype) {
        const typeName = subsubtype[item].name
        const name = typeName.split(/(?=[A-Z])/).join(' ')
        typeObj[typeName] = {
          id: typeName,
          defaultMessage: name
        }
      }
    }
  }
  return typeObj
}

export function getType (constants, type, getSubtype) {
  let message
  let name
  const subtype = getSubtype || 0
  if (constants[type] && constants[type].hasOwnProperty('subtypes')) {
    const typeFromConstant = constants[type].subtypes[subtype]
    message = renderFormattedMessage(messages[typeFromConstant.name])
    name = typeFromConstant.name
  }
  return {
    name,
    message
  }
}

export function getAssetInformation (selectedAssets, assetId) {
  let assetInfo
  selectedAssets.map((asset) => {
    if (asset.asset === assetId) {
      assetInfo = asset
    }
  })
  return assetInfo
}
