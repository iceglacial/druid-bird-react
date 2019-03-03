/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import {DataFormatter} from '../../common'
import {message} from 'antd'
import {Filters} from '../../common'
import geofenceStore from './geofence/store'
import appStore from '../../store/app_store'
import measureStore from './measure_distance/store'

let google = window.google
const maxFenceArea = geofenceStore.maxGeofenceArea
const eviltransform = window.eviltransform
const {unitFilter} = Filters
const {addLatLngOffset, removeLatLngOffset, ValidLatLng} = DataFormatter

function Drawing(type, state) {
  this.type = type;
  this.state = state;
  /**
   * google.maps.drawing.OverlayType.MARKER,
   * google.maps.drawing.OverlayType.CIRCLE,
   * google.maps.drawing.OverlayType.POLYGON,
   * google.maps.drawing.OverlayType.POLYLINE,
   * google.maps.drawing.OverlayType.RECTANGLE
   * @type {{default: [*], fence: [*], distance: [*]}}
   */
  this.modes = {
    default: [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON],
    fence: [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.RECTANGLE],
    distance: [google.maps.drawing.OverlayType.POLYLINE]
  };
  this.mode = this.modes[this.type] || this.modes.default;
  this.style = {};
  this.color = {
    search: "#C01E1E",//0-深红: 地图搜索
    default: "#7ED321",//1-绿：#7ed321（列表）
    highLight: "#42B6DB",//2-蓝：#42B6DB（高亮）
    edit: "#FF3851",//3-红：#FF3851（新建／编辑）
  };
  // 样式
  if (!this.state || this.state === 'search') {
    this.style = {
      strokeColor: this.color.search,//深红
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: this.color.search,
      fillOpacity: 0.15,
      editable: false,
    };
  } else {
    var color;
    if (this.state === "default" || this.state === 1) {
      color = this.color.default;
    } else if (this.state === "highlight" || this.state === 2) {
      color = this.color.highLight;
    } else if (this.state === "edit" || this.state === 3) {
      color = this.color.edit;
    }
    this.style = {
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.15,
      editable: false
    };
  }
}
const defaultFenceStyle = {
  strokeColor: '#7ED321',
  strokeOpacity: 1,
  strokeWeight: 2,
  fillColor: '#7ED321',
  fillOpacity: 0.15,
  editable: false
}
/**
 * 初始化地图绘制工具
 * @param map
 * @param mode
 * @param modes
 * @returns {google.maps.drawing.DrawingManager}
 */
function init(map,mode,modes) {
  // console.log(mode,modes)
  let _mode = mode || google.maps.drawing.OverlayType.CIRCLE
  let _modes = modes || [google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON]
  let drawingStyle = {
    strokeColor: '#C01E1E',//深红
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: '#C01E1E',
    fillOpacity: 0.15,
    editable: false,
  }
  return new google.maps.drawing.DrawingManager({
    map,
    drawingMode: _mode, //当前绘制类型
    drawingControl: false, //显示绘制工具
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: _modes
    },
    // overlay: "circle",
    // markerOptions: {icon: 'images/pin-search2838.png'},
    rectangleOptions: drawingStyle,
    circleOptions: drawingStyle,
    polygonOptions: drawingStyle,
  });
}
/**
 * 限制圆形围栏面积
 * @param radius
 */
function limitCircleRadius(radius, selectedShape) {
  var r = parseInt(radius);
  var maxR = Math.round(Math.sqrt(maxFenceArea / Math.PI));
  if (r > 0) {
    if (r > maxR) {
      r = maxR;
      message.error(appStore.language.fence_acreage_exceed)
    } else {
      selectedShape.setRadius(r);
      refreshBounds();
    }
  }
}
/**
 * 格式化围栏数据
 * @param shape - 地图绘制形状对象
 * @param type - 图形类型
 * @returns {*}
 */
