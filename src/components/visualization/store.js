// import React from 'react'
import {observable, action} from 'mobx'
import Highcharts from 'highcharts/highcharts'
import moment from 'moment'
import axios from 'axios/index'
import {Api, MessageHandle, httpConfig} from '../../common'
import appStore from '../../store/app_store'

//设置图表语言包
Highcharts.setOptions({lang: appStore.language.highChartsLang});

//重写reset函数
Highcharts.Pointer.prototype.reset = () => {
};

//重写highlight函数
Highcharts.Point.prototype.highlight = function (event) {
    this.onMouseOver();
    // this.series.chart.tooltip.refresh(this);
    this.series.chart.xAxis[0].drawCrosshair(event, this);
};

class Store {
    @observable loading = false;
    @observable showCharts = false;
    @observable chartList = [];
    @observable timeRange = 'last_7_days';//默认时间范围
    // @observable start = moment().subtract(7, 'days').toISOString();// 开始时间
    // @observable end = moment().toISOString();// 结束时间
    @observable chartFullScreen = '';// 图表全屏
    @observable allowChartSplitting = false;// 是否为充电模式
    @observable chartSplit = false;// 图表当前是否已被拆分
    deviceType = 'single';// 设备单/多
    device = {};// 设备
    devices = [];// 多设备
    mode = 'flightActivity';// 当前模式
    modes = ['speed', 'odba'];//选中的数据模式列表
    week = '';//选择的周
    month = '';//选择的月份
    chartData = [];//存储图表数据
    mirrorDevice=[];//拆分图表所用的镜像设备列表


    chartType = {
        speed: {// 速度-折线图
            field: 'speed',//接口内字段
            type: 'line',
            color: '#D95500',
            name: appStore.language.speed,
            average: true,//平均值
            unit: '(m/s)',
        },
        // course: {// 航向-向量图*仅模式下可见
        //     field: 'course',
        //     type: 'line',
        //     color: '#4C4E5C',
        //     name: appStore.language.course,
        //     unit: ' ',
        // },
        odba: {// ODBA-面积图
            field: 'odba',
            type: 'area',
            color: '#1A94A9',
            name: appStore.language.odba,
            unit: ' ',
        },
        flightAltitude: {// 飞行高度-面积图
            field: 'relative_altitude',
            type: 'area',
            color: '#2E7DAE',
            name: appStore.language.flight_altitude,
            unit: '(m)',
        },
        surfaceHeight: {// 地面高度-面积图
            field: 'ground_altitude',
            type: 'area',
            color: '#905607',
            name: appStore.language.surface_height,
            unit: '(m)',
        },
        altitude: {// 海拔高度-折线图
            field: 'altitude',
            type: 'line',
            color: '#0E7CAA',
            name: appStore.language.altitude,
            unit: '(m)',
        },
        illumination: {// 光照-面积图
            field: 'light',
            type: 'area',
            color: '#DAC731',
            name: appStore.language.illumination,
            unit: '(Lx)',
        },
        voltage: {// 电压-折线图
            field: 'battery_voltage',
            type: 'line',
            color: '#669241',
            name: appStore.language.voltage,
            average: true,//平均值
            unit: '(V)',
        },
        // positioningSuccessRate: {// 定位成功率-折线+点图
        //     field:'',
        //     type: 'line',
        //     color: '#50BED2',
        //     name: '定位成功率',
        // },
        positioningDuration: {// 定位时长-点图
            field: 'fix_time',
            type: 'line', 
            color: '#CDAF5A ',
            name: appStore.language.positioning_duration,
            unit: '(s)',
            point: true,
        },
        satellites: {// 定位卫星数-点图
            field: 'used_star',
            type: 'line',
            color: '#69CD5A',
            name: appStore.language.number_of_positioning_satellites,
            point: true,
            unit: ' ',
        },
        signalStrength: {// 网络信号强度-折线*带标记区
            field: 'signal_strength',
            type: 'line',
            color: '#BB6BB8',
            name: appStore.language.internet_signal_strength,
            areaColor: '#F890B8',//标记区颜色
            text: '信号强度低',
            textColor: '#FF32A9',//标记区文字颜色
            unit: '(ASU)',
        },
        temperature: {// 温度-折线
            field: 'temperature',
            type: 'line',
            color: '#C3617F',
            name: appStore.language.temperature,
            unit: '(℃)',
        },
        humidity: {// 湿度-折线
            field: 'humidity',
            type: 'line',
            color: '#4EA2B9',
            name: appStore.language.humidity,
            unit: '(%)',
        },
        airPressure: {// 气压-折线
            field: 'pressure',
            type: 'line',
            color: '#CAAF55',
            name: appStore.language.pressure,
            unit: '(hpa)',
        },
    };


