/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/26 0026.
 */
import moment from 'moment'
import Filters from './filters'
import appStore from '../store/app_store'

const {unitFilter} = Filters

/**
 * 多个设备-单个对比项
 */
function oneKey(data, key, devices) {
    let chart = {
        title: '',
        tooltip: {},
        yAxis: {
            lineWidth: 1,
            tickWidth: 1,
            opposite: false,
            title: {
                text: appStore.language.getKeyName(key) + '(' + unitFilter('unit', key) + ')',
                // style: {
                //   color: ''
                // }
            },
        },
        series: []
    };
    let isPercentAge = (key === "percentage");
    data.map(function (deviceRes, device_index) {
        let device = deviceRes.data;
        let _deviceSeries = [];
        let seriesTmp;
        let deviceMark;
        device.map(function (value, index) {
            let lng = value.longitude;
            let lat = value.latitude;
            let time = isRangeTime(isPercentAge ? value.date : value.timestamp);
            let checkPoint = isPercentAge ? time : (time && validVoltage(value.battery_voltage, key));
            if (checkPoint) {
                let tmpVal = value[key];
                !isPercentAge && ((key === "timestamp") ? (tmpVal = getUpdateTime(time, validLatLng(key, lat, lng))) : (checkPoint = validLatLng(key, lat, lng)));
                // let unit = $filter('unitFilter')(tmpKey,'chart');
                if (checkPoint) {
                    // console.log($filter('unitFilter')(time,"updated_at"),tmpVal);
                    (tmpVal !== undefined) && (tmpVal !== null) && _deviceSeries.push([time, tmpVal]);
                    deviceMark = value.mark || value.uuid;
                    seriesTmp = {
                        name: deviceMark + '(' + (_deviceSeries.length || 0) + ')',
                        data: _deviceSeries,
                        tooltip: {valueSuffix: ' ' + unitFilter('unit', key), valueDecimals: 3},//保留小数位数
                    };
                }
                ;
            }
        })//device one
        if (seriesTmp) {
            chart.series.push(seriesTmp)
        } else {
            let dInfo = devices[device_index].split('.')
            deviceMark = dInfo[1] !== 'undefined' ? dInfo[1] : dInfo[2]
            chart.series.push({
                name: deviceMark + '(0)',
                data: []
            });
        }
    })//device all
    // console.log(chart);
    return chart;
}

/**
 * 单个设备-多个对比项
 */
function oneDevice(data, keys, gpsCountData) {
    let chart = {
        title: '',
        tooltip: {},
        yAxis: [],
        series: []
    };
    keys.map(function (_key, _kIndex) {
        let _series = [];//key - 对应series数据
        data.map(function (_value, _dIndex) {
            var lng = _value.longitude;
            var lat = _value.latitude;
            var time = _value.timestamp;
            time = isRangeTime(time);
            // console.log(validLatLng(_key,lat,lng),_key,lat,lng)
            if (time) {
                if (_key === "percentage") {
                    _series = oneDeviceGpsCount(gpsCountData);
                }
                else {
                    let tmpVal = _value[_key];
                    let _validVoltage = validVoltage(_value.battery_voltage, _key);
                    let _validLatLng = validLatLng(_key, lat, lng);
                    if (_validVoltage && _validLatLng) {
                        (_key === "timestamp") && (tmpVal = getUpdateTime(time, _validLatLng));
                        _series.push([time, tmpVal]);
                    }
                }
                ;
            }
        })//获取key数据
        if (_series) {
            let type = ''
            let color = null
            if (_key === 'light') {
                type = 'area'
                color = '#DAC731'
            } else {
                type = 'line'
            }
            var seriesTmp = {
                type: type,
                name: appStore.language.getKeyName(_key) + '(' + (_series.length || 0) + ')',
                data: _series,
                color: color,
                yAxis: _kIndex,
                tooltip: {valueSuffix: ' ' + unitFilter('unit', _key), valueDecimals: 3},//保留小数位数
                pointInterval: 1,
                dataGrouping: {
                    enabled: false
                }
            };
            chart.series.push(seriesTmp);
        }
        ;
        //yAxis
        let tmp = {
            className: 'highcharts-color-' + (_kIndex + 1),
            lineWidth: 1,
            tickWidth: 1,
            title: {
                text: appStore.language.getKeyName(_key) + ' (' + unitFilter('unit', _key) + ')',
                // style: {
                //   color: ''
                // }
            },
        };
        (_kIndex % 2 === 1) ? (tmp.opposite = true) : (tmp.opposite = false);
        chart.yAxis.push(tmp);
    })//key
    // console.log(chart)
    return chart;
}

