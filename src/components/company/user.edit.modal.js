/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import './index.less'
import {Row, Col, message, Modal, Form, Input} from 'antd'
import axios from 'axios'
import {Api, MessageHandle, Token, httpConfig} from '../../common'
import appStore from './../../store/app_store'
import AccountStore from '../account/store'

const FormItem = Form.Item;
class UserEditFormDefine extends React.Component {
  constructor(props) {
    super(props)
    this.form = this.props.form;
    this.formValidator = appStore.form;
    this.state = {
      user: props.user
    }
  }

  render() {
    const {onCreate, form} = this.props;
    const {getFieldDecorator} = form;
    const validator = this.formValidator;
    const user = this.props.user;
    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem label={appStore.language.getKeyName('username')} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('username', {
                rules: [{
                  required: true,
                  message: appStore.language.username_required
                }, {
                  pattern: validator.username.pattern,
                  message: appStore.language.username_pattern
                }, {
                  min: validator.username.min,
                  message: appStore.language.username_minlength(validator.username.min)
                }, {
                  max: validator.email.max,
                  message: appStore.language.username_maxlength(validator.username.max)
                }],
                initialValue: user.username,
              })(
                <Input disabled/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={appStore.language.getKeyName('email')} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('email', {
                rules: [{
                  required: true,
                  message: '请输入邮箱'
                }, {
                  type: 'email',
                  message: '邮箱格式不正确'
                }, {
                  min: validator.email.min,
                  message: '至少' + validator.email.min + '个字符'
                }, {
                  max: validator.email.max,
                  message: '不能超过' + validator.email.max + '个字符'
                }],
                initialValue: user.email,
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={appStore.language.getKeyName('phone')} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入联系方式'
                }, {
                  pattern: validator.phone.pattern,
                  message: '格式不正确'
                }, {
                  min: validator.phone.min,
                  message: '至少' + validator.username.min + '个字符'
                }, {
                  max: validator.phone.max,
                  message: '不能超过' + validator.username.max + '个字符'
                }],
                initialValue: user.phone,
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={appStore.language.getKeyName('address')} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('address', {
                rules: [{
                  max: validator.address.max,
                  message: '不能超过' + validator.address.max + '个字符'
                }],
                initialValue: user.addresss,
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={appStore.language.getKeyName('old_password')} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('old_password', {
                rules: [{
                  required: true,
                  message: '请输入登录密码'
                }, {
                  pattern: validator.password.pattern,
                  message: '仅支持数字和字母'
                }, {
                  min: validator.password.min,
                  message: '至少' + validator.password.min + '个字符'
                }, {
                  max: validator.password.max,
                  message: '不能超过' + validator.password.max + '个字符'
                }]
              })(
                <Input type="password"/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={appStore.language.getKeyName('password')} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: '请输入登录密码'
                }, {
                  pattern: validator.password.pattern,
                  message: '仅支持数字和字母'
                }, {
                  min: validator.password.min,
                  message: '至少' + validator.password.min + '个字符'
                }, {
                  max: validator.password.max,
                  message: '不能超过' + validator.password.max + '个字符'
                }]
              })(
                <Input type="password"/>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label={appStore.language.getKeyName('re_password')} labelCol={{span: 8}} wrapperCol={{span: 16}}>
              {getFieldDecorator('repassword', {
                rules: [{
                  required: true,
                }, {
                  validator: AccountStore.checkPassword,
                }]
              })(
                <Input type="password"/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
;
const UserEditForm = Form.create()(UserEditFormDefine);
class userEditModal extends React.Component {
  constructor(props) {
    super(props)
    const {onCancel} = props;
    this.state = {
      modalVisible: props.visible,
      user: props.user,
    }
    this.onCancel = onCancel;

    // console.log(this.onCancel);
  }

  saveCreateFormRef(form) {
    this.form = form
  }

  onCancel = () => {
    this.props.setState({modalUserVisible: false});
  }

  /**
   * 修改用户信息
   * */
  onCreate() {
    const form = this.form;
    const user = this.props.user;
    // console.log(user);
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const data = {
        old_password: Token.set(user.username, values.password),
        password: Token.set(appStore.user.username, values.password)
      };
      axios.put(Api.password(user.id), data, httpConfig()).then(res => {
        form.resetFields();
        message.success(`用户信息修改成功！`);
      }).catch(err => {
        MessageHandle(err);
      })
    })
  }

  render() {
    // const { visible, onCancel, onCreate, form, user } = this.props;
    return (
      <Modal
        visible={this.props.visible}
        title="编辑用户"
        onCancel={this.onCancel}
        onOk={this.onCreate}
        wrapClassName="vertical-center-modal"
        maskClosable={false}
      >
        <UserEditForm onSubmit={ () => this.onCreate } ref={this.saveCreateFormRef} user={this.props.user}/>
      </Modal>
    )
  }
}
export default userEditModal