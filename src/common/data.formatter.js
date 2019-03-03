/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/26 0026.
 */
import Filters from './filters'
import '../js/transform'
import appStore from "../store/app_store";

const {unitFilter} = Filters
const eviltransform = window.eviltransform

/**
 * gps数据过滤 - 单位优化
 * @param data
 * @returns {*}
 * @constructor
 */
function GpsDataFormatter(array) {
    let afterArray = [];
    array.map(function (data) {
        let _data = data;
        _data.mark = data.mark || -1; // -1 for sort
        let valid = ValidLatLng(data.latitude, data.longitude);
        let limitedKey = ['latitude', 'longitude', 'altitude', 'course', 'dimension', 'horizontal', 'speed', 'used_star', 'vertical', 'view_star'];
        for (let key in data) {
            if (limitedKey.indexOf(key) >= 0 && !valid) {
                _data[key] = '-';
            } else {
                _data[key] = unitFilter(data[key], key);
            }
        }
        afterArray.push(_data);
    })
    return afterArray;
}

/**
 * 行为数据过滤 - 单位优化
 * @param array
 * @returns {Array}
 * @constructor
 */
function BhvDataFormatter(array) {
    let afterArray = [];
    array.map(function (data) {
        let _data = data;
        for (let key in data) {
            _data[key] = unitFilter(data[key], key);
        }
        afterArray.push(_data);
    })
    return afterArray;
}

/**
 * 行为数据2过滤 - 单位优化
 * @param array
 * @returns {Array}
 * @constructor
 */
function Bhv2DataFormatter(array) {
    let afterArray = [];
    array.map(function (data) {
        let _data = data;
        for (let key in data) {
            _data[key] = unitFilter(data[key], key);
        }
        afterArray.push(_data);
    })
    return afterArray;
}

/**
 * 格式化设备配置数据
 * @param array
 * @returns {Array}
 * @constructor
 */
function SettingDataFormatter(array) {
    let afterArray = [];
    let keys = [
        "mark",
        "uuid",
        "updated_at",
        "downloaded_at",
        "behavior_sampling_mode",
        // "behavior_sampling_freq",// 兼容sort，需单独格式化
        "behavior_voltage_threshold",
        "env_sampling_mode",
        // "env_sampling_freq",// 兼容sort，需单独格式化
        "env_voltage_threshold",
        "gprs_mode",
        // "gprs_freq",// 兼容sort，需单独格式化
        "gprs_voltage_threshold",
        "gprs_version",
        "ota_voltage_threshold",
        "sp_number",
    ]
    array.map(function (data) {
        let _data = data;
        for (let key of keys) {
            _data[key] = data[key] !== undefined ? unitFilter(data[key], key) : '';
        }
        // _data.mark = data.mark || -1; // -1 for sort
        afterArray.push(_data);
    })
    return afterArray;
}

/**
 * 设备列表数据格式化
 * @param array
 * @returns {Array}
 * @constructor
 */
function DeviceDataFormatter(array) {
    let afterArray = [];
    let childKeys = ['last_gps.timestamp', 'updated_at','last_valid_gps.longitude.latitude']
    array.map(function (data) {
        let _data = data;
        _data.mark = data.mark || ''; // -1 for sort
        childKeys.map(keyStr => {
            let keyName = keyStr
            let keys = keyStr.split('.');
            if (keys.length === 2) {
                keyName = keyStr.replace('.', '_')
                _data[keyName] = data[keys[0]] ? unitFilter(data[keys[0]][keys[1]], keys[1]) : '-'
            } else if (keys.length === 1) {
                _data[keyName] = unitFilter(data[keyName], keyName)
            }else if(keys.length===3){
                let lat,lon;
                lon=data[keys[0]] ? unitFilter(data[keys[0]][keys[1]], keys[1]) : ''
                lat=data[keys[0]] ? unitFilter(data[keys[0]][keys[2]], keys[2]) : ''
                _data[keyName] = lon?lat+','+lon:'-';
            }
        })
        let deviceTypeInfo = getDeviceType(_data.hardware_version, _data.device_type);
        afterArray.push(Object.assign(_data, deviceTypeInfo));
    })
    return afterArray;
}

