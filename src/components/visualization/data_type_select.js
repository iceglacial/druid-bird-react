import React from 'react'
import {observer} from 'mobx-react'
import {Radio, Checkbox, message} from 'antd'
import thisStore from './store'
import appStore from '../../store/app_store'

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


@observer
class DataTypeSelect extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
    }

    state = {
        mode: 'flightActivity',
    }

    onRadioChange = (e) => {
        let mode = e.target.value;

        if (mode === 'freeChoiceMode') {
            thisStore.set('modes', []);
        } else {
            thisStore.set('modes', thisStore.modeList[mode].modes);
        }
        thisStore.set('mode', mode);
        this.setState({
            mode: mode,
        });
    }
    //多个设备，数据类型选择
    multOnRadioChange = (e) => {
        let value = e.target.value;
        thisStore.set('modes', [value]);
    }

    options = [
        {
            value: 'speed',
            label: appStore.language.speed,
        },
        {
            value: 'odba',
            label:appStore.language.odba,
        },
        // {
        //     value: 'course',
        //     label: '航向',
        //     disabled: true,
        // },
        {
            value: 'altitude',
            label: appStore.language.altitude,
        },
        {
            value: 'flightAltitude',
            label: appStore.language.flight_altitude,
            disabled: true,
            opacity:true,
        },
        {
            value: 'surfaceHeight',
            label: appStore.language.surface_height,
            disabled: true,
            opacity:true,
        },
        {
            value: 'voltage',
            label: appStore.language.voltage,
        },
        {
            value: 'illumination',
            label: appStore.language.illumination,
        },
        // {
        //     value: 'positioningSuccessRate',
        //     label: '定位成功率',
        //     disabled: true,
        // },
        {
            value: 'positioningDuration',
            label: appStore.language.positioning_duration,
        },
        {
            value: 'satellites',
            label: appStore.language.number_of_positioning_satellites,
        },
        {
            value: 'signalStrength',
            label: appStore.language.internet_signal_strength,
        },
        {
            value: 'temperature',
            label: appStore.language.temperature,
        },
        {
            value: 'humidity',
            label: appStore.language.humidity,
        },
        {
            value: 'airPressure',
            label: appStore.language.pressure,
        }
    ]


    onchkChange = (checkedValues) => {
        if (checkedValues.length > 5) {
            message.warning(appStore.language.only_5_types_of_display_are_supported_at_the_same_time);
            return
        }
        thisStore.set('modes', checkedValues);
    }

    render() {
        return (
            <div>
                {this.props.selectMode === 'single' ?
                    <div>
                        <div>
                            <RadioGroup onChange={this.onRadioChange} value={this.state.mode}>
                                <Radio value={'flightActivity'} className={'radio-item'}>
                                    <span title={appStore.language.flight + '/' + appStore.language.activity_amount}>
                                        {appStore.language.flight}/{appStore.language.activity_amount}
                                        </span>
                                    {this.state.mode === 'flightActivity' ?
                                        <span className={'radio-item_mark'}>
                                            {appStore.language.speed} {appStore.language.course} {appStore.language.odba}
                                            </span> : ''
                                    }
                                </Radio>
                                <Radio value={'flightAltitude'} className={'radio-item'}>
                                    <span title={appStore.language.flight + '/' + appStore.language.height}>
                                        {appStore.language.flight}/{appStore.language.height}
                                        </span>
                                    {this.state.mode === 'flightAltitude' ?
                                        <span
                                            className={'radio-item_mark'}>{appStore.language.speed} {appStore.language.altitude}
                                            {/*{appStore.language.flight_altitude} {appStore.language.surface_height}*/}
                                            </span> : ''
                                    }
                                </Radio>
                                <Radio value={'charging'} className={'radio-item'}>
                                    <span title={appStore.language.charging}>
                                        {appStore.language.charging}
                                    </span>
                                    {this.state.mode === 'charging' ?
                                        <span
                                            className={'radio-item_mark'}>{appStore.language.voltage} {appStore.language.illumination}</span> : ''
                                    }
                                </Radio>
                                <Radio value={'positioning'} className={'radio-item'}>
                                    <span title={appStore.language.positioning}>
                                        {appStore.language.positioning}
                                    </span>
                                    {this.state.mode === 'positioning' ?
                                        <span
                                            className={'radio-item_mark'}>{appStore.language.positioning_duration} {appStore.language.number_of_positioning_satellites}</span> : ''
                                    }
                                </Radio>
                                <Radio value={'internetSignal'} className={'radio-item'}>
                                    <span title={appStore.language.internet_signal}>
                                        {appStore.language.internet_signal}
                                    </span>
                                    {this.state.mode === 'internetSignal' ?
                                        <span
                                            className={'radio-item_mark'}>{appStore.language.internet_signal_strength}</span> : ''
                                    }
                                </Radio>
                                <Radio value={'sensor'} className={'radio-item'}>
                                    <span title={appStore.language.sensor}>
                                        {appStore.language.sensor}
                                    </span>
                                    {this.state.mode === 'sensor' ?
                                        <span
                                            className={'radio-item_mark'}>{appStore.language.temperature} {appStore.language.humidity} {appStore.language.pressure}</span> : ''
                                    }
                                </Radio>
                                <Radio value={'altitude'} className={'radio-item'}>
                                    <span title={appStore.language.altitude2}>
                                        {appStore.language.altitude2}
                                    </span>
                                    {this.state.mode === 'altitude' ?
                                        <span className={'radio-item_mark'}>{appStore.language.altitude}</span> : ''
                                    }
                                </Radio>
                                <Radio value={'freeChoiceMode'} className={'radio-item'}>
                                    <span title={appStore.language.freedom_of_choice}>
                                        {appStore.language.freedom_of_choice}
                                    </span>
                                    {this.state.mode === 'freeChoiceMode' ?
                                        <span className={'radio-item_mark'}>
                                            {appStore.language.you_can_select_up_to_5_items_of_data}</span> : ''
                                    }
                                </Radio>
                            </RadioGroup>
                        </div>
                        {this.state.mode === 'freeChoiceMode' ?
                            <div>
                                <CheckboxGroup onChange={this.onchkChange}>
                                    {this.options.map((v) => {
                                        return (<Checkbox value={v.value} key={v.value}
                                                          disabled={v.disabled}
                                                          style={v.opacity?{display:'none'}:{}}>
                                            <span title={v.label}>
                                                {v.label}
                                            </span>
                                        </Checkbox>)
                                    })}
                                </CheckboxGroup>
                            </div> : ''}
                    </div> :
                    <div className={'multiple__data-type'}>
                        <RadioGroup onChange={this.multOnRadioChange}>
                            {this.options.map((v) => {
                                return (<Radio value={v.value} key={v.value}
                                               disabled={v.disabled}
                                               style={v.opacity?{display:'none'}:{}}>
                                <span title={v.label}>
                                    {v.label}
                                </span>
                                </Radio>)
                            })}
                        </RadioGroup>

                    </div>
                }
            </div>
        )
    }
}

export default DataTypeSelect