/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import React from 'react'
import {observer} from 'mobx-react'
// import mapStore from '../store'
import thisStore from './store'
import AddGeofenceInfo from './add_geofence.infobox'


@observer
class addGeoFence extends React.Component {
  constructor(props){
    super(props)
    this.fenceID = props.match.params.id;
    // console.log(props.match.params.id)
  }
  drawBaseMap(mapDiv) {
    thisStore.initMap(mapDiv)
    // if (mapDiv) {
    //   map = new google.maps.Map(
    //     mapDiv,
    //     mapStore.mapConfig
    //   )
    //     thisStore.setAddGeofenceMap(map)
    // }
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