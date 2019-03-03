import React from 'react'
import {observer} from 'mobx-react'
import {Card, Row, Col, Breadcrumb, Radio, Switch, Form, Select, Button} from 'antd'
import appStore from '../../../store/app_store'
import {Link} from 'react-router-dom'
import {SelectDevice} from './select_device'
import store from '../../device/store'
import {Filters, DateRangePro} from './../../../common'
import {Api, httpConfig, MessageHandle} from '../../../common'
import axios from 'axios/index'
import {message} from 'antd/lib/index'
import settingStore from '../store'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const {unitFilter} = Filters;

@observer
class ModifySetting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: 'custom',
            settingDisable: false,
            modeDate: store.defaultMode["realtime"]
        }
        this.modeOnChange = this.modeOnChange.bind(this);
        this.settingMany = this.settingMany.bind(this);

        this.env_sampling_mode = this.env_sampling_mode.bind(this);
        this.behavior_sampling_mode = this.behavior_sampling_mode.bind(this);
        this.gprs_mode = this.gprs_mode.bind(this);

        this.behavior_sampling_freq = this.behavior_sampling_freq.bind(this)
        this.behavior_voltage_threshold = this.behavior_voltage_threshold.bind(this)
        this.env_sampling_freq = this.env_sampling_freq.bind(this)
        this.env_voltage_threshold = this.env_voltage_threshold.bind(this)
        this.gprs_freq = this.gprs_freq.bind(this)
        this.gprs_voltage_threshold = this.gprs_voltage_threshold.bind(this)
    }

    componentDidMount() {


    }


    modeOnChange(e) {

        let mode = e.target.value
        this.setState({mode: mode})
        if (mode != 'custom') {
            this.setState({settingDisable: true});
            this.setState({modeDate: store.defaultMode[mode]})
        } else {
            this.setState({settingDisable: false});
            this.setState({modeDate: store.defaultMode["realtime"]})
        }
    }

    settingMany() {
        if (appStore.user.role !== 'guest') {
            const data = {
                devices: [],
                env_sampling_mode: this.state.modeDate.env_sampling_mode ? 1 : 2,
                env_sampling_freq: parseFloat(this.state.modeDate.env_sampling_freq),
                env_voltage_threshold: parseFloat(this.state.modeDate.env_voltage_threshold),
                behavior_sampling_mode: this.state.modeDate.behavior_sampling_mode ? 1 : 2,
                behavior_sampling_freq: parseFloat(this.state.modeDate.behavior_sampling_freq),
                behavior_voltage_threshold: parseFloat(this.state.modeDate.behavior_voltage_threshold),
                gprs_mode: this.state.modeDate.gprs_mode ? 1 : 2,
                gprs_freq: parseFloat(this.state.modeDate.gprs_freq),
                gprs_voltage_threshold: parseFloat(this.state.modeDate.gprs_voltage_threshold),
            }
            /*if (!this.state.modeDate.env_sampling_mode) {
              data.env_sampling_freq = device.env_sampling_freq;
              data.env_voltage_threshold = device.env_voltage_threshold;
            }
            if (!this.state.modeDate.behavior_sampling_mode) {
              data.behavior_sampling_freq = device.behavior_sampling_freq;
              data.behavior_voltage_threshold = device.behavior_voltage_threshold;
            }
            if (!this.state.modeDate.gprs_mode) {
              data.gprs_freq = device.gprs_freq;
              data.gprs_voltage_threshold = device.gprs_voltage_threshold;
            }*/

            for (let i = 0; i < settingStore.selectedDevices.length; i++) {
                data.devices.push(settingStore.selectedDevices[i].device_id);
            }
            for (let i = 0; i < settingStore.newSelectedDevices.length; i++) {
                data.devices.push(settingStore.newSelectedDevices[i].id);
            }
            axios.put(Api.settingMany, data, httpConfig()).then(res => {
                message.success(appStore.language.device_setting_updated());
            }).catch(err => {
                MessageHandle(err)
            })
        } else {
            message.info(appStore.language.statusMessage[403]);
        }
    }

    env_sampling_mode() {
        this.state.modeDate.env_sampling_mode = this.state.modeDate.env_sampling_mode === 1 ? 2 : 1;
    }

    behavior_sampling_mode() {
        this.state.modeDate.behavior_sampling_mode = this.state.modeDate.behavior_sampling_mode === 1 ? 2 : 1;
    }

    gprs_mode() {
        this.state.modeDate.gprs_mode = this.state.modeDate.gprs_mode === 1 ? 2 : 1;
    }

    behavior_sampling_freq(value) {
        this.state.modeDate.behavior_sampling_freq = value
    }

    behavior_voltage_threshold(value) {
        this.state.modeDate.behavior_voltage_threshold = value
    }

    env_sampling_freq(value) {
        this.state.modeDate.env_sampling_freq = value
    }

    env_voltage_threshold(value) {
        this.state.modeDate.env_voltage_threshold = value
    }

    gprs_freq(value) {
        this.state.modeDate.gprs_freq = value
    }

    gprs_voltage_threshold(value) {
        this.state.modeDate.gprs_voltage_threshold = value
    }


    render() {
        return (
            <div className="wrap wrap-full">
                <div className="modifyBox">
                    <Card>
                        <Row>
                            <Col className='col-box'>
                                <Breadcrumb>
                                    <Breadcrumb.Item><Link to="device_setting">{appStore.language.device_setting}</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item>{appStore.language.modify_setting}</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                            <Col className='col-box'>
                                <Row>
                                    <Col span={1}>{appStore.language.device}</Col>
                                    <Col span={23}>
                                        <SelectDevice/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='col-box'>
                                <Row>
                                    <Col span={1}>{appStore.language.mode}</Col>
                                    <Col span={23}>
                                        {/*modeRadio*/}
                                        <Row>
                                            <Col>
                                                <RadioGroup size="large" onChange={this.modeOnChange}
                                                            value={this.state.mode}>
                                                    <Radio className={'radio'}
                                                           value="realtime">{appStore.language.realtime_mode}</Radio>
                                                    <Radio className={'radio'}
                                                           value="standard">{appStore.language.standard_mode}</Radio>
                                                    <Radio className={'radio'}
                                                           value="save">{appStore.language.save_mode}</Radio>
                                                    <Radio className={'radio'}
                                                           value="standby">{appStore.language.standby_mode}</Radio>
                                                    <Radio className={'radio'}
                                                           value="custom">{appStore.language.custom_mode}</Radio>
                                                </RadioGroup>
                                            </Col>
                                        </Row>
                                        {/*tittle*/}
                                        <Row className={'modeRow'}>
                                            <Col span={3}>{appStore.language.acquisition_type}</Col>
                                            <Col span={3}>{appStore.language.switch}</Col>
                                            <Col span={3}>{appStore.language.time_interval}</Col>
                                            <Col span={3}>{appStore.language.threshold_voltage}</Col>
                                        </Row>
                                        {/*environment*/}
                                        <Row className={'modeRow'}>
                                            <Col span={3}>{appStore.language.getKeyName('env_sampling_mode')}</Col>
                                            <Col span={3}> <Switch checkedChildren={appStore.language.label_radio_open}
                                                                   unCheckedChildren={appStore.language.label_radio_close}
                                                                   disabled={this.state.settingDisable}
                                                                   onChange={this.env_sampling_mode}
                                                                   checked={this.state.modeDate && (this.state.modeDate.env_sampling_mode === 1)}/></Col>
                                            <Col span={3}>
                                                {this.state.settingDisable ?
                                                    this.state.modeDate && unitFilter(this.state.modeDate.env_sampling_freq, 'freq') :
                                                    (<Select style={{width: 92}} onChange={this.env_sampling_freq}
                                                             defaultValue={unitFilter(this.state.modeDate.env_sampling_freq, 'freq')}
                                                             disabled={this.state.modeDate.env_sampling_mode === 2}>
                                                        {appStore.settingItems.env_sampling_freq.map(d =>
                                                            <Option key={d + ''}>{unitFilter(d, 'freq')}</Option>
                                                        )}
                                                    </Select>)}
                                            </Col>
                                            <Col span={3}>
                                                {this.state.settingDisable ?
                                                    this.state.modeDate && unitFilter(this.state.modeDate.env_voltage_threshold, 'threshold') :
                                                    (<Select style={{width: 92}} onChange={this.env_voltage_threshold}
                                                             defaultValue={unitFilter(this.state.modeDate.env_voltage_threshold, 'threshold')}
                                                             disabled={this.state.modeDate.env_sampling_mode === 2}>
                                                        {appStore.settingItems.env_voltage_threshold.map(d =>
                                                            <Option key={d + ''}>{unitFilter(d, 'threshold')}</Option>
                                                        )}
                                                    </Select>)}
                                            </Col>
                                        </Row>
                                        {/*behavior*/}
                                        <Row className={'modeRow'}>
                                            <Col span={3}>{appStore.language.getKeyName('behavior_sampling_mode')}</Col>
                                            <Col span={3}>
                                                <Switch checkedChildren={appStore.language.label_radio_open}
                                                        unCheckedChildren={appStore.language.label_radio_close}
                                                        disabled={this.state.settingDisable}
                                                        onChange={this.behavior_sampling_mode}
                                                        checked={this.state.modeDate && (this.state.modeDate.behavior_sampling_mode === 1)}/>
                                            </Col>
                                            <Col span={3}>
                                                {this.state.settingDisable ?
                                                    this.state.modeDate && unitFilter(this.state.modeDate.behavior_sampling_freq, 'freq') :
                                                    (<Select style={{width: 92}} onChange={this.behavior_sampling_freq}
                                                             defaultValue={unitFilter(this.state.modeDate.behavior_sampling_freq, 'freq')}
                                                             disabled={this.state.modeDate.behavior_sampling_mode === 2}>
                                                        {appStore.settingItems.behavior_sampling_freq.map(d =>
                                                            <Option key={d + ''}>{unitFilter(d, 'freq')}</Option>
                                                        )}
                                                    </Select>)}
                                            </Col>
                                            <Col span={3}>
                                                {this.state.settingDisable ?
                                                    this.state.modeDate && unitFilter(this.state.modeDate.behavior_voltage_threshold, 'threshold') :
                                                    (<Select style={{width: 92}}
                                                             onChange={this.behavior_voltage_threshold}
                                                             defaultValue={unitFilter(this.state.modeDate.behavior_voltage_threshold, 'threshold')}
                                                             disabled={this.state.modeDate.behavior_sampling_mode === 2}>
                                                        {appStore.settingItems.behavior_voltage_threshold.map(d =>
                                                            <Option key={d + ''}>{unitFilter(d, 'threshold')}</Option>
                                                        )}
                                                    </Select>)}
                                            </Col>
                                        </Row>
                                        {/*gprs*/}
                                        <Row className={'modeRow'}>
                                            <Col span={3}>{appStore.language.getKeyName('gprs_mode')}</Col>
                                            <Col span={3}> <Switch checkedChildren={appStore.language.label_radio_open}
                                                                   unCheckedChildren={appStore.language.label_radio_close}
                                                                   disabled={this.state.settingDisable}
                                                                   onChange={this.gprs_mode}
                                                                   checked={this.state.modeDate && (this.state.modeDate.gprs_mode === 1)}/></Col>
                                            <Col span={3}>
                                                {this.state.settingDisable ?
                                                    this.state.modeDate && unitFilter(this.state.modeDate.gprs_freq, 'freq') :
                                                    (<Select style={{width: 92}} onChange={this.gprs_freq}
                                                             defaultValue={unitFilter(this.state.modeDate.gprs_freq, 'freq')}
                                                             disabled={this.state.modeDate.gprs_mode === 2}>
                                                        {appStore.settingItems.gprs_freq.map(d =>
                                                            <Option key={d + ''}>{unitFilter(d, 'freq')}</Option>
                                                        )}
                                                    </Select>)}
                                            </Col>
                                            <Col span={3}>
                                                {this.state.settingDisable ?
                                                    this.state.modeDate && unitFilter(this.state.modeDate.gprs_voltage_threshold, 'threshold') :
                                                    (<Select style={{width: 92}} onChange={this.gprs_voltage_threshold}
                                                             defaultValue={unitFilter(this.state.modeDate.gprs_voltage_threshold, 'threshold')}
                                                             disabled={this.state.modeDate.gprs_mode === 2}>
                                                        {appStore.settingItems.gprs_voltage_threshold.map(d =>
                                                            <Option key={d + ''}>{unitFilter(d, 'threshold')}</Option>
                                                        )}
                                                    </Select>)}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}
                                                 className="sepcialNote">{appStore.language.special_note}</Col>
                                        </Row>
                                        <Row>
                                            <Col className={'saveBtn'}>
                                                <Button type="primary" size="large"
                                                        onClick={this.settingMany}>{appStore.language.save}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>

        )
    }
}

export default ModifySetting
