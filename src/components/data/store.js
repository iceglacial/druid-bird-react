/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import {observable, action} from 'mobx'
import {Formatter} from './../../common'
const {ActivityIntensity,ActivityPercent} = Formatter

let dataStore = observable({
  gridGps: [], //环境数据
  gridBehavior: [], //行为数据
  searchData: {},
  searchOutGps: {
    rows: [],
    sortColumn: null,
    sortDirection: null
  },
  columnsGps: [
    { key: 'mark', name: 'SN', locked: true, width: 80 },
    { key: 'uuid', name: 'UUID', locked: true, width: 210 },
    { key: 'updated_at', name: '上传时间', minWidth: 200, width: 200 },
    { key: 'timestamp', name: '采集时间', minWidth: 200, width: 200 },
    { key: 'longitude', name: '经度', minWidth: 100, width: 100 },
    { key: 'latitude', name: '纬度', minWidth: 100, width: 100 },
    { key: 'altitude', name: '海拔高度', minWidth: 80, width: 80 },
    { key: 'dimension', name: '定位模式', minWidth: 140, width: 140 },
    { key: 'horizontal', name: '水平精度', minWidth: 80, width: 80 },
    { key: 'vertical', name: '垂直精度', minWidth: 80, width: 80 },
    { key: 'course', name: '航向', minWidth: 80, width: 80 },
    { key: 'speed', name: '速度', minWidth: 80, width: 80 },
    { key: 'used_star', name: '定位卫星数', minWidth: 80, width: 80 },
    { key: 'temperature', name: '温度', minWidth: 80, width: 80 },
    { key: 'humidity', name: '湿度', minWidth: 140, width: 140 },
    { key: 'light', name: '光照', minWidth: 80, width: 80 },
    { key: 'pressure', name: '气压', minWidth: 80, width: 80 },
    { key: 'signal_strength', name: '网络信号强度', minWidth: 120, width: 120 },
    { key: 'battery_voltage', name: '电压', minWidth: 80, width: 80 },
    { key: 'firmware_version', name: '固件', minWidth: 80, width: 80 },
  ],
  columnsBehavior: [
    { key: 'mark', name: 'SN', locked: true, width: 80 },
    { key: 'uuid', name: 'UUID', locked: true, width: 210 },
    { key: 'updated_at', name: '上传时间', minWidth: 200, width: 200 },
    { key: 'timestamp', name: '采集时间', minWidth: 200, width: 200 },
    { key: 'activity_expend', name: '活动时间', formatter: ActivityPercent, getRowMetaData: (row) => row, minWidth: 200, width: 130 },
    { key: 'activity_intensity', name: '活动强度', formatter: ActivityIntensity, getRowMetaData: (row) => row, minWidth: 200, width: 200 },
    { key: 'firmware_version', name: '固件', minWidth: 80, width: 80 },
  ],
})
const thisStore = dataStore;
/**
 * 环境数据
 */
thisStore.setGridGps = action(array => {
  thisStore.gridGps = array
})
thisStore.setSearchData = action(data => {
  thisStore.searchData = data
  // console.log('./data/store',JSON.stringify(thisStore.searchData))
})
thisStore.setSearchOutGps = action(array => {
  thisStore.searchOutGps = array
})
thisStore.setGridBehavior = action(array => {
  thisStore.gridBehavior = array
})
export default dataStore