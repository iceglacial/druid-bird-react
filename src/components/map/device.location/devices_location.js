/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/3 0003.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig, Filters} from '../../../common'
import thisStore from './store'
import {Icon, Radio, Slider, Select, Spin, Tabs} from 'antd'
import '../../../js/transform'
import mapService from '../map.service'
import appStore from '../../../store/app_store'
import Marker from '../marker'
import searchStore from '../search/store'
import SearchOutDeviceList from '../search/search_out.devices_list'
import RangeSearch from '../search/range_search'
import MeasureDistance from '../measure_distance/measure_distance'
import TimeLinePicker from './timeline_picker'
import YearPicker from './year_picker'
import LoadingImg from '../../../common/loadingImg'

const {deviceLocationFilter, unitFilter} = Filters
const google = window.google

let devicesLocationDrawing = {}
@observer
class DevicesLocation extends React.Component {
  constructor() {
    super()
    let isSearch = window.location.hash.split('?')[1]
    let searchMark;
    if(isSearch){
      searchMark = isSearch.split('=')[1]
    }
    this.state = {
      deviceAll: [],
      devicesLocation: [],
      devicesInfo: [],
      onMapDevices: [],
      searchInfo: searchMark,
      searchOutDevice: [],
      deviceCount: {
        all: 0,
        location: 0
      },
      filterOptions: {
        battery_voltage: [3.6,4.2],
        temperature: [-20,70],
        survive: thisStore.filterType
      },
      openFilterMenu: true,
      // locationType: thisStore.locationType
    }
    // setTimeout(this.drawBaseMap,1000)
  }

  componentDidMount() {
    thisStore.set('historyDay', null)
    thisStore.set('locationType', thisStore.locationTypeOptions[0])
    this.drawDevicesLocation()
  }

