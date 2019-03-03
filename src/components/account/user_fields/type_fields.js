/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common'
import thisStore from './store'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import { Button, Row, Col, Icon, message, Card} from 'antd'
import appStore from '../../../store/app_store'
// import userStore from './../store'
import mobx from 'mobx'

// let fieldsType;
@observer
class UserFeldsTabs extends React.Component {
  constructor(props) {
    super(props)
    // fieldsType = thisStore.fieldsType;//this.props.fieldsType
    this.state = {
      myFields: {
        hidden: Object.assign([],thisStore.myHiddenFields.toJS()),
        shown: Object.assign([],thisStore.myFields.toJS())
      },
      hiddenItems: thisStore.myHiddenFields,
      items: thisStore.myFields,
    };
    // console.log(Object.assign([],thisStore.myHiddenFields))
  }

  componentDidMount() {
  }

  updateFields = () => {
    thisStore.set('loading', true)
    let fieldsType = thisStore.fieldsType
    let items = []
    this.state.items.map(item => {
      if (appStore.disabledFields[fieldsType].indexOf(item) === -1) {
        items.push(item)
      }
    })
    let url;
    if (fieldsType === 'device') {
      url = Api.setUserFields('device');
    } else if (fieldsType === 'env') {
      url = Api.setUserFields('env');
    } else if (fieldsType === 'bhv') {
      url = Api.setUserFields('behavior');
    } else if (fieldsType === 'sms') {
      url = Api.setUserFields('sms');
    }
    axios.put(url, {fields: items}, httpConfig()).then(res => {
      message.success(appStore.language.updated)
      let changeItems = {}
      changeItems[fieldsType] = items;
      appStore.set('userFields', Object.assign(appStore.userFields, changeItems))
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  addField = (value) => {
    let items = this.state.items
    let hiddenItems = this.state.hiddenItems
    let index = hiddenItems.indexOf(value)
    hiddenItems.splice(index, 1)
    items.push(value)
    this.setState({
      hiddenItems,
      items,
    });
  }
  removeField = (value) => {
    let items = this.state.items
    let hiddenItems = this.state.hiddenItems
    let index = items.indexOf(value)
    items.splice(index, 1)
    hiddenItems.push(value)
    this.setState({
      hiddenItems,
      items,
    });
  }
  resetFields = ({oldIndex, newIndex}) => {
    let items = Object.assign([],this.state.myFields.shown)
    let hiddenItems = Object.assign([],this.state.myFields.hidden)
    this.setState({
      hiddenItems,
      items,
    });
  }

  render() {
    const DragHandle = SortableHandle(() => <Icon type={'drag'}/>); // This can be any component you want

    const SortableItem = SortableElement(({value}) => {
      if (appStore.disabledFields[thisStore.fieldsType].indexOf(value) !== -1) {
        return (
          <Card.Grid className={'reorder-item locked'}>
            <span title={`${appStore.language.getKeyName(value)}`}>{appStore.language.getKeyName(value)}</span>
          </Card.Grid>
        );
      } else {
        return (
          <Card.Grid className={'reorder-item'}>
            <DragHandle/>
            <span title={`${appStore.language.getKeyName(value)}`}>{appStore.language.getKeyName(value)}</span>
            <Icon type={'minus-circle'} onClick={() => this.removeField(value)}/>
          </Card.Grid>
        );
      }
    });

    const SortableList = SortableContainer(({items}) => {
      return (
        <Card bordered={false} bodyStyle={{padding:0}}>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} disabled={appStore.disabledFields[thisStore.fieldsType].indexOf(value) !== -1} helperClass={'on-drag-item'}/>
          ))}
        </Card>
      );
    });

    let hiddenItems = this.state.hiddenItems || []
    return (
      <div className="wrap-overlay">
        <div className='sort-head'>
          <Button onClick={this.resetFields}>{appStore.language.reset}</Button>
          <Button onClick={this.updateFields}>{appStore.language.confirm}</Button>
        </div>
        <div className={'sortable-list'}>
          <div className='showingFields'>
            <div className='label'>{appStore.language.onShowingGrid}</div>
            <SortableList items={this.state.items} axis='xy' onSortEnd={this.onSortEnd} useDragHandle={true}/>
          </div>
          <div className='hidingFields'>
            <div className='label'>{appStore.language.hiddenGrid}</div>
            <div>
              {hiddenItems.map((value, index) => {
                return <Card.Grid key={value + index + 'hidden'} className={'reorder-item'}>
                  {appStore.language.getKeyName(value)}
                  <Icon type={'add-circle'} onClick={() => this.addField(value)}/>
                </Card.Grid>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserFeldsTabs