/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import './index.less'
import {Row, Col, Button, message, Popover, Radio, DatePicker, Checkbox} from 'antd'
import moment from 'moment';
import axios from 'axios'
import {Api, httpConfig, MessageHandle, DateRangePro} from '../../common'
import thisStore from './store'
import {observer} from 'mobx-react'
import FileSaver from 'file-saver'
import {Link} from 'react-router-dom'
import appStore from '../../store/app_store'

const {RangePicker} = DatePicker;

/**
 * 设置日期选择框随外层元素移动
 * @param trigger
 * @returns {*|Element|Node}
 */
function getCalendarContainer(trigger) {
  return trigger.parentNode;
}

@observer
class DeviceListHead extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      downloadLoading: false,
      fileType: 'kml',
      multiple: true,
      rangeDate: [],
      selectAll: false
    }
  }

  componentDidMount() {
  }

  /**
   * 退出导出状态
   */
  cancelExport() {
    thisStore.setDownloadDeviceGpsState(false);
    // let rows = [];
    // thisStore.deviceAll.forEach((r) => {
    //   rows.push(Object.assign({}, r, {isSelected: false}));
    // });
    // thisStore.setDeviceAll(rows);
    thisStore.set('cancelExport', true)
  }

  /**
   * 导出设备的环境数据
   */
  downloadDeviceGps = () => {
    this.setState({
      downloadLoading: true
    })
    if (!!thisStore.downloadDeviceGps.length) {
      const _fileType = this.state.fileType;//thisStore.downloadFileType;
      const _fileMultiple = this.state.multiple;//thisStore.downloadMultiple;
      const _rangeDate = this.state.rangeDate;//thisStore.downloadRangeDate;
      const _data = {
        id: thisStore.downloadDeviceGps
      };
      let config = Object.assign(httpConfig(), {responseType: "arraybuffer"});
      axios.post(Api.downloadDeviceGps(_fileType, _rangeDate, _fileMultiple), _data, config).then(res => {
        thisStore.set("cancelExport",false);
        let fileName;
        var disposition = res.headers['content-disposition'] || res.headers['Content-Disposition'];
        if (typeof disposition !== 'undefined') {
          var responseFilename = /filename=([^;]*);?/.exec(disposition);
          if (responseFilename != null && responseFilename.length > 1) {
            fileName = responseFilename[1];
          }
        }
        var _dData = new Blob([res.data], {type: 'application/zip;charset=utf-8'});
        FileSaver.saveAs(_dData,fileName);//, _fileType + '-' + moment().format() + '.zip'
        this.setState({
          downloadLoading: false
        })
      }).catch(err => {
        MessageHandle(err)
        this.setState({
          downloadLoading: false
        })
      })
    } else {
      message.info(appStore.language.no_device_selected);
      this.setState({
        downloadLoading: false
      })
    }
  }
  /**
   * 日期选择确定操作
   * @param date
   * @param dateStrings
   */
  rangeDateOnOK = (date, dateStrings) => {
    const _range = {
      begin: dateStrings[0],
      end: dateStrings[1]
    };
    this.setState({
      rangeDate: _range
    })
    // thisStore.setDownloadRangeDate(_range);
    // console.log('from:',moment(date[0]).format('YYYY-MM-DD'),'to:',moment(date[1]).format('YYYY-MM-DD'),dateStrings);
  }
  setFileType = (e) => {
    if (e.target.value === 'kml') {
      // console.log(e.target.value,e.target.value === 'kml');
      this.setState({
        multiple: true
      })
    }
    this.setState({
      fileType: e.target.value
    })
    // thisStore.setDownloadMultiple(e)
  }

  setMultiple = (e) => {
    this.setState({
      multiple: e.target.value
    })
    // thisStore.setDownloadMultiple(e)
  }
  selectAll = () => {
    let state = !this.state.selectAll
    this.setState({
      selectAll: state
    })
    // console.log(state)
    thisStore.set('toggleSelectAll', true)
    thisStore.set('selectAllState', state)
  }
  exportGPS = () => {
    thisStore.setDownloadDeviceGpsState()
    this.setState({
      selectAll: false
    })
  }

  render() {
    const setFileType = this.setFileType
    const rangeDateOnOK = this.rangeDateOnOK
    const setMultiple = this.setMultiple
    const downloadDeviceGps = this.downloadDeviceGps
    const cancelExport = this.cancelExport
    const selectAll = this.selectAll
    const optionsExportFileType = [
      {label: '.kml', value: 'kml'},
      // {label: '.excel', value: 'excel'},
      {label: '.csv', value: 'csv'},//, disabled: false
    ];
    const optionsExportFileMultiple = [
      {label: `${appStore.language.single_file}`, value: false, disabled: this.state.fileType === 'kml'},
      {label: `${appStore.language.multiple_file_base_on_device}`, value: true},
    ];
    const downloadDeviceGpsContent = (
      <div>
        <div className="popover-inner">
          <div className="item-box">
            <h4>{appStore.language.export_type}</h4>
            <Radio.Group options={optionsExportFileType} onChange={setFileType}
                         value={this.state.fileType}/>
          </div>
          <div className="item-box">
            <h4>{appStore.language.date_range}:</h4>
            <RangePicker
              disabledDate={DateRangePro.disabledDate}
              // disabledTime={DateRangePro.disabledRangeTime}
              format="YYYY-MM-DD"
              onChange={rangeDateOnOK}
              //placeholder={[appStore.language.start_date,appStore.language.end_date]}
              // onOk={rangeDateOnOK}
              getCalendarContainer={getCalendarContainer}
            />
          </div>
          <div className="item-box">
            <h4>{appStore.language.export_selected_file_to}:</h4>
            <Radio.Group options={optionsExportFileMultiple} onChange={setMultiple}
                         value={this.state.multiple}/>
          </div>
        </div>
        <div className="popover-foot">
          <Button.Group>
            <Button onClick={downloadDeviceGps}
                    loading={this.state.downloadLoading}>{appStore.language.confirm}</Button>
          </Button.Group>
        </div>
      </div>
    );
    return (
      <Row type="flex" justify="space-between" className='mg-bottom'>
        {
          appStore.user.role !== 'guest' ? <Col>
            {
              (thisStore.downloadDeviceGpsState)
                ? <div>
                  <Popover content={downloadDeviceGpsContent} title={appStore.language.data_export} trigger="click"
                           placement="bottomLeft">
                    <Button type='primary'>{appStore.language.export}</Button>
                  </Popover>
                  <Button onClick={selectAll}>
                    <Checkbox checked={this.state.selectAll}></Checkbox>{appStore.language.select_all}
                  </Button>
                  <Button onClick={cancelExport}>{appStore.language.cancel}</Button>
                </div>
                : <Button onClick={this.exportGPS}>{appStore.language.export_device_gps}</Button>
            }
          </Col> : <Col></Col>
        }
        <Col>
          {
            window.location.hash.indexOf('search') === -1 ? <Link to="map/devices_location"><Button type="primary">{appStore.language.devices_location}</Button></Link>
              : <Link to={{pathname: `/map/devices_location`,
                search: window.location.hash.split('?')[1]}}><Button type="primary">{appStore.language.devices_location}</Button></Link>
          }
        </Col>
      </Row>
    )
  }
}

export default DeviceListHead