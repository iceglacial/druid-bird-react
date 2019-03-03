import appStore from "../store/app_store";
import {DataFormatter, Formatter} from "./index";
import DeviceActionFormatter from "../components/device/device_action_formatter";
import mobx from 'mobx'


const {DeviceDataFormatter} = DataFormatter;
const {DeviceState, Location, ActivityIntensity, ActivityPercent,CopyBtn} = Formatter


let deviceFields = [
  'mark', 'updated_at', 'timestamp','latlon',/*'location',*/ 'firmware_version', 'device_type', 'network_operator', 'description'//, 'setting'
]
let envFields = [
  'updated_at', 'timestamp', 'longitude', 'latitude', 'battery_voltage', 'altitude', 'dimension', 'course', 'speed', 'used_star', 'temperature', 'humidity', 'light', 'pressure', 'signal_strength', 'firmware_version', 'device_type','mark', 'description', 'network_operator'
]
let bhvFields = [
  'updated_at', 'timestamp', 'activity_expend', 'activity_intensity', 'firmware_version'
]
let smsFields = [
  'updated_at', 'timestamp', 'longitude', 'latitude','battery_voltage', 'altitude', 'dimension', 'course', 'speed', 'used_star', 'temperature', 'humidity', 'light', 'pressure', 'signal_strength',  'firmware_version'
]
let disabledFields = {
  device: ['mark', 'updated_at', 'timestamp','longitude','latitude','latlon'/* 'location'*/],//, 'setting'
  env: ['updated_at','timestamp', 'longitude', 'latitude', 'battery_voltage'],
  bhv: ['updated_at', 'timestamp','activity_expend'],
  sms: ['updated_at','timestamp', 'longitude', 'latitude', 'battery_voltage']
};
let defaultFields = {
  device: deviceFields,
  env: envFields,
  bhv: bhvFields,
  sms: smsFields
};

