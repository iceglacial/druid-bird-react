/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/24 0024.
 */
import {observable, action} from 'mobx'
import Highcharts from 'highcharts/highstock'
import appStore from '../../store/app_store'

let accountStore = observable({
  loading: false,
  deviceAll: [],
  selectedDevice: [], //对比设备
  rangeDate: {},
  selectDeviceModalVisible: false,
  analysisItems: [
    "battery_voltage", //电压
    "temperature",// 温度
    "light",//光照
    "pressure", //气压
    "humidity", //湿度
    "altitude", //海拔高度
    "ground_altitude",//飞行高度
    "relative_altitude",//地表海拔
    // "horizontal", //水平精度
    // "vertical", //垂直精度
    "speed", //速度
    "used_star",//定位卫星数
    "signal_strength", //信号强度
    "percentage", //定位成功率
    "fix_time", //定位时长
     ],
  selectedItem: [], //对比项
  selectItemModalVisible: false,
  showAnalysisBox: true,
})
const thisStore = accountStore;
thisStore.set = action((name,value) => {
  thisStore[name] = value
})
thisStore.setDeviceAll = action(array => {
  thisStore.deviceAll = array
})
//选择对比设备
thisStore.setSelectedDevice = action(array => {
  thisStore.selectedDevice = array
})
thisStore.setSelectedItem = action(array => {
  thisStore.selectedItem = array
})
thisStore.setRangeDate = action(array => {
  thisStore.rangeDate = array
})
thisStore.setSelectDeviceModalVisible = action(visible => {
  thisStore.selectDeviceModalVisible = visible
})
//选择对比项
thisStore.setSelectItem = action(array => {
  thisStore.selectedItem = array
})
thisStore.setSelectItemModalVisible = action(visible => {
  thisStore.selectItemModalVisible = visible
})
thisStore.reloadSeries = action((chart,chartName) => {
  // console.log(chart)
  thisStore.loading = true
  let dateTimeLabelFormats = {
    millisecond: '%H:%M:%S.%L',
    second: '%H:%M:%S',
    minute: '%H:%M',
    hour: '%H:%M',
    day: '%m.%e',
    week: '%m-%e',
    month: '%Y-%m',
    year: '%Y'
  };
  let color = ["#7ED321", "#F6A623", "#2DC9D7", "#BD0FE1", "#50E3C2", "#4990E2", "#FF556A", "#F8E81C", "#D0011B", "#417505"];
  Highcharts.stockChart(chartName || 'myChart', {
    global: {
      useUTC: true,
      // timezoneOffset: -480
    },
    lang: appStore.language.highChartsLang,
    rangeSelector: {
      selected: 4
    },
    xAxis: {
      type: 'datetime',
      breaks: [{
        breakSize: 0
      }],
      dateTimeLabelFormats: dateTimeLabelFormats,
    },
    yAxis: chart.yAxis,
    // 默认颜色
    colors: color,
    // 数据导出
    exporting: {
      enabled: true
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: true
        }
      },
      line: {
        connectNulls: true,//该设置会连接空值点
      },
      // series: {
      //   // compare: 'percent',
      //   showInNavigator: true
      // }
      series : {
        dataGrouping : {
          dateTimeLabelFormats : {
            millisecond: ['%Y-%m-%d %H:%M:%S'],
            second: ['%Y-%m-%d %H:%M:%S'],
            minute: ['%Y-%m-%d %H:%M:%S'],
            hour: ['%Y-%m-%d %H:%M:%S'],
            day: ['%Y-%m-%d %H:%M:%S'],
            week: ['%Y-%m-%d %H:%M:%S'],
            month: ['%Y-%m-%d %H:%M:%S'],
            year: ['%Y-%m-%d %H:%M:%S']
          }
        }
      }
    },
    // 信息框
    tooltip: {
      shared: true,
      crosshairs: true,
      useHTML: true,
      xDateFormat: '%Y-%m-%d %H:%M:%S',
      headerFormat: '<div><small>{point.key}</small></div>',
      pointFormat: '<table><tr>' +
      '<td style="color:{series.color}">{series.name}:</td>' +
      '<td>{point.y}</td>' +
      '</tr></table>',//({point.change}%)
      footerFormat: '',
      valueDecimals: 2,
      split: false
    },
    // 导航条
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'top',
      y: 20,
      floating: true,
      borderWidth: 0,
      margin: 20,
      // labelFormatter: function () {
      //   var label = $filter('chFilter')(this.name,'chart');
      //   if(labelFormatter === 1){
      //     label += "(" + $filter('unitFilter')(this.name) + ")";
      //   };
      //   return label;
      // }
    },
    rangeSelector: {
      enabled: true,
      buttons: [
        {
          type: 'day',
          count: 1,
          text: '1 D'
        },
        {
          type: 'week',
          count: 1,
          text: '1 W'
        },
        {
          type: 'month',
          count: 1,
          text: '1 M'
        },
        {
          type: 'month',
          count: 3,
          text: '3 M'
        },
        {
          type: 'month',
          count: 6,
          text: '6 M'
        },
        // {
        //     type: 'ytd',
        //     text: 'YTD'
        // },
        {
          type: 'year',
          count: 1,
          text: '1 Y'
        },
        {
          type: 'all',
          text: "ALL"
        }
      ],
      inputDateFormat: '%Y-%m-%d',// %H:%M:%S
    },
    // 滚动条
    navigator: {
      enabled: true,
    },
    series: chart.series
  });
  thisStore.loading = false
})
// 数据对比
thisStore.toggleAnalysisBox = action(() => {
  thisStore.showAnalysisBox = !thisStore.showAnalysisBox;
})
export default accountStore