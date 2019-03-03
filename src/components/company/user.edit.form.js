/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import './index.less'
import {Row, Col, Modal, Form, Input} from 'antd'
import appStore from './../../store/app_store'
import CompanyStore from './store'

const FormItem = Form.Item;
const userEditForm = Form.create()(
  (props) => {
    const {form} = props;
    const {getFieldDecorator} = form;
    const validator = appStore.form;
    const user = CompanyStore.onEditUser
    // console.log(user)
    function checkPassword(rule, value, callback) {
      if (value && value !== form.getFieldValue('password')) {
        callback(appStore.language.password_not_match);
      } else {
        callback();
      }
    }
    let layoutInput = {
      labelCol: {span: 12}, wrapperCol: {span: 8}
    }
    let adminPasswordFormItem = (
      <FormItem label={appStore.language.getKeyName('admin_password')}>
        {getFieldDecorator('old_password', {
          rules: [{
            required: true,
            message: appStore.language.password_required
          }, {
            pattern: validator.password.pattern,
            message: appStore.language.password_pattern
          }, {
            min: validator.password.min,
            message: appStore.language.password_minlength(validator.password.min)
          }, {
            max: validator.password.max,
            message: appStore.language.password_minlength(validator.password.max)
          }]
        })(
          <Input type="password"/>
        )}
      </FormItem>
    )
    let newPasswordFormItem = (
      <FormItem label={appStore.language.getKeyName('password')}>
        {getFieldDecorator('password', {
          rules: [{
            required: true,
            message: appStore.language.password_required
          }, {
            pattern: validator.password.pattern,
            message: appStore.language.password_pattern
          }, {
            min: validator.password.min,
            message: appStore.language.password_minlength(validator.password.min)
          }, {
            max: validator.password.max,
            message: appStore.language.password_minlength(validator.password.max)
          }]
        })(
          <Input type="password"/>
        )}
      </FormItem>
    )
    let confirmPasswordFormItem = (
      <FormItem label={appStore.language.getKeyName('re_password')}>
        {getFieldDecorator('repassword', {
          rules: [{
            required: true,
          }, {
            validator: checkPassword,
          }]
        })(
          <Input type="password"/>
        )}
      </FormItem>
    )
    return (
      <Row>
        <Col span={10}>
          <Row className='user-info'>
            <div className="info-body">
              <div className="item">{appStore.language.getKeyName('username')}：{user.username}</div>
              <div className="item">{appStore.language.getKeyName('phone')}：{user.phone}</div>
              <div className="item">{appStore.language.getKeyName('email')}：{user.email}</div>
              <div className="item">{appStore.language.getKeyName('address')}：{user.address}</div>
            </div>
          </Row>
        </Col>
        <Col span={12} offset={2}>
          <Form layout='vertical'>
            <Row>
              <Col >{adminPasswordFormItem}</Col>
              <Col >{newPasswordFormItem}</Col>
              <Col >{confirmPasswordFormItem}</Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
);
export default userEditForm