/**
 * 单个设备对比时，计算gpscount: data = [...]
 * @param data
 * @param yAxisIndex
 * @returns {Array}
 */
function oneDeviceGpsCount(data) {
    let _seriesData = [];
    data.map(function (_value) {
        let time = _value.date;
        time = isRangeTime(time);
        time && _seriesData.push([time, _value.percentage]);
    })
    return _seriesData;
}

/**
 * 计算上传历时
 * @param time
 * @param valid
 * @returns {*}
 */
function getUpdateTime(time, valid) {
    /**
     * 精确到秒
     * 不在有效时间范围内：隐藏
     */
    let validTime = 10;
    let finalSeconds;
    if (valid === "undefined" || valid === true) {
        let minutes = (new Date(time)).getMinutes();
        let seconds = (new Date(time)).getSeconds();
        if (minutes < validTime) {
            finalSeconds = minutes * 60 + seconds;
        } else if (minutes >= (60 - validTime)) {
            finalSeconds = (minutes - 60) * 60 + seconds;
        }
        ;
    }
    else {
        finalSeconds = validTime * 60;
    }
    ;
    return finalSeconds;
}

/**
 * 当电压为0，【signal_strength，dimension，horizontal，vertical，speed，course，battery_voltage】均视为无效数据
 * @param voltage
 * @param key
 * @returns {boolean}
 */
function validVoltage(voltage, key) {
    let valid = true;
    let isLimitKey = ((key === "signal_strength" || key === "dimension" || key === "horizontal" || key === "vertical" || key === "speed" || key === "course" || key === "battery_voltage"));
    if ((voltage === 0) && isLimitKey) {
        valid = false
    }
    ;
    return valid;
}

/**
 * 判断时间是否有效
 * * @param time
 * @param time_begin
 * @param time_end
 * @returns {*}
 */
function isRangeTime(time, time_begin, time_end) {
    let minTime = moment('2010-01-01').valueOf();//最小时间
    let maxTime = moment('2030-01-01').valueOf();//最大时间
    let _time = unitFilter(time, 'millisecond');//time本身为UTC时间
    let timeBegin = unitFilter(time_begin, 'millisecond');
    let timeEnd = unitFilter(time_end, 'millisecond');
    if ((timeBegin && (_time < timeBegin)) || (timeEnd && (timeEnd < _time)) || (_time < minTime) || (_time > maxTime)) {
        _time = null;
    }
    ;
    // console.log(_time);
    return _time;
}

/**
 * 经纬度无效时，【altitude，ground_altitude，dimension，horizontal，vertical，speed，course，used_star】均视为无效数据
 * @param key
 * @param lat
 * @param lng
 * @returns {boolean}
 */
function validLatLng(key, lat, lng) {
    let isLimitedItems = ['altitude', 'ground_altitude', 'relative_altitude', 'dimension', "horizontal", "vertical", "speed", "course", "used_star"]
    let isLimitKey = (isLimitedItems.indexOf(key) !== -1);
    if (isLimitKey) {// 经纬度无效无数据
        return ((lat > -90) && (lat < 90) && (lng > -180) && (lng < 180));
    }
    else {// 经纬度无效有数据
        return true;
    }
}

// 格式化series data
const SeriesData = {
    oneDevice,
    oneKey
}

const HighchartPro = {
    validLatLng,
    SeriesData,
}

export default HighchartPro