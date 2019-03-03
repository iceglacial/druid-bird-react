/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/8 0008.
 */
import React from 'react'
import {observer} from 'mobx-react'
// import mapStore from '../store'
import {Route} from 'react-router-dom'
import thisStore from './store'
import GeofenceDetailInfo from './geofence_detail.infobox'
import GeofenceDetailManageDevices from './geofence_detail.manage_devices'


@observer
class geoFenceDetail extends React.Component {
  constructor(props){
    super(props)
    this.fenceID = props.match.params.id;
    // console.log(props)
    this.state = {
      fenceID: props.match.params.id,
      geoFence: '',
      drawingOfGeofence: '',
      geofenceDevices: [],
      devicesLocation: [],
      devicesInfo: []
    }
    thisStore.initDetailPage()
  }
  drawBaseMap=(mapDiv)=> {
    thisStore.initMap(mapDiv)
    // if (mapDiv) {
      // map = new google.maps.Map(
      //   mapDiv,
      //   mapStore.mapConfig
      // )
      // thisStore.setGeofenceDetailMap(map)
    // }
  }
  render() {
    return (
      <div className="wrap-full flex-row">
        <div ref={this.drawBaseMap} id="map"></div>
        <Route exact path="/geofence/id/:id" component={GeofenceDetailInfo}/>
        <Route exact path="/geofence/id/:id/devices" component={GeofenceDetailManageDevices}/>
        {/*<GeofenceDetailInfo fenceID={this.fenceID} history={this.props.history}/>*/}
      </div>
    )
  }
}
export default geoFenceDetail