/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'
import React from 'react'
import '../../js/markerclusterer'

const google = window.google
const pathTimeRanges = ['1','7','30','90','180','360']
let mapStore = observable({
  // 设备位置
  showCluster: true,
  trackType: 'original_path',
  enabledTrackTypes: ['original_path','simple_path'],
  deviceLocationMap: null,
  devicesLocation: [],
  devicesInfo: [],
  deviceLocationMarkers: [],
  deviceLocationMarkerCluster: [],
  deviceAll: [], //所有设备
  //设备轨迹
  devicePathMap: null,
  // 范围搜索
  isRangeSearching: false,
  rangeSearchType: 'circle',//google.maps.drawing.OverlayType.CIRCLE, //true: circle; false: polygon
  enableSearchTypes: ['circle','polygon'],//[google.maps.drawing.OverlayType.CIRCLE,google.maps.drawing.OverlayType.POLYGON],
  // 搜索结果
  searchOutDevices: { devices: [], deviceGps: []},
  // 范围搜索结果
  rangeSearchOutDevices: { devices: [], deviceGps: []},
  // 正在进行查看的设备
  onMapDevices: [],
  // 轨迹时间段
  pathTimeRange: pathTimeRanges[0],
  pathTimeRangeOptions: pathTimeRanges,
})
const thisStore = mapStore;

thisStore.clear = action(() => {
    thisStore.pathTimeRange=pathTimeRanges[0]
})




thisStore.set = action((name,value) => {
  thisStore[name] = value
})
/**
 * 所有设备
 */
thisStore.setDeviceLocationMap = action(map => {
  thisStore.deviceLocationMap = map
})
thisStore.setDeviceLocationMarkers = action(markers => {
  thisStore.deviceLocationMarkers = markers
})
thisStore.setDeviceLocationMarkerCluster = action(cluster => {
  thisStore.deviceLocationMarkerCluster = cluster
})
thisStore.setCluster = action((state) => {
  thisStore.showCluster = state
})
thisStore.toggleCluster = action(() => {
  thisStore.showCluster = !thisStore.showCluster
})
thisStore.setDevicesLocation = action(array => {
  thisStore.devicesLocation = array
})
thisStore.setDevicesInfo = action(array => {
  thisStore.devicesInfo = array
})
// 设备轨迹
thisStore.setDevicePathMap = action(map => {
  thisStore.devicePathMap = map
})
// 其他功能
thisStore.setIsRangeSearching = action(state => {
  thisStore.isRangeSearching = state;
})
thisStore.setRangeSearchType = action(type => {
  let mapDarwingType = 'circle';
  if(typeof(type) === 'boolean'){
    if(type){
      mapDarwingType = google.maps.drawing.OverlayType.CIRCLE;
    }
    else{
      mapDarwingType = google.maps.drawing.OverlayType.POLYGON;
    }
  }else if(type){
    mapDarwingType = type;
  }
  thisStore.rangeSearchType = mapDarwingType
})
thisStore.setRangeSearchOutDevices = action(array => {
  thisStore.rangeSearchOutDevices = array
})
thisStore.updateOnMapDevices = action(device => {
  let maxOnMapDeviceLength = 5;
  let _onMapDevices = thisStore.onMapDevices
  let _index = -1;
  _onMapDevices.map(function (d,i) {
    // console.log(d.id,device.id,d.id === device.id)
    if(d.id === device.id){
      _index = i;
      _onMapDevices.splice(_index,1)
    }
  })
  if((_index === -1) && (_onMapDevices.length < maxOnMapDeviceLength)){
    _onMapDevices.push(device)
  }
  thisStore.onMapDevices = _onMapDevices
  // console.log(JSON.stringify(thisStore.onMapDevices),device,_index === -1,_index,_onMapDevices.length < maxOnMapDeviceLength)
})
export default mapStore;