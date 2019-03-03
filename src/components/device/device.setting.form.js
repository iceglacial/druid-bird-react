/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/13 0013.
 */
import React from 'react'
import AppStore from './../../store/app_store'
import {Row, Col, Radio, Switch, Select, Form, DatePicker} from 'antd'
import {Filters, DateRangePro} from './../../common'
import DeviceStore from './store'
import appStore from '../../store/app_store'
import moment from 'moment'
import {observer} from 'mobx-react'
import thisStore from '../device.setting/store'

const {unitFilter} = Filters;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

/**
 * 匹配配置模式
 * @param params
 * @returns {string}
 */
function matchMode(params) {
    let modeType = 'custom';
    let modes = Object.keys(DeviceStore.defaultMode)
    let keys = Object.keys(DeviceStore.defaultMode['realtime'])
    for (let modeKey of modes) {
        let match = true
        let mode = DeviceStore.defaultMode[modeKey]
        keys.map(key => {
            let isMode = (key.indexOf('mode') !== -1);//开关
            if (isMode) {
                let modeMatch = (mode[key] === params[key])//开关匹配，1为开启
                if (!modeMatch) {
                    match = false;
                }
            } else if (mode[key]) {
                if (mode[key] !== params[key]) {
                    match = false;
                }
            }
        })
        if (match) {
            modeType = modeKey
            break;
        }
    }
    if (modeType === 'custom') {
        DeviceStore.set('modeDisabled', false)
    } else {
        DeviceStore.set('modeDisabled', true)
    }
    return modeType
}

