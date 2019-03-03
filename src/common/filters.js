/*rule类型过滤器*/
import moment from 'moment';
import appStore from '../store/app_store'

// console.log('test utc:',appStore.timeZone,moment.utc().format(),moment().utcOffset('+0800').format());
// 毫秒转换-精确到秒
function filterTime(time) {
  var unit = {
    month: " Mon",
    week: " week",
    day: " day",
    hour: " hour",
    minute: " min",
    seconds: " s"
  };
  var tmp = "";
  var oneMin = 60;
  var oneHour = oneMin * 60;
  var oneDay = oneHour * 24;
  var oneWeek = oneDay * 7;
  var oneMonth = oneDay * 30;
  var seconds = time % 60;
  var min = Math.floor(time % oneMonth % oneWeek % oneDay % oneHour / oneMin);
  var hour = Math.floor(time % oneMonth % oneWeek % oneDay / oneHour);
  var day = Math.floor(time % oneMonth % oneWeek / oneDay);
  var week = Math.floor(time % oneMonth / oneWeek);
  var month = Math.floor(time / oneMonth);
  // (month > 0) && (tmp += month + unit.month);
  // (week > 0) && (tmp += ((tmp.length > 0) && " ") + week + unit.week) && ((week > 1) && (tmp += "s"));
  day = month * 30 + week * 7 + day;
  (day > 0) && (tmp += ((tmp.length > 0) && " ") + day + unit.day) && ((day > 1) && (tmp += "s"));
  (hour > 0) && (tmp += ((tmp.length > 0) && " ") + hour + unit.hour) && ((hour > 1) && (tmp += "s"));
  (min > 0) && (tmp += ((tmp.length > 0) && " ") + min + unit.minute);
  (seconds > 0) && (tmp += ((tmp.length > 0) && " ") + seconds + unit.seconds);
  return tmp;
};
function filterDistance(meters) {
  let distance = parseFloat(meters)
  if(distance > 0 && distance < 1000){
    return distance.toFixed(2) + ' m'
  }else{
    return (distance/1000).toFixed(2) + ' km'
  }
}
// 单位过滤
function unitFilter(value, type) {
  let filVal = '';
  let unit = '';
  // console.log('unitFilter',value,type);
  let dateFormat = "YYYY-MM-DD";
  let timeFormat = "HH:mm:ss";
  let datetimeFormat = dateFormat + ' ' + timeFormat;
  let zoneOffset = parseInt(appStore.timeZone)
  switch (type) {
    case 'updated_at':
    case 'timestamp':
    case "downloaded_at":
    case "readed_at":
      // console.log('test UTC:',zoneOffset,moment.utc(value).format(datetimeFormat),moment.utc(value).utcOffset(zoneOffset).format(datetimeFormat));
      //.utcOffset(offset):offset: -300 || '+0800'
      return value ? moment.utc(value).utcOffset(zoneOffset).format(datetimeFormat) : null;
    // break;
    case 'millisecond':
      // console.log(value,value ? moment.utc(value).utcOffset(appStore.timeZone).valueOf() : null)
      return value ? moment.utc(value).utcOffset(zoneOffset).valueOf() : null;
    // break;
    // return value;
    case 'date':
      // console.log(value,value ? moment.utc(value).utcOffset(appStore.timeZone).valueOf() : null)
      return value ? moment.utc(value).utcOffset(zoneOffset).format(dateFormat) : null;
    case 'time':
      // console.log(value,value ? moment.utc(value).utcOffset(appStore.timeZone).valueOf() : null)
      return value ? moment.utc(value).utcOffset(zoneOffset).format(timeFormat) : null;
    case "behavior_sampling_freq":
    case "env_sampling_freq":
    case "gprs_freq":
    case "gprs_version":
    case "freq":
      filVal = filterTime(value);
      break;
    case "gender":
      if (value === 0) {
        filVal = appStore.language.female
      } else if (value === 1) {
        filVal = appStore.language.male
      } else {
        filVal = ''
      }
      break;
    case "age":
      if (value === 0) {
        filVal = appStore.language.adult
      } else if (value === 1) {
        filVal = appStore.language.juvenile
      } else {
        filVal = ''
      }
      break;
    case "percentage":
      unit = '%';
      break;
    case "temperature":
      unit = '℃';
      break;
    case "light":
      unit = 'Lx';
      break;
    case "pressure":
      unit = 'hPa';
      break;
    case "humidity":
      unit = '%';
      break;
    case "weight":
      unit =' g';// 'kg';//g
      break;
    case "dimension":
      if (value === 0) {
        filVal = "-";
      }
      else if (value === 1) {
        filVal = "2D";
      }
      else if (value === 2) {
        filVal = "3D";
      }
      break;
    case "latitude":
    case "longitude":
    case "course":
      unit = '°';
      break;
    case "speed":
      unit = ' m/s';
      break;
    case "horizontal":
    case "vertical":
    case "altitude":
    case "ground_altitude":
    case "relative_altitude":
      unit = ' m';
      break;
    case "distance":
      filVal = filterDistance(value)
      break;
    case "signal_strength":
      unit = 'ASU';
      break;
    case "behavior_sampling_mode":
    case "gprs_mode":
    case "env_sampling_mode":
      switch (value) {
        case 0:
          filVal = appStore.language.temporarily_closed;
          break;
        case 1:
          filVal = appStore.language.open;
          break;
        case 2:
          filVal = appStore.language.close;
          break;
        default:
          filVal = value;
          break;
      }
      break;
    case "behavior_sampling_freq":
    case "env_sampling_freq":
    case "gprs_freq":
    case "gprs_version":
    case "freq":
      filVal = filterTime(value);
      break;
    case "battery_voltage":
    case "behavior_voltage_threshold":
    case "env_voltage_threshold":
    case "gprs_voltage_threshold":
    case "ota_voltage_threshold":
    case "threshold":
    case "voltage":
      unit = "V";
      break;
    case "msg_type_geofence":
      if (value === 1) {
        filVal = '入界'
      }
      else if (value === 2) {
        filVal = '出界'
      }
      else {
        filVal = value
      }
      break;
    case "activity_expend":
    case "sleep_expend":
    case "crawl_expend":
    case "fly_expend":
    case "other_expend":
    case "peck_expend":
    case "run_expend":
      unit = '%';
      break;
    case "acreage":
      let kmUnit = 1000 * 1000; //1 km²
      if (value > kmUnit) {
        filVal = (value / kmUnit).toFixed(3) + ' km²'
      } else if (value) {
        filVal = value.toFixed(0) + ' m²'
      }
      // console.log(value,filVal)
      break;
    case "language":
      if (value === 0) {
        filVal = '中文'
      }
      else if (value === 1) {
        filVal = 'English'
      }
      else {
        filVal = value
      }
      break;
    default:
      if (value !== 'unit') {
        return value;
      } else {
        break;
      }
  }
  if (value === 'unit') {
    filVal = unit;
  } else {
    let validVal = (value !== undefined && value !== null && value !== '')
    if (validVal && unit && !filVal) {
      if (value !== '-' && typeof(parseFloat(value)) === 'number') {
        filVal = parseFloat(value) + "" + unit;
      } else {
        filVal = '-';
      }
    } else if (!validVal) {
      filVal = '';
    }
  }
  return filVal;
}
// 3.6-3.7V: (0-5%)  -- red: #FF556A; （不工作）
// 3.7V~3.8V: (5-30%)  --  orange: #F4A523;  （不能采样）
// 3.8V~3.9V: (30-85%)  --  blue: #54C2E9;  （可采样）
// 3.9V~4.05V: (85-100%)  --  green: #94C300;  （正常）
let batteryState = {
  'notWorking': {
    'color': "red",
    'icon': 'battery-bad',
    'className': 'red'
  },
  'noSample': {
    'color': "yellow",
    'icon': 'battery-33',
    'className': 'yellow'
  },
  'sampling': {
    'color': "green",
    'icon': 'battery-66',
    'className': 'green'
  },
    'sampling1': {
        'color': "blue",
        'icon': 'battery-66',
        'className': 'blue'
    },
  'normal': {
    'color': "green",
    'icon': 'battery-100',
    'className': 'green'//blue
  },
    'normal1': {
        'color': "blue",
        'icon': 'battery-100',
        'className': 'blue'//blue
    },
  'noData': {
    'color': "red",
    'icon': 'battery-0',
    'className': 'red'
  },
    'bad': {
        'color': "",
        'icon': 'battery-bad',
        'className': ''
    },
}
let temperatureState = {
  'low': {
    icon: 'temperature',
    className: 'temperature black'
  },
  'zero': {
    icon: 'temperature',
    className: 'temperature temperature ice'
  },
  'normal': {
    icon: 'temperature',
    className: 'temperature blue'//blue
  },
  'high': {
    icon: 'temperature',
    className: 'temperature yellow'
  },
  'toHot': {
    icon: 'temperature',
    className: 'temperature red'
  },
  'noData': {
    icon: 'temperature',
    className: ''
  },
}
function stateFilter(value, type) {
  value = parseFloat(value);
  switch (type) {
    case 'voltage':
    case "battery_voltage":
      if (value >= 4.02) {
        return batteryState.normal;
      }else if ((value < 4.02) && (value >= 3.97)) {
          return batteryState.normal1;
      }else if ((value < 3.97) && (value >= 3.92)) {
          return batteryState.sampling1;
      }else if ((value < 3.92) && (value >= 3.8)) {
        return batteryState.noSample;
      } else if ((value < 3.8) && (value >= 3.7)) {
        return batteryState.noData;
      } else if (value < 3.7) {
        return batteryState.notWorking;
      } else {
        return batteryState.bad;
      }
      break;
    case 'temperature':
      if (value <= -5) {
        return temperatureState.low;
      }
      else if (value <= 5) {
        return temperatureState.zero;
      }
      else if (value <= 30) {
        return temperatureState.normal;
      }
      else if (value <= 60) {
        return temperatureState.high;
      }
      else if (value > 60) {
        return temperatureState.toHot;
      }
      else {
        return temperatureState.noData;
      } //no data
      break;
    default:
      break;
  }
}
/**
 * 数组转换为搜索路径
 * @param array
 * @returns {string}
 */
