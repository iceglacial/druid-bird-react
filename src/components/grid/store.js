/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'
import React from 'react'
import {message} from 'antd'
import {MessageHandle, Api, Formatter, httpConfig, Filters} from './../../common'
import axios from 'axios'
import appStore from '../../store/app_store'
import moment from 'moment'

const {DeviceState, Location, LastGpsTimestamp} = Formatter
const {biologicalInfoFormat} = Filters
let deviceStore = observable({
  deviceAll: [], //所有设备
  gridData: [],
  devicesData: [],
  GPSData: [],
  BHVData: [],
  SMSData: [],
  gridType: 'env',
  downloadDeviceGpsState: false,  //选择状态-导出环境数据
  downloadDeviceGps: [], //环境数据
  downloadFileType: 'kml',  //下载类型
  downloadMultiple: true,  //多个文件
  downloadRangeDate: {},
  cancelExport: false, //取消导出后，重置设备选中状态
  toggleSelectAll: false,
  selectAllState: false, //true: select all; false: select nothing
  biologicalItems: {
    'age': [0,1],
    'blood': ['neck', 'back'],
    'gender': [0,1]
  },
  settingModalVisible: false,
  settingDevice: {},
  settingDeviceBackup: {},
  biologicalModalVisible: false,
  biologicalDevice: {},
  settingForm: '',
  biologicalForm: '',
  defaultMode: {
    "realtime": {
      behavior_sampling_freq: 600,
      behavior_sampling_mode: 1,
      behavior_voltage_threshold: 3.8,
      env_sampling_freq: 600,
      env_sampling_mode: 1,
      env_voltage_threshold: 3.7,
      gprs_freq: 86400,
      gprs_mode: 1,
      gprs_voltage_threshold: 3.8,
    },
    "standard": {
      behavior_sampling_freq: 600,
      behavior_sampling_mode: 1,
      behavior_voltage_threshold: 3.8,
      env_sampling_freq: 3600,
      env_sampling_mode: 1,
      env_voltage_threshold: 3.7,
      gprs_freq: 86400,
      gprs_mode: 1,
      gprs_voltage_threshold: 3.8,
    },
    "save": {
      behavior_sampling_freq: 0,
      behavior_sampling_mode: 0,
      behavior_voltage_threshold: 0,//3.8
      env_sampling_freq: 14400,
      env_sampling_mode: 1,
      env_voltage_threshold: 3.7,
      gprs_freq: 86400,
      gprs_mode: 1,
      gprs_voltage_threshold: 3.8,
    },
    "standby": {
      behavior_sampling_freq: 0,
      behavior_sampling_mode: 0,
      behavior_voltage_threshold: 0,//3.8
      env_sampling_freq: 0,
      env_sampling_mode: 0,
      env_voltage_threshold: 0,//3.7
      gprs_freq: 86400,
      gprs_mode: 1,
      gprs_voltage_threshold: 3.8,
    },
  },
  // searchout
  searchOutDeviceList: [],
  // 设备详情
  reloadBiologicalInfo: false
})
const thisStore = deviceStore;
thisStore.set = action((name,value) => {
  thisStore[name] = value
})
thisStore.clear = action(() => {
  thisStore.deviceAll = []
})
thisStore.setGridData = action(array => {
  thisStore.gridData = array || []
})
thisStore.setGridDataByType = action((type, array) => {
  if(type === 'device'){
    thisStore.devicesData = array || []
  }else if(type === 'env'){
    thisStore.GPSData = array || []
  }else if(type === 'bhv'){
    thisStore.BHVData = array || []
  }else if(type === 'sms'){
    thisStore.SMSData = array || []
  }
  thisStore.gridData = array
})
/**
 * 所有设备
 */
thisStore.setDeviceAll = action(array => {
  thisStore.deviceAll = array
})
/**
 * 下载设备: [id,id,...]
 */
