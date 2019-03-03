/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import React from 'react'
import appStore from '../../store/app_store'
// import mapService from './map.service'
import pathLine from './pathline'
import {DataFormatter} from '../../common'
import iconDeadLoc from "./img/pin_dead_3064.png"
import iconLoc from "./img/pin_4848.png"
import iconLocBySearch from "./img/pin_4848.png"
import iconPoint from "./../../images/pin-origin_1616.png"
import iconBegin from "./img/pin_begin_4848.png"
import iconEnd from "./img/pin_end_4848.png"
import iconBegin_EN from "./img/pin_begin_en_4848.png"
import iconEnd_EN from "./img/pin_end_en_4848.png"
import iconPointBySearch from "./../../images/pin-search1414.png"
import iconBeginBySearch from "./img/pin_begin_4848.png"
import iconEndBySearch from "./img/pin_end_4848.png"
import iconBeginBySearch_EN from "./img/pin_begin_en_4848.png"
import iconEndBySearch_EN from "./img/pin_end_en_4848.png"

let google = window.google
const MarkerClusterer = window.MarkerClusterer
const eviltransform = window.eviltransform
const {ValidLatLng, GpsDataFormatter} = DataFormatter
let initMapDevice = {
  locations: [], //地理位置
  contents: [], //信息框内容
  markers: [], //标记点
  cluster: null, //集群
  pathline: null, //轨迹折线
};
const clearMapDrawing = (drawing) => {
  // console.log('start clear markers',new Date())
  if (drawing) {
    const {markers, cluster, pathline} = drawing
    hideMarkers(markers)
    hideCluster(cluster)
    hidePathline(pathline)
  }
  // console.log('end clear markers',new Date())
}
/**
 *
 * @param draw markers(clusters,pathline) on map
 * @param gpsArray
 * @param type 0: path; 1: location;
 * @param bySearch true/false
 */
const drawOnMap = (map, gpsArray, showCluster, type, bySearch) => {
  // console.log('start draw markers',new Date())
  let _data;
  let _type, isPath = false;
  if (type === 0 || type === 'path') {
    _type = 'path';
    isPath = true;
  } else if (type === 1 || type === 'location') {
    _type = 'location';
  }
  _data = formatMarkerData(gpsArray)
  // if (isPath) {
  //   _data = mapService.formatDataDevicePath(gpsArray)
  // } else {
  //   _data = mapService.formatDataDevicesLocation(gpsArray)
  // }
  const params = {
    type: _type,
    showCluster,
    bySearch,
  }
  let markerInfo = {
    locations: _data.locations,
    contents: _data.contents,
    map,
    params,
  }
  let markersDrawing = showMarkers(markerInfo)
  let _pathline;
  if (isPath) {
    _pathline = drawPathline(map, _data.locations, bySearch)
  }
  let mapShowing = {
    locations: _data.locations, //地理位置
    contents: _data.contents, //信息框内容
    markers: markersDrawing.markers, //标记点
    cluster: markersDrawing.cluster, //集群
    pathline: _pathline, //轨迹折线
  }
  // console.log('end draw markers',new Date())
  // console.log(mapShowing)
  return mapShowing
}
/**
 * 显示集群/显示标记点
 * @param map
 * @param mapShowing
 * @param showCluster
 */
const toggleCluster = (map, mapShowing, showCluster) => {
  let _mapShowing = Object.assign({}, mapShowing);
  let _markers = _mapShowing.markers
  if (!showCluster) {//隐藏集群，显示所有标记点
    let _cluster = _mapShowing.cluster
    // hideCluster(_mapShowing.cluster)//此处只清除集群，未重新加载所有点
    clearMapDrawing(mapShowing)
  } else {//显示集群
    _mapShowing.cluster = new MarkerClusterer(map, _markers
      //   ,{
      //   // gridSize: 50,
      //   // maxZoom: 15,
      //   // ignoreHidden: false,
      //   imagePath: 'images/m'
      // }
    )
  }
  return _mapShowing
}
/**
 * 绘制轨迹折线
 * @param map
 * @param locations
 */
const drawPathline = (map, locations, bySearch) => {
  let bounds = new google.maps.LatLngBounds()
  const gps = locations
  let path;

  let polyLine = pathLine(bySearch)
  for (let i = 0; i < gps.length; i++) {
    let latLng = new google.maps.LatLng(gps[i].lat, gps[i].lng)
    bounds.extend(latLng)
    path = polyLine.getPath();
    path.push(latLng);
  }
  if (map) {
    polyLine.setMap(map)
    map.fitBounds(bounds)
  }
  return polyLine
}
/**
 * 隐藏轨迹折线
 * @param pathline
 */
