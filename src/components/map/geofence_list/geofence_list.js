/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import React from 'react'
import {observer} from 'mobx-react'
// import mapStore from '../store'
import thisStore from './store'
import GeofenceListMenu from './geofence_list.menu'


@observer
class geoFence extends React.Component {
  drawBaseMap(mapDiv) {
    thisStore.initMap(mapDiv)
  }

  render() {
    return (
      <div className="wrap-full flex-row">
        <div ref={this.drawBaseMap} id="map"></div>
        <GeofenceListMenu />
      </div>
    )
  }
}
export default geoFence