thisStore.setDownloadDeviceGps = action(data => {
  const _type = typeof(data);
  if (_type === 'string') {
    const _index = thisStore.downloadDeviceGps.indexOf(data);
    if (_index > -1) {
      thisStore.downloadDeviceGps.splice(_index, 1);
    } else {
      thisStore.downloadDeviceGps.push(data);
    }
  } else {
    thisStore.downloadDeviceGps = data
  }
  // console.log('download len:',thisStore.downloadDeviceGps.length)
  // console.log(thisStore.downloadDeviceGps.toString());
})
/**
 * 选择状态-导出环境数据
 */
thisStore.setDownloadDeviceGpsState = action(() => {
  if (thisStore.downloadDeviceGpsState) {
    thisStore.downloadDeviceGps = [];
  }
  thisStore.downloadDeviceGpsState = !thisStore.downloadDeviceGpsState;
})
/**
 * 环境数据导出文件类型
 */
thisStore.setDownloadFileType = action((e) => {
  thisStore.downloadFileType = e.target.value;
  if (e.target.value === 'kml') {
    // console.log(e.target.value,e.target.value === 'kml');
    thisStore.downloadMultiple = true;
  }
})
/**
 * 环境数据导出方式：单个文件/多个文件（按设备）
 */
thisStore.setDownloadMultiple = action((e) => {
  // console.log(typeof e);
  if (typeof e === 'object') {
    thisStore.downloadMultiple = e.target.value;
  } else {
    thisStore.downloadMultiple = e;
  }
})
/**
 * 到处环境数据的日期范围
 */
