/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import {observable, action} from 'mobx'
import {Formatter} from './../../common'

const {ActivityIntensity, ActivityPercent} = Formatter
let accountStore = observable({
  searchOutDevice: [], //设备搜索结果
  searchType: 'mark', //
  editMeForm: '',
  editMyPasswordModalVisible: false,
  editMyPasswordForm: '',
  columnsBehavior: [
    {key: 'mark', name: 'SN', locked: true, width: 80},
    {key: 'uuid', name: 'UUID', locked: true, width: 210},
    {key: 'updated_at', name: '上传时间', minWidth: 200, width: 200},
    {key: 'timestamp', name: '采集时间', minWidth: 200, width: 200},
    {
      key: 'activity_expend',
      name: '活动时间',
      formatter: ActivityPercent,
      getRowMetaData: (row) => row,
      minWidth: 200,
      width: 130
    },
    {
      key: 'activity_intensity',
      name: '活动强度',
      formatter: ActivityIntensity,
      getRowMetaData: (row) => row,
      minWidth: 200,
      width: 200
    },
    {key: 'firmware_version', name: '固件', minWidth: 80, width: 80},
  ],
})
const thisStore = accountStore;
thisStore.setSearchOutDevice = action(array => {
  thisStore.searchOutDevice = array
})
thisStore.setSearchType = action(type => {
  thisStore.searchType = type
})
thisStore.setSeriesData = action(data => {
  thisStore.seriesData = data
})
export default accountStore