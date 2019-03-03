/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/13 0013.
 */
import React from 'react'
import { Form, Input} from 'antd'
import appStore from '../../store/app_store'


class DescriptionForm extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    const {form,device} = this.props;//,device
    const {getFieldDecorator} = form;
    let validator = appStore.validatorRules
    return (
      <Form>
        <div className="wrap grey">{device.mark > 0 ? (appStore.language.getKeyName('mark') + '  ' + device.mark) : (appStore.language.getKeyName('uuid') + '  ' + device.uuid)}</div>
        <Form.Item >
          {getFieldDecorator('description', {
            rules: [
              {pattern: validator.description.pattern, message: appStore.language.length_pattern(validator.description.min, validator.description.max)},
            ],
            initialValue: device.description || '',
          })(
            <Input.TextArea autosize={{ minRows: 3, maxRows: 8 }}/>
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(DescriptionForm)