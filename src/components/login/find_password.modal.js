/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/7 0007.
 */
import React from 'react'
import {Modal} from 'antd'
import Druid from './../../common/druid.info'
import appStore from '../../store/app_store'
import {observer} from 'mobx-react'

@observer
class FindPasswordModal extends React.Component {
  constructor() {
    super();
    this.findPasswordImage = 'images/icon/icon-hands8356.png';
    this.email = Druid.contact.email.help;
    this.phone = Druid.contact.phone;
  }

  state = {visible: false}
  showModal = () => {
    // console.log('show modal');
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div className="as-btn">
        <a onClick={this.showModal} className="primary">{appStore.language.retrieve_password}</a>
        <Modal
          title={appStore.language.retrieve_password}
          visible={this.state.visible}
          wrapClassName="vertical-center-modal"
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          maskClosable={false}
        >
          <div className="center item-box">
            <img src={this.findPasswordImage}/>
          </div>
          <div className="center item-box">
            <div className="wrap">
              <h2 className="item-box ">{appStore.language.ask_druid_to_retrieve_password}</h2>
            </div>
            <p>{appStore.language.druid_phone(this.phone)}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;{appStore.language.druid_email(this.email)}</p>
          </div>
        </Modal>
      </div>
    );
  }
}
export default FindPasswordModal