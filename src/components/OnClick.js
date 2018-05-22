import React, { PropTypes } from 'react'

class OnClick extends React.Component {

  constructor (props) {
    super(props)
    this.clickCallback = this.clickCallback.bind(this)
  }

  clickCallback () {
    if (this.props.disabled !== true) {
      this.props.callback(this.props.value)
    }
  }

  render () {
    return (
      <div onClick={this.clickCallback} className={this.props.className}>
        {this.props.children}
      </div>
    )
  }
}

OnClick.propTypes = {
  disabled: PropTypes.bool,
  callback: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number
  ]),
  children: PropTypes.object,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default OnClick
