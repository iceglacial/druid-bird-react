/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common'
import thisStore from './store'
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import {List, Button, Row, Col, Icon, message, Spin, Card} from 'antd'
import appStore from '../../../store/app_store'
import userStore from './../store'
import mobx from 'mobx'

@observer
class UserFeldsTabs extends React.Component {
  constructor() {
    super()
    this.state = {
      fieldsType: this.props.fieldsType,
      myFields: [],
      hiddenItems: [],
      items: [],
    };
  }
  componentDidMount(){
    let curFields = mobx.toJS(appStore.userFields.env)
    let myFields = curFields.length ? mobx.toJS(appStore.disabledFields.env).concat(curFields) : appStore.defaultFields.env
    let myHiddenFields = []
    appStore.defaultFields.env.map(item=>{
      if(myFields.indexOf(item) === -1){
        myHiddenFields.push(item)
      }
    })
    console.log(myFields,myHiddenFields)
    this.setState({
      hiddenItems: myHiddenFields,
      items: myFields,
      myFields: myFields
    })
  }


  updateFields = () => {
    thisStore.set('loading', true)
    let items = []
    this.state.items.map(item => {
      if (thisStore.disabledFields.env.indexOf(item) === -1) {
        items.push(item)
      }
    })
    let url = Api.setUserFields('device');
    if(this.state.fieldsType === 'env'){
      url = Api.setUserFields('env');
    }else if(this.state.fieldsType === 'bhv'){
      url = Api.setUserFields('behavior');
    }else if(this.state.fieldsType === 'sms'){
      url = Api.setUserFields('sms');
    }
    axios.put(url, {fields: items}, httpConfig()).then(res => {
      message.success(appStore.language.updated)
      appStore.set('userFields', Object.assign(appStore.userFields, {env: items}))
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
  addField=(value)=>{
    let items = this.state.items
    let hiddenItems = this.state.hiddenItems
    let index = hiddenItems.indexOf(value)
    hiddenItems.splice(index,1)
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
    items.splice(index,1)
    hiddenItems.push(value)
    this.setState({
      hiddenItems,
      items,
    });
  }
  resetFields = ({oldIndex, newIndex}) => {
    this.setState({
      items: this.state.myFields,
    });
  }

  render() {
    const DragHandle = SortableHandle(() => <Icon type={'drag'}/>); // This can be any component you want

    const SortableItem = SortableElement(({value}) => {
      if (thisStore.disabledFields.env.indexOf(value) !== -1) {
        return (
          <Card.Grid className={'reorder-item'} >
            {appStore.language.getKeyName(value)}
          </Card.Grid>
        );
      }else{
        return (
          <Card.Grid className={'reorder-item'} >
            <DragHandle />
            {appStore.language.getKeyName(value)}
            <Icon type={'minus-circle'} onClick={()=>this.removeField(value)}/>
          </Card.Grid>
        );
      }
    });

    const SortableList = SortableContainer(({items}) => {
      return (
        <Card>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} helperClass={'on-drag-item'}/>
          ))}
        </Card>
      );
    });

    let hiddenItems = this.state.hiddenItems || []
    return (
      <div className="wrap-overlay">
        <Row className={'sortable-list'}>
          <Card span={6}>
              {hiddenItems.map((value, index) => {
                return <Card.Grid key={value + index + 'hidden'} className={'reorder-item'} >
                  {appStore.language.getKeyName(value)}
                  <Icon type={'add-circle'} onClick={()=>this.addField(value)}/>
                  </Card.Grid>
              })}
          </Card>
          <Col>
            <SortableList items={this.state.items} axis='xy' onSortEnd={this.onSortEnd} useDragHandle={true}/>
          </Col>
        </Row>

        <Button onClick={this.resetFields}>{appStore.language.reset}</Button>
        <Button onClick={this.updateFields}>{appStore.language.confirm}</Button>
      </div>
    )
  }
}

export default UserFeldsTabs