    modeList = {
        flightActivity: {// 飞行活动量
            singleChart: true,
            title: appStore.language.flight + '/' + appStore.language.activity_amount,
            modes: ['speed', 'odba']
        },
        flightAltitude: {// 飞行高度
            singleChart: true,
            title: appStore.language.flight + '/' + appStore.language.height,
            // modes: ['speed', 'flightAltitude', 'altitude', 'surfaceHeight']
            modes: ['speed', 'altitude' ]
        },
        charging: {//充电
            singleChart: true,
            title: appStore.language.charging,
            modes: ['voltage', 'illumination']
        },
        positioning: {//定位
            singleChart: false,
            title: appStore.language.positioning,
            modes: ['positioningDuration', 'satellites']
        },
        internetSignal: {//网络信号强度
            singleChart: true,
            title: appStore.language.internet_signal,
            modes: ['signalStrength']
        },
        sensor: {//传感器
            singleChart: false,
            title: appStore.language.sensor,
            modes: ['temperature', 'humidity', 'airPressure']
        },
        altitude: {//海拔
            singleChart: true,
            title: appStore.language.altitude2,
            modes: ['altitude']
        },
        freeChoiceMode: {//自由选择
            singleChart: false,
            title: appStore.language.freedom_of_choice,
        }
    }

    /*
    * 发送请求，获取数据
    * ids:id列表
    * types:类型列表
    * range:时间
    * */
    getChartData(ids, types, range) {
        //显示loading...
        this.loading = true

        console.log(ids, types, range);

        //时间处理
        let date = 0;

        if (range === 'last_7_days') {
            date = 7;
        } else if (range === 'last_1_month') {
            date = 30;
        } else if (range === 'week') {
            date = this.week
        } else if (range === 'month') {
            date = this.month
        }

        //区分情况生成请求列表
        let request = []//请求列表
        if (range === 'month') {
            for (let i = 0; i < ids.length; i++) {
                for (let j = 0; j < types.length; j++) {
                    if (types[j] === 'odba') {
                        request.push(axios.get(Api.behavior2chartMonth(ids[i], date), httpConfig('timestamp')))
                    } else {
                        request.push(axios.get(Api.chartMonth(ids[i], date), httpConfig('timestamp')))
                    }
                }
            }
        } else if (range === 'week') {
            for (let i = 0; i < ids.length; i++) {
                for (let j = 0; j < types.length; j++) {
                    if (types[j] === 'odba') {
                        request.push(axios.get(Api.behavior2chartWeek(ids[i], date), httpConfig('timestamp')))
                    } else {
                        request.push(axios.get(Api.chartWeek(ids[i], date), httpConfig('timestamp')))
                    }
                }
            }
        } else {//last XX
            for (let i = 0; i < ids.length; i++) {
                for (let j = 0; j < types.length; j++) {
                    if (types[j] === 'odba') {
                        request.push(axios.get(Api.behavior2chartLast(ids[i], date), httpConfig('timestamp')))
                    } else {
                        request.push(axios.get(Api.chartLast(ids[i], date), httpConfig('timestamp')))
                    }

                }
            }
        }

        //批量请求
        axios.all(request).then((val) => {
            let data = []
            for (let i = 0; i < val.length; i++) {
                data.push(val[i].data);
            }

            //当模式为充电时，允许进行图表拆分
            this.chartSplit = false;
            if (this.mode === 'charging') {
                this.allowChartSplitting = true;
                this.chartData = data;
                this.mirrorDevice=this.devices;
            } else {
                this.allowChartSplitting = false;
                this.chartData = [];
            }

            this.loadCharts(data);
        }).catch((err) => {
            MessageHandle(err)
        })
    }

