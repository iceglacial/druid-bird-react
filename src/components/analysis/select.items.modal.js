/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/24 0024.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Modal, Transfer, Button, Icon} from 'antd'
import AnalysisStore from './store'
import appStore from '../../store/app_store'

@observer
class SelectDeviceModal extends React.Component {
  constructor() {
    super()
    this.language = appStore.language
  }

  state = {
    mockData: [],
    targetKeys: [],
  }

  componentDidMount() {
    this.getMock();
  }

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    const _itemAll = AnalysisStore.analysisItems
    const _selectedItem = AnalysisStore.selectedItem;
    for (let i = 0; i < _itemAll.length; i++) {
      let chosen = false;
      if(_selectedItem.indexOf(_itemAll[i]) !== -1){
        chosen = true;
      }
      const data = {
        key: `${_itemAll[i]}`,
        title: `${this.language.getKeyName(_itemAll[i])}`,
        // description: `${_deviceAll[i].uuid}`,
        chosen: chosen,
      };
      if (data.chosen && targetKeys.length < 10) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    AnalysisStore.setSelectedItem(targetKeys);
    // console.log(_itemAll,mockData,targetKeys);
    this.setState({mockData, targetKeys});
  }
  handleChange = (targetKeys, direction, moveKeys) => {
    // console.log(targetKeys, direction, moveKeys);
    const _maxLength = AnalysisStore.selectedDevice.length > 1 ? 1 : 10;
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
    AnalysisStore.setSelectItemModalVisible(false);
  }
  onCreate = () => {
    //id.mark.uuid.index
    // console.log('已选中设备：',AnalysisStore.selectedDevice,this.state.targetKeys);
    AnalysisStore.setSelectedItem(this.state.targetKeys);
    AnalysisStore.setSelectItemModalVisible(false);
  }
  removeSelectedItem = (value,index) => {
    const _selectedItem = AnalysisStore.selectedItem.filter(key=>key!==value);
    // console.log(_selectedDevice)
    AnalysisStore.setSelectedItem(_selectedItem);
    this.setState({targetKeys: _selectedItem})
  }

  render() {
    const removeSelectedItem = this.removeSelectedItem
    const language = appStore.language
    return (
      <div>
        <div className="">
          <span className="title">{appStore.language.select_data_type}：</span>
          <Button className='plus' onClick={() => AnalysisStore.setSelectItemModalVisible(true)}>
            <Icon type="plus"/>
          </Button>
          {AnalysisStore.selectedItem.map(function (value, index) {
            return <Button key={Math.random() * 1000000}
                           onClick={() => removeSelectedItem(value,index)}>{language.getKeyName(value)}</Button>
          })}
          {
            AnalysisStore.selectedDevice.length > 1 ?
              <p className="tips">{appStore.language.choose_only_one_data_type}</p> : ''
          }
        </div>
        <Modal
          visible={AnalysisStore.selectItemModalVisible}
          title={appStore.language.select_data_type}
          onCancel={this.onCancel}
          onOk={this.onCreate}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          wrapClassName="vertical-center-modal"
          maskClosable={false}
        >
          <Transfer
            dataSource={this.state.mockData}
            listStyle={{
              width: 220,
              height: 400,
            }}
            titles={[`${appStore.language.unselected}`, `${appStore.language.selected}`]}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={this.renderItem}
          />
        </Modal>
      </div>
    )
  }
}
export default SelectDeviceModal