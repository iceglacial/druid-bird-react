/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import './index.less'
import {Row, Col, Modal, Form, Input} from 'antd'

import filters from './../../common/filters'
import appStore from './../../store/app_store'

const {
  stateFilter,
  unitFilter,
} = filters
const FormItem = Form.Item;
const userCreateModal = Form.create()(
  (props) => {
    const {visible, onCancel, onCreate, form, checkPassword} = props;
    const {getFieldDecorator} = form;
    const validator = appStore.form;
    const layout = {
      labelCol:  { span: 8 },
      wrapperCol:  { span: 16 }
    }
    return (
      <Modal
        visible={visible}
        title={appStore.language.create_account}
        onCancel={onCancel}
        onOk={onCreate}
        okText={appStore.language.confirm}
        cancelText={appStore.language.cancel}
        wrapClassName="vertical-center-modal"
        maskClosable={false}
        width={600}
      >
        <Form layout={`vertical`}>
          <Row>
            <Col span={12}>
              <FormItem label={appStore.language.getKeyName('username')} hasFeedback>
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
                    max: validator.username.max,
                    message: appStore.language.username_maxlength(validator.username.max)
                  }],
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={appStore.language.getKeyName('email')} hasFeedback>
                {getFieldDecorator('email', {
                  rules: [{
                    required: true,
                    message: appStore.language.email_required
                  }, {
                    type: 'email',
                    message: appStore.language.email_pattern
                  }, {
                    min: validator.email.min,
                    message: appStore.language.email_minlength(validator.email.min)
                  }, {
                    max: validator.email.max,
                    message: appStore.language.email_maxlength(validator.email.max)
                  }]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={appStore.language.getKeyName('phone')} hasFeedback>
                {getFieldDecorator('phone', {
                  rules: [{
                    required: true,
                    message: appStore.language.phone_required
                  }, {
                    pattern: validator.phone.pattern,
                    message: appStore.language.phone_pattern
                  }, {
                    min: validator.phone.min,
                    message: appStore.language.phone_minlength(validator.phone.min)
                  }, {
                    max: validator.phone.max,
                    message: appStore.language.phone_maxlength(validator.phone.max)
                  }]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={appStore.language.getKeyName('address')} hasFeedback>
                {getFieldDecorator('address', {
                  max: validator.address.max,
                  message: appStore.language.address_maxlength(validator.address.max)
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={appStore.language.getKeyName('password')} hasFeedback>
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
                    message: appStore.language.password_maxlength(validator.password.max)
                  }]
                })(
                  <Input type="password"/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={appStore.language.getKeyName('re_password')} hasFeedback>
                {getFieldDecorator('repassword', {
                  rules: [{
                    required: true,
                    message: appStore.language.password_required
                  }, {
                    validator: checkPassword,
                  }]
                })(
                  <Input type="password"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
)
export default userCreateModal