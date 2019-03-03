/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {Form, Input} from 'antd'
import AppStore from './../../store/app_store'
import AccountStore from './store'
import appStore from '../../store/app_store'
import {observer} from 'mobx-react'

const FormItem = Form.Item;
@observer
class MyinfoFormDefine extends React.Component {
  constructor(props) {
    super(props)
    this.form = this.props.form;
    this.formValidator = AppStore.form;
    this.state = {
      user: props.user
    }
  }

  render() {
    const {onCreate, form} = this.props;
    const {getFieldDecorator} = form;
    const validator = this.formValidator;
    const user = AccountStore.myInfo;
    return (
      <div className="wrap">
        <Form layout="vertical">
          <FormItem label={appStore.language.getKeyName('email')} colon={false}>
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
              }],
              initialValue: user.email,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label={appStore.language.getKeyName('phone')} colon={false}>
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
              }],
              initialValue: user.phone,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label={appStore.language.getKeyName('address')} colon={false}>
            {getFieldDecorator('address', {
              rules: [{
                max: validator.address.max,
                message: appStore.language.address_maxlength(validator.address.max)
              }],
              initialValue: user.address,
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
;
const MyinfoForm = Form.create()(MyinfoFormDefine);

export default MyinfoForm