const hidePathline = (pathline) => {
  if (pathline) {
    pathline.setMap(null)
  }
}
/**
 * 绘制多个点
 * @param markerInfo
 * @returns {{markers: Array, cluster: *}}
 */
const showMarkers = (markerInfo) => {
  let {locations, contents, map, params} = markerInfo
  let bounds = new google.maps.LatLngBounds()
  // console.log(params)
  const markers = []
  const markerLoc = locations;
  const markerData = contents;
  let isPath = params.type === 'path'
  let isLocation = params.type === 'location'
  let label = ''
  if (locations && markerData) {
    for (let i = 0; i < locations.length; i++) {
      let _content = markerData && markerData[i] || {};
      if (isPath) {
        if (i === 0) {
          params.BOE = 1
          // label = '起'
        } else if (i === locations.length - 1) {
          params.BOE = 2
          // label = '终'
        } else {
          params.BOE = 0
        }
      } else if (isLocation) {
        if (markerData[i] && markerData[i].survive === 1) {
          params.dead = true
        } else {
          params.dead = false
        }
      }
      let infoWindow = new google.maps.InfoWindow({
        content: deviceLocationInfoWindow(_content)
      })
      let v = new google.maps.Marker({
        position: markerLoc[i],
        label,
        title: 'S/N:' + _content.mark || _content.uuid,
        icon: getMarkerImage(params),
        optimized: true,
        device_id: _content.device_id,
        infoWindow,
        map: params.showCluster ? null : map, //加上此项后，加载速度明显变慢
      });
      bounds.extend(markerLoc[i])
      v.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
      v.addListener('click', function () {
        /*定义信息窗口*/
        // let infoWindow = new google.maps.InfoWindow({
        //   content: deviceLocationInfoWindow(_content)
        // })
        this.infoWindow.open(map, v)
        this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        this.infoWindow.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
      })
      markers.push(v)
    }
  }
  let cluster = null
  if (params.showCluster) {
    if (isPath) {
      cluster = new MarkerClusterer(map, markers.slice(1, -1))
      markers[0] && markers[0].setMap(map)
      markers[markers.length - 1] && markers[markers.length - 1].setMap(map)
    } else {
      cluster = new MarkerClusterer(map, markers)
    }
  }
  //#2471 无设备则跳转至围栏而非南太平洋
  if(locations.length){
    map.fitBounds(bounds)
  }
  return {
    markers,
    cluster
  }
}
/**
 * 隐藏多个点
 * @param array
 */
const hideMarkers = (array) => {
  let _hiddenMarkers = array;
  if (_hiddenMarkers) {
    for (let marker of _hiddenMarkers) {
      marker.setMap(null);
    }
  }
  return _hiddenMarkers;
}
/**
 * 隐藏集群
 * @param markers
 * @param cluster
 */
const hideCluster = (cluster) => {
  if (cluster) {
    cluster.clearMarkers();
  }
}
/**
 * 显示集群
 * @param marker
 * @param map
 * @returns {MarkerClusterer}
 */
const showCluster = (marker, map) => {
  return new MarkerClusterer(map, marker)
}
/**
 * 隐藏设备轨迹
 * @param markers
 * @param cluster
 * @param path
 */
const hideDevicePath = (markers, cluster, path) => {
  // console.log(markers, cluster, path)
  hideMarkers(markers);
  (cluster) && cluster.removeMarkers(markers);
  (path) && path.setMap(null);
}
/**
 *
 * @param type 类型： location - 设备位置； path - 设备轨迹
 * @param bySearch 是否非搜索结果
 * @param BOE 0：默认，1：开始点，2：结束点
 */
