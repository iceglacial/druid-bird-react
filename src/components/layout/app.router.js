/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/27 0027.
 */
import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
// 设备
import DeviceList from '../device/device_list'
import DeviceDetail from '../device/detail/device.detail'
import DevicesLocation from '../map/device.location/devices_location'///device.location
import DevicesPath from '../map/device.path/device_path'
// 用户管理
import UserList from '../company/user.list'
import UserAuth from '../company/user.auth'
// 数据分类
import DataGpsGrid from '../data/gps'
import DataBehaviorGrid from '../data/behavior'
import SearchOutGps from '../data/searchout.gps'
// 设备配置
import DeviceSettingGrid from '../device.setting/device.setting'
import ModifySetting from '../device.setting/modify_setting/modify_setting'
// 地理围栏
import GeoFence from '../map/geofence/geofence'
import GeoFenceOfDevices from '../map/geofence/geofence_of_devices'
import GeoFenceDetail from '../map/geofence/geofence_detail'
import GeoFenceDetailManegeDevice from '../map/geofence/geofence_detail.manage_devices'
import AddGeoFence from '../map/geofence/add_geofence'
// 数据分析
// import Analysis from '../analysis/analysis'
import Visualization from '../visualization/visualization'
// 个性设置
import MySetting from '../account/personal'
import MessagePage from '../account/message'

class AppRouter extends React.Component {
  render(){
    return(
      <Switch>
        <Route exact path="/" component={DeviceList}/>
        {/*DeviceList,GridTest*/}
        <Route exact path="/device" component={DeviceList}/>
        <Route exact path="/device/:id" component={DeviceDetail}/>

        <Route exact path="/map/devices_location" component={DevicesLocation}/>
        <Route exact path="/map/device_path/:id" component={DevicesPath}/>

        <Route exact path="/data/gps" component={DataGpsGrid}/>
        <Route exact path="/data/behavior" component={DataBehaviorGrid}/>

        <Route exact path="/device_setting" component={DeviceSettingGrid}/>
        <Route exact path="/device_setting/modify_setting" component={ModifySetting}/>

        <Route exact path="/user-manage" component={UserList}/>
        <Route exact path="/user-manage/:id" component={UserAuth}/>

        <Route exact path="/account-setting/me" component={MySetting}/>
        <Route exact path="/account-setting/message" component={MessagePage}/>

        {/*<Route path="/analysis" component={Analysis}/>*/}
        <Route path="/analysis" component={Visualization}/>

        <Route exact path="/geofence" component={GeoFence}/>
        <Route exact path="/devices/geofence" component={GeoFenceOfDevices}/>
        <Route exact path="/geofence/id/:id" component={GeoFenceDetail}/>
        <Route exact path="/geofence/id/:id/devices" component={GeoFenceDetail}/>
        <Route exact path="/geofence/add" component={AddGeoFence}/>

        <Route path="/data/gps/search_out" component={SearchOutGps}/>
      </Switch>
    )
  }
}
export default  AppRouter