function formatFenceDrawing(shape,type) {
  let _type = type
  if(_type === 'rectangle'){
    return formatFenceRectangle(shape)
  }else if(_type === 'circle' || _type === 'round'){
    return formatFenceCircle(shape)
  }else{
    console.log('不支持类图形转换!')
  }
}
/**
 * 格式化围栏 - 圆
 * (地图绘制结果转显示数据)
 * @param circle
 * @param origin
 * @returns {{}}
 */
function formatFenceCircle(circle) {
  var center,radius,acreage,requestPath;
  var path = {};
  center = removeLatLngOffset(circle.center.lat(), circle.center.lng());
  requestPath = center
  radius = parseInt(circle.radius);
  var maxR = Math.round(Math.sqrt(maxFenceArea / Math.PI));
  if (path.radius > maxR) {
    limitCircleRadius(path.radius);
    path.radius = maxR;
  }
  acreage = getCircleAcreage(radius)
  path = {
    radius: radius,
    center: center,
    requestPath: requestPath,
    acreage: acreage
  }
  // console.log(path,"format");
  return path;
}
/**
 * 格式化围栏 - 矩形
 * (地图绘制结果转显示数据)
 * @param rectangle
 * @param origin
 * @returns {*}
 */
function formatFenceRectangle(rectangle) {
  var ne = rectangle.getBounds().getNorthEast();
  var sw = rectangle.getBounds().getSouthWest();
  var _ne = removeLatLngOffset(ne.lat(),ne.lng())
  var _sw = removeLatLngOffset(sw.lat(),sw.lng())
  var _nw = removeLatLngOffset(ne.lat(),sw.lng())
  var _se = removeLatLngOffset(sw.lat(),ne.lng())
  var north = parseFloat(_ne.lat.toFixed(7));
  var south = parseFloat(_sw.lat.toFixed(7));
  var east = parseFloat(_ne.lng.toFixed(7));
  var west = parseFloat(_sw.lng.toFixed(7));
  let lat = []
  let lng = []
  lat.push(north);
  lat.push(south);
  lng.push(west);
  lng.push(east);
  let requestPath = []
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      var tmp = {
        lat: lat[i],
        lng: lng[j],
      }
      requestPath.push(tmp);
    }
  }
  rectangle = {
    northWest: _nw,
    southEast: _se,
    requestPath: requestPath,
    acreage: getRectangleAcreage(north,south,west,east)
  };
  return rectangle;
}
/**
 * 格式化矩形围栏地理位置为服务器所需格式
 * @param north_west
 * @param south_east
 * @returns {Array}
 */
function formatPolygonRequestPath(north_west, south_east) {
  var data = [];
  var nw = north_west;
  var se = south_east;
  nw = ValidLatLng(nw.lat, nw.lng);
  se = ValidLatLng(se.lat, se.lng);
  var bounds = '';//selectedShape.getBounds();
  var north, south, west, east;
  var lat = [];
  var lng = [];
  if (nw && se) {//已去偏
    north = nw.lat;
    south = se.lat;
    west = nw.lng;
    east = se.lng;
  } else if (bounds) {//未去偏
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    ne = removeLatLngOffset(ne.lat, ne.lng);
    sw = removeLatLngOffset(sw.lat, sw.lng);
    if (ne && sw) {
      north = ne.lat;
      south = sw.lat;
      west = sw.lng;
      east = ne.lng;
    } else {
      return;
    }
  } else {
    return;
  }
  lat.push(north);
  lat.push(south);
  lng.push(west);
  lng.push(east);
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      var tmp = {
        lat: lat[i],
        lng: lng[j]
      }
      data.push(tmp);
    }
  }
  // console.log(data);
  return data;
}
/**
 * 格式化多边形路径
 * @param polygon
 * @returns {{drawing: Array, request: Array}}
 */
