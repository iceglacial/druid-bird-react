/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {Form, Input} from 'antd'
import appStore from './../../store/app_store'
import AccountStore from './store'

const FormItem = Form.Item;
class MovebankFormDefine extends React.Component {
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
          <FormItem label={appStore.language.getKeyName('username')} colon={false}>
            {getFieldDecorator('movebank_username', {
              rules: [{
                required: true,
                message: appStore.language.username_required
              }]
            })(
              <Input type="text"
                     placeholder={AccountStore.movebankName?AccountStore.movebankName:""}
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const MovebankForm = Form.create()(MovebankFormDefine);

export default MovebankForm