let dataGridColumns = {
  device: {
    mark: {
      key: 'mark',
      name: appStore.language.getKeyName('mark'),
      formatter: DeviceState,
      getRowMetaData: (row) => row,
      locked: true,
      width: 230,
      sortable: true,
    },
    updated_at: {
      key: 'updated_at',
      name: appStore.language.getKeyName('updated_at', 'device_list'),
      sortable: true,
      width: 200
    },//, minWidth: 200, width: 200
    timestamp: {
      key: 'last_gps_timestamp',
      name: appStore.language.getKeyName('timestamp', 'device_list'),
      sortable: true,
      width: 200
    },
      latlon:{
        key: 'last_valid_gps.longitude.latitude',
        name:appStore.language.getKeyName('latlon'),
        width:220,
        formatter: CopyBtn,
      },
      // latitude:{key: 'last_gps_latitude',name:appStore.language.getKeyName('latitude'),width:220},
    // location: {key: 'geocoding', name: appStore.language.getKeyName('location'), formatter: Location,},//, minWidth: 280, width: 280
    firmware_version: {
      key: 'firmware_version',
      name: appStore.language.getKeyName('firmware_version'),
      sortable: true,
      // minWidth: 100,
      width: 100,
    },//sortable: true,
    device_type: {
      key: 'device_type',
      name: appStore.language.getKeyName('device_type'),
      sortable: true,
      // minWidth: 100,
      width: 120
    },
// device_model: {key: 'device_model', name: appStore.language.device_model,sortable: true, minWidth: 100, width: 130},
    network_operator: {
      key: 'network_operator',
      name: appStore.language.getKeyName('network_operator'),
      sortable: true,
      // minWidth: 100,
      width: 100
    },
    description: {
      key: 'description',
      name: appStore.language.getKeyName('description'),
      editable: true,
      minWidth: 350,
      // width: 350
    },
    setting: {
      key: 'setting',
      name: appStore.language.settings,
      formatter: DeviceActionFormatter,
      getRowMetaData: (row) => row,
      // minWidth: 260,
      width: 260,
      // locked: true,
    }
  },
  env: {
    updated_at: {key: 'updated_at', name: `${appStore.language.getKeyName('updated_at', 'gps')}`, width: 180},
    timestamp: {key: 'timestamp', name: `${appStore.language.getKeyName('timestamp', 'gps')}`, width: 180},
    longitude: {key: 'longitude', name: `${appStore.language.getKeyName('longitude')}`, width: 110},
    latitude: {key: 'latitude', name: `${appStore.language.getKeyName('latitude')}`, width: 110},
    altitude: {key: 'altitude', name: `${appStore.language.getKeyName('altitude')}`, width: 100},
    dimension: {key: 'dimension', name: `${appStore.language.getKeyName('dimension')}`, width: 140},
// horizontal:{key: 'horizontal', name: `${appStore.language.getKeyName('horizontal')}`, width: 120},
// vertical:{key: 'vertical', name: `${appStore.language.getKeyName('vertical')}`, width: 120},
    course: {key: 'course', name: `${appStore.language.getKeyName('course')}`, width: 90},
    speed: {key: 'speed', name: `${appStore.language.getKeyName('speed')}`, width: 90},
    used_star: {key: 'used_star', name: `${appStore.language.getKeyName('used_star')}`, width: 90},
    temperature: {key: 'temperature', name: `${appStore.language.getKeyName('temperature')}`, width: 100},
    humidity: {key: 'humidity', name: `${appStore.language.getKeyName('humidity')}`, width: 140},
    light: {key: 'light', name: `${appStore.language.getKeyName('light')}`, width: 120},
    pressure: {key: 'pressure', name: `${appStore.language.getKeyName('pressure')}`, width: 100},
    signal_strength: {key: 'signal_strength', name: `${appStore.language.getKeyName('signal_strength')}`, width: 160},
    battery_voltage: {key: 'battery_voltage', name: `${appStore.language.getKeyName('battery_voltage')}`, width: 120},
    firmware_version: {
      key: 'firmware_version',
      name: `${appStore.language.getKeyName('firmware_version')}`,
      width: 100
    },
    mark: {
      key: 'mark',
      name: appStore.language.getKeyName('mark'),
      formatter: DeviceState,
      getRowMetaData: (row) => row,
      width: 230,
      sortable: true,
    },
    device_type: {
      key: 'device_type',
      name: appStore.language.getKeyName('device_type'),
      sortable: true,
      // minWidth: 100,
      width: 120
    },
    network_operator: {
      key: 'network_operator',
      name: appStore.language.getKeyName('network_operator'),
      sortable: true,
      // minWidth: 100,
      width: 100
    },
    description: {
      key: 'description',
      name: appStore.language.getKeyName('description'),
      editable: true,
      // minWidth: 350,
      width: 350
    },
  },
  bhv: {
    updated_at: {key: 'updated_at', name: `${appStore.language.getKeyName('updated_at', 'behavior')}`},
    timestamp: {key: 'timestamp', name: `${appStore.language.getKeyName('timestamp', 'behavior')}`},
    activity_expend: {
      key: 'activity_expend',
      name: `${appStore.language.getKeyName('activity_expend')}`,
      formatter: ActivityPercent,
      getRowMetaData: (row) => row
    },
    activity_intensity: {
      key: 'activity_intensity',
      name: `${appStore.language.getKeyName('activity_intensity')}`,
      formatter: ActivityIntensity,
      getRowMetaData: (row) => row
    },
    firmware_version: {key: 'firmware_version', name: `${appStore.language.getKeyName('firmware_version')}`}
  },
  sms: {
    updated_at: {
      key: 'updated_at', name:
        `${appStore.language.getKeyName('updated_at', 'gps')}`,
        width: 180
    }
    ,
    timestamp: {
      key: 'timestamp', name:
        `${appStore.language.getKeyName('timestamp', 'gps')}`,
        width:
        180
    }
    ,
    longitude: {
      key: 'longitude', name:
        `${appStore.language.getKeyName('longitude')}`,
        width:
        110
    }
    ,
    latitude: {
      key: 'latitude', name:
        `${appStore.language.getKeyName('latitude')}`,
        width:
        110
    }
    ,
    altitude: {
      key: 'altitude', name:
        `${appStore.language.getKeyName('altitude')}`,
        width:
        100
    }
    ,
    dimension: {
      key: 'dimension', name:
        `${appStore.language.getKeyName('dimension')}`,
        width:
        140
    }
    ,
// horizontal:{key: 'horizontal', name: `${appStore.language.getKeyName('horizontal')}`, width: 120},
// vertical:{key: 'vertical', name: `${appStore.language.getKeyName('vertical')}`, width: 120},
    course: {
      key: 'course', name:
        `${appStore.language.getKeyName('course')}`,
        width:
        90
    }
    ,
    speed: {
      key: 'speed', name:
        `${appStore.language.getKeyName('speed')}`,
        width:
        90
    }
    ,
    used_star: {
      key: 'used_star', name:
        `${appStore.language.getKeyName('used_star')}`,
        width:
        90
    }
    ,
    temperature: {
      key: 'temperature', name:
        `${appStore.language.getKeyName('temperature')}`,
        width:
        100
    }
    ,
    humidity: {
      key: 'humidity', name:
        `${appStore.language.getKeyName('humidity')}`,
        width:
        140
    }
    ,
    light: {
      key: 'light', name:
        `${appStore.language.getKeyName('light')}`,
        width:
        120
    }
    ,
    pressure: {
      key: 'pressure', name:
        `${appStore.language.getKeyName('pressure')}`,
        width:
        100
    }
    ,
    signal_strength: {
      key: 'signal_strength', name:
        `${appStore.language.getKeyName('signal_strength')}`,
        width:
        160
    }
    ,
    battery_voltage: {
      key: 'battery_voltage', name:
        `${appStore.language.getKeyName('battery_voltage')}`,
        width:
        120
    }
    ,
    firmware_version: {
      key: 'firmware_version',
      name:
        `${appStore.language.getKeyName('firmware_version')}`,
      width:
        100
    }
  }
}
let getColumns = (type, items) => {
  let columns = [];
  let colItems = mobx.toJS(appStore.userFields[type])
  // console.log(disabledFields[type],colItems)
  //   console.log(colItems && colItems.length)
  if (colItems && colItems.length) {
    // console.log(disabledFields[type],colItems)
    colItems = disabledFields[type].concat(colItems)
      // console.log('haha',colItems)
  } else {
    colItems = defaultFields[type]
  }
  colItems.map(item => {
    // console.log(type,item)
    let column = dataGridColumns[type][item]
    column && columns.push(column)
  })
  if (type === 'device') {
    columns.push(dataGridColumns[type].setting)
  }
  return columns
}
export default {
  getColumns,
  disabledFields,
  defaultFields,
  dataGridColumns
}