/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'
import React from 'react'
import '../../../js/markerclusterer'
import mapService from '../map.service'
import searchStore from '../search/store'
// require('https://maps.googleapis.com/maps/api/js?key=AIzaSyCcgISWlofggfUPB7zmCQL8jl87Az524eg')

const google = window.google
let initMapDevice = {
  locations: [],
  contents: [],
  markers: [],
  cluster: null,
};
const pathTimeRanges = ['-3','-6','-12']
// const trackTypes = ['gps_path','gps_simple_path','sms_path']
const trackTypes = ['gps_path','gps_simple_path']
let mapStore = observable({
  loading: false,
  // 默认参数
  showCluster: true,
  trackType: trackTypes[0],
  enabledTrackTypes: trackTypes,//,'uploading_path'
  // 轨迹时间段
  pathTimeRange: pathTimeRanges[0],
  pathTimeRangeOptions: pathTimeRanges,
  map: null,
  devicePath: initMapDevice,
  searchOutDevicesPath: initMapDevice,
})
const thisStore = mapStore;
thisStore.set = action((name,value) => {
  thisStore[name] = value
})
thisStore.initMap = action(mapDiv => {
  thisStore.map = mapService.initMap(mapDiv)
  searchStore.initMap(thisStore.map)
})
thisStore.setDeviceLocationMap = action(map => {
  thisStore.deviceLocationMap = map
})
thisStore.setTrackType = action(type => {
  thisStore.trackType = type
  searchStore.setTrackType(type)
})
thisStore.setCluster = action(show => {
  thisStore.showCluster = show
  searchStore.setToggleCluster(true)
})
thisStore.dateCompare=action((dateString, compareDateString)=>{
  const dateTime = new Date(dateString).getTime();
  const compareDateTime = new Date(compareDateString).getTime();
  if (compareDateTime > dateTime) {
    return 1;
  } else if (compareDateTime == dateTime) {
    return 0;//
  } else {
    return -1;//
  }
})

thisStore.isDateBetween=action((dateString, startDateString, endDateString)=>{
  let flag = false;
  const startFlag = (thisStore.dateCompare(dateString, startDateString) < 1);
  const endFlag = (thisStore.dateCompare(dateString, endDateString) > -1);
  if (startFlag && endFlag) {
    flag = true;
  }
  return flag;
})
export default mapStore;