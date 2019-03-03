/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import {observer} from 'mobx-react'
import appStore from '../../store/app_store'
import {Button, message, Modal} from 'antd'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../common'
import CompanyStore from './store'
import {Link} from 'react-router-dom'

@observer
class DeviceActionFormatter extends React.Component {
  constructor(props) {
    super(props)
    // this.data = props.dependentValues;
    // console.log(this.data);
  }

  deleteUser = () => {
    const user = this.props.dependentValues;
    Modal.confirm({
      title: appStore.language.delete_confirm,
      content: appStore.language.delete_user_confirm(user),
      maskClosable: false,
      iconType: 'delete red',
      okText: appStore.language.confirm,
      cancelText: appStore.language.cancel,
      onOk() {
        var _companyUser = CompanyStore.userAll.filter((u)=>u.id !== user.id)
        axios.delete(Api.deleteUser(user.id), httpConfig()).then(res => {
          message.success(appStore.language.deleted_user(user));
          CompanyStore.setUserAll(_companyUser);
          // console.log('delete success',user)
        }).catch(err => {
          MessageHandle(err);
        })
      },
      onCancel() {
        // console.log('删除用户 ' + user.username + ' 操作已取消。');
      },
    })
  }
  updateUser = () => {
    // console.log('update user...', this.data.username);
    CompanyStore.setOnEditUser(this.props.dependentValues);
  }
  manegeUserDevice = () => {
    let data = this.props.dependentValues
    window.location.hash = `#/user-manage/${data.id}`
    CompanyStore.setOnAuthUser(data);
  }

  render() {
    // let data = this.props.dependentValues;
    return (
      <Button.Group>
        <Button onClick={this.deleteUser}>{appStore.language.delete}</Button>
        <Button onClick={this.updateUser}>{appStore.language.edit}</Button>
        {/*<Link to={`/user-manage/${this.data.id}`} className="ant-btn-link"></Link>*/}
        <Button onClick={this.manegeUserDevice}>{appStore.language.permission}</Button>
      </Button.Group>
    )
  }
}
export default DeviceActionFormatter