function arrayToSearchUrl(array) {
  let search = ''
  for (let key in array) {
    let tmp = '&' + key + '=' + array[key].toString();
    search += tmp;
  }
  search = search.replace('&', '?');
  return search;
}
/**
 * 搜索路径转换为数组
 * @param search
 * @returns {{}}
 */
function searchUrlToArray(search) {
  let data = {}
  const isString = ['uuid', 'timestamp', 'updated_at']
  const isRange = ["mark", "timestamp", "updated_at", "longitude", "latitude", "altitude", "humidity", "temperature", "light", "pressure", "used_star", "speed", "horizontal", "vertical", "signal_strength", "battery_voltage"]
  let _items = search.slice(1).split('&')
  _items.map(item => {
    let key = item.split('=')[0]
    let value = item && (item.split('=')[1].split(','))
    if (isRange.indexOf(key) !== -1) {
      let values = []
      if (isString.indexOf(key) !== -1) {
        values = value;
      } else {
        values.push(parseFloat(value[0]))
        values.push(parseFloat(value[1]))
      }
      data[key] = values;
    } else {
      value = value[0]
      if (isString.indexOf(key) !== -1) {
        data[key] = value;
      } else {
        data[key] = parseFloat(value);
      }
    }
  })
  return data
}

function rule_type_filter(v) {
  switch (v) {
    case 1:
      return '中国移动'
    case 2:
      return '中国联通'
    default:
      return '中国电信'

  }
}

