/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import axios from 'axios'
import {Api, httpConfig, MessageHandle, HighchartPro} from '../../../common/index'
import thisStore from './store'
import {observer} from 'mobx-react'
import appStore from '../../../store/app_store'


@observer
class AppDevice extends React.Component {
  constructor(props) {
    super(props)
    this.getDeviceGPS()
  }

  toggleChartMerge=()=>{
      thisStore.set('chartMerge',!thisStore.chartMerge);
    this.getDeviceGPS()
  }

  getDeviceGPS = () => {
    thisStore.setReload(false);
    let _items = [
      "battery_voltage", //电压
      // "temperature",// 温度
      "light",//光照
      // "ground_altitude",//飞行高度
      ];
      let _items1 = [
          "battery_voltage", //电压

      ];
      let _items2 = [
          "light",//光照
      ];
    let rangeDate = thisStore.rangeDate
    let config = httpConfig('timestamp')
    let params = {
      last: '-1'
    }
    //图表不需要筛选 #2649
    // if (rangeDate.begin && rangeDate.end) {
    //   params = Object.assign(params,rangeDate)
    // }
    config.params = params
    axios.get(Api.gps(this.props.deviceId), config).then(res => {
      // #2466 错误时间的数据过滤
      for (let i = 0; i < res.data.length; i++) {
        if (!(appStore.isDateBetween(res.data[i].timestamp, new Date(2015,0,0), new Date()) &&
          appStore.isDateBetween(res.data[i].updated_at, new Date(2015,0,0), new Date()))) {
          res.data.splice(i, 1);
          i--;
        }
      }
      if(thisStore.chartMerge){
          let chart1 = HighchartPro.SeriesData.oneDevice(res.data, _items1);
          thisStore.reloadSeries(chart1,'myChart');
          let chart2 = HighchartPro.SeriesData.oneDevice(res.data, _items2);
          thisStore.reloadSeries(chart2,'myChart2');
      }else{
          let chart = HighchartPro.SeriesData.oneDevice(res.data, _items);//formatSeriesDeviceMore(res,_item[0])
          thisStore.reloadSeries(chart,'myChart');
      }

      // thisStore.setGpsData(GpsDataFormatter(res.data));
    }).catch(err => {
      MessageHandle(err)
    })
  }

  render() {
    if (thisStore.reload) {
      this.getDeviceGPS()
    }
    return (
      <div className="wrap-full flex-box">
        {/*<button onClick={this.toggleChartMerge}>{thisStore.chartMerge?appStore.language.chart_merging:appStore.language.chart_splitting}</button>*/}
          <div id="myChart" style={thisStore.chartMerge ? {height: '50%'} : {height: '100%'}}/>
          {thisStore.chartMerge?<div id="myChart2" style={{height:'50%'}}/>:''}
      </div>
    )
  }
}
export default AppDevice