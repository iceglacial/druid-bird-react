/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/3 0003.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../common'
import mapStore from './store'
import {Button, Radio, Input,Dropdown,Menu,Icon,Popover} from 'antd'
import ContextMenu from '../../js/ContextMenu'
import '../../js/transform'
import mapService from './map.service'
import pathLine from './pathline'
import appStore from '../../store/app_store'
import Marker from './marker'

let map, markers, clusterer;
const google = window.google
const MarkerClusterer = window.MarkerClusterer
const imagePath = window.location.origin + '/images/m'


//地图变量
let searchRadius, searchArray = [], selectedShape, drawingManager = null, shapeMenu;

@observer
class DevicesLocation extends React.Component {
  constructor() {
    super()
    this.state = {
      deviceAll: [],
      devicesLocation: [],
      devicesInfo: [],
      onMapDevices: [],
      onMapDevicesPath: [],
      onMapDevicesMarkers: [],
      onMapDevicesCluster: [],
      searchInfo: '',
      searchOutDevice: []
    }
    // setTimeout(this.drawBaseMap,1000)
  }

  componentDidMount() {
    this.drawDevicesLocation()
  }

  drawBaseMap = (mapDiv) => {
    let _this = this;
    let redrawSearchRange = this.redrawSearchRange
    if (mapDiv) {
      map = new google.maps.Map(
        mapDiv,
        mapStore.mapConfig
      )
      mapStore.setDeviceLocationMap(map)
      // 自定义范围，右键事件
      shapeMenu = new ContextMenu(map, mapService.contextMenuOptions.searchRange);//getShapeMenuOptions()
      google.maps.event.addListener(shapeMenu, 'menu_item_selected', function (latLng, eventName) {
        switch (eventName) {
          case 'shape_click':
            // console.log('清除搜索范围')
            _this.redrawSearchRange()
            break;
          case 'shape_search_click':
            // console.log('搜索设备')
            shapeMenu.hide();
            clearSelection();
            searchRangeDevice(searchArray)
            break;
        }
      });

    }
  }

  // 重新绘制搜索区域
  redrawSearchRange = () => {
    deleteSelectedShape()
    this.clearRangeSearchDevice()
  }

  /**
   * 绘制设备位置
   */
  drawDevicesLocation = () => {
    axios.get(Api.device(), httpConfig()).then(res => {
      let mapData = mapService.formatDataDevicesLocation(res.data)
      this.setState({
        deviceAll: res.data,
        devicesLocation: mapData.locations,
        devicesInfo: mapData.data
      })
      mapStore.setDevicesLocation(mapData.locations)
      mapStore.setDevicesInfo(mapData.data)
      this.drawMarkers()
    }).catch(err => {
      MessageHandle(err)
    })
  }

  drawMarkers = () => {
    // markers = this.addSingleMarker(this.state.devicesLocation, map)
    const params = {
      type: 'location',
      bySearch: false,
    }
    let markerInfo = {
      locations: this.state.devicesLocation,
      data: this.state.devicesInfo,
      map,
      params
    }
    markers = mapService.Marker.showMarkers(markerInfo)
    if (mapStore.showClusterer) {
      clusterer = new MarkerClusterer(map, markers)
    }
  }

