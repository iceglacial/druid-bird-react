/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'
import React from 'react'
import mapService from '../map.service'
// require('https://maps.googleapis.com/maps/api/js?key=AIzaSyCcgISWlofggfUPB7zmCQL8jl87Az524eg')


const google = window.google
let mapStore = observable({
  loading: false,
  showCluster: true,
  maxGeofenceArea: 314159266,
  geofenceMap: null, //所有围栏
  geofenceOfDevicesMap: null, //设备下的围栏
  geofenceDetailMap: null, //编辑围栏/围栏详情页
  addGeofenceMap: null, //创建围栏
  addGeofenceType: 'circle',//创建围类型
  activeDevice: '',
  geofencesOfActiveDevice: [],
  drawingOfActiveDevice: [],
  colors: {
    search: "#C01E1E",//0-深红: 地图搜索
    default: "#7ED321",//1-绿：#7ed321（列表）
    highLight: "#42B6DB",//2-蓝：#42B6DB（高亮）
    edit: "#FF3851",//3-红：#FF3851（新建／编辑）
  },
  onEdit: false,
  onEditGeofence: {},
  onEditGeofenceDevices: {
    data: [],
    markers: [],
  },
  onEditGeofenceDrawing: null,
  onManageDevice: false,
})
const thisStore = mapStore;
thisStore.set = action((name,value) => {
  thisStore[name] = value
})
thisStore.initMap = action(mapDiv => {
  thisStore.map = mapService.initMap(mapDiv)
  // thisStore.geofenceOfDevicesMap = mapDiv
})
thisStore.setMapCenter = action((lat,lng) => {
  thisStore.map.setCenter(new google.maps.LatLng(lat, lng));
})
thisStore.setGeofenceMap = action(map => {
  thisStore.geofenceMap = map
})
thisStore.setGeofenceOfDevicesMap = action(map => {
  thisStore.geofenceOfDevicesMap = map
})
thisStore.setGeofenceDetailMap = action(map => {
  thisStore.geofenceDetailMap = map
})
thisStore.setAddGeofenceMap = action(map => {
  thisStore.addGeofenceMap = map
})
thisStore.setBounds = action(bounds => {
  if (bounds) {
    if (thisStore.geofenceMap) {
      thisStore.geofenceMap.fitBounds(bounds);      // # auto-zoom
      thisStore.geofenceMap.panToBounds(bounds);    // # auto-center
    }
    if (thisStore.geofenceOfDevicesMap) {
      thisStore.geofenceOfDevicesMap.fitBounds(bounds);      // # auto-zoom
      thisStore.geofenceOfDevicesMap.panToBounds(bounds);    // # auto-center
    }
    if (thisStore.map) {
      thisStore.map.fitBounds(bounds);      // # auto-zoom
      thisStore.map.panToBounds(bounds);    // # auto-center
    }
  }
})
thisStore.setActiveDevice = action(device => {
  thisStore.activeDevice = device
})
thisStore.addGeofencesOfActiveDevice = action(fence => {
  thisStore.geofencesOfActiveDevice.push(fence)
})
thisStore.setGeofencesOfActiveDevice = action(fences => {
  console.log(fences)
  thisStore.geofencesOfActiveDevice = fences
})
thisStore.setDrawingOfActiveDevice = action(drawing => {
  thisStore.drawingOfActiveDevice = drawing
})
thisStore.setOnEditGeofence = action(fence => {
  thisStore.onEditGeofence = fence
})
thisStore.setAddGeofenceType = action(type => {
  thisStore.addGeofenceType = type
})
thisStore.setOnEdit = action(edit => {
  thisStore.onEdit = edit
})
thisStore.setOnEditGeofenceDrawing = action(drawing => {
  thisStore.onEditGeofenceDrawing = drawing
})
thisStore.setOnEditGeofenceDevices = action(devices => {
  thisStore.onEditGeofenceDevices = devices
})
thisStore.setOnManageDevice = action(isManage => {
  thisStore.onManageDevice = isManage
})
thisStore.initDetailPage = action(() => {
  thisStore.onManageDevice = false;
  thisStore.onEditGeofenceDevices = {
    data: [],
    markers: [],
  }
  thisStore.onEditGeofence = {}
})
export default mapStore;