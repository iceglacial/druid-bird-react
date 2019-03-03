/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import React from 'react'
import {observer} from 'mobx-react'
// import mapStore from '../store'
import '../../../js/transform'
import thisStore from './store'
import GeofenceDeviceMenu from './devices.menu'
import GeofenceOfActiveDeviceMenu from './geofence_of_active_device.menu'

let map;
const google = window.google
@observer
class geoFence extends React.Component {
  state = {}

  drawBaseMap(mapDiv) {
    thisStore.initMap(mapDiv)
    // if (mapDiv) {
    //   map = new google.maps.Map(
    //     mapDiv,
    //     mapStore.mapConfig
    //   )
    //   geofenceStore.setGeofenceOfDevicesMap(map)
    // }
  }

  render() {
    const activeDevice = thisStore.activeDevice
    return (
      <div className="wrap-full flex-row">
        <GeofenceDeviceMenu/>
        <div ref={this.drawBaseMap} id="map"></div>
        {
          // && geofenceStore.geofencesOfActiveDevice.length
          activeDevice ?
            <GeofenceOfActiveDeviceMenu history={this.props.history}/> : ''
        }
      </div>
    )
  }
}
export default geoFence