/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common'
import thisStore from './store'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {List, Button, Row, Col, Icon, message, Spin, Avatar} from 'antd'
import appStore from '../../../store/app_store'
import userStore from './../store'
import mobx from 'mobx'

const SortableItem = SortableElement(({value}) => {let className; if(thisStore.disabledFields.sms.indexOf(value)  !== -1){className='disabled'} return (<List.Item className={className}>{appStore.language.getKeyName(value)}</List.Item>)});

const SortableList = SortableContainer(({items}) => {
  return (
    <List className='sort-list' bordered size="small">
      {items.map((value, index) => {
        let disabled = false;
        if(thisStore.disabledFields.sms.indexOf(value)  !== -1){ disabled = true; }
          return <SortableItem key={`item-${value}`} index={index} value={value} disabled={disabled} />
      })}
    </List>
  );
});
let curFields = mobx.toJS(appStore.userFields.sms)
let myFields = curFields.length ? mobx.toJS(appStore.disabledFields.sms).concat(curFields) : thisStore.userFields.sms
@observer
class UserFeldsTabs extends React.Component {
  constructor() {
    super()
  }
  state = {
    items: myFields,
  };

  updateFields = () => {
    thisStore.set('loading',true)
    let items = []
    this.state.items.map(item=>{
      if(thisStore.disabledFields.sms.indexOf(item) === -1){
        items.push(item)
      }
    })
    axios.put(Api.setUserFields('sms'), {fields:items},httpConfig()).then(res => {
      message.success(appStore.language.updated)
      appStore.set('userFields',Object.assign(appStore.userFields,{sms: items}))
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  render() {
    return (
      <div className="wrap-overlay">
        <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
        <Button onClick={this.updateFields}>确认</Button>
      </div>
    )
  }
}
export default UserFeldsTabs