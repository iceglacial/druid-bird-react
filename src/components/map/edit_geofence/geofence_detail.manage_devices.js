/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/9 0009.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common'
import thisStore from './store'
import {Card,Spin} from 'antd'
import '../../../js/transform'
import Marker from '../marker'
import mapService from '../map.service'
import appStore from '../../../store/app_store'
import LoadingImg from '../../../common/loadingImg'

@observer
class geoFenceDetailManageDevices extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceAll: []
    }
    this.getDeviceAll()
  }

  getDeviceAll = () => {
    thisStore.set('loading',true)
    axios.get(Api.device(), httpConfig()).then(res => {
      // console.log('all devices:',res.data)
      this.setState({
        deviceAll: res.data,
      })
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }
  //添加设备到围栏
  addToGeofence = (device) => {
    // console.log(device)
    thisStore.set('loading',true)
    let data = {
      id: [device.id]
    }
    axios.put(Api.geofenceAddDevice(this.props.fenceID), data, httpConfig()).then(res => {
      // console.log('succcess');
      let devicesDrawing = thisStore.onEditGeofenceDevices
      let devices = devicesDrawing.data.concat([device])

      Marker.clearMapDrawing(devicesDrawing.drawing)
      let mapData = Marker.drawOnMap(thisStore.map,devices,thisStore.showCluster,'location')
      thisStore.setOnEditGeofenceDevices({
        data: devices,
        drawing: mapData,
      })
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }

  drawMarkers(map, locations, data) {
    // markers = this.addSingleMarker(this.state.devicesLocation, map)
    const params = {
      type: 'location',
      bySearch: false,
    }
    let markerInfo = {
      locations,
      data,
      map,
      params
    }
    let markers = thisStore.onEditGeofenceDevices.markers
    if (Marker.showMarkers(markerInfo)[0]) {
      markers.push(Marker.showMarkers(markerInfo)[0])
      thisStore.setOnEditGeofenceDevices(Object.assign(thisStore.onEditGeofenceDevices, {
        markers: markers,
      }))
    }
  }

  removeDevice = (device, index) => {
    // console.log(device, index)
    thisStore.set('loading',true)
    let data = {
      id: [device.id]
    }
    axios.put(Api.geofenceRemoveDevice(thisStore.onEditGeofence.id), data, httpConfig()).then(res => {
      let devicesDrawing = thisStore.onEditGeofenceDevices;
      let existIndex = -1
      let devices = devicesDrawing.data
      devices.map(function (_device, i) {
        if (_device.id === device.id) {
          devices.splice(existIndex, 1)
        }
      })
      Marker.clearMapDrawing(devicesDrawing.drawing)
      let mapData = Marker.drawOnMap(thisStore.map,devices,thisStore.showCluster,'location')
      thisStore.setOnEditGeofenceDevices({
        data: devices,
        drawing: mapData
      })
      thisStore.set('loading',false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading',false)
    })
  }

  render() {
    const addToGeofence = this.addToGeofence
    const removeDevice = this.removeDevice
    let geofenceDeviceList = thisStore.onEditGeofenceDevices.data || [] //已添加到围栏中的设备
    let deviceAll = this.state.deviceAll //所有设备
    return (
      <div className="fence-body">
        <Spin spinning={thisStore.loading} indicator={LoadingImg}>
        <div className="item-box">
          <div className="sub-title">{appStore.language.selected}({geofenceDeviceList.length})：</div>
          {
            geofenceDeviceList.map(function (device, index) {
              return <Card onClick={() => removeDevice(device, index)}
                           className={`${!device.last_valid_gps ? 'danger' : ''} simple-card`}
                           key={`deviceall${device.id}`}>
                {device.mark || device.uuid}
              </Card>
            })
          }
        </div>
        <div className="item-box">
          <div className="sub-title">{appStore.language.unselected}({deviceAll.filter(device=>JSON.stringify(geofenceDeviceList).indexOf(device.id) < 0).length})：</div>
          {
            deviceAll.filter(device=>JSON.stringify(geofenceDeviceList).indexOf(device.id) < 0).map(function (device) {
                return <Card key={`adddevice${device.id}`}
                             className={`simple-card`}
                             onClick={() => addToGeofence(device)}>{device.mark || device.uuid}</Card>
            })
          }
        </div>
        </Spin>
      </div>
    )
  }
}
export default geoFenceDetailManageDevices