const getMarkerImage = (params) => {
  let {type, bySearch, BOE, dead} = params
  let isEN = (appStore.languageID + '' === '1')
  if (type === 'location') {
    if (dead) {
      return {
        url: iconDeadLoc,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
        // scaledSize: new google.maps.Size(20, 20) //缩放
      }
    } else {
      if (bySearch) {
        return {
          url: iconLocBySearch,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      }
    }
  } else if (type === 'path') {
    if (bySearch) {
      if (BOE === 1) {
        return {
          url: isEN ? iconBeginBySearch_EN : iconBeginBySearch,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else if (BOE === 2) {
        return {
          url: isEN ? iconEndBySearch_EN : iconEndBySearch,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else {
        return {
          url: iconPointBySearch,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
          anchor: new google.maps.Point(7, 7)
        }
      }
    } else {
      if (BOE === 1) {
        return {
          url: isEN ? iconBegin_EN : iconBegin,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else if (BOE === 2) {
        return {
          url: isEN ? iconEnd_EN : iconEnd,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else {
        return {
          url: iconPoint,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
          anchor: new google.maps.Point(8, 8)
        }
      }
    }
  }
  return {
    url: iconLoc,//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
    // scaledSize: new google.maps.Size(20, 20) //缩放
  }
}
/**
 * 标记点信息框
 * @param info
 * @returns {string}
 */
const deviceLocationInfoWindow = (info) => {
  // return <InfoWindow info={info}></InfoWindow>
  return `<div class="marker-window">
    <div class="marker-window-head">
      <div class="title item">
        <a href='#/device/${info.device_id}'>
          ${info.mark}<div class="small">${info.uuid}</div>
        </a>
      </div>
      <div class="sub-title item"><div>${appStore.language.getKeyName('timestamp', 'map')}：${info.timestamp}</div><div>${appStore.language.getKeyName('updated_at', 'map')}：${info.updated_at}</div></div>
    </div>
    <div class="marker-window-body">
      <div class="item">
        <div>${appStore.language.getKeyName('longitude')}：${info.longitude}</div>
        <div>${appStore.language.getKeyName('latitude')}：${info.latitude}</div>
        <div>${appStore.language.getKeyName('speed')}：${info.speed}</div>
        <div>${appStore.language.getKeyName('altitude')}：${info.altitude}</div>
        <div>${appStore.language.getKeyName('battery_voltage')}：${info.battery_voltage}</div>
      </div>
      <div class="item">
        <div>${appStore.language.getKeyName('dimension')}：${info.dimension}</div>
        <div>${appStore.language.getKeyName('horizontal')}：${info.horizontal}</div>
        <div>${appStore.language.getKeyName('vertical')}：${info.vertical}</div>
        <div>${appStore.language.getKeyName('course')}：${info.course}</div>
        <div>${appStore.language.getKeyName('used_star')}：${info.used_star}</div>
      </div>
      <div class="item">
        <div>${appStore.language.getKeyName('light')}：${info.light}</div>
        <div>${appStore.language.getKeyName('temperature')}：${info.temperature}</div>
        <div>${appStore.language.getKeyName('humidity')}：${info.humidity}</div>
        <div>${appStore.language.getKeyName('pressure')}：${info.pressure}</div>
        <div>${appStore.language.getKeyName('signal_strength')}：${info.signal_strength}</div>
      </div>
    </div>
  </div>`
}
/**
 * 标记点弹窗需要显示的GPS信息
 * @param device
 * @returns {{}}
 */
const getDeviceLocationInfo = (device) => {
  var mapItems = ["device_id", "mark", "uuid", "timestamp", "updated_at", "latitude", "longitude", "temperature", "humidity", "light", "battery_voltage",
    "course", "dimension", "signal_strength", "speed", "used_star", "altitude", "horizontal", "vertical", "pressure", 'survive'];
  let info = {}
  let _gps = device
  if (device.last_valid_gps) {
    _gps = device.last_valid_gps
  }
  for (let item of mapItems) {
    info[item] = _gps[item]
  }
  // info.survive = device.survive
  return info;
}

/**
 * 格式化GPS数据为地图格式
 */
function formatGpsMapData(gps) {
  let data = {}
  let location = []
  if (gps && ValidLatLng(gps.latitude, gps.longitude)) {
    let _point = {
      lat: gps.latitude,
      lng: gps.longitude
    }
    if (gps.point_location === 1) {//for google map, offset china gps only
      _point = eviltransform.wgs2gcj(_point.lat, _point.lng)
    }
    location = _point
    data = getDeviceLocationInfo(gps)
    return {
      location,
      data,
    }
  }
}

/**
 * 格式化标记点信息（设备或gps数据）
 * @param array
 * @returns {{locations: Array, data: *, contents: *}}
 */
function formatMarkerData(array) {
  let _data = []
  let _devicesLocs = []
  for (let gps of array) {
    if (!gps.device_id) {//设备最后一条有效gps信息
      let survive = {
        survive: gps.survive
      }
      gps = gps.last_valid_gps || {};
      gps = Object.assign(gps, survive)
    }
    let formatted = formatGpsMapData(gps)
    if (formatted) {
      _devicesLocs.push(formatted.location)
      _data.push(formatted.data)
    }
  }
  let _devicesGps = GpsDataFormatter(_data)
  return {
    locations: _devicesLocs,
    // data: _devicesGps,
    contents: _devicesGps,
  }
}

const markerService = {
  showMarkers,
  hideMarkers,
  hideDevicePath,
  showCluster,
  hideCluster,
  getDeviceLocationInfo,
  drawOnMap,
  toggleCluster,
  clearMapDrawing,
  formatMarkerData
}
export default markerService