function platform_type_filter(v) {
  switch (v) {
    case 1:
      return '类型:鸟类追踪平台'
    case 2:
      return '类型:牧途-智能放牧平台'
    default:
      return '类型:畜牧平台'
  }
}

function hour_day_month(v) {
  switch (v) {
    case 1:
      return '小时'
    case 2:
      return '天'
    default:
      return '月'
  }

}
/**
 * 地图中设备位置数据筛选
 * @param data
 * @param filters
 * @returns {*}
 */
function deviceLocationFilter(data, filters,isGps) {
  let filterKeys = Object.keys(filters);
  let valid = true;
  filterKeys.map(key => {
    let values;
    let itemData = data
    let isSurviveKey = (key === 'survive')
    let lastValidGps = isGps ? data : data.last_valid_gps
    if (isSurviveKey) {
      itemData = itemData.survive;
      if (filters[key] === 'dead') {//1: dead
        (itemData === 0) && (valid = false)
      } else if (filters[key] === 'alive') {
        (itemData === 1) && (valid = false)
      }
    } else if (lastValidGps) {
      itemData = lastValidGps[key]
      if (key !== 'timestamp' && key !== 'updated_at') {
        values = filters[key].map(str => parseFloat(str))
        // console.log(key,itemData,values)
        if (!itemData || itemData < parseFloat(values[0]) || itemData > parseFloat(values[1])) {
          valid = false;
        }
      }
    } else {
      valid = false;
    }
  })
  // console.log(filterKeys)
  if (valid) {
    return data
  }
}
const stringToArray = (string) => {
  if (typeof(string) === 'string') {
    let str = string ? string.toLowerCase().slice(1, -1) : null
    return str ? str.split(',') : []
  } else {
    return string
  }
}
function biologicalInfoFormat(bio) {
  let bioInfo = bio
  if (bio) {
    bioInfo.label = stringToArray(bio.label)
    bioInfo.swab = stringToArray(bio.swab)
    bioInfo.feather = stringToArray(bio.feather)
    bioInfo.blood = (bio.blood === '1' || bio.blood === true ) ? true : false
    // bioInfo.updated_at = unitFilter(bio.updated_at,'updated_at')
  }
  return bioInfo
}

const filters = {
  rule_type_filter,
  platform_type_filter,
  hour_day_month,
  unitFilter,
  deviceLocationFilter,
  stateFilter,
  arrayToSearchUrl,
  searchUrlToArray,
  biologicalInfoFormat
}
export default filters