/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/9 0009.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig, Filters} from '../../../common'
import {Row, Col, Button, Radio, Input, message} from 'antd'
import '../../../js/transform'
import Drawing from '../drawing'
import appStore from '../../../store/app_store'
import thisStore from './store'


const {unitFilter} = Filters

let drawingManager = null, selectedShape
const google = window.google

@observer
class addGeoFenceInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      geoFenceData: {
        msg_type: 1,
        type: 'Round',
      },
      lastBounds:[],
      drawingOfGeofence: null,
    }
    // console.log(props)
  }

  componentDidMount() {
    let _this = this;
    // thisStore.map.setZoom(13);
    this.getUserlocation()
    drawingManager = Drawing.init(thisStore.map)
    // 绘制完成监听
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
      if (e.type !== google.maps.drawing.OverlayType.MARKER) {
        // drawingManager.setDrawingMode(null);
        disableDrawing(drawingManager)
        var newShape = e.overlay;
        newShape.type = e.type;
        setSelection(newShape);
        if (e.type === google.maps.drawing.OverlayType.CIRCLE) {//圆形
          //首次绘制验证大小
          if(newShape.radius>10000){
            newShape.radius=10000;
            // newShape.setBounds(newShape.bounds);
          }
          _this.updateFenceData(newShape, 'circle');
          // 修改半径
          google.maps.event.addListener(newShape, 'radius_changed', function (event) {
            //限制大小
            if(newShape.radius>10000){
              newShape.radius=10000;
              // newShape.setBounds(newShape.bounds);
            }
            _this.updateFenceData(newShape, 'circle');
          });
          // 修改圆心
          google.maps.event.addListener(newShape, 'center_changed', function (event) {
            _this.updateFenceData(newShape, 'circle');
          });
        } else if (e.type === google.maps.drawing.OverlayType.RECTANGLE) {//矩形
          //首次绘制验证大小
          let bounds = [newShape.bounds.f.f,newShape.bounds.f.b,newShape.bounds.b.f,newShape.bounds.b.b]
          let north = parseFloat(newShape.bounds.f.f.toFixed(7));
          let south = parseFloat(newShape.bounds.f.b.toFixed(7));
          let east = parseFloat(newShape.bounds.b.f.toFixed(7));
          let west = parseFloat(newShape.bounds.b.b.toFixed(7));
          if(
            Drawing.getRectangleAcreage(north,south,west,east)> thisStore.maxGeofenceArea
          ){
            if(this.state.lastBounds[0]){
              newShape.bounds.f.f=this.state.lastBounds[0];
              newShape.bounds.f.b=this.state.lastBounds[1];
              newShape.bounds.b.f=this.state.lastBounds[2];
              newShape.bounds.b.b=this.state.lastBounds[3];
              newShape.setBounds(newShape.bounds);
            }else{
              deleteSelectedShape();
            }

          }else{
            this.setState({lastBounds:bounds})
          }
          //修改验证大小
          _this.updateFenceData(newShape, 'rectangle');
          google.maps.event.addListener(newShape, 'bounds_changed', function (event) {
            let bounds = [newShape.bounds.f.f,newShape.bounds.f.b,newShape.bounds.b.f,newShape.bounds.b.b]
            let north = parseFloat(newShape.bounds.f.f.toFixed(7));
            let south = parseFloat(newShape.bounds.f.b.toFixed(7));
            let east = parseFloat(newShape.bounds.b.f.toFixed(7));
            let west = parseFloat(newShape.bounds.b.b.toFixed(7));
            if(
              Drawing.getRectangleAcreage(north,south,west,east)> thisStore.maxGeofenceArea
            ){
              if(this.state.lastBounds[0]){
                newShape.bounds.f.f=this.state.lastBounds[0];
                newShape.bounds.f.b=this.state.lastBounds[1];
                newShape.bounds.b.f=this.state.lastBounds[2];
                newShape.bounds.b.b=this.state.lastBounds[3];
                newShape.setBounds(newShape.bounds);
              }else{
                deleteSelectedShape();
              }

            }else{
              this.setState({lastBounds:bounds})
            }
            _this.updateFenceData(newShape, 'rectangle');
          }.bind(this));
        }
      }
    }.bind(this));
  }

  getUserlocation = () => {
    thisStore.map.setZoom(13);
    let map = thisStore.map
    let chengdu = {
      lat: 30.5,
      lng: 140
    };
    let beijing = {
      lat: 39.9,
      lng: 116.3
    };
    // if (navigator.geolocation) {
    //   console.log('position')
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     var pos = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude
    //     };
    //     map.setCenter(pos);
    //   }, function () {
    //     map.setCenter(chengdu);
    //   });
    // } else {
    //   // Browser doesn't support Geolocation
    //   map.setCenter(chengdu);
    // }
    map.setCenter(beijing);
    thisStore.set('map',map)
  }

