/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import React from 'react'
import {observer} from 'mobx-react'
import mapStore from '../store'
import '../../../js/transform'
import thisStore from './store'
import GeofenceMenu from './geofence.menu'

let map;
const google = window.google
@observer
class geoFence extends React.Component {
  drawBaseMap(mapDiv) {
    thisStore.initMap(mapDiv)
    // if (mapDiv) {
    //   map = new google.maps.Map(
    //     mapDiv,
    //     mapStore.mapConfig
    //   )
    //   thisStore.setGeofenceMap(map)
    // }
  }

  render() {
    return (
      <div className="wrap-full flex-row">
        <div ref={this.drawBaseMap} id="map"></div>
        <GeofenceMenu />
      </div>
    )
  }
}
export default geoFence