function formatPolygonPath(polygon) {
  let path = polygon.getPath()
  let data = {
    drawing: [],//[xx,xx]-lng,lat
    request: [],//[lat:xx,lng:xx]
  }
  let drawingBeginPoint = [];
  for (var i = 0; i < path.getLength(); i++) {
    var lnglat = gcjToWgs(path.getAt(i).toUrlValue(6));
    if(i === 0) { drawingBeginPoint = lnglat }
    data.drawing.push(lnglat);
    data.request.push({
      lng: lnglat[0],
      lat: lnglat[1]
    });
  }
  data.drawing.push(drawingBeginPoint);
  return data;
}
/**
 * 绘制围栏 - 任意图形
 * @param fenceData 服务器数据
 * @param map
 */
function drawGeofence(fenceData, map) {
  let type = fenceData.type.toLowerCase();
  if (type === "polygon") {//矩形
    return drawRectangle(fenceData.polygon.points, map)
  }else if(type === 'round'){//圆形
    return drawCircle(fenceData, map)
  }
}
/**
 * 绘制矩形围栏
 * @param bounds - [{lat: xx,lng: xx},...,{lat: xx,lng: xx}]
 * @returns {*}
 */
function drawRectangle(bounds, map) {
  var nw = addLatLngOffset(bounds[0].lat, bounds[0].lng);
  var se = addLatLngOffset(bounds[3].lat, bounds[3].lng);
  var _bounds = {
    north: nw.lat,
    south: se.lat,
    east: se.lng,
    west: nw.lng
  };
  if (map) {
    var options = defaultFenceStyle;//fenceOptions;
    options.map = map;
    options.bounds = _bounds;
    var b = limitFenceRectangle(bounds);
    (b) && (options.bounds = b);
    return new google.maps.Rectangle(options);
  }
}
/**
 * 绘制圆形围栏
 * @param circle - {distance: xx, point: {lat: xx,lng: xx}}
 * @returns {*}
 */
function drawCircle(circle, map) {
  var center = addLatLngOffset(circle.point.lat, circle.point.lng);
  var radius = circle.distance;
  if (map) {
    var options = defaultFenceStyle;//fenceOptions;
    options.map = map;
    options.center = center;
    options.radius = radius;
    return new google.maps.Circle(options);
  }
}
/**
 * 编辑图形后自动缩放地图
 */
function refreshBounds(selectedShape, map) {
  var bounds = selectedShape.getBounds();
  map.fitBounds(bounds);      // # auto-zoom
  map.panToBounds(bounds);    // # auto-center
}
/**
 * 限制矩形围栏面积
 * @param radius
 */
function limitFenceRectangle(points, selectedShape) {
  var ne,sw,nw,se;
  if (points) {
    ne = new google.maps.LatLng(points[1].lat, points[1].lng);
    sw = new google.maps.LatLng(points[2].lat, points[2].lng);
    nw = new google.maps.LatLng(points[0].lat, points[0].lng);
    se = new google.maps.LatLng(points[3].lat, points[3].lng);
  } else {
    var shape = selectedShape.getBounds();
    var rectangle = JSON.stringify(shape);
    rectangle = JSON.parse(rectangle);
    ne = shape.getNorthEast();
    sw = shape.getSouthWest();
    nw = new google.maps.LatLng(rectangle.north, rectangle.west);
    se = new google.maps.LatLng(rectangle.south, rectangle.east);
  }
  var w1 = google.maps.geometry.spherical.computeDistanceBetween(ne, nw);
  var h1 = google.maps.geometry.spherical.computeDistanceBetween(ne, se);
  var area = Math.round(w1 * h1);
  var bounds;
  // console.log(area,"rec area");
  if (area > maxFenceArea) {
    message.error(appStore.language.fence_acreage_exceed)
  }
  return bounds;
}
// 根据服务器返回围栏数据计算围栏面积
function getShapeAcreage(array) {
  var fence = array;
  var area;
  if (fence.type && fence.type.toLowerCase() === "round") {
    // shape.center = fence.point;
    // shape.radius = fence.distance;
    // type = "circle";
    area = getCircleAcreage(fence.distance)
  } else if (fence.type && fence.type.toLowerCase() === "polygon") {
    var ne = fence.polygon.points[1];
    var sw = fence.polygon.points[2];
    // shape.northEast = new google.maps.LatLng(ne.lat, ne.lng);
    // shape.southWest = new google.maps.LatLng(sw.lat, sw.lng);
    var north = ne.lat;
    var south = sw.lat;
    var west = sw.lng;
    var east = ne.lng;
    // type = "rectangle";
    area = getRectangleAcreage(north, south, west, east)
  }
  return area;
}
/**
 * 计算圆面积
 * @param radius
 * @returns {number}
 */