@observer
class CollectionCreateForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: matchMode(DeviceStore.settingDevice)
        }
        this.modeOnChange = this.modeOnChange.bind(this);
    }

    modeOnChange = (e) => {
        const {modeOnChange} = this.props;//,device
        modeOnChange(e);
        // #2470:修改自定义后，其余模式数据均被修改
        DeviceStore.settingForm.resetFields();
    }

    render() {
        const selectItems = AppStore.settingItems;
        const {form} = this.props;//,device
        const {getFieldDecorator, getFieldValue} = form;
        // console.log(device,device.env_sampling_mode,device.gprs_mode,limit);

        let device = DeviceStore.settingDevice;
        //
        // let modeType = matchMode(device);


        return (
            <Form>
                <div className="ant-modal-header has-title-circle">
                    <div className="circle-wrap">
                        <div className="title title-circle">{device.mark || '-'}</div>
                    </div>
                    <div className="modal-head-body">
                        <div className="title">{device.uuid}</div>
                        <div className="">
                            <div>
                  <span
                      className="item">{appStore.language.getKeyName('updated_at', 'device_set')}: {unitFilter(device.updated_at, 'updated_at')}</span>
                                <span
                                    className="item">{appStore.language.getKeyName('downloaded_at')}: {unitFilter(device.downloaded_at, 'downloaded_at')}</span>
                            </div>
                            <div>
                                {appStore.language.device_installation_time}:
                                {getFieldDecorator('attached_at', {
                                    initialValue: device.attached_at ? moment(device.attached_at) : null,
                                })(
                                    <DatePicker format="YYYY-MM-DD HH:mm:ss"
                                                disabledDate={DateRangePro.disabledDate}
                                                disabledTime={DateRangePro.disabledTime}
                                                showTime/>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="ant-modal-inner text-center">
                    <div className="mode-box">
                        {getFieldDecorator('setting_mode', {
                            initialValue: this.state.mode,
                        })(
                            <RadioGroup size="large" onChange={this.modeOnChange} value={this.state.mode}>
                                <RadioButton value="realtime">{appStore.language.realtime_mode}</RadioButton>
                                <RadioButton value="standard">{appStore.language.standard_mode}</RadioButton>
                                <RadioButton value="save">{appStore.language.save_mode}</RadioButton>
                                <RadioButton value="standby">{appStore.language.standby_mode}</RadioButton>
                                <RadioButton value="custom">{appStore.language.custom_mode}</RadioButton>
                            </RadioGroup>
                        )}
                    </div>
                    <div className="table-box">
                        {/*环境采样*/}
                        <Row>
                            <Col span={6}>{appStore.language.acquisition_type}</Col>
                            <Col span={4}>{appStore.language.switch}</Col>
                            <Col span={7}>{appStore.language.time_interval}</Col>
                            <Col span={7}>{appStore.language.threshold_voltage}</Col>
                        </Row>
                        <Row>
                            <Col span={6}>{appStore.language.getKeyName('env_sampling_mode')}</Col>
                            <Col span={4}>
                                {getFieldDecorator('env_sampling_mode', {
                                    valuePropName: 'checked',
                                    initialValue: device.env_sampling_mode === 1,
                                })(
                                    <Switch checkedChildren={appStore.language.label_radio_open}
                                            unCheckedChildren={appStore.language.label_radio_close}
                                            disabled={DeviceStore.modeDisabled}/>
                                )}
                            </Col>
                            <Col span={7}>
                                {getFieldDecorator('env_sampling_freq', {
                                    initialValue: device.env_sampling_freq + '',//unitFilter(device.env_sampling_freq,'freq'),
                                    rules: [{}],
                                })(
                                    <Select
                                        showSearch
                                        // placeholder=""
                                        optionFilterProp="children"
                                        onChange={handleChange}
                                        disabled={!getFieldValue('env_sampling_mode') || DeviceStore.modeDisabled}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            selectItems.env_sampling_freq.map(d =>
                                                <Option key={d + ''}>{unitFilter(d, 'freq')}</Option>
                                            )}
                                    </Select>
                                )}
                            </Col>
                            <Col span={7}>
                                {getFieldDecorator('env_voltage_threshold', {
                                    initialValue: device.env_voltage_threshold + '',//unitFilter(device.env_voltage_threshold,'threshold'),
                                    rules: [{}],
                                })(
                                    <Select
                                        showSearch
                                        // placeholder=""
                                        optionFilterProp="children"
                                        disabled={!getFieldValue('env_sampling_mode') || DeviceStore.modeDisabled}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {selectItems.env_voltage_threshold.map(d =>
                                            <Option key={d + ''}>{unitFilter(d, 'threshold')}</Option>
                                        )}
                                    </Select>
                                )}
                            </Col>
                        </Row>
                        {/*behavior*/}
                        <Row>
                            <Col span={6}>{appStore.language.getKeyName('behavior_sampling_mode')}</Col>
                            <Col span={4}>
                                {getFieldDecorator('behavior_sampling_mode', {
                                    valuePropName: 'checked',
                                    initialValue: device.behavior_sampling_mode === 1,
                                })(
                                    <Switch checkedChildren={appStore.language.label_radio_open}
                                            unCheckedChildren={appStore.language.label_radio_close}
                                            disabled={DeviceStore.modeDisabled}/>
                                )}
                            </Col>
                            <Col span={7}>
                                {getFieldDecorator('behavior_sampling_freq', {
                                    initialValue: device.behavior_sampling_freq + '',//unitFilter(device.env_sampling_freq,'freq'),
                                    rules: [{}],
                                })(
                                    <Select
                                        showSearch
                                        // placeholder=""
                                        optionFilterProp="children"
                                        onChange={handleChange}
                                        disabled={!getFieldValue('behavior_sampling_mode') || DeviceStore.modeDisabled}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {selectItems.behavior_sampling_freq.map(d =>
                                            <Option key={d + ''}>{unitFilter(d, 'freq')}</Option>
                                        )}
                                    </Select>
                                )}
                            </Col>
                            <Col span={7}>
                                {getFieldDecorator('behavior_voltage_threshold', {
                                    initialValue: device.behavior_voltage_threshold + '',//unitFilter(device.env_voltage_threshold,'threshold'),
                                    rules: [{}],
                                })(
                                    <Select
                                        showSearch
                                        // placeholder=""
                                        optionFilterProp="children"
                                        disabled={!getFieldValue('behavior_sampling_mode') || DeviceStore.modeDisabled}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {selectItems.behavior_voltage_threshold.map(d =>
                                            <Option key={d + ''}>{unitFilter(d, 'threshold')}</Option>
                                        )}
                                    </Select>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>{appStore.language.getKeyName('gprs_mode')}</Col>
                            <Col span={4}>
                                {getFieldDecorator('gprs_mode', {
                                    valuePropName: 'checked',
                                    initialValue: device.gprs_mode === 1
                                })(
                                    <Switch checkedChildren={appStore.language.label_radio_open}
                                            unCheckedChildren={appStore.language.label_radio_close}
                                            disabled={DeviceStore.modeDisabled}/>
                                )}
                            </Col>
                            <Col span={7}>
                                {getFieldDecorator('gprs_freq', {
                                    initialValue: device.gprs_freq + '',//unitFilter(device.gprs_freq,'freq'),
                                    rules: [{}],
                                })(
                                    <Select
                                        showSearch
                                        // placeholder=""
                                        optionFilterProp="children"
                                        disabled={!getFieldValue('gprs_mode') || DeviceStore.modeDisabled}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {selectItems.gprs_freq.map(d =>
                                            <Option key={d + ''}>{unitFilter(d, 'freq')}</Option>
                                        )}
                                    </Select>
                                )}
                            </Col>
                            <Col span={7}>
                                {getFieldDecorator('gprs_voltage_threshold', {
                                    initialValue: device.gprs_voltage_threshold + '',//unitFilter(device.gprs_voltage_threshold,'threshold'),
                                    rules: [{}],
                                })(
                                    <Select
                                        showSearch
                                        // placeholder=""
                                        optionFilterProp="children"
                                        disabled={!getFieldValue('gprs_mode') || DeviceStore.modeDisabled}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {selectItems.gprs_voltage_threshold.map(d =>
                                            <Option key={d + ''}>{unitFilter(d, 'threshold')}</Option>
                                        )}
                                    </Select>
                                )}
                            </Col>
                        </Row>
                    </div>
                </div>
            </Form>
        );
    }
}

function handleChange(value) {
    console.log(`selected ${value}`);
}

CollectionCreateForm = Form.create()(CollectionCreateForm)
export default CollectionCreateForm