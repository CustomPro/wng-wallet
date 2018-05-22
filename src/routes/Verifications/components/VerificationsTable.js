import React, { PropTypes} from 'react'
import ResponsiveTable from 'components/ResponsiveTable'
import OnClick from 'components/OnClick'
import { injectIntl, defineMessages } from 'react-intl'
import { RaisedButton } from 'material-ui'
import { renderFormattedMessage } from 'redux/utils/intl'
import { generateToken } from 'nxt-crypto'

const messages = defineMessages({
  reject: {
    id: 'verifications.reject',
    defaultMessage: 'Reject'
  },
  approve: {
    id: 'verifications.approve',
    defaultMessage: 'Approve'
  },
  current_status: {
    id: 'verifications.current_status',
    defaultMessage: 'Current Status: {status}'
  },
  full_name: {
    id: 'verifications.full_name',
    defaultMessage: 'Full Name'
  },
  account: {
    id: 'verifications.account',
    defaultMessage: 'Account'
  },
  address: {
    id: 'verifications.address',
    defaultMessage: 'Address'
  }
})

export class VerificationsTable extends React.Component {

  componentDidMount () {
    const { getVerificationApplications, applicationsPageNumber, applicationsPageSize } = this.props
    getVerificationApplications(applicationsPageNumber, applicationsPageSize)
  }

  handlePrevClick = () => {
    const { applicationsPageNumber } = this.props
    const prevPage = applicationsPageNumber - 1
    this.props.updateVerificationsPage(prevPage)
  }

  handleNextClick = () => {
    const { applicationsPageNumber } = this.props
    const nextPage = applicationsPageNumber + 1
    this.props.updateVerificationsPage(nextPage)
  }

  handleOpenAccountDialog = (e) => {
    const account = e.target.getAttribute('data-val')
    this.props.openAccountDialog(account)
  }

  filterData (responseKeys, response) {
    const token = generateToken('admin', this.props.secretPhrase)
    if (response) {
      const rows = []
      response.map((item) => {
        let row = {}
        const statusButtons = (
          <div>
            <OnClick
              callback={this.props.postVerificationStatus}
              value={{ id: item.id, status: 'rejected', accountRS: item.accountRS }}>
              <RaisedButton
                secondary
                label={renderFormattedMessage(messages.reject)}
              />
            </OnClick>
            <br />
            <OnClick
              callback={this.props.postVerificationStatus}
              value={{ id: item.id, status: 'approved', accountRS: item.accountRS }}>
              <RaisedButton
                primary
                label={renderFormattedMessage(messages.approve)}
              />
            </OnClick>
          </div>
        )
        responseKeys.map((key) => {
          if (item[key]) {
            switch (key) {
              case 'status':
                row[key] = (
                  <div>
                    <div
                      style={{
                        marginBottom: 10,
                        border: '1px solid #d7d7d7',
                        padding: 10
                      }}
                      >{renderFormattedMessage(messages.current_status,
                        { status: item.status })}</div>
                    {statusButtons}
                  </div>
                )
                break
              case 'comments':
                if (item[key] === 'undefined') {
                  row[key] = ''
                } else {
                  row[key] = item[key]
                }
                break
              case 'fileURLS':
                const files = item[key]
                const links = files.map((file, index) => {
                  const url = `${file.url}?token=${token}`
                  return (
                    <div key={index}>
                      <a
                        href={url}
                        target='_blank'>
                        {file.file}
                      </a>
                    </div>
                  )
                })
                row[key] = links
                break
              default:
                row[key] = item[key]
            }
          } else { row[key] = '' }
        })
        row['information'] = (
          <div>
            <strong>{renderFormattedMessage(messages.full_name)}:</strong><br />
            {item.full_name}<br /><br />
            <strong>{renderFormattedMessage(messages.account)}:</strong><br />
            <a style={{ cursor: 'pointer' }}
              onClick={this.handleOpenAccountDialog}
              data-val={item.accountRS}>{item.accountRS}
            </a><br /><br />
            <strong>{renderFormattedMessage(messages.address)}:</strong><br />
            {item.address}
          </div>
        )
        if (item.status === null) {
          row['status'] = statusButtons
        }
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
    const {
      isLoadingApplications,
      applications,
      isMobile,
      applicationsHasNext,
      applicationsHasPrev
    } = this.props

    const headers = [
      { name: 'information', 'label': 'Information', messageId: 'information' },
      { name: 'comments', 'label': 'Comments', messageId: 'comments' },
      { name: 'fileURLS', 'label': 'Files', messageId: 'files' },
      { name: 'status', 'label': 'Status', messageId: 'status' }
    ]
    const responseKeys = ['information', 'comments', 'fileURLS', 'status']

    const VerificationsData = this.processResponse(headers, responseKeys, applications)

    return (
      <ResponsiveTable
        data={VerificationsData}
        isLoading={isLoadingApplications}
        isMobile={isMobile}
        handleNextClick={this.handleNextClick}
        handlePrevClick={this.handlePrevClick}
        hasNext={applicationsHasNext}
        hasPrev={applicationsHasPrev}
      />
    )
  }
}

VerificationsTable.propTypes = {
  intl: PropTypes.object.isRequired,
  isLoadingApplications: PropTypes.bool.isRequired,
  postVerificationStatus: PropTypes.func,
  applications: PropTypes.array,
  isMobile: PropTypes.bool,
  secretPhrase: PropTypes.string,
  getVerificationApplications: PropTypes.func,
  isRetrievingApplications: PropTypes.bool,
  isUpdatingApplications: PropTypes.bool,
  applicationsPageNumber: PropTypes.number,
  applicationsPageSize: PropTypes.number,
  applicationsHasNext: PropTypes.bool,
  applicationsHasPrev: PropTypes.bool,
  updateVerificationsPage: PropTypes.func,
  openAccountDialog: PropTypes.func
}

export default injectIntl(VerificationsTable)
