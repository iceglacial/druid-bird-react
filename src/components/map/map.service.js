/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/6 0006.
 */

import mapStore from './store'
import {DataFormatter} from '../../common'
import appStore from '../../store/app_store'

import Marker from './marker'
// import PathLine from './pathline'
// import RightClickMenu from './right_click_menu'
// import Drawing from './drawing'
// maps.googleapis.com
// require('https://ditu.google.cn/maps/api/js?key=AIzaSyCcgISWlofggfUPB7zmCQL8jl87Az524eg&libraries=drawing,geometry')

const {ValidLatLng, GpsDataFormatter} = DataFormatter
const google = window.google;
const eviltransform = window.eviltransform

let cutMap = null;
//地图默认参数
let mapConfig = {
  center: {lat: 28.024, lng: 170.887},
  zoom: 3,
  // mapTypeId: 'satellite', //默认为卫星地图
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,//DROPDOWN_MENU,HORIZONTAL_BAR
    position: google.maps.ControlPosition.LEFT_BOTTOM,
  },
  scaleControl: true, //比例尺
  streetViewControl: false, //街景
  fullscreenControl: true, //全屏
  fullscreenControlOptions: {
    position: google.maps.ControlPosition.RIGHT_BOTTOM,
  },
  zoomControl: true,
  zoomControlOptions: {
    position: google.maps.ControlPosition.RIGHT_BOTTOM,
  },
}
const mapService = {
  enabledTrackTypes: ['original_path', 'simple_path'],
  // 右键搜索菜单
  contextMenuOptions: {
    // 范围搜索
    searchRange: {
      classNames: {menu: 'shape_menu', menuSeparator: 'shape_menu_separator'},
      menuItems: [
        {
          className: 'shape_item',
          eventName: 'shape_click',
          id: 'shapeItem',
          label: appStore.language.reset_search_range_result
        },
        {
          className: 'shape_item',
          eventName: 'shape_search_click',
          id: 'shapeSearchItem',
          label: appStore.language.search_range_devices
        },
      ],
    }
  },
  /**
   *
   * @param option
   * - mapDiv
   * - rangeSearch
   * - measure_distance
   * @returns {*}
   */
  initMap: (mapDiv) => {
    if (mapDiv) {
      return new google.maps.Map(
        mapDiv,
        mapConfig
      )
    }
  },
  initSearchRange: () => {

  },
  initDrawingManager: () => {
    let mode = [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON]
    let drawingStyle = {
      strokeColor: '#C01E1E',//深红
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#C01E1E',
      fillOpacity: 0.15,
      editable: false,
    }
    return new google.maps.drawing.DrawingManager({
      drawingMode: mapStore.rangeSearchType, //当前绘制类型
      drawingControl: false, //显示绘制工具
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: mode
      },
      // overlay: "circle",
      markerOptions: {icon: 'images/pin-search2838.png'},
      rectangleOptions: drawingStyle,
      circleOptions: drawingStyle,
      polygonOptions: drawingStyle,
    });
  },
  getSearchArray: (event) => {
    var type = event.type;
    let newShape = event.overlay;
    let searchArray = {};
    if (type === google.maps.drawing.OverlayType.CIRCLE) {
      let center = newShape.center;
      let radius = newShape.radius;
      var latlng = center.toString().slice(1, -1);
      var lnglat = gcjToWgs(latlng);
      searchArray.max = parseInt(radius);
      searchArray.point = lnglat;
    }
    else if (type === google.maps.drawing.OverlayType.POLYGON) {
      let polygonArray = [];
      let beginPoint = null
      let path = newShape.getPath()
      for (let i = 0; i < path.getLength(); i++) {
        let point = path.getAt(i)
        let removedOffset = eviltransform.gcj2wgs(point.lat(), point.lng());
        let lngLat = [parseFloat(removedOffset.lng.toFixed(7)), parseFloat(removedOffset.lat.toFixed(7))];
        (i === 0) && (beginPoint = lngLat);
        polygonArray.push(lngLat);
      }
      polygonArray.push(beginPoint)
      searchArray.polygon = [polygonArray];
    }else if(type === google.maps.drawing.OverlayType.RECTANGLE){
      console.log('rectangle')
    }
    // console.log(searchArray)
    return searchArray
  },
  // 格式化搜索数据
  setSearchArray: (event, array, max) => {
    let searchArray = {};
    var type = event.type;
    if (type === google.maps.drawing.OverlayType.CIRCLE) {
      var latlng = array.toString().slice(1, -1);
      var lnglat = gcjToWgs(latlng);
      searchArray.max = parseInt(max);
      searchArray.point = lnglat;
    }
    else if (type === google.maps.drawing.OverlayType.POLYGON) {
      searchArray.polygon = array;
    }
    ;
    return searchArray
  },
