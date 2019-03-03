/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/9 0009.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig, Filters} from '../../../common'
import {Row, Col, Button, Radio, Input, Card, message, Modal, Icon} from 'antd'
import '../../../js/transform'
// import mapService from '../map.service'
import Drawing from '../drawing'
import Marker from '../marker'
import ManageGeofenceDevice from './geofence_detail.manage_devices'
import appStore from '../../../store/app_store'
import thisStore from './store'

const {unitFilter} = Filters

const google = window.google

let geofenceDrawing;
@observer
class geoFenceDetailInfo extends React.Component {
  constructor(props) {
    super(props)
    // map = thisStore.map
    geofenceDrawing = thisStore.onEditGeofenceDrawing
    this.state = {
      fenceID: props.match.params.id,
      geoFence: {},
      drawingOfGeofence: thisStore.onEditGeofenceDrawing,
      geofenceDevices: [],
      devicesLocation: [],
      devicesInfo: [],
      deviceAll: [],
      showClusterer: true,
      onEdit: false
    }
  }

  componentDidMount() {
    // map = thisStore.map
    this.getThisGeofence()
    this.drawGeofencDevices()
    // geofenceDrawing = thisStore.onEditGeofenceDrawing
  }
//绘制围栏
  getThisGeofence = () => {
    axios.get(Api.geofence(this.state.fenceID), httpConfig('-updated_at')).then(res => {
      var fence = res.data;
      fence.acreage = Drawing.getShapeAcreage(fence);
      thisStore.setOnEditGeofence(fence);
      var type = fence.type;
      // console.log(map.center.toString(),"map center");
      var tmpDrawing, mapBounds;
      if (type) {
        tmpDrawing = Drawing.drawGeofence(fence,thisStore.map)
        type = type.toLowerCase();
        if (type === "polygon") {
          // var bounds = fence.polygon.points;
          // tmpDrawing = Drawing.drawRectangle(bounds, thisStore.map);
          google.maps.event.addListener(tmpDrawing, 'bounds_changed', function (event) {
            var fencePath = Drawing.formatFenceDrawing(tmpDrawing,'rectangle');
            // console.log('rectangle',fencePath)
            if(fencePath) {
              thisStore.setOnEditGeofence(Object.assign(thisStore.onEditGeofence, {
                polygon: {points: fencePath.requestPath},
                acreage: fencePath.acreage
              }))
            }
            // console.log(fencePath)
          });
        } else if (type === "round") {
          // var circle = fence;
          // tmpDrawing = Drawing.drawCircle(circle, thisStore.map);
          // 修改半径
          google.maps.event.addListener(tmpDrawing, 'radius_changed', function (event) {
            // console.log(selectedShape,"radius_changed");
            // console.log('radius_changed')
            var fencePath = Drawing.formatFenceDrawing(tmpDrawing,'circle');
            if(fencePath) {
              // console.log('radius',fencePath)
              thisStore.setOnEditGeofence(Object.assign(thisStore.onEditGeofence, {
                point: fencePath.center,
                distance: fencePath.radius,
                acreage: fencePath.acreage
              }))
            }
          });

          // 修改圆心
          google.maps.event.addListener(tmpDrawing, 'center_changed', function (event) {
            // console.log(event,tmpDrawing,'center_changed');//selectedShape.getCenter()
            var fencePath = Drawing.formatFenceDrawing(tmpDrawing,'circle');
            if(fencePath){
              // console.log('center',fencePath)
              thisStore.setOnEditGeofence(Object.assign(thisStore.onEditGeofence, {
                point: fencePath.center,
                distance: fencePath.radius,
                acreage: fencePath.acreage
              }))
            }
          });
        }
      }
      mapBounds = tmpDrawing.getBounds();
      // // (i !== 0) && mapBounds.extend(map.center);
      thisStore.setBounds(mapBounds)

      thisStore.setOnEditGeofence(fence)
      thisStore.setOnEditGeofenceDrawing(tmpDrawing)
      this.setState({
        geoFence: fence,
        drawingOfGeofence: tmpDrawing
      })
    }).catch(err => {
      MessageHandle(err)
    })
  }
  //绘制围栏内设备
  drawGeofencDevices = () => {
    axios.get(Api.deviceOfGeofence(this.state.fenceID), httpConfig('-updated_at')).then(res => {
      // console.log('geofence devices:',res.data)
      let mapData = Marker.drawOnMap(thisStore.map, res.data, thisStore.showCluster, 'location')
      // let mapData = mapService.formatDataDevicesLocation(res.data)
      this.setState({
        geofenceDevices: res.data,
        devicesLocation: mapData.locations,
        devicesInfo: mapData.data,
        markers: []
      })
      thisStore.setOnEditGeofenceDevices({
        data: res.data,
        drawing: mapData,
      })
    }).catch(err => {
      MessageHandle(err)
    })
  }

