import React from 'react'
import {Modal, Input} from 'antd'
import MyPasswordForm from './mypassword.form'
import AccountStore from './store'
import appStore from '../../store/app_store'
import {observer} from 'mobx-react'
import thisStore from '../device.setting/store'
import MovebankForm from './movebank.form'

const confirm = Modal.confirm;


@observer
class MovebankModal extends React.Component {
  componentDidMount() {
  }

  showConfirm() {
      const form = AccountStore.movebankForm;
      form.validateFields((err, values) => {
          if (err) {
              return;
          }
    const changeNotice = <span>{appStore.language.movebank_change_notice_1}<span
      className={'red'}>{appStore.language.movebank_change_notice_2}</span>{appStore.language.movebank_change_notice_3}</span>
    const confirmNotice = <span>{appStore.language.movebank_confirm_notice_1}<span
      className={'red'}>{appStore.language.movebank_confirm_notice_2}</span>{appStore.language.movebank_confirm_notice_3}</span>
    const newName=document.getElementById('movebank_username').value;
    const changeName=appStore.language.movebank_change_username+' '+newName;
    const confirmName=appStore.language.movebank_confirm_username+' '+newName;
    confirm({
      title: AccountStore.movebankName ?
         changeName:confirmName,
      content: AccountStore.movebankName ?
        changeNotice :
        confirmNotice,
      onOk() {
        AccountStore.saveMovebankModal();
        AccountStore.hideMovebankModal();
      },
      onCancel() {
      },
    });
  })}

  render() {
    return (
      <Modal
        visible={AccountStore.movebankModalVisible}
        title={appStore.language.movebankSetting}
        onCancel={AccountStore.hideMovebankModal}
        onOk={this.showConfirm}
        okText={appStore.language.confirm}
        cancelText={appStore.language.cancel}
        wrapClassName="vertical-center-modal"
        maskClosable={false}
      >
        <MovebankForm ref={AccountStore.setMovebankForm}/>
        {
          thisStore.movebankName ?
            <ul className="noticeList">
              <li>{appStore.language.movebank_notice1}</li>
            </ul>
            :
            <ul className="noticeList">
              <li>{appStore.language.movebank_notice2}</li>
              <li>{appStore.language.movebank_notice3}</li>
              <li>{appStore.language.movebank_notice4}</li>
            </ul>
        }
      </Modal>
    )
  }
}

export default MovebankModal

