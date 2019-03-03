import React from 'react'
import {Button,Spin} from 'antd'
import Drawing from '../drawing'
import appStore from '../../../store/app_store'
import thisStore from './store'
import {observer} from 'mobx-react'
import LoadingImg from '../../../common/loadingImg'

let google = window.google;
let distanceShape = null, distanceManager = null;
@observer
class MeasureDistance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      onDrawing: false
    }
  }

  measureDistance = () => {
    this.setState({
      loading: true,
      onDrawing: true
    })
    let _this = this
    let onMeasure = !thisStore.onMeasure
    let map = this.props.map
    Drawing.closeMeasureDistance(distanceShape)
    if (map) {
      if (onMeasure) {
        thisStore.setOnMeasure(true)
        distanceManager = Drawing.init(map, 'polyline', ['polyline'])
        google.maps.event.addListener(distanceManager, 'overlaycomplete', function (event) {
          let newShape = event.overlay;
          // let type = event.type;
          distanceShape = newShape;
          distanceManager.setOptions({
            drawingMode: null,
            // drawingControl: false
          });
          newShape.setEditable(true);
          newShape.setDraggable(true);
          _this.setState({
            onDrawing: false
          })
          var path = newShape.getPath();
          getPath();
          google.maps.event.addListener(newShape, "dragend", getPath);
          google.maps.event.addListener(path, "insert_at", getPath);
          google.maps.event.addListener(path, "remove_at", getPath);
          google.maps.event.addListener(path, "set_at", getPath);
          // var distance = google.maps.geometry.spherical.computeLength(path);
          function getPath(index) {
            // var path = newShape.getPath();
            // var distance = google.maps.geometry.spherical.computeLength(path);
            distanceShape = newShape;
            Drawing.setDistanceWindow(map, newShape)
          }
        });
      } else {
        thisStore.setOnMeasure(false)
        this.setState({
          onDrawing: false
        })
      }
    }
    setTimeout(()=>{
      _this.setState({
        loading: false
      });
    },0)
  }

  render() {
    return (
      <Spin spinning={this.state.loading} indicator={LoadingImg}>
          {this.state.onDrawing}
        <Button type='block' disabled={this.state.onDrawing} onClick={this.measureDistance}>{thisStore.onMeasure ? appStore.language.exit_measure : appStore.language.measure_distance}</Button>
      </Spin>
    )
  }
}
export default MeasureDistance