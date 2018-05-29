import React, { PropTypes } from 'react'
import { defineMessages } from 'react-intl'
import { Row, Col } from 'react-flexbox-grid'
import {
  Card,
  CardTitle,
  CardText,
  RaisedButton
} from 'material-ui'
import { saveAs } from 'file-saver'

import PageTitle from 'components/PageTitle'
import ChangeLocaleMenu from 'components/ChangeLocaleMenu'
import { renderFormattedMessage } from 'redux/utils/intl'

const messages = defineMessages({
  encrypted_backup: {
    id: 'encrypted_backup',
    defaultMessage: 'Safe Backup'
  },
  decrypted_backup: {
    id: 'decrypted_backup',
    defaultMessage: 'Decrypted Backup'
  },
  download_encrypted_backup: {
    id: 'download_encrypted_backup',
    defaultMessage: 'Download Encrypted Wallet'
  },
  download_decrypted_backup: {
    id: 'download_decrypted_backup',
    defaultMessage: 'Download Decrypted Wallet'
  },
  download_backup_help: {
    id: 'download_backup_help',
    defaultMessage: 'By choosing "Download Wallet", you will ' +
    'download an encrypted backup of your wallet to your current device. ' +
    'You can restore your backup file on our login page by choosing the "Restore Wallet" ' +
    'option and providing your login and password. Backups are not synchronised between devices.'
  },
  download_backup_safari_help: {
    id: 'download_backup_safari_help',
    defaultMessage: 'When using the Safari browser, after clicking ' +
    'the download button you need to save the page (press CMD + S) as ' +
    'type "Page Source" and name it "wallet.json".'
  },
  download_decrypted_backup_help: {
    id: 'download_decrypted_backup_help',
    defaultMessage: 'Here you can download your decrypted wallet. You can use this to import into a new account.'
  },
  download_decrypted_backup_warning: {
    id: 'download_decrypted_backup_warning',
    defaultMessage: 'WARNING: anyone with access to this file can access your funds. Be careful where to store it.'
  },
  language: {
    id: 'language',
    defaultMessage: 'Language'
  },
  choose_language: {
    id: 'choose_language',
    defaultMessage: 'Choose language'
  }
})

export class Settings extends React.Component {
  _onDownloadEncryptedBackup = () => {
    const { encryptedSecretPhrase } = this.props
    const blob = new Blob([JSON.stringify(encryptedSecretPhrase)], {type: 'text/plain;charset=utf-8'})
    saveAs(blob, 'encrypted_wallet.json')
  }

  _onDownloadDecryptedBackup = () => {
    const { secretPhrase } = this.props
    const blob = new Blob([JSON.stringify({ secretPhrase })], {type: 'text/plain;charset=utf-8'})
    saveAs(blob, 'wallet.json')
  }

  render () {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    return (
      <PageTitle pageName='settings'>
        <Row>
          <Col xs={12} md={12}>
            <Card>
              <CardTitle
                title={renderFormattedMessage(messages.encrypted_backup)} />
              <CardText>
                <p>{renderFormattedMessage(messages.download_backup_help)}</p>
                {isSafari && <p>
                  {renderFormattedMessage(messages.download_backup_safari_help)}
                </p>}
                <RaisedButton
                  primary
                  label={renderFormattedMessage(messages.download_encrypted_backup)}
                  onTouchTap={this._onDownloadEncryptedBackup} />
              </CardText>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <Col xs={12} md={12}>
            <Card>
              <CardTitle
                title={renderFormattedMessage(messages.decrypted_backup)} />
              <CardText>
                <p>{renderFormattedMessage(messages.download_decrypted_backup_help)}</p>
                <p>
                  <strong>{renderFormattedMessage(messages.download_decrypted_backup_warning)}</strong>
                </p>
                {isSafari && <p>
                  {renderFormattedMessage(messages.download_backup_safari_help)}
                </p>}
                <RaisedButton
                  secondary
                  label={renderFormattedMessage(messages.download_decrypted_backup)}
                  onTouchTap={this._onDownloadDecryptedBackup} />
              </CardText>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <Col xs={12} md={12}>
            <Card>
              <CardTitle
                title={renderFormattedMessage(messages.language)}
                subtitle={renderFormattedMessage(messages.choose_language)} />
              <CardText style={{ paddingBottom: 60 }}>
                <ChangeLocaleMenu />
              </CardText>
            </Card>
          </Col>
        </Row>
      </PageTitle>
    )
  }
}

Settings.propTypes = {
  intl: PropTypes.object.isRequired,
  encryptedSecretPhrase: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  secretPhrase: PropTypes.string.isRequired
}

export default Settings