  // 绘制基本地图
  drawBaseMap = (mapDiv) => {
    thisStore.set('loading', true)
    let _this = this;
    if (mapDiv) {
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
            searchStore.rangeSearchContextMenu.hide();
            searchStore.cancelShapeEditable()
            searchRangeDevice(searchStore.searchArray)
            break;
        }
      });
    }
  }
  /**
   * 绘制设备位置
   */
  drawDevicesLocation = () => {
    thisStore.set('loading', true)
    thisStore.setHistoryLocationState(false)
    Marker.clearMapDrawing(devicesLocationDrawing)
    let config = httpConfig()
    let url = Api.device()
    if (thisStore.historyDay) {
      url = Api.gpsDays(thisStore.historyDay)
    }else if(this.state.searchInfo){
      url = Api.searchDeviceByMark(this.state.searchInfo)
    }
    axios.get(url, config).then(res => {
      let filterData = res.data.filter((data) => deviceLocationFilter(data, this.state.filterOptions, thisStore.historyDay))
      // console.log(this.state.filterOptions,res.data.length,filterData.length)
      devicesLocationDrawing = Marker.drawOnMap(thisStore.map, filterData, thisStore.showCluster, 'location')
      this.setState({
        deviceCount: {
          all: res.data && res.data.length,
          location: devicesLocationDrawing.locations.length
        }
      })
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  }
  // 集群切换
  toggleCluster = () => {
    const showCluster = !thisStore.showCluster
    thisStore.setCluster(showCluster)
    devicesLocationDrawing = Marker.toggleCluster(thisStore.map, devicesLocationDrawing, showCluster)
    if (!showCluster) {//重新绘制所有标记点
      this.drawDevicesLocation()
    } else {
      thisStore.set('loading', false)
    }
    searchStore.setToggleCluster(true)
    // console.log('显示集群：', showCluster)
  }
  // radio切换集群
  turnCluster = (event) => {
    thisStore.set('loading', true)
    // let type = event.target.value
    // console.log(type)
    this.toggleCluster()
  }
  // 过滤设备
  filterDevices = (e) => {
    let type = e.target.value;
    // console.log(type)
    thisStore.setFilterType(type);
    let filterOptions = Object.assign(this.state.filterOptions, {survive: type})
    this.setState({
      filterOptions
    })
    this.drawDevicesLocation()
  }
  temperatureFormatter = (value) => {
    return unitFilter(value, 'temperature')
  }
  //值变化后执行事件
  onChangeTemperature = (value) => {
    // console.log(value)
    // let filterOptions = Object.assign(this.state.filterOptions, {temperature: value})
    // this.setState({
    //   filterOptions
    // })
    this.drawDevicesLocation()
  }
  //监听值变化
  changeTemperature = ( value)=>{
    let filterOptions = Object.assign(this.state.filterOptions, {temperature: value})
    this.setState({
      filterOptions
    })
  }
  voltageFormatter = (value) => {
    return unitFilter(value, 'battery_voltage')
  }
  //值变化后执行事件
  onChangeVoltage = (value) => {
    // console.log(value)
    // let filterOptions = Object.assign(this.state.filterOptions, {battery_voltage: value})
    // this.setState({
    //   filterOptions
    // })
    this.drawDevicesLocation()
  }
  //监听值变化
  changeVoltage = ( value)=>{
    let filterOptions = Object.assign(this.state.filterOptions, {battery_voltage: value})
    this.setState({
      filterOptions
    })
  }
  pageBack = () => {
    // console.log('page back')
    window.history.go(-1)
  }

  toggleFilterMenu = () => {
    this.setState({
      openFilterMenu: !this.state.openFilterMenu
    })
  }
//切换设备位置查看方式
  setLocationType = (value) => {
    // this.setState({
    //   locationType: value
    // })
    thisStore.set('locationType', value)
    thisStore.set('historyDay', null)
    //清空范围搜索结果
    if (value === 'history' && searchStore.isRangeSearching) {
      searchStore.initDrawingManager()
    } else if (value === 'last') {
      this.drawDevicesLocation()
    }
  }

  render() {
    let temperatureMarkers = {
      '-20': '-20',
      '-5': '-5',
      0: '0',
      5: '5',
      20: '20',
      60: '60',
      70: '70',
    };
    let voltageMarkers = {
      3.6: '3.6',
      3.7: '3.7',
      3.8: '3.8',
      3.9: '3.9',
      4.2: '4.2'
    }
    if (thisStore.isHistoryLocationState) {
      this.drawDevicesLocation()
    }
    // 范围搜索
    const rangeSearchDiv = (
      <RangeSearch/>
    )
    // 最后位置设备筛选
    const filterDevicesLastDiv = (
      <div className="map-range">
        <div className="title">{appStore.language.data_filter}</div>
        <table>
          <tbody>
          <tr>
            <td className="text-right" title={appStore.language.getKeyName('battery_voltage')}>{appStore.language.getKeyName('battery_voltage')}</td>
            <td>
              <Slider marks={voltageMarkers} tipFormatter={this.voltageFormatter} range step={0.01} min={3.6}
                      max={4.2} value={this.state.filterOptions.battery_voltage} onChange={this.changeVoltage} onAfterChange={this.onChangeVoltage}/>
            </td>
          </tr>
          <tr>
            <td className="text-right" title={appStore.language.getKeyName('temperature')}>{appStore.language.getKeyName('temperature')}</td>
            <td>
              <Slider marks={temperatureMarkers} tipFormatter={this.temperatureFormatter} range min={-20}
                      max={70} value={this.state.filterOptions.temperature} onChange={this.changeTemperature} onAfterChange={this.onChangeTemperature}/>
            </td>
          </tr>
          <tr>
            <td className="text-right">{appStore.language.device_state}</td>
            <td>
              <Radio.Group onChange={this.filterDevices}
                           value={thisStore.filterType}>
                {
                  thisStore.pathFilterOptions.map(type => (
                    <Radio.Button value={type} key={Math.random()}>{appStore.language[type]}</Radio.Button>
                  ))
                }
              </Radio.Group>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    )
    // 历史设备筛选
    const filterDevicesHistoryDiv = (
      <div className="map-range">
        <div className="title">{appStore.language.data_filter}</div>
        <table>
          <tbody>
          <tr>
            <td className="text-right">{appStore.language.getKeyName('battery_voltage')}</td>
            <td>
              <Slider marks={voltageMarkers} tipFormatter={this.voltageFormatter} range step={0.01} min={3.6}
                      max={4.2} value={this.state.filterOptions.battery_voltage} onChange={this.changeVoltage} onAfterChange={this.onChangeVoltage}/>
            </td>
          </tr>
          <tr>
            <td className="text-right">{appStore.language.getKeyName('temperature')}</td>
            <td>
              <Slider marks={temperatureMarkers} tipFormatter={this.temperatureFormatter} range min={-20}
                      max={70} value={this.state.filterOptions.temperature} onChange={this.changeTemperature} onAfterChange={this.onChangeTemperature}/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    )
    // 标记点显示方式
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
    // 距离测量
    const measureDistanceDiv = (
      <div className="">
        <MeasureDistance map={thisStore.map}/>
      </div>
    )
    let tabTitle = {
      last: appStore.language.last_fixes,
      history: appStore.language.historial_fixes
    }
    tabTitle[thisStore.locationType] += appStore.language.countOfTotal(this.state.deviceCount.location, this.state.deviceCount.all)

    return (
      <div className="wrap-full">
        <Spin spinning={thisStore.loading} indicator={LoadingImg}>
          <div ref={this.drawBaseMap} id="map"></div>
          <div className={`map-state ${this.state.openFilterMenu && 'open'}`}>
            <div className="map-close" onClick={this.pageBack}><Icon type="close-circle"/></div>
            <div className="state-inner">
              <div className="note state-head">
                <span>{appStore.language.device_latest_loc}</span>
                <label className="block-ding">
                  <Icon type="ding" className={`${this.state.openFilterMenu ? 'primary' : ''}`}
                        onClick={this.toggleFilterMenu}/>
                </label>
                {/*<Button type='circle' className={`btn-slide ${this.state.openFilterMenu ? 'primary' : ''}`} onClick={this.toggleFilterMenu}></Button>*/}
              </div>
              <div className="state-body">
                <Tabs activeKey={thisStore.locationType} animated={{inkBar: true, tabPane: false}}
                      onChange={this.setLocationType}>
                  <Tabs.TabPane tab={tabTitle.last} key="last">
                    <div className="action-box">
                      <div className="item-act">{rangeSearchDiv}</div>
                      <div className="item-act">{filterDevicesLastDiv}</div>
                      <div className="item-act">{markerTypeDiv}</div>
                      <div className="item-act">{measureDistanceDiv}</div>
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={tabTitle.history} key="history">
                    <div className="action-box">
                      <div className="item-act">
                        <div className="text-right">{thisStore.historyDay}</div>
                      </div>
                      <div className="item-act"><YearPicker/></div>
                      <div className="item-act">{filterDevicesHistoryDiv}</div>
                      <div className="item-act">{markerTypeDiv}</div>
                      <div className="item-act">{measureDistanceDiv}</div>
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          </div>
          {
            thisStore.locationType === 'history' ? <div className="timeline-picker"><TimeLinePicker/></div> : ''
          }
          <SearchOutDeviceList />
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
    console.log(searchOut)
    searchStore.setRangeSearchOutDevices(searchOut)
  }).catch(err => {
    MessageHandle(err, 'range_search')
  })
}
export default DevicesLocation