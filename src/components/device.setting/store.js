/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import {observable, action} from 'mobx'
import deviceStore from '../device/store'
import {message} from 'antd/lib/index'
import {Api, httpConfig, MessageHandle} from '../../common'
import appStore from '../../store/app_store'
import axios from 'axios/index'

let dataStore = observable({
  selectedDevices:[],//勾选中的设备
  newSelectedDevices:[],//新搜选的设备
  gridDeviceSetting: [], //设备配置
  columnsDeviceSetting: [
    { key: 'mark', name: 'SN', locked: true, width: 80 },
    { key: 'uuid', name: 'UUID', locked: true, width: 210 },
    { key: 'updated_at', name: '最后修改时间', minWidth: 200, width: 200 },
    { key: 'downloaded_at', name: '配置生效时间', minWidth: 200, width: 200 },
    { key: 'behavior_sampling_mode', name: '行为采样', minWidth: 150, width: 150 },
    { key: 'behavior_sampling_freq', name: '行为采样间隔', minWidth: 150, width: 150 },
    { key: 'behavior_voltage_threshold', name: '行为电压门限', minWidth: 150, width: 150 },
    { key: 'env_sampling_mode', name: '环境采样', minWidth: 150, width: 150 },
    { key: 'env_sampling_freq', name: '环境采样间隔', minWidth: 150, width: 150 },
    { key: 'env_voltage_threshold', name: '环境电压门限', minWidth: 150, width: 150 },
    { key: 'gprs_mode', name: '网络通信', minWidth: 150, width: 150 },
    { key: 'gprs_freq', name: '网络通信间隔', minWidth: 150, width: 150 },
    { key: 'gprs_voltage_threshold', name: 'GPRS电压门限', minWidth: 150, width: 150 },
    { key: 'gprs_version', name: 'GPRS反转门限', minWidth: 150, width: 150 },
    { key: 'ota_voltage_threshold', name: 'OTA电压门限', minWidth: 150, width: 150 },
    { key: 'sp_number', name: '短信SP号码', minWidth: 150, width: 150 },
  ],
  modeDisabled: true,
  settingDevice: {},
  settingDeviceBackup: {},
  settingForm: '',
})
const thisStore = dataStore;
thisStore.set = action((name, value) => {
  thisStore[name] = value
})
thisStore.saveSettingModal=()=>{
  // axios.put(Api.deviceAttachTime(device.device_id), attachData, httpConfig()).then(res => {
  let device=1009;
    thisStore.settingModalVisible = false;
    message.success(appStore.language.device_setting_updated(device));
    // thisStore.settingModalVisible = false;
  // }).catch(err => {
  //   MessageHandle(err)
  // })
}

/**
 * 环境数据
 */
thisStore.setGridDeviceSetting = action(array => {
  thisStore.gridDeviceSetting = array
})
export default thisStore