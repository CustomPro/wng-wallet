import React, { PropTypes } from 'react'
import BlockInformationContainer from './BlockInformationContainer'
import { Dialog, FlatButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  block: {
    id: 'block',
    defaultMessage: 'Block'
  },
  info: {
    id: 'info',
    defaultMessage: 'info'
  },
  close: {
    id: 'close',
    defaultMessage: 'Close'
  }
})

export class BlockDialog extends React.Component {

  render () {
    const {
      show,
      asset,
      block
    } = this.props
    const blockMessage = renderFormattedMessage(messages.block)
    const infoMessage = renderFormattedMessage(messages.info)
    const title = (<div>{blockMessage} <span style={{fontWeight: 'bold'}}>{block}</span> {infoMessage}
      <div style={{
        float: 'right',
        paddingRight: '10px',
        fontWeight: 100,
        cursor: 'pointer'
      }}><a onClick={this.props.closeDialog}>x</a></div>
    </div>)
    const actions = (<FlatButton onClick={this.props.closeDialog}>{renderFormattedMessage(messages.close)}</FlatButton>)
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
        <BlockInformationContainer asset={asset} block={block} />
      </Dialog>
    )
  }
}

BlockDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeDialog: PropTypes.func,
  block: PropTypes.string,
  asset: PropTypes.object
}

export default BlockDialog
