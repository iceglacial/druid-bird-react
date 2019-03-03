/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/9 0009.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common/index'
import thisStore from './store'
import {Input, Tag, Pagination, Spin} from 'antd'
import '../../../js/transform'
import Drawing from '../drawing'
import appStore from '../../../store/app_store'
import LoadingImg from '../../../common/loadingImg'

let map = null;
let geoFences = {}
const google = window.google
@observer
class geoFence extends React.Component {
  constructor(props) {
    super(props)
    map = thisStore.geofenceMap
    this.state = {
      deviceAll: [],
      activeGeofence: '',
      searchInfo: '',
      currentPage: 1
    }
    this.loadPage()
  }

  getAllDevice=()=> {
    axios.get(Api.device(), httpConfig()).then(res => {
      this.setState({
        deviceAll: res.data,
        fences: []
      })
    }).catch(err => {
      MessageHandle(err)
    })
  }

  getGeofencesOfDevice=(device)=>{
    thisStore.set('loading',true)
    axios.get(Api.geofenceOfDevice(device.id), httpConfig()).then(res => {
      let fences = res.data;
      let geoFences = thisStore.drawingOfActiveDevice;
      fences.map((fence,index)=>{
        fence.acreage = Drawing.getShapeAcreage(fence)
        var type = fence.type;
        // console.log(map.center.toString(),"map center");
        var tmp, mapBounds;
        if (type) {
          type = type.toLowerCase();
          if (type === "polygon") {
            var bounds = fence.polygon.points;
            tmp = Drawing.drawRectangle(bounds, thisStore.map);//thisStore.geofenceOfDevicesMap
          } else if (type === "round") {
            var circle = fence;
            tmp = Drawing.drawCircle(circle, thisStore.map);//thisStore.geofenceOfDevicesMap);
          }
          mapBounds = tmp.getBounds();
          // // (i !== 0) && mapBounds.extend(map.center);
          if (mapBounds) {
            thisStore.setBounds(mapBounds)
          }
          geoFences[fence.id] = tmp;
        }
      })
      thisStore.setGeofencesOfActiveDevice(fences)
      thisStore.setDrawingOfActiveDevice(geoFences)
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }

  //查看设备的所有围栏
  showDeviceGeofence = (device) => {
    // console.log('showDeviceGeofence',device)
    thisStore.setActiveDevice(device)
    this.clearFencesOfActiveDevice();
    this.getGeofencesOfDevice(device)
  }
  //删除地图上的所有围栏
  clearFencesOfActiveDevice = () => {
    let fences = thisStore.drawingOfActiveDevice
    for (let fence of Object.values(fences)) {
      fence.setMap(null)
    }
    thisStore.setGeofencesOfActiveDevice([])
  }
  // 搜索值改变
  onChangeSearch = (e) => {
    const {value} = e.target;
    const reg = /^[1-9]\d*$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // console.log(value)
      this.setState({
        searchInfo: value,
      })
      if(value){
        thisStore.set('loading',true)
        axios.get(Api.searchDeviceByMark(value), httpConfig('',10)).then(res => {
          this.setState({
            deviceAll: res.data,
            fences: []
          })
          thisStore.set('loading',false)
        }).catch(err => {
          if (err.response && err.response.status != '404') {
            MessageHandle(err)
          }
          thisStore.set('loading',false)
        })
      }
    }
  }
  onChangePage = (page) => {
    // console.log(page)
    this.loadPage(page)
  }
  loadPage=(p)=>{
    thisStore.set('loading',true)
    let page = p || 1
    let limit = appStore.pageSize;
    let offset = limit * (page - 1);
    // this.setState({
    //   selectedRowKeys: []
    // })
    // console.log(p,limit, offset,appStore.user)
    axios.get(Api.device(), httpConfig('mark',limit,offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      this.setState({
        deviceAll: res.data,
        fences: [],
        totalLength,
        currentPage: page
      })
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }

  render() {
    const showDeviceGeofence = this.showDeviceGeofence
    const onChangeSearch = this.onChangeSearch
    const searchInfo = this.state.searchInfo
    return (
    <Spin spinning={thisStore.loading} indicator={LoadingImg}>
      <div className="geofence-menu flex-box wrap-full">
        <header className="fence-head">
          <Input placeholder={appStore.language.quick_search}
                 onChange={onChangeSearch.bind(this)}
                 value={this.state.searchInfo}/>
        </header>
        <div className="flex-full">
          <ul className="item-box">
            {
              this.state.deviceAll.map(function (device, index) {
                const _fenceLength = device.ditu_area ? device.ditu_area.length : 0
                const isActive = device.id === thisStore.activeDevice.id
                if ((device.mark + '').indexOf(searchInfo) > -1) {
                  return <li className={`item ${isActive ? 'active' : ''}`} key={device.id}
                             onClick={() => showDeviceGeofence(device)}>
                    <div className="title">{device.mark || '-'}{
                      _fenceLength ? <Tag color="blue">{_fenceLength}</Tag> : ''
                    }</div>
                    <div className="small">{device.uuid}</div>
                  </li>
                }
              })
            }
          </ul>
        </div>
        <div className="wrap text-center">
          {!this.state.searchInfo ?
            <Pagination current={this.state.currentPage}
                        simple
              // showTotal={total => appStore.language.total_count(total)}
                        onChange={this.onChangePage}
                        total={this.state.totalLength}//accountStore.messageTotalLength
                        pageSize={appStore.pageSize}
                        bordered
            />
            : ''}
        </div>
      </div>
    </Spin>
    )
  }
}
export default geoFence