  drawPath = (locations) => {
    let bounds = new google.maps.LatLngBounds()
    const gps = locations
    let path;

    let polyLine = pathLine(true)
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

  // 显示/隐藏设备轨迹
  drawMarkersByDevice = (device) => {
    let _onMapDevicesPath = this.state.onMapDevicesPath;
    let _onMapDevicesMarkers = this.state.onMapDevicesMarkers;
    let _onMapCluster = this.state.onMapDevicesCluster;
    let mapData;
    const params = {
      type: 'path',
      bySearch: true,
    }
    if (mapStore.isRangeSearching) {
      mapData = mapStore.rangeSearchOutDevices.deviceGps[device.id]
      if (mapData) {
        let markerInfo = {
          locations: mapData.locations,
          data: mapData.data,
          map,
          params
        }
        // 绘制路径
        let _thisPathLine = this.drawPath(mapData.locations)
        _onMapDevicesPath.push(_thisPathLine)
        // 绘制标记点
        let _thisMarkers = mapService.Marker.showMarkers(markerInfo)
        _onMapDevicesMarkers.push(_thisMarkers)
        // 绘制集群
        let _thisCluster = new MarkerClusterer(map, _thisMarkers);
        _onMapCluster.push(_thisCluster);
        // console.log(_onMapDevicesMarkers,_onMapDevicesPath,_onMapCluster,this.state)
      }
    } else {
      axios.get(Api.gps(device.id), httpConfig('timestamp')).then(res => {
        mapData = mapService.formatDataDevicePath(res.data);
        let markerInfo = {
          locations: mapData.locations,
          data: mapData.data,
          map,
          params
        }
        // 绘制路径
        let _thisPathLine = this.drawPath(mapData.locations)
        _onMapDevicesPath.push(_thisPathLine)
        // 绘制标记点
        let _thisMarkers = mapService.Marker.showMarkers(markerInfo)
        _onMapDevicesMarkers.push(_thisMarkers)
        // 绘制集群
        let _thisCluster = new MarkerClusterer(map, _thisMarkers);
        _onMapCluster.push(_thisCluster);
      }).catch(err => {
        MessageHandle(err)
      })
    }
    this.setState({
      onMapDevicesMarkers: _onMapDevicesMarkers,
      onMapDevicesPath: _onMapDevicesPath,
      onMapDevicesCluster: _onMapCluster
    })
  }
  // 绘制标记点
  addSingleMarker = (locations, map) => {
    const params = {
      type: 'location',
      bySearch: false,
    }
    let markerInfo = {
      locations: locations,
      data: this.state.devicesInfo,
      map,
      params
    }
    let _markers = mapService.drawMarkers(markerInfo)
    return _markers
  }
// 清除无范围限制的搜索结果
  clearSearchDevice = () => {
    // console.log('clearSearchDevice')
    let _onMapDevices = this.state.onMapDevices;// || this.state.onMapDevices;
    let _onMapPaths = this.state.onMapDevicesPath;
    let _onMapMarkers = this.state.onMapDevicesMarkers;
    let _onMapClusters = this.state.onMapDevicesCluster;
    // console.log('clearRangeSearchDevice',_onMapDevices,this.state.onMapDevicesPath)
    _onMapDevices.map(function (device, index) {
      // console.log('clear range device', device, index)
      mapService.Marker.hideDevicePath(_onMapMarkers[index], _onMapClusters[index], _onMapPaths[index])
    })
    this.setState({
      searchInfo: '',
      searchOutDevice: [],
      onMapDevices: [],
      onMapDevicesPath: [],
      onMapDevicesMarkers: [],
      onMapDevicesCluster: []
    })
  }
  // 清除范围搜索结果
  clearRangeSearchDevice = () => {
    let _onMapDevices = this.state.onMapDevices;// || this.state.onMapDevices;
    let _onMapPaths = this.state.onMapDevicesPath;
    let _onMapMarkers = this.state.onMapDevicesMarkers;
    let _onMapClusters = this.state.onMapDevicesCluster;
    // console.log('clearRangeSearchDevice',_onMapDevices,this.state.onMapDevicesPath)
    _onMapDevices.map(function (device, index) {
      // console.log('clear range device', device, index)
      mapService.Marker.hideDevicePath(_onMapMarkers[index], _onMapClusters[index], _onMapPaths[index])
    })
    this.setState({
      searchInfo: '',
      searchOutDevice: [],
      onMapDevices: [],
      onMapDevicesPath: [],
      onMapDevicesMarkers: [],
      onMapDevicesCluster: []
    })
  }
  toggleCluster = () => {
    const showClusterer = mapStore.showClusterer
    let _onMapDevicesMarkers = this.state.onMapDevicesMarkers;
    let _onMapDeviceClusters = this.state.onMapDevicesCluster;
    if (showClusterer) {//显示标记点
      if (clusterer) clusterer.removeMarkers(markers)
      markers = this.addSingleMarker(this.state.devicesLocation, map)
      _onMapDeviceClusters.map(function (cluster, i) {
        mapService.Marker.hideCluster(cluster)
      })
      this.redrawSearchOutDevicesMarkersOnly()
    } else {//显示集群
      clusterer = new MarkerClusterer(map, markers)//, {imagePath}
      _onMapDevicesMarkers.map(function (markers, i) {
        _onMapDeviceClusters[i] = mapService.Marker.showCluster(markers, map)
      })
    }
    this.setState({
      onMapDevicesCluster: _onMapDeviceClusters
    })
    mapStore.toggleCluster();
  }
  //重新绘制快捷查看设备标记点
  redrawSearchOutDevicesMarkersOnly = () => {
    let _onMapDevices = this.state.onMapDevices
    let _onMapDevicesMarkers = []
    let _onMapCluster = []
    const params = {
      type: 'path',
      bySearch: true,
    }
    if (_onMapDevices.length) {
      _onMapDevices.map(function (device, index) {
        let mapData = {};
        if (mapStore.isRangeSearching) {
          mapData = mapStore.rangeSearchOutDevices.deviceGps[device.id]
          // console.log(mapData)
          let markerInfo = {
            locations: mapData.locations,
            data: mapData.data,
            map,
            params
          }
          // 绘制标记点
          let _thisMarkers = mapService.Marker.showMarkers(markerInfo)
          _onMapDevicesMarkers.push(_thisMarkers)
        } else {
          axios.get(Api.gps(device.id), httpConfig('timestamp')).then(res => {
            mapData = mapService.formatDataDevicePath(res.data);
            // console.log(mapData)
            let markerInfo = {
              locations: mapData.locations,
              data: mapData.data,
              map,
              params
            }
            // 绘制标记点
            let _thisMarkers = mapService.Marker.showMarkers(markerInfo)
            _onMapDevicesMarkers.push(_thisMarkers)
          }).catch(err => {
            MessageHandle(err)
          })
        }
        // console.log(mapData)
        let markerInfo = {
          locations: mapData.locations,
          data: mapData.data,
          map,
          params
        }
        // 绘制标记点
        let _thisMarkers = mapService.Marker.showMarkers(markerInfo)
        _onMapDevicesMarkers.push(_thisMarkers)
        // 绘制集群
        // let _thisCluster = new MarkerClusterer(map, _thisMarkers);
        // _onMapCluster.push(_thisCluster);
      })
      // console.log(_onMapDevicesMarkers)
      this.setState({
        onMapDevicesMarkers: _onMapDevicesMarkers,
        // onMapDevicesCluster: _onMapCluster
      })
    }
  }
  // 范围搜索
  searchRange = () => {
    // console.log('search range...')
    if (!drawingManager) {
      drawingManager = mapService.initDrawingManager();
      drawingManager.setMap(map);
      mapStore.setIsRangeSearching(true);
      this.clearSearchDevice()
    } else {
      if (!drawingManager.map) {
        drawingManager.setMap(map);
        mapStore.setIsRangeSearching(true);
        this.clearSearchDevice()
      } else {
        deleteSelectedShape()
        drawingManager.setMap(null);
        mapStore.setIsRangeSearching(false);
        this.clearRangeSearchDevice()
      }
    }

    // 范围搜索
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
      if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
        var radius = event.overlay.getRadius();
        searchRadius = radius;
        searchArray = new Array();
      }
    });
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
      if (e.type !== google.maps.drawing.OverlayType.MARKER) {
        // Switch back to non-drawing mode after drawing a shape.
        drawingManager.setDrawingMode(null);
        // To hide:
        drawingManager.setOptions({
          drawingControl: false
        });
        // Add an event listener that selects the newly-drawn shape when the user
        // mouses down on it.
        var newShape = e.overlay;
        newShape.type = e.type;
        // google.maps.event.addListener(newShape, 'click', function (event) {
        //   setSelection(newShape);
        // });
        google.maps.event.addListener(newShape, 'rightclick', function (event) {
          shapeMenu.show(event.latLng);
          setSelection(newShape);
          searchRadius = newShape.radius;
          searchArray = mapService.setSearchArray(e, newShape.center, newShape.radius);
        });
        setSelection(newShape);
      }
    });
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
      var polygonArray = mapService.getPolygonArray(polygon.getPath());
      searchArray = mapService.setSearchArray(polygon, polygonArray);
      google.maps.event.addListener(polygon, 'rightclick', function (event) {
        var polygonArray = mapService.getPolygonArray(polygon.getPath());
        searchArray = mapService.setSearchArray(polygon, polygonArray);
      });
    });
  }
  // switch
  onChangeRangeSearchType(checked) {
    console.log(`switch to ${checked}`);
    mapStore.setRangeSearchType(checked)
    deleteSelectedShape()
  }

  // radio
  onRadioChangeRangeSearchType = (e) => {
    // console.log('radio checked',e);
    let type = e.target ? e.target.value : e.key ? e.key : e
    mapStore.setRangeSearchType(type)
    deleteSelectedShape()
  }
  // 更新快捷查看的设备
  updateOnMapDevices = (device) => {
    let _onMapDevices = this.state.onMapDevices;
    let _index = -1;
    let _this = this;
    let _paths = _this.state.onMapDevicesPath;
    let _clusters = _this.state.onMapDevicesCluster;
    let _markers = _this.state.onMapDevicesMarkers;
    _onMapDevices.map(function (d, i) {
      if (d.id === device.id) {
        _index = i;
        _onMapDevices.splice(_index, 1)
        // console.log(_markers, _clusters, _paths, _this.state, i)
        mapService.Marker.hideDevicePath(_markers[i], _clusters[i], _paths[i])
      }
    })
    if (_index === -1 && _onMapDevices.length < 5) {
      _onMapDevices.push(device)
      this.drawMarkersByDevice(device)
    } else {
      _paths.splice(_index, 1)
      _clusters.splice(_index, 1)
      _markers.splice(_index, 1)
      this.setState({
        onMapDevices: _onMapDevices,
        onMapDevicesPath: _paths,
        onMapDevicesMarkers: _markers,
        onMapDevicesCluster: _clusters
      })
    }
    // mapStore.updateOnMapDevices(device)
  }
  // 搜索值改变
  onChangeSearch = (e) => {
    const {value} = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // console.log(value)
      this.setState({
        searchInfo: value,
      })
      if (!mapStore.isRangeSearching) {
        axios.get(Api.searchDeviceByMark(value), httpConfig()).then(res => {
          this.setState({
            searchOutDevice: res.data
          })
          // console.log(res.data)
        }).catch(err => {
          MessageHandle(err)
        })
      }
    }
  }

  render() {
    const updateOnMapDevices = this.updateOnMapDevices
    const onChangeSearch = this.onChangeSearch
    let onMapDevices = this.state.onMapDevices
    let searchNote = ''
    if (mapStore.isRangeSearching) {
      searchNote =
        <p className="small">{appStore.language.search_range_result_count(mapStore.rangeSearchOutDevices.devices.length)}</p>
    } else if (this.state.searchInfo) {
      searchNote = <p>{appStore.language.search_result_count(this.state.searchOutDevice.length)}</p>
    }
    const searchInfo = this.state.searchInfo
    const rangeSearchDrawingType = (
      <Menu
        onClick={this.onRadioChangeRangeSearchType}
        defaultSelectedKeys={[mapStore.rangeSearchType]}
      >
        <Menu.ItemGroup>
          {
            mapStore.enableSearchTypes.map(type=>(
              <Menu.Item key={type}>{appStore.language[type]}</Menu.Item>
            ))
          }
          {/*<Menu.Item key="circle">{appStore.language.circle}</Menu.Item>*/}
          {/*<Menu.Item key="polygon">{appStore.language.polygon}</Menu.Item>*/}
        </Menu.ItemGroup>
      </Menu>
    )
    const rangeSearchType = () =>{
      if(mapStore.isRangeSearching){
        return <label className="item-inner" onClick={this.searchRange}>
            <span>{appStore.language.cancel_search_range}&nbsp;-&nbsp;</span>
            <Popover content={rangeSearchDrawingType} placement="bottom">{appStore.language[mapStore.rangeSearchType]}<Icon type="down"></Icon></Popover>
          </label>
      }else{
        return <label className="item-inner" onClick={this.searchRange}>{appStore.language.search_range}</label>
      }
    }
    return (
      <div className="wrap-full">
        <div ref={this.drawBaseMap} id="map"></div>
        <div className="mapAction">
          <div className="action-body">
            <div className="map-item is-act">
              {rangeSearchType()}
            </div>
            <div className="map-item is-act" onClick={this.toggleCluster}>
              <label className="item-inner">{mapStore.showClusterer ? appStore.language.show_markers : appStore.language.show_cluster}</label>
            </div>
            <div className="map-item">
              <label className="item-inner">{appStore.language.device_latest_loc(this.state.devicesLocation.length,this.state.deviceAll.length)}</label>
            </div>
          </div>
        </div>
        <div className="map-search-box">
          <div className="search-header">
            <Input placeholder={appStore.language.search_range_device} onChange={onChangeSearch.bind(this)} value={this.state.searchInfo}/>
          </div>
          <div className="search-body-wrap">
            <div className="result-tips">{searchNote}</div>
            <div className="search-quick-show">
              {
                onMapDevices.map(function (device, index) {
                  return <Button className='item' key={index}
                                 onClick={() => updateOnMapDevices(device)}>{device.mark || device.uuid}</Button>
                })
              }
            </div>
            <div className="search-body">
              <div className="body-list">
                {
                  mapStore.isRangeSearching ?
                    mapStore.rangeSearchOutDevices.devices.map(function (device, index) {
                      // console.log(device.mark,searchInfo)
                      if (JSON.stringify(onMapDevices).indexOf(device.id) === -1 && (device.mark + '').indexOf(searchInfo) > -1) {
                        return <div className="item range-out" key={index} onClick={() => updateOnMapDevices(device)}>
                          <div className="title">{device.mark || '-'}</div>
                          <div className="sub-title">{device.uuid}</div>
                        </div>
                      }
                    }) : this.state.searchOutDevice.map(function (device, index) {
                    if (JSON.stringify(onMapDevices).indexOf(device.id) === -1) {
                      return <div className="item" key={index} onClick={() => updateOnMapDevices(device)}>
                        <div className="title">{device.mark || '-'}</div>
                        <div className="sub-title">{device.uuid}</div>
                      </div>
                    }
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 取消选择形状
 */
function clearSelection() {
  if (selectedShape) {
    selectedShape.setEditable(false);
    selectedShape.setDraggable(false);
  }
}

/**
 * 选中形状
 * @param shape
 */
function setSelection(shape) {
  clearSelection();
  selectedShape = shape;
  shape.setEditable(true);
  shape.setDraggable(true);
  // selectColor(shape.get('fillColor') || shape.get('strokeColor'));
}

/**
 * 删除选中形状
 */
function deleteSelectedShape() {
  if (selectedShape) {
    selectedShape.setMap(null);
    selectedShape = null;
  }
  // To show:
  if (drawingManager) {
    drawingManager.setOptions({
      // drawingControl: true,
      drawingMode: mapStore.rangeSearchType,
    });
  }
  // console.log(mapStore.rangeSearchType)
}
const searchRangeDevice = (data) => {
  axios.post(Api.searchRangeDevice(), data, httpConfig('device_id,timestamp')).then(res => {
    let searchOut = mapService.resolveRangeSearchDevices(res.data)
    mapStore.setRangeSearchOutDevices(searchOut)
    // console.log(searchOut)
  }).catch(err => {
    MessageHandle(err)
  })
}
export default DevicesLocation