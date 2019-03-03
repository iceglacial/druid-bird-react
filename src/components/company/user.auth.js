/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import './index.less'
import {observer} from 'mobx-react'
import {Row, Col, Card, Modal, Tabs, Button, message, Spin, Input} from 'antd'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../common'
import thisStore from './store'
import UserPermissionsForm from './user.permissions.form'
import {Link} from 'react-router-dom'
import appStore from '../../store/app_store'
import LoadingImg from '../../common/loadingImg'

// import NumericInput from "../../common/numeric.input";

@observer
class CompanyUserAuth extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userArray: [],
      modalUserVisible: false,
      user: {},
      filterDevice: ''
    }
  }

  componentDidMount() {
    this.getUserInfo();
    this.getUserDevice()
  }

  getUserInfo = () => {
    if (!thisStore.onAuthUser.id) {
      thisStore.set('loading', true)
      axios.get(Api.getUser(this.props.match.params.id), httpConfig()).then(res => {
        thisStore.setOnAuthUser(res.data);
        // this.getUserDevice(res.data);
        thisStore.set('loading', false)
      }).catch(err => {
        MessageHandle(err)
        thisStore.set('loading', false)
      })
    } else {
      // this.getUserDevice(thisStore.onAuthUser);
    }
  }
  getUserDevice = (user) => {
    thisStore.set('loading', true)
    axios.get(Api.deviceOfUser(this.props.match.params.id), httpConfig('mark')).then(res => {
      thisStore.setOnAuthDevice(res.data);
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
    // if (user.device_id) {
    //   const data = {
    //     id: thisStore.onAuthUser.device_id
    //   }
    //   axios.post(Api.deviceByIDArray, data, httpConfig()).then(res => {
    //     thisStore.setOnAuthDevice(res.data);
    //     thisStore.set('loading', false)
    //   }).catch(err => {
    //     MessageHandle(err)
    //     thisStore.set('loading', false)
    //   })
    // }
  }
  getDeviceNotExclude = () => {
    thisStore.set('loading', true)
    const data = {
      id: []
    }
    thisStore.onAuthDevice.map(function (value, index) {
      data.id.push(thisStore.onAuthDevice[index].id)
    })
    axios.post(Api.deviceNoExclude, data, httpConfig('mark')).then(res => {
      thisStore.setNotExcludeDevice(res.data);
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  }
  tabChange = (key) => {
    if (key === 'addAuthDevice') {
      this.getDeviceNotExclude();
    }
  }
  doAddDevice = () => {
    thisStore.set('loading', true)
    const data = {
      id: thisStore.toAddDevice
    }
    axios.post(Api.addDeviceToUser(thisStore.onAuthUser.id), data, httpConfig()).then(res => {
      message.success(appStore.language.add_device_to_user_success(thisStore.toAddDevice.length))
      thisStore.removeExcludeDevice();
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  }
  removeDevice = (device, index) => {
    thisStore.set('loading', true)
    if (device.id) {
      const _data = {
        id: [device.id]
      }
      Modal.confirm({
        title: appStore.language.delete_confirm,
        content: appStore.language.remove_device_from_user_confirm(device),
        okType: 'danger',
        iconType: 'device danger',
        okText: appStore.language.confirm,
        cancelText: appStore.language.cancel,
        onOk() {
          axios.post(Api.removeDeviceFromUser(thisStore.onAuthUser.id), _data, httpConfig()).then(res => {
            message.success(appStore.language.remove_device_from_user_success(device));
            const _onAuthDevice = thisStore.onAuthDevice;
            _onAuthDevice.splice(index, 1);
            thisStore.setOnAuthDevice(_onAuthDevice);
            thisStore.set('loading', false)
          }).catch(err => {
            MessageHandle(err)
            thisStore.set('loading', false)
          })
        },
        onCancel() {
          console.log(`取消移除设备${device.mark || device.uuid}!`);
          thisStore.set('loading', false)
        },
      })
    }
  }
  /**
   * 搜索值改变
   * @param e
   */
  onChangeSearch = (e) => {
    const {value} = e.target;
    const reg = /^[0-9]\d*$/;//  /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      // console.log(value)
      this.setState({
        filterDevice: value,
      })
    }
  }

  filterDeviceByMark=(device)=>{
    let search = this.state.filterDevice
    let mark = device.mark
    if(!search){
      return true;
    }else{
      if(mark){
        return (mark+'').indexOf(search) !== -1;
      }else{
        return false;
      }
    }
  }

  render() {
    const userPermissions = thisStore.onAuthUser.permissions || {};
    const removeDevice = this.removeDevice;
    return (
      <div className="wrap-full">
        <Spin spinning={thisStore.loading} indicator={LoadingImg}>
          <Row className="wrap-full">
            <Col lg={6} md={9} xs={24} className='wrap-overlay'>
              <UserPermissionsForm/>
            </Col>
            <Col lg={18} md={15} xs={24} className='wrap-full'>
              <div className="card-tabs">
                <Tabs type="card" className={'ant-table-flex'} onChange={this.tabChange}>
                  <Tabs.TabPane tab={<label>{appStore.language.user_label(thisStore.onAuthUser) || '-'}
                    <span
                      className="small pd-left">{appStore.language.device_count_label(thisStore.onAuthDevice.length)}</span>
                  </label>} key="userAuthDevice">
                    <div className='ant-table-flex-body'>
                      <Row type='flex'>
                        {thisStore.onAuthDevice.map(function (device, index) {
                          return <Col lg={6} md={8} xs={12} key={'userDevice' + Math.random() * 1000000}>
                            <Card className="device-card" bordered={false}>
                              <div className="action-list">
                                <div className="item">
                                  <Link to={`/device/${device.id}`}>
                                    <Button type='circle' icon="edit"/>
                                  </Link>
                                </div>
                                <div className="item" onClick={() => removeDevice(device, index)}>
                                  <Button type='circle' icon="delete" className='btn-delete'/>
                                </div>
                              </div>
                              <div className="title">{device.mark || '-'}</div>
                              <div className="content">
                                <div className="text-inline">{device.uuid}</div>
                                <div
                                  className="break-line">{appStore.language.getKeyName('description')}：{device.description}</div>
                              </div>
                            </Card>
                          </Col>
                        })}
                      </Row>
                      {
                        !thisStore.onAuthDevice.length && <div className="wrap">{appStore.language.no_device}</div>
                      }
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={appStore.language.allocate_device} key="addAuthDevice" forceRender={false}>
                    <div className="sub-title">
                      <Row type='flex'>
                        <Col>
                          <span
                            className="yellow">{appStore.language.selected_count(thisStore.toAddDevice.length, thisStore.notExcludeDevice.length)}</span>
                        </Col>
                        <Col style={{'flex': 1,'text-align': 'center'}}>
                          <div className='search-input' style={{'width': '200px','margin':'0 auto'}}>
                            <Input placeholder={appStore.language.quick_search} className='input-search'
                                   onChange={this.onChangeSearch.bind(this)} value={this.state.filterDevice}/>
                          </div>
                        </Col>
                        <Col>
                          <Button onClick={this.doAddDevice} type='primary'>{appStore.language.confirm}</Button>
                        </Col>
                      </Row>
                      {/*<span className="yellow">{appStore.language.selected_count(thisStore.toAddDevice.length, thisStore.notExcludeDevice.length)}</span>*/}
                      {/*<span className='float-right'>*/}
                      {/*<Button onClick={this.doAddDevice} type='primary'>{appStore.language.confirm}</Button>*/}
                      {/*</span>*/}
                    </div>
                    <div className='ant-table-flex-body'>
                      <Row>
                        {thisStore.notExcludeDevice.filter(device=>this.filterDeviceByMark(device)).map(function (device) {
                          return <Col lg={6} md={8} xs={12} key={'addDevice' + Math.random() * 1000000}>
                            <Card bordered={false}
                                  className={`device-card ${thisStore.toAddDevice.indexOf(device.id) > -1 ? 'active' : ''}`}
                                  onClick={() => thisStore.setToAddDevice(device.id)}>
                              <div className="title">{device.mark || '-'}</div>
                              <div className="content">
                                <div className="text-inline">{device.uuid}</div>
                                <div
                                  className="break-line">{appStore.language.getKeyName('description')}：{device.description}</div>
                              </div>
                            </Card>
                          </Col>
                        })}
                      </Row>
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Spin>
      </div>
    )
  }
}

export default CompanyUserAuth