/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/13 0013.
 */
import React from 'react'
import {Switch, Row, Col, Input, Select, Form, Checkbox, InputNumber} from 'antd'
import appStore from '../../store/app_store'
import DeviceStore from './store'
import {Filters,WordLimit} from '../../common'

const Option = Select.Option;
const FormItem = Form.Item;
const {unitFilter, biologicalInfoFormat} = Filters
// const {wordLength} = WordLimit

class CollectionCreateForm extends React.Component {
  constructor(props) {
    super(props)
  }
  checkNickName=(rule, value, callback) => {
    // const form = this.props.form;
    let valid = WordLimit(value,50);
    if (!valid) {
      callback( appStore.language.string_pattern);
    } else {
      callback();
    }
  }
  checkAddress=(rule, value, callback) => {
    // const form = this.props.form;
    let validator = appStore.biologicalValidator
    let valid = WordLimit(value,validator.location.max);
    if (!valid) {
      callback(appStore.language.length_pattern(validator.location.min, validator.location.max));
    } else {
      callback();
    }
  }

  render() {
    const selectItems = DeviceStore.biologicalItems;
    const {form, biologicalInfo} = this.props;//,biological
    const {getFieldDecorator} = form;
    let validator = appStore.biologicalValidator
    let biological = biologicalInfoFormat(biologicalInfo ? biologicalInfo : DeviceStore.biologicalDevice)
    const labelOptions = [
      {label: appStore.language.getKeyName('neck'), value: 'neck'},
      {label: appStore.language.getKeyName('beak'), value: 'beak'},
      {label: appStore.language.getKeyName('back'), value: 'back'},
      {label: appStore.language.getKeyName('leg'), value: 'leg'},
    ];
    const swabOptions = [
      {label: appStore.language.getKeyName('anal'), value: 'anal'},
      {label: appStore.language.getKeyName('throat'), value: 'throat'},
    ];
    const featherOptions = [
      {label: appStore.language.getKeyName('head'), value: 'head'},
      {label: appStore.language.getKeyName('breast'), value: 'breast'},
      {label: appStore.language.getKeyName('covert'), value: 'covert'},
      {label: appStore.language.getKeyName('tail'), value: 'tail'},
    ];
    let layoutInput = {
      labelCol: {span: 10},
      wrapperCol: {span: 14}
    }
    let layoutMore = {
      labelCol: {span: 5},
      wrapperCol: {span: 19}
    }
    const bidFormItem = (
      <FormItem label={appStore.language.getKeyName('bid')} {...layoutMore}>
        {getFieldDecorator('bid', {
          rules: [
            {validator: this.checkNickName},
          ],
          initialValue: biological.bid,
        })(
          <Input></Input>
          // disabled={!!biological.bid}
        )}
      </FormItem>
    )
    const labelFormItem = (
      <FormItem label={appStore.language.getKeyName('label')} {...layoutMore}>
        {getFieldDecorator('label', {
          initialValue: biological.label,
        })(
          <Checkbox.Group options={labelOptions}/>
          // disabled={!!biological.bid}
        )}
      </FormItem>
    )
    const updatedAtFormItem = (
      <FormItem label={appStore.language.getKeyName('updated_at', 'bird')} {...layoutInput}>
        {getFieldDecorator('updated_at', {
          initialValue: biological.updated_at ? unitFilter(biological.updated_at, 'updated_at') : null,
          rules: [{}],
        })(
          <Input disabled/>
        )}
      </FormItem>
    )
    const latitudeFormItem = (
      <FormItem label={appStore.language.getKeyName('latitude')} {...layoutInput}>
        {getFieldDecorator('latitude', {
          initialValue: biological.latitude,
          rules: [
            // {pattern: validator.latitude.pattern, message: validator.latitude.message},
          ],
          // onChange: this.handleValueChange
        })(
          <InputNumber formatter={(value)=>value + '°'} parser={value => value.replace('°', '')} precision="7" min={-90} max={90} step="0.0000001"/>
        )}
      </FormItem>
    )
    const longitudeFormItem = (
      <FormItem label={appStore.language.getKeyName('longitude')} {...layoutInput}>
        {getFieldDecorator('longitude', {
          initialValue: biological.longitude,
          rules: [
            // {pattern: validator.longitude.pattern, message: validator.longitude.message},
          ],
        })(
          <InputNumber formatter={(value)=>value + '°'} parser={value => value.replace('°', '')} precision="7" min={-180} max={180} step="0.0000001"/>
        )}
      </FormItem>
    )
    const locationFormItem = (
      <FormItem label={appStore.language.getKeyName('location')} {...layoutInput}>
        {getFieldDecorator('location', {
          initialValue: biological.location,
          rules: [
            {validator: this.checkAddress},
          ],
        })(
          <Input />
        )}
      </FormItem>
    )
    const speciesFormItem = (
      <FormItem label={appStore.language.getKeyName('species')} {...layoutInput}>
        {getFieldDecorator('species', {
          initialValue: biological.species,
          rules: [
            {
              pattern: validator.species.pattern,
              message: appStore.language.length_pattern(validator.species.min, validator.species.max)
            },
          ],
        })(
          <Input />
        )}
      </FormItem>
    )
    const genderFormItem = (
      <FormItem label={appStore.language.getKeyName('gender')} {...layoutInput}>
        {getFieldDecorator('gender', {
          initialValue: biological.gender !== undefined ? biological.gender + '' : '',
          rules: [{}],
        })(
          <Select
            placeholder={appStore.language.please_choose}
            optionFilterProp="children"
            // onFocus={handleFocus}
            // onBlur={handleBlur}
          >
            {selectItems.gender.map(option =>
              <Option key={option + ''}>{unitFilter(option, 'gender')}</Option>
            )}
          </Select>
        )}
      </FormItem>
    )
    const ageFormItem = (
      <FormItem label={appStore.language.getKeyName('age')} {...layoutInput}>
        {getFieldDecorator('age', {
          initialValue: biological.age !== undefined ? biological.age + '' : '',
          rules: [{}],
        })(
          <Select
            placeholder={appStore.language.please_choose}
            optionFilterProp="children"
            // onFocus={handleFocus}
            // onBlur={handleBlur}
          >
            {selectItems.age.map(option =>
              <Option key={option + ''}>{unitFilter(option, 'age')}</Option>
            )}
          </Select>
        )}
      </FormItem>
    )

    const weightFormItem = (
      <FormItem label={appStore.language.getKeyName('weight')} {...layoutInput}>
        {getFieldDecorator('weight', {
          initialValue: biological.weight,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber formatter={(value)=>value + ' g'} parser={value => value.replace('g', '')} precision="0" min={0} max={99999} step="1" />
        )}
      </FormItem>
    )
    const headLengthFormItem = (
      <FormItem label={appStore.language.getKeyName('head_length')} {...layoutInput}>
        {getFieldDecorator('head_length', {
          initialValue: biological.head_length,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber formatter={(value)=>value + ' cm'} parser={value => value.replace(/cm|m|c/, '')} precision="0" min={0} max={999} step="2" />
        )}
      </FormItem>
    )
    const tarsusLengthFormItem = (
      <FormItem label={appStore.language.getKeyName('tarsus_length')} {...layoutInput}>
        {getFieldDecorator('tarsus_length', {
          initialValue: biological.tarsus_length,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber  formatter={(value)=>value + ' cm'} parser={value => value.replace(/cm|m|c/, '')} precision="0" min={0} max={999} step="1"  />
        )}
      </FormItem>
    )
    const wingLengthFormItem = (
      <FormItem label={appStore.language.getKeyName('wing_length')} {...layoutInput}>
        {getFieldDecorator('wing_length', {
          initialValue: biological.wing_length,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber  formatter={(value)=>value + ' cm'} parser={value => value.replace(/cm|m|c/, '')} precision="0" min={0} max={999} step="1"  />
        )}
      </FormItem>
    )
    const tailLengthFormItem = (
      <FormItem label={appStore.language.getKeyName('tail_length')} {...layoutInput}>
        {getFieldDecorator('tail_length', {
          initialValue: biological.tail_length,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber  formatter={(value)=>value + ' cm'} parser={value => value.replace(/cm|m|c/, '')} precision="0" min={0} max={999} step="1"  />
        )}
      </FormItem>
    )
    const culmenLengthFormItem = (
      <FormItem label={appStore.language.getKeyName('culmen_length')} {...layoutInput}>
        {getFieldDecorator('culmen_length', {
          initialValue: biological.culmen_length,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber  formatter={(value)=>value + ' cm'} parser={value => value.replace(/cm|m|c/, '')} precision="0" min={0} max={999} step="1"  />
        )}
      </FormItem>
    )
    const wingspanFormItem = (
      <FormItem label={appStore.language.getKeyName('wingspan')} {...layoutInput}>
        {getFieldDecorator('wingspan', {
          initialValue: biological.wingspan,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber  formatter={(value)=>value + ' cm'} parser={value => value.replace(/cm|m|c/, '')} precision="0" min={0} max={999} step="1"  />
        )}
      </FormItem>
    )
    const bodyLengthFormItem = (
      <FormItem label={appStore.language.getKeyName('body_length')} {...layoutInput}>
        {getFieldDecorator('body_length', {
          initialValue: biological.body_length,
          rules: [
            // {
            //   pattern: validator.number_float.pattern,
            //   message: appStore.language.number_float_pattern(validator.number_float.min, validator.number_float.max)
            // },
          ]
        })(
          <InputNumber  formatter={(value)=>value + ' cm'} parser={value => value.replace(/cm|m|c/, '')} precision="0" min={0} max={999} step="1"  />
        )}
      </FormItem>
    )
    const swabFormItem = (
      <FormItem label={appStore.language.getKeyName('swab')} {...layoutMore}>
        {getFieldDecorator('swab', {
          initialValue: biological.swab,
        })(
          <Checkbox.Group options={swabOptions}/>
          // disabled={!!biological.bid}
        )}
      </FormItem>
    )
    const featherFormItem = (
      <FormItem label={appStore.language.getKeyName('feather')} {...layoutMore}>
        {getFieldDecorator('feather', {
          initialValue: biological.feather,
        })(
          <Checkbox.Group options={featherOptions}/>
          // disabled={!!biological.bid}
        )}
      </FormItem>
    )
    const bloodFormItem = (
      <FormItem label={appStore.language.getKeyName('blood')} {...layoutMore}>
        {getFieldDecorator('blood', {
          initialValue: biological.blood,
          valuePropName: 'checked'
        })(
          /*<Checkbox />*/
          <Switch />
          // disabled={!!biological.bid}
        )}
      </FormItem>
    )
    const noteFormItem = (
      <FormItem label={appStore.language.getKeyName('note')} {...layoutMore}>
        {getFieldDecorator('note', {
          initialValue: biological.note,
          rules: [
            {
              pattern: validator.note.pattern,
              message: appStore.language.length_pattern(validator.note.min, validator.note.max)
            },
          ]
        })(
          <Input.TextArea />
        )}
      </FormItem>
    )
    return (
      <div className="has-even-shadow biological-box">
        <Form>
          <Row className={'no-padding'}>
            <Col span={24}>{bidFormItem}</Col>
          </Row>
          <Row className={'no-padding'}>
            <Col span={24}>{labelFormItem}</Col>
          </Row>
          <Row className={'no-padding'}>
            <div className="sub-title">{appStore.language.location}</div>
            <Col span={12}>{updatedAtFormItem}</Col>
            <Col span={12}>{latitudeFormItem}</Col>
            <Col span={12}>{locationFormItem}</Col>
            <Col span={12}>{longitudeFormItem}</Col>
          </Row>
          <Row className={'no-padding'}>
            <div className="sub-title">{appStore.language.basic_info}</div>
            <Col span={12}>{speciesFormItem}</Col>
            <Col span={12}>{genderFormItem}</Col>
            <Col span={12}>{ageFormItem}</Col>
            <Col span={12}>{weightFormItem}</Col>
          </Row>
          <Row className={'no-padding'}>
            <div className="sub-title">{appStore.language.organism_measurement}</div>
            <Col span={12}>{headLengthFormItem}</Col>
            <Col span={12}>{tarsusLengthFormItem}</Col>
            <Col span={12}>{wingLengthFormItem}</Col>
            <Col span={12}>{tailLengthFormItem}</Col>
            <Col span={12}>{culmenLengthFormItem}</Col>
            <Col span={12}>{wingspanFormItem}</Col>
            <Col span={12}>{bodyLengthFormItem}</Col>
          </Row>
          <Row className={'no-padding'}>
            <Col span={24}>{swabFormItem}</Col>
          </Row>
          <Row className={'no-padding'}>
            <Col span={24}>{featherFormItem}</Col>
          </Row>
          <Row className={'no-padding'}>
            <Col span={24}>{bloodFormItem}</Col>
          </Row>
          <Row className='has-textarea no-padding'>
            <Col span="24">{noteFormItem}</Col>
          </Row>
        </Form>
      </div>
    );
  }
}
;

export default Form.create()(CollectionCreateForm)