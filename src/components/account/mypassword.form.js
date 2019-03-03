/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {Form, Input} from 'antd'
import appStore from './../../store/app_store'
import AccountStore from './store'

const FormItem = Form.Item;
class MyPasswordFormDefine extends React.Component {
  constructor(props) {
    super(props)
    this.form = this.props.form;
    this.formValidator = appStore.form;
  }

  render() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    const validator = this.formValidator;
    return (
      <div className="wrap">
        <Form layout="vertical">
          <FormItem label={appStore.language.getKeyName('old_password')} colon={false}>
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
          <FormItem label={appStore.language.getKeyName('password')} colon={false}>
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
          <FormItem label={appStore.language.getKeyName('re_password')} colon={false}>
            {getFieldDecorator('repassword', {
              rules: [{
                required: true,
                message: appStore.language.repassword_required
              }, {
                validator: AccountStore.checkPassword,
              }]
            })(
              <Input type="password"/>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const MyPasswordForm = Form.create()(MyPasswordFormDefine);

export default MyPasswordForm