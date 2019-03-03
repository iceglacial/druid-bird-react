/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/12/5 0005.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Slider} from 'antd'
import {Filters} from '../../../common'
import moment from 'moment'
import appStore from '../../../store/app_store'
import thisStore from './store'

const {unitFilter} = Filters
let zoneOffset = parseInt(appStore.timeZone)
const now = moment.utc()//.utcOffset(zoneOffset)
const oneDayMS = 1000 * 60 * 60 * 24
let firstDayOfYear =  moment.utc().startOf('year')
let lastDayOfYear = moment.utc().endOf('year')
//moment().subtract(1, 'years')//向前一年
//moment().add(1, 'years')//向后一年
function getMonthMarkers(year) {
  let activeYear = year;
  if(!activeYear){
    activeYear = now.toObject().years
  }
  // let dateObj = moment.utc(activeYear+'0101').toObject()
  let markers = {}
  for (let i = 1; i <= 12; i++) {
    let _dateMoment = moment.utc(activeYear + '-' + i + '-01')
    let key = _dateMoment.valueOf()
    // console.log(i, key, _dateMoment.format('MM'), _dateMoment.format())
    markers[key] = _dateMoment.format('MM') === '01' ? _dateMoment.format('YYYY') : _dateMoment.format('MM')
  }
  // console.log(dateObj,markers)
  return markers
}
@observer
class TimeLinePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeDay: now.startOf('day'),
      minMark: firstDayOfYear,
      maxMark: lastDayOfYear,
      marks: getMonthMarkers()
    }
    this.setActiveDay(now.startOf('day'))
    this.getDevicesLocation(now.startOf('day'))
  }

  tipFormatter(value) {
    return unitFilter(value, 'date')
  }

  getDevicesLocation = (day) => {
    // console.log(day, unitFilter(day, 'date'))
    let date = unitFilter(day, 'date')
    thisStore.setHistoryDay(date)
  }
  setActiveDay=(day)=>{
    // console.log(day,unitFilter(day, 'date'))
    this.setState({
      activeDay: day,
    })
  }
  reSetYearMarkers=()=>{
    thisStore.set('reSetHistoryYear',false)
    let activeYear = thisStore.historyYear
    let firstDay =  moment.utc(activeYear+'-01-01');//
    let lastDay = moment.utc(activeYear+'-12-31')
    this.setState({
      activeDay: firstDay,
      minMark: firstDay.valueOf(),
      maxMark: lastDay.valueOf(),
      marks: getMonthMarkers(activeYear)
    })
    // console.log(this.state,activeYear,firstDay.format(),lastDay.format())
  }

  render() {
    const defaultParams = {
      value: this.state.activeDay,
      marks: this.state.marks,
      step: oneDayMS,
      dots: false,//只能拖拽到刻度上
      allowClear: true, //支持清除
      min: this.state.minMark,
      max: this.state.maxMark,
      tipFormatter: this.tipFormatter
    }
    if(thisStore.reSetHistoryYear){
      this.reSetYearMarkers()
    }
    return (
      <div className="map-timeline">
        <Slider {...defaultParams} onChange={this.setActiveDay} onAfterChange={this.getDevicesLocation}/>
      </div>
    )
  }
}
export default TimeLinePicker