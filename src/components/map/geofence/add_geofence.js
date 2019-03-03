/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import React from 'react'
import {observer} from 'mobx-react'
import mapStore from '../store'
import geofenceStore from './store'
import AddGeofenceInfo from './add_geofence.infobox'

let map;
const google = window.google
@observer
class addGeoFence extends React.Component {
  constructor(props){
    super(props)
    this.fenceID = props.match.params.id;
    // console.log(props.match.params.id)
  }
  drawBaseMap(mapDiv) {
    if (mapDiv) {
      map = new google.maps.Map(
        mapDiv,
        mapStore.mapConfig
      )
      geofenceStore.setAddGeofenceMap(map)
    }
  }

  render() {
    return (
      <div className="wrap-full flex-row">
        <div ref={this.drawBaseMap} id="map"></div>
        <AddGeofenceInfo history={this.props.history}/>
      </div>
    )
  }
}
export default addGeoFence