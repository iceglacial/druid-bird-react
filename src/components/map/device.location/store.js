/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'
import React from 'react'
import '../../../js/markerclusterer'
import mapService from '../map.service'
import searchStore from '../search/store'
import moment from 'moment'
// require('https://maps.googleapis.com/maps/api/js?key=AIzaSyCcgISWlofggfUPB7zmCQL8jl87Az524eg')

const today = moment.utc().toObject()
const google = window.google
let initMapDevice = {
  locations: [],
  contents: [],
  markers: [],
  cluster: null
};
const trackTypes = ['gps_path','gps_simple_path','sms_path']
const rangeSearchTyps = ['circle','polygon']
const pathTypes = ['dead','alive','all']
const locationTypes = ['last','history']
let mapStore = observable({
  loading: false,
  // 默认参数
  showCluster: true,
  reload: false,
  filterType: pathTypes[2],
  trackType: trackTypes[1],
  enabledTrackTypes: trackTypes,//,'uploading_path'
  pathFilterOptions: pathTypes,
  map: null,
  locationType: locationTypes[0],
  locationTypeOptions: locationTypes,
  deviceLocation: initMapDevice,
  searchOutDevicesPath: initMapDevice,
  searchDevice: '',//顶部搜索栏
  // 范围搜索
  isRangeSearching: false,
  rangeSearchType: rangeSearchTyps[0], //true: circle; false: polygon
  enableSearchTypes: rangeSearchTyps,
  // 搜索结果
  searchOutDevices: { devices: [], deviceGps: []},
  // 范围搜索结果
  rangeSearchOutDevices: { devices: [], deviceGps: []},
  // 正在进行查看的设备
  onMapDevices: [],
  minHistoryYear: 2015,
  historyYear: today.year,
  reSetHistoryYear: false,
  isHistoryLocationState: false, // 切换到历史位置
  historyDay: null, //历史位置
})
const thisStore = mapStore;
thisStore.set = action((name,value) => {
  thisStore[name] = value
})
thisStore.initMap = action(mapDiv => {
  thisStore.map = mapService.initMap(mapDiv)
  searchStore.initMap(thisStore.map)
  // init params
  thisStore.historyDay = null
  thisStore.showCluster = true
  thisStore.searchOutDevices = {devices: [], deviceGps: []}
  thisStore.rangeSearchOutDevices = { devices: [], deviceGps: []}
})
thisStore.setFilterType = action(type => {
  thisStore.filterType = type
})
thisStore.setReload = action(reload => {
  thisStore.reload = reload
})
thisStore.setDeviceLocationMap = action(map => {
  thisStore.deviceLocationMap = map
})
thisStore.setTrackType = action(type => {
  thisStore.trackType = type || 'simple_path'
})
thisStore.setCluster = action(show => {
  thisStore.showCluster = show
})
thisStore.setIsRangeSearching = action(state => {
  thisStore.isRangeSearching = state;
})
thisStore.setRangeSearchOutDevices = action(array => {
  thisStore.rangeSearchOutDevices = array
})
thisStore.setOnMapDevices = action(devices => {
  thisStore.onMapDevices = devices
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
thisStore.setHistoryDay = action(date => {
  thisStore.historyDay = date
  thisStore.setHistoryLocationState(true)
})
thisStore.setHistoryYear = action(year => {
  thisStore.historyYear = year
  thisStore.setHistoryDay(moment.utc(year+'0101').format('YYYY-MM-DD'))
  thisStore.reSetHistoryYear = true
})
thisStore.setHistoryLocationState = action(state => {
  thisStore.isHistoryLocationState = state
})
export default mapStore;