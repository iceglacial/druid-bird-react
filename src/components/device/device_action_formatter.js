/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Button} from 'antd'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../common'
import DeviceStore from './store'
import appStore from '../../store/app_store'
// import DeviceBioModal from './device.biological.form'
// import DeviceSettingModal from './device.setting.form'

@observer
class DeviceActionFormatter extends React.Component {
  constructor(props) {
    super(props)
    this.data = props.dependentValues;
    // console.log(props);
  }

  /**
   * 显示模态框，并读取设备配置
   * @param modalVisible
   */
  setModalSettingVisible = (device) => {
    // console.log('test attached_at',this.data.attached_at)
    axios.get(Api.setting(device.id), httpConfig())
      .then(res => {
        let deviceSetting = res.data
        Object.assign(deviceSetting,{attached_at: this.data.attached_at})
        DeviceStore.setSettingModalDevice(deviceSetting,true);
      })
      .catch(err => {
        MessageHandle(err)
      })
  }
  setModalBioVisible = (device) => {
    axios.get(Api.biological(device.id), httpConfig())
      .then(res => {
        let bioInfo = res.data;
        if (!res.data) {
          bioInfo = {
            device_id: device.id,
            mark: device.mark
          }
        } else {
          bioInfo = Object.assign(bioInfo, {mark: device.mark});
        }
        // console.log(device,bioInfo);
        DeviceStore.setBiologicalDevice(bioInfo);
        DeviceStore.setBiologicalModalVisible(true)
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          DeviceStore.setBiologicalDevice({
            device_id: device.id,
            mark: device.mark
          });
          DeviceStore.setBiologicalModalVisible(true)
        } else {
          MessageHandle(err)
        }
        // console.log(err)
      })
  }

  render() {
    // console.log(this.data);59b90a960059ea0a31dfa638-59b90a960059ea0a31dfa638
    return (
      <Button.Group>
        <Button onClick={() => this.setModalSettingVisible(this.data)} disabled={this.data.owner === 'FromDruidOld'}>{appStore.language.device_parameter}</Button>
        <Button onClick={() => this.setModalBioVisible(this.data)}>{appStore.language.organism_info}</Button>
        {/*/!*设备配置弹窗*!/*/}
        {/*<DeviceSettingModal key={this.data.id + moment().format()} ref={DeviceStore.setSettingForm}*/}
        {/*visible={DeviceStore.settingModalVisible}*/}
        {/*onCancel={DeviceStore.hideSettingModal}*/}
        {/*onCreate={DeviceStore.saveSettingModal}*/}
        {/*/>*/}
        {/*/!*生物信息弹窗*!/*/}
        {/*<DeviceBioModal key={this.data.id + moment().format()} ref={DeviceStore.setBiologicalForm}*/}
        {/*visible={DeviceStore.biologicalModalVisible}*/}
        {/*onCancel={DeviceStore.hideBiologicalModal}*/}
        {/*onCreate={DeviceStore.saveBiologicalModal}*/}
        {/*/>*/}
      </Button.Group>
    )
  }
}
export default DeviceActionFormatter