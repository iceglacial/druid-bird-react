/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Button, message} from 'antd'
import axios from 'axios'
import {Api, MessageHandle, httpConfig, Token} from '../../common'
import UserCreateModal from './user.create.form'
import CompanyStore from './store'
import appStore from '../../store/app_store'

@observer
class CompanyUserHead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalUserVisible: false,
    }
  }

  modalUserVisible = () => {
    this.setState({
      modalUserVisible: true
    })
  }
  saveUserFormRef = (form) => {
    this.form = form;
  }
  // 新建用户
  saveModalUser = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const data = {
        username: values.username,
        role: 'user',
        email: values.email,
        phone: values.phone,
        address: values.address,
        password: Token.set(values.username, values.password)
      };
      // console.log(values);
      axios.post(Api.createUser, data, httpConfig()).then(res => {
        form.resetFields();
        message.success(appStore.language.account_created);
        // this.props.addUser(res.data);
        form.resetFields();//清空表单内容
        this.setState({
          modalUserVisible: false
        })
        this.reloadCompanyUser();
      }).catch(err => {
        MessageHandle(err,'create_user');
      })
    })
  }
  reloadCompanyUser = () => {
    axios.get(Api.companyUser, httpConfig('-updated_at')).then(res => {
      CompanyStore.setUserAll(res.data);
    })
  }
  handleUserCancel = () => {
    this.setState({modalUserVisible: false});
  }
  /**
   * 验证密码一致
   * */
  checkPassword = (rule, value, callback) => {
    const form = this.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(appStore.language.password_not_match);
    } else {
      callback();
    }
  }

  render() {
    return (
      <div className="pd-bottom">
        <Button onClick={this.modalUserVisible} type='primary'>{appStore.language.create_account}</Button>
        <UserCreateModal ref={this.saveUserFormRef}
                         visible={this.state.modalUserVisible}
                         onCancel={this.handleUserCancel}
                         onCreate={this.saveModalUser}
                         checkPassword={this.checkPassword}
        />
      </div>
    )
  }
}
export default CompanyUserHead