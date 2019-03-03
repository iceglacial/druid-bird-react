import React from 'react'
import {observer} from 'mobx-react'
import moment from 'moment';
import {Radio, DatePicker} from 'antd'
import thisStore from './store'
import appStore from '../../store/app_store'

const RadioGroup = Radio.Group;
const { MonthPicker, WeekPicker } = DatePicker;

@observer
class TimeSelect extends React.Component {
    componentDidMount() {
    }

    state = {
        value: 'last_7_days',
        startValue: null,
        endValue: null,
        endOpen: false,
        PickerDisabled: true,
    }
    onRadioChange = (e) => {
        let value = e.target.value;
        thisStore.set('timeRange', value);
        this.setState({
            value: e.target.value,
        });

    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledDate = (current) => {
        return  current > moment().endOf('day');
    }

    onWeekChange = (value,string) => {
        string=string.slice(0,-2);
        string=string.replace('-','W')
        thisStore.set('week',string);
    }

    onMonthChange = (value,string) => {
        thisStore.set('month',string);
    }

    render() {
        return (
            <div>
                <RadioGroup onChange={this.onRadioChange} defaultValue={'last_7_days'}>
                    <Radio value={'last_7_days'}>{appStore.language.last_week}</Radio>
                    <Radio value={'last_1_month'}>{appStore.language.last_month}</Radio>
                    <Radio value={'week'} className={'ant-radio-wrapper-long'}>
                        <WeekPicker onChange={this.onWeekChange}  disabledDate={this.disabledDate}
                        placeholder={appStore.language.select_week}/>
                    </Radio>
                    <Radio value={'month'} className={'ant-radio-wrapper-long'}>
                        <MonthPicker onChange={this.onMonthChange} disabledDate={this.disabledDate}
                                     placeholder={appStore.language.select_month}/>
                    </Radio>
                </RadioGroup>
            </div>
        )
    }
}

export default TimeSelect