import React from 'react'

export default class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.hideOnOuterClick = this.hideOnOuterClick.bind(this)
  }

  hideOnOuterClick (event) {
    if (this.props.closeOnOuterClick === false) {
      return
    }
    if (event.target.dataset.modal && this.props.onClose instanceof Function) {
      this.props.onClose(event)
    }
  }

  render () {
    if (!this.props.show) {
      return null
    }

    return (
      <div className='vcv-ui-modal-overlay' onClick={this.hideOnOuterClick} data-modal='true'>
        <div className='vcv-ui-modal-container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}