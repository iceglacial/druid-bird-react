/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/12/5 0005.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Slider} from 'antd'
import {Filters} from '../../../common'
import moment from 'moment'
// import appStore from '../../../store/app_store'
import thisStore from './store'

const {unitFilter} = Filters
const now = moment.utc().toObject()//.utcOffset(zoneOffset)
// console.log(now)
function getMarkers() {
  let marker = {}
  for(let i=0;i<now.years;i++){
    marker[thisStore.minHistoryYear + i] = thisStore.minHistoryYear + i
    // if((thisStore.minHistoryYear + i)%5 === 0){
    //   marker[thisStore.minHistoryYear + i] = thisStore.minHistoryYear + i
    // }
  }
  // marker[now.years] = now.years
  return marker;
}
@observer
class TimeLinePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultValue: now.years,
      marks: getMarkers()
    }
  }

  tipFormatter(value) {
    return unitFilter(value, 'date')
  }

  render() {
    const defaultParams = {
      defaultValue: this.state.defaultValue,
      marks: this.state.marks,
      step: 1,
      dots: false,//只能拖拽到刻度上
      allowClear: true, //支持清除
      min: thisStore.minHistoryYear,
      max: now.years,
      // tipFormatter: this.tipFormatter
    }
    return (
      <div className="map-timeline">
        <Slider {...defaultParams} onAfterChange={thisStore.setHistoryYear}/>
      </div>
    )
  }
}
export default TimeLinePicker