// 格式化polygon坐标点array
  getPolygonArray: (polygon) => {
    var array = [];
    var polygonArray = [];
    var beginPoint;
    for (var i = 0; i < polygon.getLength(); i++) {
      var lnglat = gcjToWgs(polygon.getAt(i).toUrlValue(6));
      (i == 0) && (beginPoint = lnglat);
      array.push(lnglat);
    }
    ;
    array.push(beginPoint);
    polygonArray.push(array);
    return polygonArray;
  },
  // 从区域搜索结果分割出设备和设备轨迹
  resolveRangeSearchDevices: (array) => {
    let devices = [];//范围内搜索结果设备基本信息
    let devicesGPS = {};//范围内单个设备所有gps信息
    if (array.length) {
      array.map(function (value, index) {
        var thisID = value.device_id;
        var thisMark = (value.mark === undefined) ? "" : value.mark;
        var thisUUID = value.uuid;
        var dLen = devices.length;

        if (index === 0 || !devicesGPS[thisID]) {
          devices.push({
            id: thisID,
            mark: thisMark,
            uuid: thisUUID,
          });
        }
        !devicesGPS[thisID] && (devicesGPS[thisID] = []);
        devicesGPS[thisID].push(value);
      })
      // setRangeDevice(devices);
      // setRangeDeviceGps(devicesGPS);
      // $rootScope.$emit('searchRange', devices);//更新 map.ctrl 中搜索结果列表设备
      // document.getElementById('mapSearch').className = 'open';
      // angular.element('#mapSearch').addClass('open');
    } else {
      // httpService.myAlert('info',$filter('chFilter')('useful_info_none'));
    }
    let formattedDeviceGps = {};
    for (let gps of Object.values(devicesGPS)) {
      formattedDeviceGps[gps[0].device_id] = mapService.formatDataDevicePath(gps)
    }
    // $rootScope.$emit('hideLoadingYellow');
    // modalService.hideLoading();
    return {
      devices: devices,
      devicesGps: devicesGPS,
      formatGps: formattedDeviceGps,
      deviceGps: formattedDeviceGps,
    }
  },
  /**
   * 格式化设备位置地图数据 - 中国区加偏
   * @param array
   * @returns {{locations: Array, data: *}}
   */
  formatDataDevicesLocation: (array) => {
    let _devices = [];
    let _devicesLoc = [];
    for (let i of array) {
      if (i.last_valid_gps) {
        if (ValidLatLng(i.last_valid_gps.latitude, i.last_valid_gps.longitude)) {
          let _point = {
            lat: i.last_valid_gps.latitude,
            lng: i.last_valid_gps.longitude
          }
          if (i.last_valid_gps.point_location === 1) {//for google map, offset china gps only
            _point = eviltransform.wgs2gcj(_point.lat, _point.lng)
          }
          _devicesLoc.push(_point)
          _devices.push(Marker.getDeviceLocationInfo(i))
        }
      }
    }
    let _devicesInfo = GpsDataFormatter(_devices)
    return {
      locations: _devicesLoc,
      data: _devicesInfo,
      contents: _devicesInfo,
    }
  },
  /**
   * 格式化设备轨迹地图数据
   * @param array
   * @returns {{locations: Array, data: *}}
   */
  formatDataDevicePath: (array) => {
    let _data = []
    let _devicesLocs = []
    for (let gps of array) {
      let formatted = formatGpsMapData(gps)
      if(formatted){
        _devicesLocs.push(formatted.location)
        _data.push(formatted.data)
      }
    }
    let _devicesGps = GpsDataFormatter(_data)
    return {
      locations: _devicesLocs,
      data: _devicesGps,
      contents: _devicesGps,
    }
  },
  drawMarkers: (markerInfo) => {
    return Marker.showMarkers(markerInfo)
  },
  hideMarkers: (array) => {
    Marker.hideMarkers(array)
  },
}
//格式化GPS数据为地图格式
function formatGpsMapData(gps) {
  let data = {}
  let location = []
  if (ValidLatLng(gps.latitude, gps.longitude)) {
    let _point = {
      lat: gps.latitude,
      lng: gps.longitude
    }
    if (gps.point_location === 1) {//for google map, offset china gps only
      _point = eviltransform.wgs2gcj(_point.lat, _point.lng)
    }
    location = _point
    data = Marker.getDeviceLocationInfo(gps)
    return {
      location,
      data,
    }
  }
}
// 反向纠偏 - 去偏
function gcjToWgs(latlngStr) {
  var latlng = latlngStr.split(',');
  latlng = eviltransform.gcj2wgs(parseFloat(latlng[0]), parseFloat(latlng[1]));
  latlng.lng = parseFloat(latlng.lng.toFixed(7));
  latlng.lat = parseFloat(latlng.lat.toFixed(7));
  var lnglat = [];
  lnglat.push(latlng.lng);
  lnglat.push(latlng.lat);
  return lnglat;
}
/**
 *
 * @param type 类型： location - 设备位置； path - 设备轨迹
 * @param bySearch 是否非搜索结果
 * @param BOE 0：默认，1：开始点，2：结束点
 */
function getMarkerImage(params) {
  let {type, bySearch, BOE} = params
  if (type === 'location') {
    if (bySearch) {
      return {
        url: window.location.origin + "/images/pin-blue2836.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
        // scaledSize: new google.maps.Size(20, 20) //缩放
      }
    }
  } else if (type === 'path') {
    if (bySearch) {
      if (BOE === 1) {
        return {
          url: window.location.origin + "/images/pin-search-begin_4040.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else if (BOE === 2) {
        return {
          url: window.location.origin + "/images/pin-search-end_4040.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else {
        return {
          url: window.location.origin + "/images/pin-search1414.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
          anchor: new google.maps.Point(7, 7)
        }
      }
    } else {
      if (BOE === 1) {
        return {
          url: window.location.origin + "/images/pin-begin_4040.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else if (BOE === 2) {
        return {
          url: window.location.origin + "/images/pin-end_4040.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
        }
      } else {
        return {
          url: window.location.origin + "/images/pin-origin_1616.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
          // scaledSize: new google.maps.Size(20, 20) //缩放
          anchor: new google.maps.Point(8, 8)
        }
      }
    }
  }
  return {
    url: window.location.origin + "/images/pin-red2838.png",//'http://ditu.google.cn/mapfiles/kml/paddle/ylw-circle.png'
    // scaledSize: new google.maps.Size(20, 20) //缩放
  }
}
export default mapService