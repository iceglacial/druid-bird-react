/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/3 0003.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common'
import {Button, Input, Radio, Spin, Select} from 'antd'
import '../../../js/transform'
import thisStore from './store'
import mapStore from '../store'
import appStore from '../../../store/app_store'
import Marker from '../marker'
import LoadingImg from '../../../common/loadingImg'

@observer
class DevicesLocation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      noTurnTrack: props.noTurnTrack,
      onMapDevices: [],
      searchInfo: '',
      searchOutDevice: [],
    }
    // setTimeout(this.drawBaseMap,1000)
  }

  componentDidMount() {
    this.clearSearchDevice()
  }

    componentWillUnmount() {
        mapStore.clear()
    }
  /**
   * 绘制单个设备轨迹
   * @param device
   */
  drawOneDevicePath = (device) => {
    // console.log('draw one device')
    this.setState({
      loading: true
    })
    let gpsArray = []
    let devicesPath = thisStore.searchOutDevicesPath
    if (thisStore.isRangeSearching) {
      gpsArray = thisStore.rangeSearchOutDevices.devicesGps[device.id]
      devicesPath[device.id] = Marker.drawOnMap(thisStore.map, gpsArray, thisStore.showCluster, 'path', true)
      thisStore.setSearchOutDevicesPath(devicesPath)
      this.setState({
        loading: false
      })
    } else {
      let _type = thisStore.trackType

      // let config = httpConfig('timestamp')
      // let url = Api.gps(device.id)
      // if (_type === 'gps_simple_path') {
      //   url = Api.gpsLine(device.id)
      // }else if (_type === 'sms_path') {
      //   url = Api.sms(device.id)
      // }else if (_type === 'uploading_path') {
      //   url = Api.gpsLine(device.id)// 缺API
      // }
      // config.params = {
      //   last: mapStore.pathTimeRange
      // }


        let url = Api.gps(device.id,mapStore.pathTimeRange)

        let config = httpConfig('timestamp')

        if(_type === 'gps_simple_path'){//精简
            let last=-mapStore.pathTimeRange/30;
            config = httpConfig('timestamp',null,null,{last: last})
            url = Api.gpsLine(device.id)
        }else{//原始
            url = Api.gpsNewLine(device.id,mapStore.pathTimeRange)
        }

        // if(mapStore.pathTimeRange>30){
        //     let last=-mapStore.pathTimeRange/30;
        //     config = httpConfig('timestamp',null,null,{last: last})
        //     if (_type === 'gps_simple_path') {//精简
        //         url = Api.gpsLine(device.id)
        //     } else if (_type === 'sms_path') {
        //         url = Api.sms(device.id)
        //     } else if (_type === 'gps_path') {
        //         url = Api.gpsLine(device.id)// 缺API
        //     }
        // }else{
        //     if (_type === 'gps_simple_path') {//精简
        //         url = Api.gpsNewLine(device.id,mapStore.pathTimeRange)
        //     } else if (_type === 'sms_path') {
        //         url = Api.sms(device.id)
        //     } else if (_type === 'gps_path') {//原始
        //
        //         url = Api.gpsNewLine(device.id,mapStore.pathTimeRange)
        //     }
        // }

      axios.get(url, config).then(res => {
        gpsArray = res.data
        devicesPath[device.id] = Marker.drawOnMap(thisStore.map, gpsArray, thisStore.showCluster, 'path', true)
        thisStore.setSearchOutDevicesPath(devicesPath)
        this.setState({
          loading: false
        })
      }).catch(err => {
        MessageHandle(err)
        this.setState({
          loading: false
        })
      })
    }
  }
  /**
   * 重新绘制搜索结果设备
   */
  reDrawSearchDevices=()=>{
    thisStore.setReDraw(false)//防止二次触发
    let drawings = Object.values(thisStore.searchOutDevicesPath)
    drawings.map(drawing=>{
      Marker.clearMapDrawing(drawing)
    })
    thisStore.setSearchOutDevicesPath([])
    this.drawSearchOutDevicesPath()
  }
  /**
   * 清除搜索结果设备
   */
  clearSearchDevice = () => {
    thisStore.setClearDrawing(false)//防止二次触发
    // let _onMapDevices = this.state.onMapDevices;
    // let devicesPath = thisStore.searchOutDevicesPath
    // _onMapDevices.map((device) => {
    //   Marker.clearMapDrawing(devicesPath[device.id])
    //   delete devicesPath[device.id]
    // })
    let searchoutPaths = Object.values(thisStore.searchOutDevicesPath)
    searchoutPaths.map(
      drawing=>{
        Marker.clearMapDrawing(drawing)
      }
    )
    thisStore.setSearchOutDevicesPath([])
    this.setState({
      searchInfo: '',
      searchOutDevice: [],
      onMapDevices: [],
    })
  }
  /**
   * 绘制所有设备（选中）轨迹
   */
  drawSearchOutDevicesPath = () => {
    let _devices = this.state.onMapDevices
    _devices.map(device => {
      this.drawOneDevicePath(device)
    })
    // console.log('drawSearchOutDevicesPath...',_devices)
  }
  /**
   * 更新（增/删）快捷查看的设备
   * @param device
   */
  updateOnMapDevices = (device) => {
    let _onMapDevices = this.state.onMapDevices;
    let devicesPath = thisStore.searchOutDevicesPath
    let _index = -1; //设备是否已在查看
    _onMapDevices.map(function (d, i) {
      if (d.id === device.id) {//隐藏设备轨迹
        _index = i;
      }
    })
    if (_index === -1 && _onMapDevices.length < 5) {
      _onMapDevices.push(device)
      this.drawOneDevicePath(device)
    } else {
      _onMapDevices.splice(_index, 1)
      Marker.clearMapDrawing(devicesPath[device.id])
      delete devicesPath[device.id]
    }
    this.setState({
      onMapDevices: _onMapDevices,
    })
    thisStore.setOnMapDevices(_onMapDevices)
    thisStore.setSearchOutDevicesPath(devicesPath)
  }
  /**
   * 搜索值改变
   * @param e
   */
  onChangeSearch = (e) => {
    const {value} = e.target;
    const reg = /^[0-9]\d*$/;// /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // console.log(value)
      this.setState({
        searchInfo: value,
      })
      if (!thisStore.isRangeSearching) {
        if(value){
          this.setState({
            loading: true,
          })
          axios.get(Api.searchDeviceByMark(value), httpConfig()).then(res => {
            this.setState({
              loading: false,
              searchOutDevice: res.data
            })
            // console.log(res.data)
          }).catch(err => {
            this.setState({
              loading: false,
              searchOutDevice: []
            })
            MessageHandle(err)
          })
        }else{
          this.setState({
            searchOutDevice: []
          })
        }
      }
    }
  }
  /**
   * 切换轨迹类型
   * @param e
   */
  onChangeTrackType = (e) => {
    let type = e.target.value
    thisStore.setTrackType(type)
    this.reDrawSearchDevices()
    // console.log(type)
  }
  toggleCluster = () => {
    thisStore.setToggleCluster(false)//防止二次触发
    const showCluster = !thisStore.showCluster
    thisStore.setCluster(showCluster)
    let devicesPath = thisStore.searchOutDevicesPath
    let _devices = Object.keys(devicesPath)
    _devices.map((key) => {
      devicesPath[key] = Marker.toggleCluster(thisStore.map, devicesPath[key], showCluster)
    })
    if (!showCluster) {//重新绘制所有标记点
      this.drawSearchOutDevicesPath()
    }
    // console.log('显示集群：', showCluster)
  }
  handleDevicesLastTimeChange=(key)=>{
    mapStore.set('pathTimeRange',key)
    if(key>30){
        thisStore.setTrackType('gps_simple_path')
    }else if(key<30){
        thisStore.setTrackType('gps_path')
    }
    this.reDrawSearchDevices()
  }
  render() {
    if(thisStore.clearDrawing){
      // console.log('clear drawing...')
      this.clearSearchDevice()
    }
    if(thisStore.toggleCluster){
      // console.log('toggle cluster')
      this.toggleCluster()
    }
    if(thisStore.reDraw){
      // console.log('redraw')
      this.reDrawSearchDevices()
    }
    const updateOnMapDevices = this.updateOnMapDevices
    const onChangeSearch = this.onChangeSearch
    const onChangeTrackType = this.onChangeTrackType
    let onMapDevices = this.state.onMapDevices
    let searchNote = ''
    if (thisStore.isRangeSearching) {
      searchNote =
        <p
          className="small">{appStore.language.search_range_result_count(thisStore.rangeSearchOutDevices.devices.length)}</p>
    } else if (this.state.searchInfo) {
      searchNote = <p>{appStore.language.search_result_count(this.state.searchOutDevice.length)}</p>
    }
    //轨迹时间范围 - 对所有轨迹全局有效
    const pathTimeRangeSelector = (
      <div className="time-range">
        <div className="title">{appStore.language.path_time_range}</div>
        <Select defaultValue={mapStore.pathTimeRange}
                onChange={this.handleDevicesLastTimeChange}
                style={{'width': '100%'}}>
          {
            mapStore.pathTimeRangeOptions.map(time=>{
              return <Select.Option key={time}>{appStore.language.last_days_path(parseInt(time))}</Select.Option>
            })
          }
        </Select>
      </div>
    )
    const searchInfo = this.state.searchInfo
    const pathType = () => {
      if (!this.state.noTurnTrack && !thisStore.isRangeSearching && this.state.searchOutDevice.length) {
        return <div className="wrap">
          {pathTimeRangeSelector}
          <div className="path-type">
              <div className="title">{appStore.language.track_type}</div>
            <Radio.Group onChange={onChangeTrackType} value={thisStore.trackType}>
              {
                thisStore.enabledTrackTypes.map(type => (
                  <Radio.Button value={type} key={type} disabled={type==='gps_path'&&mapStore.pathTimeRange>30 ||
                  type==='gps_simple_path'&&mapStore.pathTimeRange<30}>
                      {appStore.language[type + '_short']}
                      </Radio.Button>
                ))
              }
            </Radio.Group>
          </div>
          </div>
      }
    }
    const searchOutDevices = () => {
      let devices = []
      if (thisStore.isRangeSearching) {
        devices = thisStore.rangeSearchOutDevices.devices
      } else {
        devices = this.state.searchOutDevice
      }
      return <div className="body-list">
        {
          devices.map(function (device, index) {
            let filter = true;
            if (thisStore.isRangeSearching) {
              filter = ((device.mark + '').indexOf(searchInfo) > -1)
            }
            if (JSON.stringify(onMapDevices).indexOf(device.id) === -1 && filter) {
              return <div className="item range-out" key={Math.random()} onClick={() => updateOnMapDevices(device)}>
                <div className="title">{device.mark || '-'}</div>
                <div className="sub-title">{device.uuid}</div>
              </div>
            }
          })
        }
      </div>
    }
    return (
        <div className="map-search-box">
          <div className="search-header">
            <Input placeholder={appStore.language.search_range_device} onChange={onChangeSearch.bind(this)}
                   value={this.state.searchInfo}/>
          </div>
          <Spin spinning={this.state.loading}  indicator={LoadingImg}>
            <div className="search-body-wrap">
              <div className="result-tips">{searchNote}</div>
              <div className="search-quick-show">
                {pathType()}
                {
                  onMapDevices.map(function (device, index) {
                    return <Button className='item' key={index}
                                   onClick={() => updateOnMapDevices(device)}>{device.mark || device.uuid}</Button>
                  })
                }
              </div>
              <div className="search-body">
                {searchOutDevices()}
              </div>
            </div>
          </Spin>
        </div>
    )
  }
}
export default DevicesLocation