    /*
    * 加载chart
    * chartName：图
    * */
    @action
    loadCharts(data) {
        console.log(data);
        //判断chart图数量
        let length = 1;
        if (this.mode === 'freeChoiceMode' || !this.modeList[this.mode].singleChart) {
            length = this.devices.length + this.modes.length - 1;
        }

        //循环生成chart数据
        for (let i = 0; i < length; i++) {
            let container = 'chartContainer-' + i;
            let series = [];
            let title = ' ';
            let yAxis = [];
            let lineColor = '';
            let marker = {};
            let stacking = '';

            //设置标题
            if (this.deviceType === 'multiple') {
                title = appStore.language.device + data[i][0].mark
            } else {
                if (!this.modeList[this.mode].singleChart) {
                    title = this.chartType[this.modes[i]].name
                } else {
                    title = this.modeList[this.mode].title;
                }
            }

            if (length === 1) {//单图
                //当模式为充电时，允许进行图表拆分
                if (this.mode === 'charging') {
                    this.allowChartSplitting = true;
                    this.chartData = data;
                } else {
                    this.allowChartSplitting = false;
                }

                for (let j = 0; j < data.length; j++) {

                    //循环设置数据
                    let chartData = [];
                    for (let k = 0; k < data[j].length; k++) {
                        // 为飞行/高度模式处理异常值(定位异常点)
                        if (this.mode === 'flightAltitude' && data[j][k].longitude === 200) {
                            continue;
                        }

                        // 为飞行/高度模式处理异常值（高度异常点）
                        if (this.mode === 'flightAltitude' &&
                            this.modes[j] === 'altitude' &&
                            (data[j][k].ground_altitude > data[j][k][this.chartType[this.modes[j]].field])) {
                            //设备海拔高度低于为负值时强制设为地面高度+1
                            chartData.push([
                                moment(data[j][k].timestamp) - 0,
                                data[j][k].ground_altitude + 1
                            ]);

                        } else if (this.mode === 'flightAltitude' &&
                            this.modes[j] === 'flightAltitude' &&
                            (data[j][k][this.chartType[this.modes[j]].field] < 0)) {
                            //飞行高度为负值是强制设为1
                            chartData.push([
                                moment(data[j][k].timestamp) - 0,
                                1
                            ]);
                        } else {
                            chartData.push([
                                moment(data[j][k].timestamp) - 0,
                                data[j][k][this.chartType[this.modes[j]].field]
                            ]);
                        }
                    }

                    //设置点标记样式
                    if (this.chartType[this.modes[j]].point) {
                        marker = {
                            enabled: true,
                            fillColor: '#ffffff',
                            lineColor: this.chartType[this.modes[j]].color,
                            lineWidth: 2,
                            radius: 6
                        }
                        lineColor = 'transparent';
                    } else {
                        marker = {
                            enabled: false,
                        }
                        lineColor = this.chartType[this.modes[j]].color
                    }

                    //当模式为飞行高度或充电时，数据类型为速度或电压线条zIndex提前
                    let zIndex = false;
                    if ((this.mode === "flightAltitude" || this.mode === 'charging') &&
                        (this.modes[j] === 'speed' || this.modes[j] === 'voltage')) {
                        zIndex = true;
                    }

                    //当模式为飞行高度时，数据类型为飞行高度或电地面高度要堆叠
                    let stack = false;
                    if (this.mode === "flightAltitude" &&
                        (this.modes[j] === 'flightAltitude' || this.modes[j] === 'surfaceHeight')) {
                        stack = true;
                    }

                    //循环设置系列样式
                    series.push({
                        type: this.chartType[this.modes[j]].type,
                        data: chartData,
                        color: this.chartType[this.modes[j]].color,
                        name: this.chartType[this.modes[j]].name,
                        lineWidth: (this.mode === 'flightAltitude' && this.modes[j] === 'surfaceHeight') ? 0 : 2,
                        yAxis: (this.mode === 'flightAltitude' && this.modes[j] !== 'speed') ? 1 : j,
                        marker: marker,
                        stacking: stack ? 'normal' : null,
                        zIndex: zIndex ? 9 : null
                    })

                    //当数据类型为速度或电压时，设置平均线
                    let plotLine = {}
                    let max = 0;
                    if (this.chartType[this.modes[j]].average) {
                        let num = 0;
                        for (let k = 0; k < data[j].length; k++) {
                            num += data[j][k][this.chartType[this.modes[j]].field]
                            if (data[j][k][this.chartType[this.modes[j]].field] > max) {
                                max = data[j][k][this.chartType[this.modes[j]].field];
                            }
                        }
                        num /= data[j].length;
                        plotLine = {
                            color: '#ccc',
                            width: 1,
                            label: {
                                text: num.toFixed(2) + this.chartType[this.modes[j]].unit,
                                style: {
                                    color: '#ccc',
                                    textShadow: '0 0 8px #fff'
                                }
                            },
                            value: num,
                            zIndex: 9
                        }
                    }

                    //循环设置Y轴(flightAltitude 公用Y轴)
                    if (true
                    //暂时屏蔽了地表高度与飞行高度，因此公用Y轴条件去掉
                        // this.mode !== 'flightAltitude' ||
                        // this.modes[j] !== 'altitude' && this.modes[j] !== 'surfaceHeight'
                ) {
                        yAxis.push({
                            id: j,
                            title: {
                                text: this.chartType[this.modes[j]].unit || ' '
                            },
                            plotLines: [plotLine],
                            gridLineColor: 'transparent',
                            opposite: !!(j % 2),
                        })
                    }


                }
            } else {//多图
                let modes_i = this.modes.length === 1 ? 0 : i;

                //设置数据
                let chartData = [];
                for (let j = 0; j < data[i].length; j++) {
                    chartData.push([
                        moment(data[i][j].timestamp) - 0,
                        data[i][j][this.chartType[this.modes[modes_i]].field]
                    ]);
                }

                //设置点标记样式
                if (this.chartType[this.modes[modes_i]].point) {
                    marker = {
                        enabled: true,
                        fillColor: '#ffffff',
                        lineColor: this.chartType[this.modes[modes_i]].color,
                        lineWidth: 2,
                        radius: 6
                    }
                    lineColor = 'transparent';
                } else {
                    marker = {
                        enabled: false,
                    }
                    lineColor = this.chartType[this.modes[modes_i]].color
                }

                //设置系列对象
                series = [{
                    type: this.chartType[this.modes[modes_i]].type,
                    data: chartData,
                    color: lineColor,
                    name: this.chartType[this.modes[modes_i]].name,
                    marker: marker,
                }]

                //设定y轴样式
                yAxis = [{
                    gridLineColor: 'transparent',
                    title: {
                        text: this.chartType[this.modes[modes_i]].unit
                    }
                }]
            }


            // 图表配置
            let options = {
                chart: {
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift',
                    marginLeft: 70
                },
                title: {
                    text: title,
                    align: 'left'
                },
                series: series,
                noData: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px',
                        color: '#303030'
                    }
                },
                tooltip: {
                    dateTimeLabelFormats: {
                        millisecond: '%Y-%m-%d %H:%M:%S',
                        second: "%Y-%m-%d %H:%M:%S",
                        minute: "%Y-%m-%d %H:%M:%S",
                        hour: "%Y-%m-%d %H:%M:%S",
                        day: "%Y-%m-%d %H:%M:%S",
                        week: "%Y-%m-%d %H:%M:%S",
                        month: "%Y-%m-%d %H:%M:%S",
                        year: "%Y-%m-%d %H:%M:%S"
                    },
                    shared: true,
                },
                yAxis: yAxis,
                xAxis: {
                    crosshair: true,
                    events: {
                        setExtremes: this.syncExtremes
                    },
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m-%d',
                        week: '%m-%d',
                        month: '%Y-%m',
                        year: '%Y'
                    }
                },
            };

            Highcharts.chart(container || 'chartContainer-1', options);
        }

        this.loading = false;
    };

    /*
    * 事件同步到其他图表
    * */
    syncExtremes(e) {
        var thisChart = this.chart;
        if (e.trigger !== 'syncExtremes') {
            Highcharts.each(Highcharts.charts, function (chart) {
                if (!chart) {
                    return
                }
                if (chart !== thisChart) {
                    if (chart.xAxis[0].setExtremes) {
                        chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {trigger: 'syncExtremes'});
                    }
                }
            });
        }
    }

    /*
    * 鼠标移动时间
    * */
    handleMouseMove(e) {
        let point = null;
        let event = null;
        Highcharts.charts.forEach(chart => {
            if (!chart) {
                return
            }
            // console.log(chart)
            event = chart.pointer.normalize(e);
            point = chart.series[0].searchPoint(event, true);
            if (point) {
                point.highlight(e);
            }
        });
    }

    /*
    * 图表全屏切换
    * */
    @action
    toggleChartFullScreen = () => {
        this.chartFullScreen = 'chartFullScreen';
    }

    /*
     * 图表拆分合并切换
     * */
    @action
    chartSplitToggle = () => {
        if (!this.allowChartSplitting) {
            return;
        }
        //创建图表选择框状态镜像
        let mirror = {
            mode: this.mode,
            modes: this.modes,
            devices: this.devices,
            deviceType: this.deviceType,
        }

        //强制规范图表状态
        this.modes = ['voltage', 'illumination'];
        this.deviceType='single';
        this.devices=this.mirrorDevice;

        if (this.chartSplit) {//合并操作
            this.set('chartList',[0]);
            // alert('合并成功！')
            this.mode = 'charging';
            this.chartSplit = false;

        } else {//拆分操作
            this.set('chartList',[0,1]);
            // alert('拆分成功！')
            this.mode = 'freeChoiceMode';
            this.chartSplit = true;
        }

        // 镜像还原
        setTimeout(
            ()=>{
                this.loadCharts(this.chartData);
                // 镜像还原
                this.mode = mirror.mode;
                this.modes = mirror.modes;
                this.devices = mirror.devices;
                this.deviceType = mirror.deviceType;
            },50)

    }

    @action
    clearData() {
        this.aaa = '';
        this.chartList = [];
        this.timeRange = 'last_7_days';
        this.deviceType = 'single';// 设备单/多
        this.device = {};// 设备
        this.devices = [];// 多设备
        this.mode = 'flightActivity';// 当前模式
        this.modes = ['speed', 'odba'];//选中的数据模式列表
        this.week = '';//选择的周
        this.month = '';//选择的月份
        this.chartData = [];//图表数据
        this.allowChartSplitting = false;// 是否为充电模式
        this.showCharts = false;
        this.chartSplit = false;
    }

    @action
    set(n, d) {
        this[n] = d
    }
}

const store = new Store()
export default store

