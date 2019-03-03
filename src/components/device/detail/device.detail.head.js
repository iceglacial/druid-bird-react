/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/19 0019.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Card, Row, Col, Icon, Modal, message} from 'antd'
import axios from 'axios'
import {Api, MessageHandle, Filters, httpConfig, DataFormatter} from '../../../common/index'
import thisStore from '../store'
import DeviceBioForm from './../device.biological.form'
import DeviceSettingForm from './../device.setting.form'
import appStore from '../../../store/app_store'
import moment from 'moment'

const {unitFilter} = Filters
const {DeviceDataFormatter} = DataFormatter

@observer
class DeviceDetailHead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      device: {},
      setting: [],
      biological: [],
      gpsData: [],
      behaviorData: [],
      smsData: []
    }
    // console.log(props);
    this.getDeviceInfo();
    this.getDeviceSetting();
    this.getDeviceBiological();
  }

  getDeviceInfo = (showModal) => {
    axios.get(Api.device(this.props.deviceId), httpConfig()).then(res => {
      // console.log(res.data);
      let device = DeviceDataFormatter([res.data])[0]
      this.setState({
        device
      })
        thisStore.set('behaviorType',device.firmware_version)
      let deviceParams = thisStore.settingDevice
      deviceParams.attached_at = res.data.attached_at;
      if (showModal) {
        this.getDeviceSetting({attached_at: res.data.attached_at})
        // thisStore.setSettingModalDevice(deviceParams, true);
      }
    }).catch(err => {
      MessageHandle(err)
    })
  }

  getDeviceSetting = (time) => {
    axios.get(Api.setting(this.props.deviceId), httpConfig()).then(res => {
      // console.log(res.data);
      this.setState({
        setting: res.data
      })
      if (time) {
        let deviceSettings = Object.assign({}, res.data, time)
        thisStore.setSettingModalDevice(deviceSettings, true);
      }
    }).catch(err => {
      MessageHandle(err)
    })
  }

  getDeviceBiological = (showModal) => {
    thisStore.set('reloadBiologicalInfo', false)
    axios.get(Api.biological(this.props.deviceId), httpConfig()).then(res => {
      // console.log('get bio info:',res.data);
      const _bio = res.data || {};
      this.setState({
        biological: _bio
      })
      thisStore.setBiologicalDevice(_bio);
      if (showModal) {
        if (!_bio.bid) {
          thisStore.setBiologicalDevice({
            device_id: this.state.setting.device_id,
            mark: this.state.setting.mark
          });
        }
        thisStore.setBiologicalModalVisible(true)
      }
    }).catch(err => {
      if (err.response && err.response.status !== 404) {
        MessageHandle(err)
      }
    })
  }

  setModalSettingVisible = () => {
    this.getDeviceInfo('showModal')
  }
  setModalBioVisible = () => {
    this.getDeviceBiological('showModal')
  }
  modeOnChange = (e) => {
    // console.log(e.target.value)
    let mode = e.target.value
    let deviceParams
    deviceParams = thisStore.settingDevice
    if (mode !== 'custom') {
      Object.assign(deviceParams, thisStore.defaultMode[mode])
      thisStore.set('modeDisabled',true)
    } else {
      thisStore.set('modeDisabled',false)
      let keys = Object.keys(thisStore.defaultMode['realtime'])
      keys.map(key => {
        deviceParams[key] = thisStore.settingDeviceBackup[key]
      })
    }
    thisStore.setSettingModalDevice(deviceParams)
  }

  saveBiological = () => {
    let form = thisStore.biologicalForm;
    let deviceId = this.props.deviceId;//this.state.biological;
    let _this = this
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let latitude = values.latitude !== undefined ? values.latitude + '' : ''
      let longitude = values.longitude !== undefined ? values.longitude + '' : ''
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
      axios.post(Api.updateBiological(deviceId, 'bird'), data, httpConfig()).then(res => {
        thisStore.biologicalModalVisible = false;
        _this.setState({
          biological: data
        })
        message.success(appStore.language.device_biological_updated());
        form.resetFields();
      }).catch(err => {
        MessageHandle(err);
      })
    })
  }

  getDeviceLocationMap = () => {
    let enURL = 'https://maps.googleapis.com';
    let chURL = 'http://ditu.google.cn'
    let url = window.location.pathname === '/' ? chURL : enURL
    let lastValidGps = this.state.device.last_valid_gps
    //limit size:max width 640px
    if (lastValidGps) {
      let lat = lastValidGps.latitude
      let lng = lastValidGps.longitude
      // AIzaSyCBMSxZOjWS8AOBIsivwdV3JRX1CljupYY//center=Chengdu&
      return url + '/maps/api/staticmap?zoom=10&size=1000x100&maptype=roadmap' +
        '&markers=color:red%7Clabel:AS%7C' + lat + ',' + lng +
        '&key=AIzaSyBgH7o1ov6uxnOTk8m0oUrwEb2KJxwUP4I'
    }
  }

  render() {
    // const layout1 = {
    //   lg: 5,
    //   sm: 6
    // }
    // const layout2 = {
    //   lg: 5,
    //   sm: 6
    // }
    // const layout3 = {
    //   lg: 6,
    //   sm: 6
    // }
    // const layout4 = {
    //   lg: 8,
    //   sm: 6
    // }
    if (thisStore.reloadBiologicalInfo) {
      this.getDeviceBiological()
    }
    return (
      <div className="wrap">
        <div className="device-detail-head">
          <Row type='flex' justify='flex-start' style={{flexWrap: "nowrap"}}>
            <Col className='device-info-box'>
              {/*flex-box center*/}
              <Card className='no-border deviceCard'>
                <Row type={'flex'}>
                  <Col className='head-title'>
                    <div className='title'><span className="title">{this.state.device.mark} </span><span
                      className="small">{this.state.device.device_type} {this.state.device.network_operator}</span>
                    </div>
                    <div className="sub-title">UUID {this.state.device.uuid}</div>
                  </Col>
                  {this.state.device.owner !== 'FromDruidOld' &&
                  <Col className='sampleCard'>
                    <div className="title">{appStore.language.sampling_interval}</div>
                    <Row type={'flex'} className="sub-title">
                      <Col className='item'>
                        <span className="primary anticon">ENV</span>
                        <span
                          title={unitFilter(this.state.setting.env_sampling_freq, 'env_sampling_freq')}>{unitFilter(this.state.setting.env_sampling_freq, 'env_sampling_freq')}</span>
                      </Col>
                      <Col className='item'>
                        <span className="primary anticon">BHV</span>
                        <span
                          title={unitFilter(this.state.setting.behavior_sampling_freq, 'behavior_sampling_freq')}>{unitFilter(this.state.setting.behavior_sampling_freq, 'behavior_sampling_freq')}</span>
                      </Col>
                      <Col className='item'>
                        <span className="primary anticon">Comm.</span>
                        <span
                          title={unitFilter(this.state.setting.gprs_freq, 'gprs_freq')}>{unitFilter(this.state.setting.gprs_freq, 'gprs_freq')}</span>
                      </Col>
                    </Row>
                  </Col>
                  }
                </Row>
              </Card>
            </Col>
            {/*{this.state.device.owner !== 'FromDruidOld' &&*/}
            {/*<Col>*/}
            {/*<Card className='sampleCard'>*/}
            {/*<div className="title">{appStore.language.sampling_interval}</div>*/}
            {/*<Row type={'flex'} className="sub-title">*/}
            {/*<Col className='item'>*/}
            {/*<span className="primary anticon">ENV</span>*/}
            {/*<span*/}
            {/*title={unitFilter(this.state.setting.env_sampling_freq, 'env_sampling_freq')}>{unitFilter(this.state.setting.env_sampling_freq, 'env_sampling_freq')}</span>*/}
            {/*</Col>*/}
            {/*<Col className='item'>*/}
            {/*<span className="primary anticon">BHV</span>*/}
            {/*<span*/}
            {/*title={unitFilter(this.state.setting.behavior_sampling_freq, 'behavior_sampling_freq')}>{unitFilter(this.state.setting.behavior_sampling_freq, 'behavior_sampling_freq')}</span>*/}
            {/*</Col>*/}
            {/*<Col className='item'>*/}
            {/*<span className="primary anticon">NET</span>*/}
            {/*<span*/}
            {/*title={unitFilter(this.state.setting.gprs_freq, 'gprs_freq')}>{unitFilter(this.state.setting.gprs_freq, 'gprs_freq')}</span>*/}
            {/*</Col>*/}
            {/*</Row>*/}
            {/*</Card>*/}
            {/*</Col>*/}
            {/*}*/}
            {this.state.device.owner !== 'FromDruidOld' &&
            <Col>
              <Card onClick={this.setModalSettingVisible} className='settingCard'>
                <div className="title"><Icon type="setting" className="primary"/>{appStore.language.device_set}</div>
                <div className="sub-title">
                  {appStore.language.validation_time}：
                  <span
                    title={unitFilter(this.state.setting.downloaded_at, 'downloaded_at')}>{unitFilter(this.state.setting.downloaded_at, 'downloaded_at') || '-'}</span>
                </div>
              </Card>
            </Col>
            }
            <Col>
              <Card onClick={this.setModalBioVisible} className='biologicalCard'>
                <div className="title"><Icon type="edit" className="primary"/>{appStore.language.organism_info}</div>
                <Row type={'flex'} className="sub-title">
                  <Col className='item'>
                    <div className='limit'
                         title={unitFilter(this.state.biological.species, 'species') || '-'}>{appStore.language.getKeyName('species')}:{unitFilter(this.state.biological.species, 'species') || '-'}</div>
                  </Col>
                  <Col className='item'>
                    <div className='limit'
                         title={unitFilter(this.state.biological.gender, 'gender') || '-'}>{appStore.language.getKeyName('gender')}:{unitFilter(this.state.biological.gender, 'gender') || '-'}</div>
                  </Col>
                  <Col className='item'>
                    <div className='limit'
                         title={unitFilter(this.state.biological.age, 'age') || '-'}>{appStore.language.getKeyName('age')}:{unitFilter(this.state.biological.age, 'age') || '-'}</div>
                  </Col>
                  <Col className='item'>
                    <div className='limit'
                         title={unitFilter(this.state.biological.weight, 'weight') || '-'}>{appStore.language.getKeyName('weight')}:{unitFilter(this.state.biological.weight, 'weight') || '-'}</div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col style={{flex: 1,height: '85px'}}>
              {/*http://ditu.google.cn；https://maps.googleapis.com*/}
              {/*<img src={this.getDeviceLocationMap()}/>*/}
              <div style={{width:'100%',maxWidth:'640px',height:'100%',background: `url(${this.getDeviceLocationMap()}) center no-repeat`,borderRadius: '5px',boxShadow:'0 2px 4px 0 rgba(212, 212, 212, 0.5)'}}></div>
            </Col>
          </Row>
        </div>
        {/*设备配置弹窗*/}
        <Modal
          visible={thisStore.settingModalVisible}
          title={appStore.language.device_set}
          onCancel={thisStore.hideSettingModal}
          onOk={thisStore.saveSettingModal}
          width={680}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          wrapClassName="vertical-center-modal"
          maskClosable={false}
        >
          <DeviceSettingForm ref={thisStore.setSettingForm} modeOnChange={this.modeOnChange}/>
        </Modal>
        {/*生物信息弹窗*/}
        <Modal
          visible={thisStore.biologicalModalVisible}
          title={appStore.language.organism_info}
          onCancel={thisStore.hideBiologicalModal}
          onOk={this.saveBiological}//thisStore.saveBiologicalModal
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          wrapClassName="vertical-center-modal"
          width={600}
          maskClosable={false}
        >
          <DeviceBioForm ref={thisStore.setBiologicalForm} biologicalInfo={this.state.biological}/>
        </Modal>
      </div>
    )
  }
}

function fixNumber(num, step) {
  return parseFloat(num);//.toFixed(step || 3)
}

export default DeviceDetailHead;