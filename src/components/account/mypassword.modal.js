/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {Modal} from 'antd'
import MyPasswordForm from './mypassword.form'
import AccountStore from './store'
import appStore from '../../store/app_store'
import {observer} from 'mobx-react'

@observer
class MyPasswordModal extends React.Component {
  render() {
    // const { visible, onCancel, onCreate, form, user } = this.props;
    return (
      <Modal
        visible={AccountStore.editMyPasswordModalVisible}
        title={appStore.language.edit_password}
        onCancel={AccountStore.hideEditMyPasswordModal}
        onOk={AccountStore.saveEditMyPasswordModal}
        okText={appStore.language.confirm}
        cancelText={appStore.language.cancel}
        wrapClassName="vertical-center-modal"
        maskClosable={false}
      >
        <MyPasswordForm ref={AccountStore.setEditMyPasswordForm}/>
      </Modal>
    )
  }
}
export default MyPasswordModal