function getCircleAcreage(radius) {
  var area = radius * radius * Math.PI;
  // if(area > maxFenceArea){
  //   message.error('超过围栏最大面积限制！')
  // }
  return parseInt(area);
}
/**
 * 计算矩形面积
 * @param north
 * @param south
 * @param west
 * @param east
 * @returns {number}
 */
function getRectangleAcreage(north, south, west, east) {
  var ne = new google.maps.LatLng(north, east);
  var nw = new google.maps.LatLng(north, west);
  var se = new google.maps.LatLng(south, east);
  // console.log(ne,nw,se,"format area");
  var width = google.maps.geometry.spherical.computeDistanceBetween(ne, nw);
  var height = google.maps.geometry.spherical.computeDistanceBetween(ne, se);
  var area = Math.round(width * height);
  // console.log(area,area > maxFenceArea);
  // if (area > maxFenceArea) {
  //   message.error('超过围栏最大面积限制！')
  // }
  return parseInt(area);
}
// 反向纠偏
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
// 格式化polygon坐标点array (for drawing)
function getPolygonArray(polygon) {
  var array = [];
  var polygonArray = [];
  var beginPoint;
  for (var i = 0; i < polygon.getLength(); i++) {
    var lnglat = gcjToWgs(polygon.getAt(i).toUrlValue(6));
    (i == 0) && (beginPoint = lnglat);
    array.push(lnglat);
  }
  array.push(beginPoint);
  polygonArray.push(array);
  return polygonArray;
}
// 格式化搜索数据
const setSearchArray = (event, array, max) => {
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
}
//绘制距离测量结果
const setDistanceWindow = (map,measureShape) =>{
  let infoDiv;
  var distance = google.maps.geometry.spherical.computeLength(measureShape.getPath());
  var closeBtn = document.createElement('div');
  closeBtn.id = 'distanceCloseBtn';
  closeBtn.className = "anticon anticon-close";
  closeBtn.style.marginLeft = '10px';
  closeBtn.style.float = 'right';
  infoDiv = document.getElementById("distanceNote");
  if (!infoDiv) {
    infoDiv = document.createElement('div');
    infoDiv.id = 'distanceNote';
    infoDiv.style.backgroundColor = "#fff";
    infoDiv.style.border = "1px solid #666";
    infoDiv.style.padding = "5px 10px";
    infoDiv.style.borderRadius = "3px";
    infoDiv.style.marginTop = '10px';
    infoDiv.style.marginBottom = '10px';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoDiv);
  }
  infoDiv.innerHTML = unitFilter(distance,'distance');//with unit
  if (!document.getElementById("distanceCloseBtn")) {
    infoDiv.appendChild(closeBtn);
    closeBtn.addEventListener('click', function () {
      closeMeasureDistance(measureShape);
    });
  }
}
/**
 * 隐藏距离测量结果
 * @param measurePath
 */
const closeMeasureDistance=(measureShape)=>{
  if(measureShape){
    measureShape.setMap(null);
    // measureShape = null;
  }
  let infoDiv = document.getElementById("distanceNote");
  infoDiv && infoDiv.remove();
  measureStore.setOnMeasure(false)
}
const
Drawing = {
  init,
  drawGeofence,
  formatFenceDrawing,
  //==========
  drawCircle,
  drawRectangle,
  getShapeAcreage,
  formatFenceRectangle,
  getRectangleAcreage,
  formatFenceCircle,
  getCircleAcreage,
  getPolygonArray,
  setSearchArray,
  formatPolygonPath,
  setDistanceWindow,
  closeMeasureDistance,
}
export default Drawing