/**
 * 创建或编辑绘制图形后，更新显示数据
 * @param shape
 * @param type
 */
updateFenceData = (shape, type) => {
  let _pathData, _geofence
  let fenceData = this.state.geoFenceData
  if (type === 'circle') {
    _pathData = Drawing.formatFenceCircle(shape);
    _geofence = Object.assign(fenceData, {
      point: _pathData.requestPath,
      distance: _pathData.radius,
      acreage: _pathData.acreage,
      type: 'Round'
    })
  } else if (type === 'rectangle') {
    _pathData = Drawing.formatFenceRectangle(shape);
    _geofence = Object.assign(fenceData, {
      polygon: {points: _pathData.requestPath},
      acreage: _pathData.acreage,
      type: 'Polygon'
    })
  }
  if (_pathData.acreage > thisStore.maxGeofenceArea) {
    message.error(appStore.language.fence_acreage_exceed)
  }
  this.setState({
    geoFenceData: _geofence
  })
}

// 切换围栏类型
onRadioChangeGeofenceType = (e) => {
  thisStore.setAddGeofenceType(e.target.value)
  let _geofence = Object.assign(this.state.geoFenceData, {type: e.target.value, acreage: 0})
  this.setState({
    geoFenceData: _geofence
  })
  deleteSelectedShape();
}
onChangeMsgType = (e) => {
  // console.log(e.target.value)
  let _geofence = Object.assign(this.state.geoFenceData, {msg_type: e.target.value})
  this.setState({
    geoFenceData: _geofence
  })
}
onChangeGeoFenceName = (e) => {
  let {value} = e.target
  let _geofence = Object.assign(this.state.geoFenceData, {area_name: value})
  this.setState({
    geoFenceData: _geofence
  })
}
pageBack = () => {
  // console.log('page back')
  window.history.go(-1)
}
saveFence = () => {
  thisStore.set('loading', true)
  let geofence = this.state.geoFenceData
  let type = geofence.type && geofence.type.toLowerCase()
  let data = {};
  if (!geofence.area_name) {
    message.error(appStore.language.please_enter_fence_name)
  } else if (!selectedShape) {
    message.error(appStore.language.please_draw_fence_range)
  } else if (geofence.acreage > thisStore.maxGeofenceArea) {
    message.error(appStore.language.fence_acreage_exceed)
  } else {
    if (type === 'round') {
      data.distance = geofence.distance;
      data.point = geofence.point
    } else if (type === 'polygon') {
      data.polygon = geofence.polygon
    }
    Object.assign(data, {
      type: geofence.type,
      area_name: geofence.area_name,
      msg_type: geofence.msg_type
    })
    axios.post(Api.geofence(), data, httpConfig('-updated_at')).then(res => {
      message.success(appStore.language.fence_created(geofence.area_name));
      thisStore.set('loading', false)
      this.props.history.push('/geofence')
    }).catch(err => {
      MessageHandle(err)
      // thisStore.set('loading',false)
    })
  }
  thisStore.set('loading', false)
}


