/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'
import React from 'react'
import '../../../js/markerclusterer'
import mapService from '../map.service'
import Drawing from '../drawing'
import ContextMenu from '../../../js/ContextMenu'
// require('https://maps.googleapis.com/maps/api/js?key=AIzaSyCcgISWlofggfUPB7zmCQL8jl87Az524eg')

const google = window.google
let initMapDevice = {
  locations: [],
  contents: [],
  markers: [],
  cluster: null
};
let mapStore = observable({
  map: null,
  // drawing
  reDraw: false,
  clearDrawing: false,//清空搜索结果
  drawingManager: null,
  defaultDrawingMode: 'circle',
  enabledDrawingModes: ['circle', 'polygon'],//polygon
  selectedShape: null,
  // 右键菜单
  rangeSearchContextMenu: null,
  // 数据
  searchArray: {},
  // 展示
  toggleCluster: false,
  // 默认参数
  showCluster: true,
  reload: false,
  filterType: 'all',
  trackType: 'gps_simple_path',
  // enabledTrackTypes: ['gps_path', 'gps_simple_path', 'sms_path'],//,'uploading_path'
  enabledTrackTypes: ['gps_path', 'gps_simple_path'],//,'uploading_path'
  pathFilterOptions: ['dead', 'alive', 'all'],
  searchOutDevicesPath: {},
  // 范围搜索
  isRangeSearching: false,
  rangeSearchType: google.maps.drawing.OverlayType.CIRCLE, //true: circle; false: polygon
  enableSearchTypes: [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON],
  // 搜索结果
  searchOutDevices: {devices: [], deviceGps: []},
  // 范围搜索结果
  rangeSearchOutDevices: {devices: [], deviceGps: []},
  // 正在进行查看的设备
  onMapDevices: [],
})
const thisStore = mapStore;
thisStore.init = action(() => {
  thisStore.isRangeSearching = false
  thisStore.deleteSelectedShape();
  thisStore.searchOutDevices = {devices: [], deviceGps: []}
  thisStore.rangeSearchOutDevices = {devices: [], deviceGps: []}
  thisStore.clearDrawing = true;
})
/**
 * 初始化地图
 */
thisStore.initMap = action(map => {
  thisStore.map = map
  // thisStore.map = mapService.initMap(mapDiv)
})
/**
 * 初始化右键菜单
 */
thisStore.initRangeSearchContextMenu = action(() => {
  if(thisStore.map){
    thisStore.rangeSearchContextMenu = new ContextMenu(thisStore.map, mapService.contextMenuOptions.searchRange)
  }
})
/**
 * 切换绘制类型/重新绘制图形
 */
thisStore.redrawSearchRange = action(()=>{
  thisStore.deleteSelectedShape()
  thisStore.setClearDrawing()
})
/**
 * 初始化绘制工具
 */
thisStore.initDrawingManager = action((show) => {
  let drawing = thisStore.drawingManager
  if (!drawing) {//未初始化
    thisStore.drawingManager = Drawing.init(thisStore.map, thisStore.rangeSearchType, thisStore.enableSearchTypes);
    thisStore.setIsRangeSearching(true);
    thisStore.setClearDrawing(true)
  } else {
    if(show){
      thisStore.drawingManager.setMap(thisStore.map);
      thisStore.setIsRangeSearching(true);
      thisStore.setClearDrawing(true)
    }else{
      thisStore.deleteSelectedShape();
      thisStore.drawingManager.setMap(null);
      thisStore.setIsRangeSearching(false);
      thisStore.setClearDrawing(true)
    }
  }
  // 范围搜索
  google.maps.event.addListener(thisStore.drawingManager, 'overlaycomplete', function (event) {
    let newShape = event.overlay;
    let type = event.type;
    thisStore.drawingManager.setOptions({
      drawingMode: null,
      // drawingControl: false
    });
    thisStore.selectShape(newShape);
    thisStore.searchArray = mapService.getSearchArray(event);
    // if (type === google.maps.drawing.OverlayType.CIRCLE) {
    //   thisStore.searchArray = mapService.setSearchArray(event, newShape.center, newShape.radius);
    // } else if (type === google.maps.drawing.OverlayType.POLYGON) {
    //   // var polygonArray = mapService.getPolygonArray(newShape.getPath());
    //   // thisStore.searchArray = mapService.getSearchArray(newShape, polygonArray);
    //   thisStore.searchArray = mapService.getSearchArray(event);
    // }
    google.maps.event.addListener(newShape, 'rightclick', function (_event) {
      thisStore.rangeSearchContextMenu.show(_event.latLng);
    });
  });
})
/**
 * 切换绘制类型
 */
thisStore.setRangeSearchType = action(type => {
  thisStore.rangeSearchType = type || 'circle';
  thisStore.deleteSelectedShape()
})
/**
 * 取消选中形状
 */
thisStore.cancelShapeEditable = action(() => {
  if (thisStore.selectedShape) {
    thisStore.selectedShape.setEditable(false);
    thisStore.selectedShape.setDraggable(false);
  }
})
/**
 * 选中形状
 */
thisStore.selectShape = action(shape => {
  shape.setEditable(true);
  shape.setDraggable(true);
  thisStore.selectedShape = shape
})
/**
 * 删除选中形状，重置绘制类型
 */
thisStore.deleteSelectedShape = action(() => {
  if (thisStore.selectedShape) {
    thisStore.selectedShape.setMap(null);
    thisStore.selectedShape = null;
  }
  // To show:
  if (thisStore.drawingManager) {
    thisStore.drawingManager.setOptions({
      drawingMode: thisStore.rangeSearchType,
    });
  }
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
  thisStore.setReDraw(true)
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
thisStore.setSearchOutDevicesPath = action(paths => {
  thisStore.searchOutDevicesPath = paths
})
/**
 * 清除上次搜索结果绘制图形
 */
thisStore.setClearDrawing = action((state) => {
  thisStore.clearDrawing = state;
  if (state) {
    setTimeout(() => {
      thisStore.clearDrawing = false;
    }, 0)
  }
})
thisStore.setToggleCluster = action((state) => {
  thisStore.toggleCluster = state;
  if (state) {
    setTimeout(() => {
      thisStore.toggleCluster = false;
    }, 0)
  }
})
thisStore.setReDraw = action((state)=>{
  // console.log('redraw',state)
  thisStore.reDraw = state;
  if (state) {
    setTimeout(() => {
      thisStore.reDraw = false;
    }, 0)
  }
})
export default mapStore;