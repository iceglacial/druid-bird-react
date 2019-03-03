/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/3 0003.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../common'
import {Popover,Menu} from 'antd'
import mapStore from './store'
import pathLine from './pathline'
import mapService from './map.service'
import appStore from '../../store/app_store'

let map, markers, clusterer;
const google = window.google
const MarkerClusterer = window.MarkerClusterer
const imagePath = window.location.origin + '/images/m'
// console.log('imagePath', imagePath)

@observer
class DevicesLocation extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      deviceID: props.match.params.id,
      deviceName: '',
      deviceLocations: [],
      deviceGps: []
    }
  }

  componentDidMount() {
    this.drawDevicePath()
  }

  drawBaseMap(mapDiv) {
    if (mapDiv) {
      map = new google.maps.Map(
        mapDiv,
        mapStore.mapConfig
      )
      mapStore.setDevicePathMap(map)
    }
  }

  /**
   * 绘制设备轨迹
   */
  drawDevicePath(type) {
    let url = Api.gps(this.state.deviceID)
    if(type === 'simple_path'){
      url = Api.gpsLine(this.state.deviceID)
    }
    axios.get(url, httpConfig('timestamp')).then(res => {
      let mapData = mapService.formatDataDevicePath(res.data);
      let deviceName = res.data[0] && (res.data[0].mark || res.data[0].uuid)
      this.setState({
        deviceGps: mapData.data,
        deviceLocations: mapData.locations,
        deviceName: deviceName
      })
      this.drawMarkers()
      this.drawArrows()
      // console.log(_devicesGps);
    }).catch(err => {
      MessageHandle(err)
    })
  }

// 绘制标记和集群
  drawMarkers() {
    markers = this.addSingleMarker(this.state.deviceLocations, map)
    // 起点和终点不按集群显示
    if (mapStore.showClusterer) {
      clusterer = new MarkerClusterer(map, markers.slice(1, -1))
    }
  }

// 绘制轨迹折线
  drawArrows() {
    let bounds = new google.maps.LatLngBounds()
    const gps = this.state.deviceLocations
    let path;

    let polyLine = pathLine()
    for (let i = 0; i < gps.length - 1; i++) {
      let latLng = new google.maps.LatLng(gps[i].lat, gps[i].lng)
      bounds.extend(latLng)
      path = polyLine.getPath();
      path.push(latLng);
    }
    polyLine.setMap(map)
    map.fitBounds(bounds)
    return polyLine
  }

  addSingleMarker(locations, map) {
    const params = {
      type: 'path',
      bySearch: false,
    }
    let markerInfo = {
      locations: locations,
      data: this.state.deviceGps,
      map,
      params
    }
    let _markers = mapService.drawMarkers(markerInfo)
    return _markers
  }

  toggleCluster = () => {
    const showClusterer = mapStore.showClusterer
    if (showClusterer) {
      if (clusterer) clusterer.removeMarkers(markers)
      markers = this.addSingleMarker(this.state.deviceLocations, map)
    } else {
      clusterer = new MarkerClusterer(map, markers.slice(1, -1))//, {imagePath}
    }
    mapStore.toggleCluster();
  }
  reLoadMapData=(type)=>{
      this.drawDevicePath(type)
  }
  initMapShowing=()=>{

  }
  toggleTrackType=(e)=>{
    let type = e.key
    this.reLoadMapData(type)
}

  render() {
    const trackTypeOption = (
      <Menu
        onClick={this.toggleTrackType}
        defaultSelectedKeys={[mapStore.trackType]}
      >
        <Menu.ItemGroup>
          {
            mapStore.enabledTrackTypes.map(type=>(
              <Menu.Item key={type}>{appStore.language[type]}</Menu.Item>
            ))
          }
        </Menu.ItemGroup>
      </Menu>
    )
    return (
      <div className="wrap-full">
        <div ref={this.drawBaseMap} id="map"></div>
        <div className="mapAction">
          <div className="action-body">
            <div className="map-item">
              <label className="item-inner" onClick={this.toggleCluster}>{mapStore.showClusterer ? appStore.language.show_markers : appStore.language.show_cluster}</label>
            </div>
            <div className="map-item is-act">
              <label className="item-inner">
                <Popover content={trackTypeOption} placement="bottom">
                  {appStore.language[mapStore.trackType]}
                </Popover>
                </label>
            </div>
            <div className="map-item">
              <label className="item-inner">{appStore.language.device_path_type(this.state.deviceName)}</label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default DevicesLocation