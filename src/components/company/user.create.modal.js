/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import './index.less'
import {Row, Col, message, Modal, Form, Input} from 'antd'
import axios from 'axios'
import {Api, Token, httpConfig} from '../../common'
import appStore from './../../store/app_store'

const FormItem = Form.Item;
class UserCreateFormDefine extends React.Component {
  constructor(props) {
    super(props)
    this.form = this.props.form;
    this.formValidator = appStore.form;
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
    const {onCreate, form} = this.props;
    const {getFieldDecorator} = form;
    const validator = this.formValidator;
    return (
      <Form layout={'vertical'}>
        <Row>
          <Col span={12}>
            <FormItem label='用户名' labelCol={{span: 8}} wrapperCol={{span: 16}} hasFeedback>
              {getFieldDecorator('username', {
                rules: [{
                  required: true,
                  message: '请输入用户名'
                }, {
                  pattern: validator.username.pattern,
                  message: '仅支持数字，字母，“.”,“_”，“-”'
                }, {
                  min: validator.username.min,
                  message: '至少' + validator.username.min + '个字符'
                }, {
                  max: validator.email.max,
                  message: '不能超过' + validator.username.max + '个字符'
                }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='邮箱' labelCol={{span: 8}} wrapperCol={{span: 16}} hasFeedback>
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
                }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='联系方式' labelCol={{span: 8}} wrapperCol={{span: 16}} hasFeedback>
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
                }]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='地址' labelCol={{span: 8}} wrapperCol={{span: 16}} hasFeedback>
              {getFieldDecorator('address', {
                max: validator.address.max,
                message: '不能超过' + validator.address.max + '个字符'
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='密码' labelCol={{span: 8}} wrapperCol={{span: 16}} hasFeedback>
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
            <FormItem label='确认密码' labelCol={{span: 8}} wrapperCol={{span: 16}} hasFeedback>
              {getFieldDecorator('repassword', {
                rules: [{
                  required: true,
                  message: '请输入登录密码'
                }, {
                  validator: this.checkPassword,
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
const UserCreateForm = Form.create()(UserCreateFormDefine);
class userCreateModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: props.visible,
    }
  }

  saveCreateFormRef(form) {
    this.form = form
  }

  onCreate() {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const data ={
        username: values.username,
        email: values.email,
        password: Token.set(values.username, values.password),
        phone: values.phone,
        role: values.role
      };
      // console.log(values);
      axios.post(Api.createUser, data, httpConfig()).then(res => {
        form.resetFields();
        message.success(`新建用户成功！`);
        this.setState({
          modalVisible: false
        })
      }).catch(err => {
        // console.log(err);
        message.error(err.response.status);
      })
    })
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title="新建用户"
        onCancel={this.props.onCancel}
        onOk={this.onCreate}
        wrapClassName="vertical-center-modal"
        maskClosable={false}
      >
        {/*<div className="ant-modal-header">*/}
        {/*<p></p>*/}
        {/*</div>*/}
        {/*<div className="ant-modal-body">*/}
        {/**/}
        {/*</div>*/}
        <UserCreateForm onSubmit={() => this.onCreate} ref={this.saveCreateFormRef}/>
      </Modal>
    )
  }
}
export default userCreateModal