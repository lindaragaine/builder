import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import { getStorage } from 'vc-cake'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

const workspaceStorage = getStorage('workspace')

export default class ParamsGroupAttribute extends Attribute {
  constructor (props) {
    super(props)
    this.clickAdd = this.clickAdd.bind(this)
    this.clickClone = this.clickClone.bind(this)
    this.clickDelete = this.clickDelete.bind(this)
    this.clickEdit = this.clickEdit.bind(this)
    this.enableEditable = this.enableEditable.bind(this)
    this.validateContent = this.validateContent.bind(this)
    this.preventNewLine = this.preventNewLine.bind(this)

    this.getSortableHandle = this.getSortableHandle.bind(this)
    this.getSortableList = this.getSortableList.bind(this)
    this.getSortableItems = this.getSortableItems.bind(this)
  }

  onParamChange (index, element, paramFieldKey, newValue) {
    let { updater, fieldKey, fieldType } = this.props
    let { value } = this.state
    value.value[ index ][ paramFieldKey ] = newValue
    element.cook ? element.cook().set(fieldKey, value) : element.set(fieldKey, value)
    updater(fieldKey, value, null, fieldType)
  }

  updateState (props) {
    if (props.value.value) {
      return {
        value: props.value,
        editable: {}
      }
    } else {
      let value = {}
      value.value = props.value
      return {
        value: value,
        editable: {}
      }
    }
  }

  setFieldValue (value) {
    let { updater, fieldKey, fieldType } = this.props
    updater(fieldKey, value, null, fieldType)
    this.setState({ value: value })
  }

  clickEdit (index) {
    let groupName = this.state.value.value[ index ]
    let options = {
      nestedAttr: true,
      parentElement: this.props.element,
      activeParamGroup: groupName,
      activeParamGroupIndex: index,
      fieldKey: this.props.fieldKey,
      customUpdater: this.onParamChange.bind(this)
    }
    workspaceStorage.trigger('edit', this.props.element.get('id'), this.props.element.get('tag'), options)
  }

  clickAdd () {
    let { value } = this.state.value
    let { settings } = this.props.options
    let newValue = {}
    Object.keys(settings).forEach((setting) => {
      newValue[ setting ] = settings[ setting ].value
    })
    newValue.title = 'Group title'
    value.push(lodash.defaultsDeep({}, newValue))
    let newState = {
      value: value
    }
    this.setFieldValue(newState)
  }

  clickClone (index) {
    let { value } = this.state.value
    value.push(lodash.defaultsDeep({}, value[ index ]))
    let newState = {
      value: value
    }
    this.setFieldValue(newState)
  }

  clickDelete (index) {
    let { value } = this.state.value
    value.splice(index, 1)
    let newState = {
      value: value
    }
    this.setFieldValue(newState)
  }

  getSortableItems () {
    const SortableItem = SortableElement(({ value, groupIndex }) => {
      let controlLabelClasses = 'vcv-ui-tree-layout-control-label'

      return (
        <div className='vcv-ui-form-params-group-item vcv-ui-tree-layout-control'>
          {this.getSortableHandle()}
          <div className='vcv-ui-tree-layout-control-content'>
            <span className={controlLabelClasses}>
              <span
                className='vcv-ui-forms-params-group-content-editable'
                ref={span => { this[ `title${groupIndex}` ] = span }}
                contentEditable
                suppressContentEditableWarning
                onKeyDown={this.preventNewLine}
                onClick={this.enableEditable}
                onBlur={this.validateContent}
                data-index={groupIndex}
              >
                {value.title}
              </span>
            </span>
            {this.getChildControls(groupIndex)}
          </div>
        </div>
      )
    })

    return this.state.value.value.map((group, index) => {
      return (
        <SortableItem key={`sortable-item-paramgroup-${index}`}
          index={index}
          value={group}
          groupIndex={index} />
      )
    })
  }

  enableEditable (e) {
    e.currentTarget.closest('.vcv-ui-tree-layout-control-label').classList.add('vcv-ui-tree-layout-control-label-editable')
  }

  validateContent (event) {
    const groupIndex = event.currentTarget.getAttribute('data-index')
    const value = event.currentTarget.innerText.trim()
    this.updateContent(value, groupIndex)
  }

  preventNewLine (event) {
    const groupIndex = event.currentTarget.getAttribute('data-index')
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this[ `title${groupIndex}` ].blur()
      this.validateContent(event)
    }
  }

  updateContent (value, groupIndex) {
    const { element } = this.props
    if (!value) {
      value = this.props.options.title
      this[ `title${groupIndex}` ].innerText = value
    }

    this.onParamChange(groupIndex, element, 'title', value)

    this.setState({
      editable: {}
    })
  }

  getSortableList () {
    const SortableList = SortableContainer(() => {
      return (
        <div>
          {this.getSortableItems()}
        </div>
      )
    })

    const onSortEnd = ({ oldIndex, newIndex }) => {
      let newState = this.state.value
      newState.value = arrayMove(this.state.value.value, oldIndex, newIndex)
      this.setFieldValue(newState)
    }

    let useDragHandle = true

    return (
      <SortableList lockAxis={'y'}
        useDragHandle={useDragHandle}
        helperClass={'vcv-ui-form-params-group-item--dragging'}
        onSortEnd={onSortEnd}
        items={this.state.value.value} />
    )
  }

  getSortableHandle () {
    const SortableHandler = SortableHandle(() => {
      let dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
      return (
        <div className={dragHelperClasses}>
          <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
        </div>
      )
    })

    return (<SortableHandler />)
  }

  getChildControls (index) {
    const { value } = this.state
    const { options } = this.props
    let maximum = false
    let minimum = false
    if (options.max && value && value.value && value.value.length >= options.max) {
      maximum = true
    }

    if (options.min && value && value.value && value.value.length <= options.min) {
      minimum = true
    }

    if (value && value.value && value.value.length <= 1) {
      minimum = true
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()
    const cloneText = localizations ? localizations.clone : 'Clone'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    return (
      <div className='vcv-ui-tree-layout-control-actions-container'>
        <span className='vcv-ui-tree-layout-control-actions'>
          <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={() => { this.clickEdit(index) }}>
            <i className='vcv-ui-icon vcv-ui-icon-edit' />
          </span>
          {!maximum &&
          <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={() => { this.clickClone(index) }}>
            <i className='vcv-ui-icon vcv-ui-icon-copy' />
          </span>}
          {!minimum && <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={() => { this.clickDelete(index) }}>
            <i className='vcv-ui-icon vcv-ui-icon-trash' />
          </span>}
        </span>
      </div>
    )
  }

  render () {
    const { value } = this.state
    const { options } = this.props
    let maximum = false
    if (options.max && value && value.value && value.value.length >= options.max) {
      maximum = true
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addText = localizations ? localizations.add : 'Add'
    return (
      <React.Fragment>
        {value.value && value.value.length ? null : (
          <div className='vcv-ui-form-group-heading'>{options.title}</div>
        )}
        <div className='vcv-ui-form-params-group'>
          {this.getSortableList()}
          {!maximum && <div className='vcv-ui-form-params-group-add-item vcv-ui-icon vcv-ui-icon-add' onClick={this.clickAdd} title={addText} />}
        </div>
      </React.Fragment>
    )
  }
}
