/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {Modal} from 'antd'
import MyInfoForm from './myinfo.form'
import AccountStore from './store'
import appStore from '../../store/app_store'
import {observer} from 'mobx-react'

@observer
class MyinfoModal extends React.Component {
  render() {
    // const { visible, onCancel, onCreate, form, user } = this.props;
    return (
      <Modal
        visible={AccountStore.editMeModalVisible}
        title={appStore.language.edit_profile}
        onCancel={AccountStore.hideEditMeModal}
        onOk={AccountStore.saveEditMeModal}
        okText={appStore.language.confirm}
        cancelText={appStore.language.cancel}
        wrapClassName="vertical-center-modal"
        maskClosable={false}
      >
        <MyInfoForm ref={AccountStore.setEditMeForm}/>
      </Modal>
    )
  }
}
export default MyinfoModal