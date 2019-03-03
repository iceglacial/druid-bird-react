/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/3 0003.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common'
import {Select, Icon, Radio, Spin} from 'antd'
import thisStore from './store'
import searchStore from '../search/store'
import mapStore from '../store'
import appStore from '../../../store/app_store'
import Marker from '../marker'
import mapService from '../map.service'
import SearchOutDeviceList from '../search/search_out.devices_list'
import RangeSearch from '../search/range_search'
import MeasureDistance from '../measure_distance/measure_distance'
import LoadingImg from '../../../common/loadingImg'


let devicePathMapShowing = {};
let google = window.google

@observer
class DevicesLocation extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      device: {
        id: props.match.params.id
      },
      devicePathMapShowing: {},
      // old:
      deviceID: props.match.params.id,
      deviceName: null,
      deviceLocations: [],
      deviceGps: [],
      openFilterMenu: true,
      pathTime: '',//显示轨迹的时间：2017.02-2017.05
    }
  }

  componentDidMount() {
    this.drawDevicePath()
  }

  // 绘制地图
  drawBaseMap = (mapDiv) => {
    thisStore.set('loading', true)
    thisStore.initMap(mapDiv)
    // 自定义范围，右键事件
    searchStore.initRangeSearchContextMenu()
    google.maps.event.addListener(searchStore.rangeSearchContextMenu, 'menu_item_selected', function (latLng, eventName) {
      switch (eventName) {
        case 'shape_click':
          // console.log('清除搜索范围')
          searchStore.redrawSearchRange()
          break;
        case 'shape_search_click':
          // console.log('搜索设备')
          searchRangeDevice(searchStore.searchArray)
          break;
      }
    });
  }

  /**
   * 绘制设备轨迹
   */
  drawDevicePath() {
    thisStore.set('loading', true)
    // console.log('start get gps',new Date())
    Marker.clearMapDrawing(devicePathMapShowing)
    let _type = thisStore.trackType

    let url = Api.gps(this.state.deviceID,mapStore.pathTimeRange)

    let config = httpConfig('timestamp')
      if(_type === 'gps_simple_path'){//精简
          let last
          if (mapStore.pathTimeRange === '1') {
              last = -1
          } else {
              last = -mapStore.pathTimeRange / 30;
          }

          config = httpConfig('timestamp',null,null,{last: last})
          url = Api.gpsLine(this.state.deviceID)
      }else{//原始
          url = Api.gpsNewLine(this.state.deviceID,mapStore.pathTimeRange)
      }

      // if(mapStore.pathTimeRange>30){
      //   let last=-mapStore.pathTimeRange/30;
      //     config = httpConfig('timestamp',null,null,{last: last})
      //     if (_type === 'gps_simple_path') {//精简
      //         url = Api.gpsLine(this.state.deviceID)
      //     } else if (_type === 'sms_path') {
      //         url = Api.sms(this.state.deviceID)
      //     } else if (_type === 'gps_path') {
      //         url = Api.gpsLine(this.state.deviceID)// 缺API
      //     }
      // }else{
      //     if (_type === 'gps_simple_path') {//精简
      //         url = Api.gpsNewLine(this.state.deviceID,mapStore.pathTimeRange)
      //     } else if (_type === 'sms_path') {
      //         url = Api.sms(this.state.deviceID)
      //     } else if (_type === 'gps_path') {//原始
      //         url = Api.gpsNewLine(this.state.deviceID,mapStore.pathTimeRange)
      //     }
      // }

    // console.log(_type,url)
    axios.get(url, config).then(res => {
      // #2466 错误时间的数据过滤
      for (let i = 0; i < res.data.length; i++) {
        if (!(appStore.isDateBetween(res.data[i].timestamp, new Date(2015,0,0), new Date()) &&
          appStore.isDateBetween(res.data[i].updated_at, new Date(2015,0,0), new Date()))) {
          res.data.splice(i, 1);
          i--;
        }
      }
      // console.log('end get gps',new Date())
      if(res.data && res.data.length>0){
        let deviceName = res.data[0].mark || res.data[0].uuid;
          devicePathMapShowing = Marker.drawOnMap(thisStore.map, res.data, thisStore.showCluster, 'path')
        let validPath = devicePathMapShowing.contents;
        let pathTime = validPath[0].timestamp.slice(0,7).replace('-','.') + '-' + validPath[validPath.length-1].timestamp.slice(0,7).replace('-','.');
        this.setState({
          deviceName: deviceName,
          devicePathMapShowing: devicePathMapShowing,
          pathTime
        })
        if (!devicePathMapShowing.locations.length) {
          this.getDeviceInfo(this.state.deviceID)
        }
      }else{
        this.setState({
          pathTime: ''
        })
        this.getDeviceInfo(this.state.deviceID)
      }
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  }

// 重新绘制图形
  reLoadMapData = () => {
    // thisStore.set('loading', true)
    // Marker.clearMapDrawing(devicePathMapShowing)
    this.drawDevicePath()
  }
  //当gps数据为空时
  getDeviceInfo = (id) => {
    axios.get(Api.device(id), httpConfig()).then(res => {
      let deviceName = res.data && (res.data.mark || res.data.uuid)
      this.setState({
        deviceName: deviceName,
      })
    }).catch(err => {
      MessageHandle(err)
    })
  }
  // 集群切换
  toggleCluster = () => {
    const showCluster = !thisStore.showCluster
    thisStore.setCluster(showCluster)
    devicePathMapShowing = Marker.toggleCluster(thisStore.map, devicePathMapShowing, showCluster)
    if (!showCluster) {//重新绘制所有标记点
      this.drawDevicePath()
    }else{
      thisStore.set('loading',false)
    }
    // searchStore.setToggleCluster(true)
    // console.log('显示集群：', showCluster)
  }
  // radio切换集群
  turnCluster = (event) => {
    // let type = event.target.value
    // console.log(type)
    thisStore.set('loading', true)
    this.toggleCluster()
  }
  // 切换轨迹类型
  toggleTrackType = (e) => {
    let type = e.target.value
    thisStore.setTrackType(type)
    // searchStore.setTrackType(type)
    thisStore.set('loading', true)
    this.reLoadMapData()
  }
  toggleFilterMenu = () => {
    this.setState({
      openFilterMenu: !this.state.openFilterMenu
    })
  }
  handleDevicesLastTimeChange = (key) => {
    mapStore.set('pathTimeRange', key)
      if(key>30){
          thisStore.setTrackType('gps_simple_path')
      }else if(key<30){
          thisStore.setTrackType('gps_path')
      }
    this.reLoadMapData()
  }

  render() {
    const markerTypeDiv = (
      <div className="">
        <div className="title">{appStore.language.marker_show_type}</div>
        <div>
          <Radio.Group onChange={this.turnCluster}
                       value={thisStore.showCluster ? 'cluster' : 'marker'}>
            <Radio.Button value='marker'>{appStore.language.show_markers_short}</Radio.Button>
            <Radio.Button value='cluster'>{appStore.language.show_cluster_short}</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    )
    const trackTypeDiv = (
      <div className="">
        <div className="title">{appStore.language.device_path}</div>
        <div>
          <Radio.Group onChange={this.toggleTrackType}
                       defaultValue={thisStore.trackType}>
            {
              thisStore.enabledTrackTypes.map(type => (
                <Radio.Button value={type}
                              key={Math.random()} disabled={type==='gps_path'&&mapStore.pathTimeRange>30 ||
                type==='gps_simple_path'&&mapStore.pathTimeRange<30}>
                    {appStore.language[type + '_short']}
                </Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
      </div>
    )
    //轨迹时间范围 - 对所有轨迹全局有效
    const pathTimeRangeSelector = (
      <div className="time-range">
        <div className="title">{appStore.language.path_time_range} <span className='float-right small'>{this.state.pathTime}</span></div>
        <Select defaultValue={mapStore.pathTimeRange}
                onChange={this.handleDevicesLastTimeChange}
                style={{'width': '100%'}}>
          {
            mapStore.pathTimeRangeOptions.map(time => {
              return <Select.Option
                key={time}>{appStore.language.last_days_path(parseInt(time))}</Select.Option>
            })
          }
        </Select>
      </div>
    )
    return (
      <div className="wrap-full">
        <Spin spinning={thisStore.loading} indicator={LoadingImg}>
          <div ref={this.drawBaseMap} id="map"></div>
          <div className={`map-state ${this.state.openFilterMenu && 'open'}`}>
            <div className="map-close" onClick={this.pageBack}><Icon type="close-circle"/></div>
            <div className="state-inner">
              <div className="note state-head">
                <span>{appStore.language.device_path_type(this.state.deviceName || '-')}</span>
                <label className="block-ding">
                  <Icon type="ding" className={`${this.state.openFilterMenu ? 'primary' : ''}`}
                        onClick={this.toggleFilterMenu}/>
                </label>
                {/*<Button type='circle' className="btn-slide" onClick={this.toggleFilterMenu}>*/}
                {/*{this.state.openFilterMenu ? <Icon type="up"/> : <Icon type="down"/>}</Button>*/}
              </div>
              <div className="state-body">
                <div className="action-box">
                  <div className="item-act">{pathTimeRangeSelector}</div>
                  <div className="item-act"><RangeSearch/></div>
                  <div className="item-act">{markerTypeDiv}</div>
                  <div className="item-act">{trackTypeDiv}</div>
                  <div className="item-act"><MeasureDistance map={thisStore.map}/></div>
                </div>
              </div>
            </div>
          </div>
          <SearchOutDeviceList noTurnTrack={true}/>
        </Spin>
      </div>
    )
  }
}

/**
 * api搜索设备
 * @param data
 */
const searchRangeDevice = (data) => {
  searchStore.rangeSearchContextMenu.hide();
  searchStore.cancelShapeEditable()
  axios.post(Api.searchRangeDevice(), data, httpConfig('device_id,timestamp')).then(res => {
    let searchOut = mapService.resolveRangeSearchDevices(res.data)
    searchStore.setRangeSearchOutDevices(searchOut)
    // console.log(searchOut)
  }).catch(err => {
    MessageHandle(err, 'range_search')
  })
}
export default DevicesLocation