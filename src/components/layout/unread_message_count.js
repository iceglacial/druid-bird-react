/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../common'
import {Badge, Icon} from 'antd'
import {Link} from 'react-router-dom'
import appStore from '../../store/app_store'

@observer
class UnreadMessageCount extends React.Component {
  constructor() {
    super()
    this.state = {
      unreadMessageCount: 0
    }
    this.getUnreadMessage()
  }

  getUnreadMessage = () => {
    appStore.set('updateUnreadMessage',false);
    axios.get(Api.messageUnread, httpConfig()).then(res => {
      this.setState({
        unreadMessageCount: res.data.length
      })
      // console.log(this.state.unreadMessageCount)
    }).catch(err => {
      MessageHandle(err)
    })
  }
  setNavState = () => {
    appStore.setNavState({
      openKeys: ['pro_setting'],
      selectedKeys: ['push_notification']
    })
    window.location.hash='#/account-setting/message'
  }

  render() {
    if(appStore.updateUnreadMessage){
      this.getUnreadMessage()
    }
    return (
      <Badge count={this.state.unreadMessageCount}>
        <span onClick={this.setNavState}><Icon type="bell"/></span>
      </Badge>
    )
  }
}
export default UnreadMessageCount