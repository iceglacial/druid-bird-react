/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/13 0013.
 */
import {observable, action} from 'mobx'
import {Formatter} from './../../../common'
import appStore from "../../../store/app_store";
import Highcharts from "highcharts/highstock";
import AppDevice from './gps.grid'

const {ActivityIntensity, ActivityPercent} = Formatter

let deviceStore = observable({
    reload: false,
    loading: false,
    rangeDate: {},//数据筛选
    gridType: 'env',
    gpsData: [],
    gpsShowType: '1',
    behaviorData: [],
    behavior2Data: [],
    smsData: [],
    datePickDirection: true,//true:以前,false:以后
    datePicking: false,//时间是否被选中
    direction: '',//左右翻页方向
    chartMerge:false,
})
const thisStore = deviceStore;
thisStore.set = action((name, value) => {
    thisStore[name] = value
})
thisStore.setGpsData = action(array => {
    thisStore.gpsData = array
})
thisStore.setBehaviorData = action(array => {
    thisStore.behaviorData = array
})
thisStore.setBehavior2Data = action(array => {
    thisStore.behavior2Data = array
})
thisStore.setSmsData = action(array => {
    thisStore.smsData = array
})
thisStore.setRangeDate = action(array => {
    thisStore.rangeDate = array;
    thisStore.reload = true;
})
thisStore.setDatePickDirection = action(value => {
    thisStore.datePickDirection = value;
    thisStore.reload = true;
})
thisStore.setReload = action(reload => {
    thisStore.reload = reload
})
thisStore.clearStore = action(() => {
    thisStore.gpsData = [];
    thisStore.behaviorData = [];
    thisStore.behavior2Data = [];
    thisStore.smsData = [];
    thisStore.rangeDate = {};
    thisStore.datePickDirection = true;
    thisStore.datePicking = false;
    thisStore.direction = '';
    thisStore.chartMerge = false;
    thisStore.gridType= 'env';
})
thisStore.reloadSeries = action((chart, chartName) => {
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
    let color = ["#669241", "#DAC731", "#2DC9D7", "#BD0FE1", "#50E3C2", "#4990E2", "#FF556A", "#F8E81C", "#D0011B", "#417505"];
    Highcharts.stockChart(chartName, {
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
export default deviceStore;