thisStore.setDownloadRangeDate = action(range => {
  thisStore.downloadRangeDate = range;
})
thisStore.setSettingForm = action(form => {
  // console.log(form);
  thisStore.settingForm = form;
})
thisStore.hideSettingModal = action(() => {
  thisStore.settingModalVisible = false;
  thisStore.settingForm.resetFields();
})
thisStore.saveSettingModal = action((refs) => {
  const form = thisStore.settingForm;
  const device = thisStore.settingDevice;
  form.validateFields((err, values) => {
    if (err) {
      return;
    }
    const data = {
      env_sampling_mode: values.env_sampling_mode ? 1 : 2,
      env_sampling_freq: parseFloat(values.env_sampling_freq),
      env_voltage_threshold: parseFloat(values.env_voltage_threshold),
      behavior_sampling_mode: values.behavior_sampling_mode ? 1 : 2,
      behavior_sampling_freq: parseFloat(values.behavior_sampling_freq),
      behavior_voltage_threshold: parseFloat(values.behavior_voltage_threshold),
      gprs_mode: values.gprs_mode ? 1 : 2,
      gprs_freq: parseFloat(values.gprs_freq),
      gprs_voltage_threshold: parseFloat(values.gprs_voltage_threshold),
    }
    if (!values.env_sampling_mode) {
      data.env_sampling_freq = device.env_sampling_freq;
      data.env_voltage_threshold = device.env_voltage_threshold;
    }
    if (!values.behavior_sampling_mode) {
      data.behavior_sampling_freq = device.behavior_sampling_freq;
      data.behavior_voltage_threshold = device.behavior_voltage_threshold;
    }
    if (!values.gprs_mode) {
      data.gprs_freq = device.gprs_freq;
      data.gprs_voltage_threshold = device.gprs_voltage_threshold;
    }
    if (values.attached_at && values.attached_at != thisStore.settingDeviceBackup.attached_at) {
      let attachData = {
        attached_at: values.attached_at
      }
      axios.put(Api.deviceAttachTime(device.device_id), attachData, httpConfig()).then(res => {
        thisStore.settingModalVisible = false;
        thisStore.settingForm.resetFields();
        message.success(appStore.language.device_setting_updated(device));
        thisStore.settingModalVisible = false;
        form.resetFields();
      }).catch(err => {
        MessageHandle(err)
      })
    }
    axios.put(Api.setting(device.device_id), data, httpConfig()).then(res => {
      thisStore.settingModalVisible = false;
      message.success(appStore.language.device_setting_updated(device));
      form.resetFields();
    }).catch(err => {
      MessageHandle(err)
    })
  });
})
thisStore.setBiologicalForm = action(form => {
  // console.log(form);
  thisStore.biologicalForm = form;
})
thisStore.hideBiologicalModal = action(() => {
  thisStore.biologicalModalVisible = false;
  thisStore.biologicalForm.resetFields();
})
thisStore.saveBiologicalModal = action(() => {
  let form = thisStore.biologicalForm;
  let biological = thisStore.biologicalDevice;//this.state.biological;
  form.validateFields((err, values) => {
    if (err) {
      return;
    }
    let latitude = values.latitude !== undefined ? values.latitude+'' : ''
    let longitude = values.longitude !== undefined ? values.longitude+'' : ''
    var data = {
      // string:
      age: parseInt(values.age),
      // beek_length:  fixNumber(values.beek_length),
      bid: values.bid,
      blood: values.blood ? '1' : '0',
      note: values.note,
      gender: parseInt(values.gender),
      latitude,
      location: values.location,
      longitude,
      species: values.species,
      head_length: fixNumber(values.head_length),
      // primary_feather_length: fixNumber(values.primary_feather_length),
      // tarsus_long: fixNumber(values.tarsus_long),
      // tarsus_short: fixNumber(values.tarsus_short),
      timestamp: moment.utc().toISOString(),
      weight: fixNumber(values.weight),
      wing_length: fixNumber(values.wing_length),
      label: '[' + (values.label ? values.label.toString() : '') + ']',
      feather: '[' + (values.feather ? values.feather.toString() : '') + ']',
      swab: '[' + (values.swab ? values.swab.toString() : '') + ']',
      // new
      culmen_length: parseFloat(values.culmen_length),
      tarsus_length: parseFloat(values.tarsus_length),
      tail_length: parseFloat(values.tail_length),
      wingspan: parseFloat(values.wingspan),
      body_length: parseFloat(values.body_length),
    };
    // delete data.updated_at;
    // console.log(values);
    axios.post(Api.updateBiological(biological.device_id, 'bird'), data, httpConfig()).then(res => {
      thisStore.biologicalModalVisible = false;
      let _devices = thisStore.deviceAll;
      _devices.map(function (value, index) {
        if (value.id === biological.device_id && !value.biological_id) {
          _devices[index].biological_id = res.data.id;
        }
      })
      thisStore.setDeviceAll(_devices);
      message.success(appStore.language.device_biological_updated(biological));
      form.resetFields();
    }).catch(err => {
      MessageHandle(err);
    })
  })
})
/**
 * 设备配置弹窗-可见
 */
thisStore.setSettingModalVisible = action(visible => {
  thisStore.settingModalVisible = visible;
})
/**
 * 设备配置弹窗-设备基本信息
 */
thisStore.setSettingModalDevice = action((device, backup) => {
  thisStore.settingModalVisible = true;
  thisStore.settingDevice = device;
  if (backup) {
    let keys = Object.keys(thisStore.defaultMode.realtime)
    keys.map(key => {
      thisStore.settingDeviceBackup[key] = device[key]
    })
  }
  // backup && (thisStore.settingDeviceBackup = device); //备份
})
/**
 * 设备生物信息弹窗-可见
 */
thisStore.setBiologicalModalVisible = action(visible => {
  thisStore.biologicalModalVisible = visible;
})
/**
 * 设备生物信息弹窗-设备基本信息
 */
thisStore.setBiologicalDevice = action(bio => {
  // thisStore.biologicalModalVisible = true;
  thisStore.biologicalDevice = biologicalInfoFormat(bio);
  // console.log(bioInfo)
})
function fixNumber(num,step) {
  return parseFloat(num);//.toFixed(step || 3)
}
export default deviceStore;