render()
{
  const pageBack = this.pageBack
  const saveFence = this.saveFence
  const fenceInfo = this.state.geoFenceData || {}
  const circle = (fence) => {
    let _center = fence.point ? fence.point : {};
    let _radius = fence.distance || 0;
    return <Row>
      <Row className='item'>
        <Col span={8} className='item-lead'>{appStore.language.center}：</Col>
        <Col span={16} className='item-body'>
          <div>Lat: {unitFilter(_center.lat, 'latitude')}</div>
          <div>Lng: {unitFilter(_center.lng, 'longitude')}</div>
        </Col>
      </Row>
      <Row className='item'>
        <Col span={8} className='item-lead'>{appStore.language.radius}：</Col>
        <Col span={16} className='item-body'> {unitFilter(_radius, 'distance')}</Col>
      </Row>
    </Row>
  }
  const polygon = (fence) => {
    let _path = fence.polygon.points || {};
    return <Row>
      <Row className='item'>
        <Col span={8} className='item-lead'>{appStore.language.left_top}：</Col>
        <Col span={16} className='item-body'>
          <div>Lat: {unitFilter(_path[0].lat, 'latitude')}</div>
          <div>Lng: {unitFilter(_path[0].lng, 'longitude')}</div>
        </Col>
      </Row>
      <Row className='item'>
        <Col span={8} className='item-lead'>{appStore.language.right_bottom}：</Col>
        <Col span={16} className='item-body'>
          <div>Lat: {unitFilter(_path[3].lat, 'latitude')}</div>
          <div>Lng: {unitFilter(_path[3].lng, 'longitude')}</div>
        </Col>
      </Row>
    </Row>
  }
  const drawingInfo = (fence) => {
    let type = fence.type || ''
    if (type.toLowerCase() === 'round') {
      return circle(fence)
    } else if (type.toLowerCase() === 'polygon') {
      return polygon(fence)
    }
  }
  return (
    <div className="geofence-menu has-header has-footer">
      <header className="fence-head"><span className="title-style">{appStore.language.create_fence}</span></header>
      <div className="fence-body">
        <Row className='item'>
          <Radio.Group defaultValue="circle" size="small" onChange={this.onRadioChangeGeofenceType}>
            <Radio value="circle">{appStore.language.circle}</Radio>
            <Radio value="rectangle">{appStore.language.rectangle}</Radio>
          </Radio.Group>
        </Row>

        <Row className='item'>
          <Col span={8} className='item-lead'>{appStore.language.fence_name}：</Col>
          <Col span={16} className='item-body'>
            <Input.TextArea placeholder={appStore.language.please_enter_fence_name} autosize={{minRows: 2, maxRows: 4}}
                            onChange={this.onChangeGeoFenceName} value={fenceInfo.area_name}/>
          </Col>
        </Row>
        {
          selectedShape ? drawingInfo(fenceInfo) : ''
        }
        {
          selectedShape ? <Row className='item'>
            <Col span={8} className='item-lead'>{appStore.language.acreage} ≈ </Col>
            <Col span={16} className='item-body'> {unitFilter(fenceInfo.acreage, 'acreage')}</Col>
            <Col span={24}
                 className={`small text-center ${(fenceInfo.acreage > thisStore.maxGeofenceArea) ? 'danger' : 'grey'}`}>{appStore.language.fence_max_acreage(unitFilter(thisStore.maxGeofenceArea, 'acreage'))}</Col>
          </Row> : ''
        }
        <Row>
          <Col span={10} className='item-lead'>{appStore.language.notification_type}：</Col>
          <Col span={14} className='item-body'>
            <Radio.Group onChange={this.onChangeMsgType} value={fenceInfo.msg_type}>
              <Radio value={1}>{appStore.language.getFenceNotificationType(1)}</Radio>
              <Radio value={2}>{appStore.language.getFenceNotificationType(2)}</Radio>
            </Radio.Group>
          </Col>
        </Row>
        {/*<Row>*/}
        {/*<Col span={8} className='item-lead'>设备：</Col>*/}
        {/*<Col span={16}> {fenceInfo.device_id && fenceInfo.device_id.length || 0}</Col>*/}
        {/*</Row>*/}
      </div>
      <div className="fence-foot">
        <Button.Group>
          <Button onClick={pageBack}>{appStore.language.pageback}</Button>
          <Button loading={thisStore.loading} onClick={saveFence}>{appStore.language.save}</Button>
        </Button.Group>
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
  selectedShape.setEditable(true);
  selectedShape.setDraggable(true);
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
    drawingManager.setDrawingMode(thisStore.addGeofenceType);
  }
}

function disableDrawing(_drawingManager) {
  _drawingManager.setDrawingMode(null);
}

export default addGeoFenceInfo