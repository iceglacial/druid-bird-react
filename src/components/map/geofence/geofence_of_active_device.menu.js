/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/9 0009.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, Filters, MessageHandle, httpConfig} from '../../../common'
import thisStore from './store'
import {Row, Col, Button, Card, Modal, message, Spin} from 'antd'
import '../../../js/transform'
import appStore from '../../../store/app_store'
import LoadingImg from '../../../common/loadingImg'

let map = null;
let geoFences = {}
const google = window.google
const {unitFilter} = Filters
@observer
class geoFence extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeGeofence: {}
    }
  }

  // 选中围栏-高亮效果
  highLightFence = (fence) => {
    thisStore.set('loading',true)
    this.setState({
      activeGeofence: fence
    })
    var _fence = thisStore.drawingOfActiveDevice[fence.id];
    var bounds = _fence.getBounds();
    thisStore.setBounds(bounds)
    var colors = thisStore.colors;
    let geofencesValue = Object.values(thisStore.drawingOfActiveDevice)
    for (let i = 0; i < geofencesValue.length; i++) {
      geofencesValue[i].setOptions({strokeColor: colors.default, fillColor: colors.default, strokeWeight: 2});
    }
    _fence.setOptions({strokeColor: colors.highLight, fillColor: colors.highLight, strokeWeight: 3});
    setTimeout(thisStore.set('loading',false),0)
    // marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);//polygon no setZIndex function
  }

  removeGeofence(fence) {
    // this.stopPropagation();
    // console.log('removeGeofence', fence)
    thisStore.set('loading',true)
    let device = thisStore.activeDevice
    let data = {
      id: [device.id]
    }
    // console.log(thisStore.drawingOfActiveDevice)
    Modal.confirm({
      title: appStore.language.delete_confirm,
      content: appStore.language.remove_fence_confirm(fence.area_name),
      okType: 'danger',
      iconType: 'geofence danger',
      okText: appStore.language.confirm,
      cancelText: appStore.language.cancel,
      onOk() {
        axios.put(Api.geofenceRemoveDevice(fence.id), data, httpConfig()).then(res => {
          let fences = thisStore.geofencesOfActiveDevice;
          fences.map(function (_fence, i) {
            if (_fence.id === fence.id) {
              fences.splice(i, 1)
            }
          })
          let fencesOnMap = thisStore.drawingOfActiveDevice;
          fencesOnMap[fence.id].setMap(null);
          // thisStore.setDrawingOfActiveDevice(fencesOnMap)
          message.success(appStore.language.remove_fence_success(fence.area_name))
          thisStore.set('loading',false)
        }).catch(err => {
          MessageHandle(err)
          thisStore.set('loading',false)
        })
      },
      onCancel() {
        // console.log(`取消删除围栏${fence.area_name}!`);
      },
    })
  }

  geofenceDetail = (fence) => {
    // console.log('geofenceDetail', fence)
    this.props.history.replace(`/geofence/id/${fence.id}`)
  }

  render() {
    const fences = thisStore.geofencesOfActiveDevice
    const highLightFence = this.highLightFence
    const removeGeofence = this.removeGeofence
    const geofenceDetail = this.geofenceDetail
    const geofenceLength = fences ? fences.length : 0
    const activeGeofence = this.state.activeGeofence
    const circle = (fence) => (
      <div>
        <div className="title">{appStore.language.center}：</div>
        <div>
          <div>Lat:{unitFilter(fence.point.lat || 0, 'latitude')}</div>
          <div>Lng:{unitFilter(fence.point.lng || 0, 'longitude')}</div>
        </div>
        <div className="title">{appStore.language.radius}：</div>
        <div><div>{unitFilter(fence.distance || 0, 'distance')}</div></div>
      </div>
    )
    const polygon = (fence) => {
      return <div>
        <div className="title">{appStore.language.left_top}：</div>
        <div>
          <div>Lat:{unitFilter(fence.polygon.points[0].lat || 0, 'latitude')}</div>
          <div>Lng:{unitFilter(fence.polygon.points[0].lng || 0, 'longitude')}</div>
        </div>
        <div className="title">{appStore.language.right_bottom}：</div>
        <div>
          <div>Lat:{unitFilter(fence.polygon.points[3].lat || 0, 'latitude')}</div>
          <div>Lng:{unitFilter(fence.polygon.points[3].lng || 0, 'longitude')}</div>
        </div>
      </div>
    }
    // console.log(thisStore.activeDevice,thisStore.geofencesOfActiveDevice)
    return (
      <Spin spinning={thisStore.loading} indicator={LoadingImg}>
        <div className="geofence-menu has-header flex-box">
          <header className="fence-head">
            <span className="title-style">{appStore.language.fence_list(geofenceLength)}</span>
          </header>
          <div className="fence-body flex-full">
            {
              thisStore.geofencesOfActiveDevice.map(function (fence, index) {
                return <Card className={`card-fence-detail ${activeGeofence.id === fence.id ? 'active' : ''}`}
                             key={fence.id} title={fence.area_name} onClick={() => highLightFence(fence)}>
                  <div className="card-inner">
                    <Row className=''>
                      <Col span={10} className='item-lead'>{appStore.language[fence.type.toLowerCase()]}：</Col>
                      <Col span={14} className='item-body' style={{textAlign:'left'}}>
                        {
                          (fence.type.toLowerCase() === 'round') ? circle(fence) : ''
                        }
                        {
                          (fence.type.toLowerCase() === 'polygon') ? polygon(fence) : ''
                        }
                      </Col>
                    </Row>
                    <Row className=''>
                      <Col span={10} className='item-lead'>{appStore.language.acreage}&nbsp;≈&nbsp;</Col>
                      <Col span={14} className='item-body'  style={{textAlign:'left'}}> {unitFilter(fence.acreage || 0, 'acreage')}</Col>
                    </Row>
                    <Row className=''>
                      <Col span={10} className='item-lead'>{appStore.language.device}：</Col>
                      <Col span={14} className='item-body'  style={{textAlign:'left'}}>{fence.device_id ? fence.device_id.length : 0}</Col>
                    </Row>
                    <Row className=''>
                      <Col span={10} className='item-lead'>{appStore.language.notification_type}：</Col>
                      <Col span={14}
                           className='item-body'  style={{textAlign:'left'}}>{appStore.language.getFenceNotificationType(fence.msg_type || 0)}</Col>
                    </Row>
                  </div>
                  <div className="card-footer">
                    <Button.Group>
                      <Button onClick={() => removeGeofence(fence)}>{appStore.language.remove}</Button>
                      <Button onClick={() => geofenceDetail(fence)}>{appStore.language.view}</Button>
                    </Button.Group>
                  </div>
                </Card>
              })
            }
          </div>
        </div>
      </Spin>
    )
  }
}
export default geoFence