  editFence = () => {
    let tmpDrawing = thisStore.onEditGeofenceDrawing
    if (tmpDrawing) {
      let onEdit = !this.state.onEdit
      tmpDrawing.setEditable(onEdit)
      tmpDrawing.setDraggable(onEdit)
      thisStore.setOnEditGeofenceDrawing(tmpDrawing)
      this.setState({
        onEdit,
        drawingOfGeofence: tmpDrawing
      })
      if (!onEdit) {
        tmpDrawing.setMap(null)
        this.getThisGeofence() //重新绘制围栏
      }
    }
  }
  deleteFence = () => {
    let fence = thisStore.onEditGeofence
    let _this = this;
    Modal.confirm({
      title: appStore.language.delete_confirm,
      content: appStore.language.delete_fence_confirm(fence.area_name),
      okType: 'danger',
      iconType: 'geofence danger',
      okText: appStore.language.confirm,
      cancelText: appStore.language.cancel,
      onOk() {
        axios.delete(Api.geofence(fence.id), httpConfig('-updated_at')).then(res => {
          message.success(appStore.language.delete_fence_success(fence.area_name));
          _this.pageBack()
        }).catch(err => {
          MessageHandle(err)
        })
      },
      onCancel() {
        console.log(`取消删除围栏${fence.area_name}!`);
      },
    })
  }
  onChangeMsgType = (e) => {
    // console.log(e.target.value)
    let _geofence = Object.assign(thisStore.onEditGeofence, {msg_type: e.target.value})
    thisStore.setOnEditGeofence(_geofence);
  }
  onChangeGeoFenceName = (e) => {
    let _geofence = Object.assign(thisStore.onEditGeofence, {area_name: e.target.value})
    thisStore.setOnEditGeofence(_geofence);
  }
  pageBack = () => {
    window.history.go(-1)
  }
  saveFence = () => {
    // console.log('saveFence', thisStore.onEditGeofence)
    let geofence = thisStore.onEditGeofence
    let type = geofence.type.toLowerCase()
    let data = {
      type: geofence.type,
      area_name: geofence.area_name,
      msg_type: geofence.msg_type
    }
    if (type === 'round') {
      data.distance = geofence.distance;
      data.point = geofence.point
    } else if (type === 'polygon') {
      data.polygon = geofence.polygon
    }
    let _this = this;
    axios.put(Api.geofence(thisStore.onEditGeofence.id), data, httpConfig('-updated_at')).then(res => {
      message.success(appStore.language.edit_fence_success(thisStore.onEditGeofence.area_name));
      _this.props.history.push('/geofence')
    }).catch(err => {
      MessageHandle(err)
    })
  }
  editGeofenceDevices = () => {
    // this.props.history.push(`/geofence/id/${this.state.geoFence.id}/devices`)
    let onManage = !thisStore.onManageDevice;
    thisStore.setOnManageDevice(onManage)
    if (!this.state.deviceAll) {
      this.getDeviceAll()
    }
  }
  cancelEditGeofenceDevices = () => {
    // this.props.history.push(`/geofence/id/${this.state.geoFence.id}/devices`)
    let onManage = !thisStore.onManageDevice;
    thisStore.setOnManageDevice(onManage)
  }
  getDeviceAll = () => {
    axios.get(Api.device(), httpConfig('-updated_at')).then(res => {
      this.setState({
        deviceAll: res.data,
      })
    }).catch(err => {
      MessageHandle(err)
    })
  }
  viewMarker = (device, index) => {
    let gps = device.last_valid_gps
    if (gps) {
      thisStore.setMapCenter(gps.latitude, gps.longitude)
      // map.setCenter(new google.maps.LatLng(gps.latitude, gps.longitude));
      // for(let marker of thisStore.onEditGeofenceDevices.markers){
      //   if (marker.getAnimation() !== null) {
      //     marker.setAnimation(null);
      //   }
      // }
      // let curMarker = thisStore.onEditGeofenceDevices.markers[index]
      // curMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
  removeDevice = (device, index) => {
    // console.log(device, index)
    let data = {
      id: [device.id]
    }
    axios.put(Api.geofenceRemoveDevice(thisStore.onEditGeofence.id), data, httpConfig('-updated_at')).then(res => {
      let devicesDrawing = thisStore.onEditGeofenceDevices;
      let devices = devicesDrawing.data
      devices.map(function (_device, i) {
        if (_device.id === device.id) {
          devices.splice(i, 1)
        }
      })

      Marker.clearMapDrawing(devicesDrawing.drawing)
      let mapData = Marker.drawOnMap(thisStore.map,devices,thisStore.showCluster,'location')
      thisStore.setOnEditGeofenceDevices({
        data: devices,
        drawing: mapData
      })
    }).catch(err => {
      MessageHandle(err)
    })
  }

  render() {
    const editFence = this.editFence
    const deleteFence = this.deleteFence
    const pageBack = this.pageBack
    const saveFence = this.saveFence
    const viewMarker = this.viewMarker
    const removeDevice = this.removeDevice
    const editGeofenceDevices = this.editGeofenceDevices
    const cancelEditGeofenceDevices = this.cancelEditGeofenceDevices
    const fenceInfo = thisStore.onEditGeofence || {}
    /**
     * 圆形围栏详细信息
     * @param fence
     * @returns {XML}
     */
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
    /**
     * 矩形围栏详细信息
     * @param fence
     * @returns {XML}
     */
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
    /**
     * 根据围栏类型返回相应类型围栏信息
     * @param fence
     * @returns {XML}
     */
    const drawingInfo = (fence) => {
      let type = fence.type || ''
      if (type.toLowerCase() === 'round') {
        return circle(fence)
      } else if (type.toLowerCase() === 'polygon') {
        return polygon(fence)
      }
    }
    if (thisStore.onManageDevice) {
      return <div className="geofence-menu has-header has-footer">
        <header className="fence-head">
          <span className="title-style">{appStore.language.device_manage}</span>
        </header>
        <ManageGeofenceDevice fenceID={this.state.fenceID}/>
        <div className="fence-foot">
          <Button.Group>
            <Button onClick={cancelEditGeofenceDevices}>{appStore.language.pageback}</Button>
            <Button onClick={saveFence}>{appStore.language.save}</Button>
          </Button.Group>
        </div>
      </div>
    } else {
      return (
        <div className="geofence-menu has-header has-footer">
          <header className="fence-head">
            <span className="title-style">{appStore.language.fence_detail}</span>
            <Button
              onClick={editFence}>{this.state.onEdit ? `${appStore.language.cancel}` : `${appStore.language.edit}`}</Button>
            <Button className='btn-danger' onClick={deleteFence}>{appStore.language.delete}</Button>
          </header>
          <div className="fence-body">
            <Row className='item'>
              <Col span={8} className='item-lead'>{appStore.language.fence_name}：</Col>
              <Col span={16} className='item-body has-input'>
                <Input.TextArea placeholder={appStore.language.please_enter_fence_name} disabled={!this.state.onEdit}
                                autosize={{minRows: 2, maxRows: 4}}
                                onChange={this.onChangeGeoFenceName} value={fenceInfo.area_name}/>
              </Col>
            </Row>
            {
              drawingInfo(fenceInfo)
            }
            <Row className='item'>
              <Col span={8} className='item-lead'>{appStore.language.acreage} ≈ </Col>
              <Col span={16} className='item-body'> {unitFilter(fenceInfo.acreage, 'acreage')}</Col>
            </Row>
            <Row className='item'>
              <Col span={10} className='item-lead'>{appStore.language.notification_type}：</Col>
              <Col span={14} className='item-body'>
                <Radio.Group onChange={this.onChangeMsgType} value={fenceInfo.msg_type} disabled={!this.state.onEdit}>
                  <Radio value={1}>{appStore.language.getFenceNotificationType(1)}</Radio>
                  <Radio value={2}>{appStore.language.getFenceNotificationType(2)}</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row className='item'>
              <Col className=''>
                <div className="sub-title">{appStore.language.device}： {thisStore.onEditGeofenceDevices.data && thisStore.onEditGeofenceDevices.data.length || 0}</div>
                <div>
                  {
                    thisStore.onEditGeofenceDevices.data.map(function (device, index) {
                      return <Card onClick={() => viewMarker(device, index)}
                                   className={`${!device.last_valid_gps ? 'danger' : ''} simple-card`}
                                   key={`deviceall${device.id}`}>
                        {device.mark || device.uuid}
                        <div className="hover_delete">
                          <Button onClick={() => removeDevice(device, index)}><Icon type="delete"/></Button>
                        </div>
                      </Card>
                    })
                  }
                </div>
              </Col>
              <Col className="text-center">
                <Button className='active' type='block' onClick={editGeofenceDevices}>{appStore.language.device_manage}</Button>
              </Col>
            </Row>
          </div>
          <div className='fence-foot'>
            <Button.Group>
              <Button onClick={pageBack}>{appStore.language.pageback}</Button>
              <Button onClick={saveFence}>{appStore.language.save}</Button>
            </Button.Group>
          </div>
        </div>
      )
    }
  }
}
export default geoFenceDetailInfo