/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/24 0024.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, httpConfig, MessageHandle} from '../../common'
import {Modal, Transfer, Button, Icon} from 'antd'
import AnalysisStore from './store'
import appStore from '../../store/app_store'

@observer
class SelectDeviceModal extends React.Component {
  constructor(props) {
    super(props)
    this.getDeviceAll()
    // console.log(props)
  }

  getDeviceAll = () => {
    axios.get(Api.device(), httpConfig('mark')).then(res => {
      AnalysisStore.setDeviceAll(res.data);
      this.getMock();
    }).catch(err => {
      MessageHandle(err)
    })
  }

  state = {
    mockData: [],
    targetKeys: [],
    selectedKeys: AnalysisStore.selectedDevice,
  }
  // componentDidMount() {
  //   console.log('testsdgdgdfg');
  // }
  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    const _deviceAll = AnalysisStore.deviceAll
    const _selectedDevice = AnalysisStore.selectedDevice;
    for (let i = 0; i < _deviceAll.length; i++) {
      let chosen = false;
      for (let j = 0; j < _selectedDevice.length; j++) {
        if (_selectedDevice[j].split('.')[0] === _deviceAll[i].id) {
          chosen = true;
        }
      }
      const data = {
        key: `${_deviceAll[i].id}.${_deviceAll[i].mark}.${_deviceAll[i].uuid}.${i}`,
        title: `${_deviceAll[i].mark || '-'}`,
        description: `${_deviceAll[i].uuid}`,
        chosen: chosen,
      };
      if (data.chosen && targetKeys.length < 10) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    AnalysisStore.setSelectedDevice(targetKeys);
    // console.log(_deviceAll,mockData,targetKeys);
    this.setState({mockData, targetKeys});
  }
  handleChange = (targetKeys, direction, moveKeys) => {
    // console.log('move',targetKeys, direction, moveKeys);
    const _maxLength = AnalysisStore.selectedItem.length > 1 ? 1 : 10;
    const _targetKeys = targetKeys.slice(0, _maxLength);
    this.setState({targetKeys: _targetKeys});
    // AnalysisStore.setSelectedDevice(_targetKeys);
  }
  renderItem = (item) => {
    const customLabel = (
      <span className="custom-item">
        <span className="primary">{item.title}</span> <span>{item.description}</span>
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  }
  onCancel = () => {
    AnalysisStore.setSelectDeviceModalVisible(false);
  }
  onCreate = () => {
    //id.mark.uuid.index
    // console.log('已选中设备：',AnalysisStore.selectedDevice,this.state.targetKeys);
    AnalysisStore.setSelectedDevice(this.state.targetKeys);
    AnalysisStore.setSelectDeviceModalVisible(false);
  }
  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    // console.log(sourceSelectedKeys, targetSelectedKeys)
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]})
  }
  removeSelectedDevice = (value,index) => {
    // console.log(index);
    const _selectedDevice = AnalysisStore.selectedDevice.filter(device=>device!==value);
    // console.log(_selectedDevice)
    AnalysisStore.setSelectedDevice(_selectedDevice);
    this.setState({targetKeys: _selectedDevice})
    console.log(this.state.targetKeys,value,index)
  }

  render() {
    const removeSelectedDevice = this.removeSelectedDevice
    return (
      <div>
        <div className="">
          <span className="title">{appStore.language.select_device}：</span>
          <Button className='plus' onClick={() => AnalysisStore.setSelectDeviceModalVisible(true)}>
            <Icon type="plus"/>
          </Button>
          {AnalysisStore.selectedDevice && AnalysisStore.selectedDevice.map(function (value, index) {
            if (typeof(value) === 'string') {
              const _device = value.split('.');
              return <Button key={Math.random() * 1000000}
                             onClick={() => removeSelectedDevice(value,index)}>{_device[1] !== 'undefined' ? _device[1] : _device[2]}</Button>
            }
          })}
          {
            AnalysisStore.selectedItem.length > 1 ?
              <p className="tips">{appStore.language.choose_only_one_device}</p> : ''
          }
        </div>
        <Modal
          visible={AnalysisStore.selectDeviceModalVisible}
          title={appStore.language.select_device}
          onCancel={this.onCancel}
          onOk={this.onCreate}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          wrapClassName="vertical-center-modal"
          maskClosable={false}
        >
          <Transfer
            ref='deviceForm'
            showSearch
            dataSource={this.state.mockData}
            listStyle={{
              width: 220,
              height: 500,
            }}
            titles={[`${appStore.language.unselected}`, `${appStore.language.selected}`]}
            selectedKeys={this.state.selectedKeys}
            targetKeys={this.state.targetKeys}//this.state.targetKeys
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            render={this.renderItem}
          />
        </Modal>
      </div>
    )
  }
}
export default SelectDeviceModal