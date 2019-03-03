/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common'
import thisStore from './store'
import {Tabs,Card} from 'antd'
import appStore from '../../../store/app_store'
// import DeviceFields from './device_fields'
// import EnvFields from './env_fields'
// import BhvFields from './bhv_fields'
// import SmsFields from './sms_fields'

import TypeFields from './type_fields'
import mobx from "mobx/lib/mobx";

@observer
class UserFeldsTabs extends React.Component {
  constructor() {
    super()
    this.getMyInfo()
      this.getMyFields('device')
  }
  state={
    tabsActiveKey: 'device',
  }

  getMyInfo = () => {
    thisStore.set('loading',true)
    axios.get(Api.me, httpConfig()).then(res => {
      thisStore.setMyInfo(res.data);
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }
    getMyFields=(key)=>{
        let fieldsType = key;
        let curFields = mobx.toJS(appStore.userFields[fieldsType]) || [];
        let disabledFields = mobx.toJS(appStore.disabledFields[fieldsType]);
        let defaultFields = mobx.toJS(appStore.defaultFields[fieldsType]);
        let myFields = (curFields.length > 0) ? disabledFields.concat(curFields) : defaultFields;
        // console.log(curFields.length, myFields,disabledFields,defaultFields)
        let myHiddenFields = []
        appStore.defaultFields[fieldsType].map(item => {
            if (myFields.indexOf(item) === -1 && defaultFields.indexOf(item)) {
                myHiddenFields.push(item)
            }
        })
        thisStore.set('myFields',myFields)
        thisStore.set('myHiddenFields',myHiddenFields)
        // console.log(myHiddenFields,myFields);
    }
  onChangeTabs=(key)=>{
    this.getMyFields(key)
    this.setState({
      tabsActiveKey: key
    });
    thisStore.set('fieldsType',key)
    console.log(key)
      // console.log(myHiddenFields,myFields);
  }

  render() {
    return (
      <div className="wrap wrap-full">
        <Card>
          <Tabs type="card" activeKey={this.state.tabsActiveKey} onChange={this.onChangeTabs} tabBarExtraContent=''>
            <Tabs.TabPane tab={appStore.language.device} key="device">
              <TypeFields fieldsType={'device'} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={appStore.language.env} key="env">
              {/*<EnvFields />*/}
              <TypeFields fieldsType={'env'} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={appStore.language.bhv} key="bhv">
              {/*<BhvFields />*/}
              <TypeFields fieldsType={'bhv'} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={appStore.language.sms} key="sms">
              {/*<SmsFields />*/}
              <TypeFields fieldsType={'sms'} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    )
  }
}
export default UserFeldsTabs