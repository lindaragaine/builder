import React from 'react'
import ElementControl from './lib/elementControl'
import vcCake from 'vc-cake'
const cook = vcCake.getService('cook')

export default class BlankRowPlaceholder extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    controlsData: React.PropTypes.array
  }

  static defaultProps = {
    controlsData: [
      {
        tag: 'row',
        options: {
          layout: [ 'auto' ],
          icon: 'oneColumn.svg',
          title: 'Add one column'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '50%', '50%' ],
          icon: 'twoColumns.svg',
          title: 'Add two columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '33.33%', '33.33%', '33.33%' ],
          icon: 'threeColumns.svg',
          title: 'Add three columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '25%', '25%', '25%', '25%' ],
          icon: 'fourColumns.svg',
          title: 'Add four columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '20%', '20%', '20%', '20%', '20%' ],
          icon: 'fiveColumns.svg',
          title: 'Add five columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '66.66%', '33.34%' ],
          icon: 'custom.svg',
          title: 'Add custom row layout',
          type: 'custom'
        }
      },
      {
        tag: 'textBlock',
        options: {
          icon: 'textBlock.svg',
          title: 'Add Text block'
        }
      },
      {
        tag: 'addElement',
        options: {
          icon: 'addElement.svg',
          title: 'Add Element'
        }
      }
    ]
  }

  rowContainer = null
  elementsContainer = null
  initialSetControlsLayoutTimeout = null

  constructor (props) {
    super(props)
    this.state = {}
    this.handleClick = this.handleClick.bind(this)
    this.setControlsLayout = this.setControlsLayout.bind(this)
  }

  componentDidMount () {
    this.setControlData()
    // set timeout to get new state data from setControlData()
    this.initialSetControlsLayoutTimeout = setTimeout(() => {
      this.setControlsLayout()
    }, 1)
    this.addResizeListener(this.rowContainer, this.setControlsLayout)
  }

  componentWillUnmount () {
    this.removeResizeListener(this.rowContainer, this.setControlsLayout)
    if (this.initialSetControlsLayoutTimeout) {
      window.clearTimeout(this.initialSetControlsLayoutTimeout)
      this.initialSetControlsLayoutTimeout = null
    }
  }

  /**
   * Add element resize listener
   * @param element
   * @param fn
   */
  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('iframe')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
      this.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }

  /**
   * Remove element resize listener
   * @param element
   * @param fn
   */
  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }

  /**
   * Handle click for element control, don't open edit form
   * @param element
   */
  handleElementControl (element) {
    this.props.api.request('data:add', element)
  }

  /**
   * Handle click for element control, open edit form
   * @param element
   * @param tab
   */
  handleElementControlWithForm (element, tab = '') {
    this.props.api.request('data:add', element)
    this.props.api.request('app:edit', element.id, tab)
  }

  /**
   * Handle click for add element control, open add element form
   */
  handleAddElementControl () {
    this.props.api.request('app:add', '')
  }

  /**
   * Handle click for control depending on clicked control tag
   * @param control
   */
  handleClick (control) {
    if (control.tag === 'addElement') {
      this.handleAddElementControl()
    }
    if (control.tag === 'textBlock') {
      const element = cook.get({tag: control.tag}).toJS()
      this.handleElementControlWithForm(element)
    }
    if (control.tag === 'row') {
      const layoutData = {
        layoutData: control.options.layout
      }
      const element = cook.get({tag: control.tag, layout: layoutData}).toJS()
      if (control.options.type && control.options.type === 'custom') {
        this.handleElementControlWithForm(element, 'layout')
      } else {
        this.handleElementControl(element)
      }
    }
  }

  /**
   * Set state for the single control width, sum width of all controls
   */
  setControlData () {
    const controls = Array.prototype.slice.call(this.elementsContainer.children)
    const controlStyle = window.getComputedStyle(controls[0])
    const controlWidth = parseInt(controlStyle.width)
    const controlMargin = parseInt(controlStyle.marginLeft) + parseInt(controlStyle.marginRight)
    const controlFullWidth = controlWidth + controlMargin
    this.setState({
      controlWidth: controlFullWidth,
      controlsWidth: controlFullWidth * this.props.controlsData.length
    })
  }

  /**
   * Set state for the width of element controls container
   */
  setControlsLayout () {
    const { controlWidth, controlsWidth } = this.state
    const containerWidth = this.rowContainer.getBoundingClientRect().width
    const elementsCount = Math.floor(containerWidth / controlWidth)
    let elementsWidth = elementsCount * controlWidth
    elementsWidth = elementsWidth < controlsWidth ? elementsWidth : null
    if (this.state.containerWidth !== elementsWidth) {
      this.setState({ containerWidth: elementsWidth })
    }
  }

  /**
   * Get control props
   * @param control
   * @param index
   * @return {}
   */
  getControlProps (control, index) {
    return {
      key: 'vcvBlankRow' + control.tag + index,
      control: control,
      handleClick: this.handleClick
    }
  }

  /**
   * Get controls elements from controlsData
   * @return []
   */
  getElementControls () {
    return this.props.controlsData.map((control, i) => {
      return <ElementControl {...this.getControlProps(control, i)} />
    })
  }

  render () {
    const elementControls = this.getElementControls()
    let containerWidth = {}
    if (this.state.containerWidth) {
      containerWidth.width = `${this.state.containerWidth}px`
    }

    return (
      <vcvhelper
        className='vcv-ui-blank-row-container'
        ref={(container) => { this.rowContainer = container }}
      >
        <div className='vcv-ui-blank-row'>
          <div
            className='vcv-ui-blank-row-controls-container'
            style={containerWidth}
            ref={(container) => { this.elementsContainer = container }}
          >
            {elementControls}
          </div>
        </div>
      </vcvhelper>
    )
  }
}