function getDeviceType(hardware, type) {
    let device_type_name;//设备类型
    let device_model;//设备型号
    let sim_operator = appStore.language.unicom;//SIM卡运营商
    let operator_type = '2G';
    let device_bluetooth = '2.0';//蓝牙版本
    /**
     * neck_collar,backpack,ear_tag
     */
    if (type === 1) {
        if (hardware === 1) {
            device_type_name = appStore.language.device_name('neck_collar');
            device_model = "Debut 45"
        } else if (hardware === 2) {
            device_type_name = appStore.language.device_name('neck_collar')
            device_model = "Debut 35"
        }
        else if (hardware === 3) {
            device_type_name = appStore.language.device_name('neck_collar')
            device_model = "Debut 35"
        }
        else if (hardware === 4) {
            device_type_name = appStore.language.device_name('neck_collar')
            device_model = "Debut 35" + appStore.language.new_edition
        }
    }
    else if (type === 2) {
        if (hardware === 1) {
            device_type_name = appStore.language.device_name('backpack');
            device_model = "Debut 15"
        } else if (hardware === 2) {
            device_type_name = appStore.language.device_name('backpack')
            device_model = "Debut 15" + appStore.language.new_edition
        }
    }
    else if (type === 3) {
        if (hardware === 1) {
            device_type_name = appStore.language.device_name('neck_collar');
            device_model = "Debut 35"
        } else if (hardware === 2) {
            device_type_name = appStore.language.device_name('neck_collar')
            device_model = "Debut 35" + appStore.language.new_edition
        }
        device_bluetooth = '4.0'
        operator_type = '3G';
    }
    else if (type === 101) {
        if (hardware === 1) {
            device_type_name = appStore.language.device_name('ear_tag');
            device_model = "Aniact 15"
        }
        sim_operator = appStore.language.china_mobile
    }
    return {
        device_type: device_type_name,
        device_model,
        network_operator: sim_operator + ' ' + operator_type,
        sim_operator,
        operator_type,
        device_bluetooth
    }
}

/**
 * 格式化用户信息
 * @param array
 * @returns {*}
 * @constructor
 */
function UserDataFormatter(array) {
    let afterArray = array;
    afterArray.map(user => {
        user.device_count = user.device_id ? user.device_id.length : 0;
    })
    return afterArray;
}

/**
 * 经纬度有效性
 * @param lat
 * @param lng
 * @returns {{lat: *, lng: *}}
 * @constructor
 */
function ValidLatLng(lat, lng) {
    if (((lat > -90) && (lat < 90) && (lng > -180) && (lng < 180))) {
        let loc = {
            lat: lat,
            lng: lng
        }
        return loc;
    }
}

/**
 * 中国区加偏
 * @param lat, lng
 * @returns {lat: xxx,lng: xxx} / false
 */
function addLatLngOffset(lat, lng) {
    let latLng = ValidLatLng(lat, lng);
    if (latLng) {
        let gcj = eviltransform.wgs2gcj(latLng.lat, latLng.lng);
        // console.log(lat,lng,"加偏:",gcj.lat,gcj.lng);
        return {
            lat: parseFloat(gcj.lat.toFixed(7)),
            lng: parseFloat(gcj.lng.toFixed(7))
        };
    }
}

/**
 * 中国区去偏
 * @param lat, lng
 * @returns {lat: xxx,lng: xxx} / false
 */
function removeLatLngOffset(lat, lng) {
    let latLng = ValidLatLng(lat, lng);
    if (latLng) {
        let wgs = eviltransform.gcj2wgs(latLng.lat, latLng.lng);
        // console.log(latLng,"去偏",wgs);
        return {
            lat: parseFloat(wgs.lat.toFixed(7)),
            lng: parseFloat(wgs.lng.toFixed(7))
        };
    }
}

function dataFormat(type, data) {
    if (type === 'device') {
        return DeviceDataFormatter(data)
    } else if (type === 'env' || type === 'sms' || type === 'gps') {
        return GpsDataFormatter(data)
    } else if (type === 'bhv') {
        return BhvDataFormatter(data)
    } else if (type === 'device_setting') {
        return SettingDataFormatter(data)
    } else if (type === 'user') {
        return UserDataFormatter(data)
    }
    return data
}

const DataFormatter = {
    dataFormat,
    DeviceDataFormatter,
    GpsDataFormatter,
    BhvDataFormatter,
    Bhv2DataFormatter,
    SettingDataFormatter,
    UserDataFormatter,
    ValidLatLng,
    addLatLngOffset,
    removeLatLngOffset,
}
export default DataFormatter