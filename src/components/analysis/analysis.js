/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/24 0024.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, httpConfig, HighchartPro, DateRangePro} from '../../common'
import thisStore from './store'
import {Card, Button, Row, Col, Icon, DatePicker, Spin} from 'antd'
import moment from 'moment'
import appStore from '../../store/app_store'
import SelectDeviceModal from './select.device.modal'
import SelectItemModal from './select.items.modal'
import LoadingImg from '../../common/loadingImg'


const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
@observer
class Analysis extends React.Component {
  constructor() {
    super()
    this.language = appStore.language
    thisStore.set('showAnalysisBox',true)
  }

  state = {
    showAnalysisBox: true
  }
  setRangeDate = (date, dateString) => {
    //date默认时区为本地，.toJSON() => 自动转换为UTC时区
    if (date.length) {
      const _rangeDate = {
        begin: date[0].toJSON(),
        end: date[1].toJSON()
      }
      thisStore.setRangeDate(_rangeDate);
    } else {
      thisStore.setRangeDate({});
    }
    // console.log(moment.utc(date[0]),_rangeDate,dateString);
  }
  removeSelectedDevice = (index) => {
    // console.log(index);
    const _selectedDevice = thisStore.selectedDevice;
    _selectedDevice.splice(index, 1);
    // console.log(_selectedDevice)
    // thisStore.setSelectedDevice(_selectedDevice);
  }
  loadChart = () => {
    thisStore.set('loading', true)
    const _device = thisStore.selectedDevice;
    const _item = thisStore.selectedItem;
    const _rangeDate = thisStore.rangeDate;
    // const _configParams = {
    //   params: _rangeDate
    // }
    // config = Object.assign(config, _configParams);
    // config.headers['x-result-sort'] = 'timestamp';
    if (_item.length === 1 && _device.length >= 1) {
      let _request = [];
      for (let i = 0; i < _device.length; i++) {
        let _id = _device[i] && _device[i].split('.')[0];
        if (_item[0] === 'percentage') {
          // config.headers['x-result-sort'] = 'date';
          _request.push(axios.get(Api.gpsCount(_id), httpConfig('date', null, null, _rangeDate)));
        } else {
          _request.push(axios.get(Api.gps(_id), httpConfig('timestamp', null, null, _rangeDate)));
        }
      }
      axios.all(_request).then(axios.spread(function (...res) {
        // Both requests are now complete
        let chart = HighchartPro.SeriesData.oneKey(res, _item[0], _device);//formatSeriesDeviceMore(res,_item[0])
        thisStore.reloadSeries(chart);
        // console.log(ReactHighstock.Highcharts.charts[0])
        // ReactHighstock.Highcharts.charts[0].reflow();
      }))
    } else if (_item.length > 1) {
      let _oneDeviceID = _device[0] && _device[0].split('.')[0];
      axios.get(Api.gps(_oneDeviceID), httpConfig('timestamp', null, null, _rangeDate)).then(res => {
        if (_item.indexOf('percentage') >= 0) {
          // config.headers['x-result-sort'] = 'date';
          axios.get(Api.gpsCount(_oneDeviceID), httpConfig('date', null, null, _rangeDate)).then(resCount => {
            let chart = HighchartPro.SeriesData.oneDevice(res.data, _item, resCount.data);//formatSeriesDeviceMore(res,_item[0])
            thisStore.reloadSeries(chart);
          })
        } else {
          let chart = HighchartPro.SeriesData.oneDevice(res.data, _item);//formatSeriesDeviceMore(res,_item[0])
          thisStore.reloadSeries(chart);
        }
      })
    } else {
      thisStore.set('loading', false)
    }
    thisStore.toggleAnalysisBox();
    // console.log(thisStore.selectedDevice,thisStore.selectedItem,thisStore.rangeDate);
  }

  render() {
    // const removeSelectedDevice = this.removeSelectedDevice;
    const language = this.language
    return (
      <div className="wrap wrap-full">
        <div className="analysisBox" hidden={!thisStore.showAnalysisBox}>
          <Spin spinning={thisStore.loading} indicator={LoadingImg}>
            <div className="box-body">
              <Card title={appStore.language.data_visualization}
                    extra={<Button onClick={thisStore.toggleAnalysisBox}>{appStore.language.hide_filter_box} <Icon
                      type="up"/></Button>}>
                <Row type='flex'>
                  <Col className='select-box'>
                    <Row>
                      <Col className='item-box'>
                        <SelectDeviceModal/>
                      </Col>
                      <Col className='item-box'>
                        <SelectItemModal/>
                      </Col>
                      <Col className="item-box">
                        <div className="">
                          <span className="title">{appStore.language.select_date_range}：</span>
                          <RangePicker
                            style={{'width': '350px'}}
                            disabledDate={DateRangePro.disabledDate}
                            // disabledTime={DateRangePro.disabledRangeTime}
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                            }}
                            // //placeholder={[appStore.language.start_date,appStore.language.end_date]}
                            format={dateFormat}
                            onChange={this.setRangeDate}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col className='action-box'>
                    <Button type="primary" onClick={this.loadChart}>{appStore.language.generating_chart}</Button>
                  </Col>
                </Row>
              </Card>
            </div>
          </Spin>
        </div>
        <Spin spinning={thisStore.loading}indicator={LoadingImg}>
          <div className="flex-box wrap-full">
            <div className="wrap text-right">
              {/*{thisStore.selectedItem.map(key=>*/}
              {/*<span key={Math.random()*1000000}>{key},</span>*/}
              {/*)}*/}
              {/*{thisStore.selectedDevice.map(device=>*/}
              {/*<span key={Math.random()*1000000}>{device.mark||device.uuid}</span>*/}
              {/*)}*/}
              <Button onClick={thisStore.toggleAnalysisBox}>{appStore.language.show_filter_box} <Icon
                type="down"/></Button>
            </div>
            <div id="myChart"></div>
          </div>
        </Spin>
      </div>
    )
  }
}

export default Analysis