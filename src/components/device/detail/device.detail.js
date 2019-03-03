/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/19 0019.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Button, Tabs, DatePicker, Col, Row, Radio} from 'antd'
import DeviceDetailHead from './device.detail.head'
import GpsAnalysis from './gps_analysis'
import GpsGrid from './gps.grid'
import BehaviorGrid from './behavior.grid'
import BehaviorGrid2 from './behavior2.grid'
import SmsGrid from './sms.grid'
import {Link} from 'react-router-dom'
import appStore from '../../../store/app_store'
import moment from 'moment'
import thisStore from './store'
import deviceStore from '../store'
import {DateRangePro} from '../../../common'
import MyGrid from '../../grid/mygrid'
import GridStore from '../../grid/store'

const {RangePicker} = DatePicker;

@observer
class DeviceDetail extends React.Component {
    constructor(props) {
        super(props)
        this.currentDeviceID = props.match.params.id;
    }

    componentWillUnmount() {
        //#2756
        thisStore.clearStore();
    }

    state = {
        tabsActiveKey: thisStore.gridType,
        data_picker_before: true,
    }

    onChangeDateRange = (date, dateString) => {

        const _range = {
            // pickDate: moment.utc(date).toISOString(),
            begin: moment(date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
            end: moment(date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
        }
        if (!date) {
            thisStore.setRangeDate({});
            thisStore.datePicking = false;
        } else {
            thisStore.setRangeDate(_range);
            thisStore.datePicking = true;
        }
    }
    onChangeDateBtn = () => {
        thisStore.setDatePickDirection(!this.state.data_picker_before);
        this.setState({data_picker_before: !this.state.data_picker_before})
    }
    onChangeGPSShow = (e) => {
        thisStore.set('gpsShowType', e.target.value);
    }
    onChangeTabs = (key) => {
        this.setState({
            tabsActiveKey: key
        });
        thisStore.set('gridType', key);
        thisStore.set('reload', false);
        // GridStore.set('gridData',[]);
        // console.log(key)
        //强制触发window.resize
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 0)

    }

    render() {
        const operations = <Row type='flex' className="tabs-operation">
            {
                this.state.tabsActiveKey === 'env' ?
                    <Col className='item-box'>
                        <Radio.Group onChange={this.onChangeGPSShow} defaultValue={thisStore.gpsShowType}>
                            <Radio.Button value='0'>{appStore.language.show_analysis}</Radio.Button>
                            <Radio.Button value='1'>{appStore.language.show_data_list}</Radio.Button>
                        </Radio.Group>
                    </Col> : ''
            }
            <Col className='item-box'>
                <DatePicker onChange={this.onChangeDateRange}
                            disabledDate={DateRangePro.disabledDate}
                            format="YYYY-MM-DD HH:mm:ss"
                            disabled={thisStore.gpsShowType==='0'}
                            showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                    //placeholder={[appStore.language.start_date,appStore.language.end_date]}
                />

                <button className={'date-picker-btn'}
                        disabled={thisStore.gpsShowType==='0'}
                        onClick={this.onChangeDateBtn}>{this.state.data_picker_before ? appStore.language.descending : appStore.language.ascending}</button>
            </Col>
            <Col className='item-box'>
                <Link
                    to={`/map/device_path/${this.currentDeviceID}`}><Button>{appStore.language.device_path}</Button></Link>
            </Col>
        </Row>;
        return (
            <div className="device-detail wrap-full">
                <div className="flex-box wrap-full">
                    <DeviceDetailHead deviceId={this.props.match.params.id}/>
                    <div className="wrap wrap-full device-data">
                        <div className="wrap-full">
                            <Tabs tabPosition='top' type="card" activeKey={this.state.tabsActiveKey}
                                  onChange={this.onChangeTabs} tabBarExtraContent={operations}>
                                <Tabs.TabPane tab={appStore.language.env} key="env">
                                    {
                                        thisStore.gpsShowType === '0'
                                            ? <GpsAnalysis deviceId={this.props.match.params.id}/>
                                            : <GpsGrid type={'env'} deviceId={this.props.match.params.id}/>
                                    }
                                    {/*<GpsGrid deviceId={this.props.match.params.id}/>*/}
                                    {/*<MyGrid type={'env'} sort={'-timestamp'} deviceId={this.props.match.params.id}/>*/}
                                </Tabs.TabPane>
                                {
                                    deviceStore.behaviorType<=100 ?
                                        <Tabs.TabPane tab={appStore.language.bhv} key="bhv">
                                            {/*<MyGrid type={'bhv'} sort={'-timestamp'} deviceId={this.props.match.params.id}/>*/}
                                            <BehaviorGrid type={'bhv'} deviceId={this.props.match.params.id}/>
                                        </Tabs.TabPane> :
                                        <Tabs.TabPane tab={appStore.language.odba} key="odba">
                                            {/*<MyGrid type={'bhv'} sort={'-timestamp'} deviceId={this.props.match.params.id}/>*/}
                                            <BehaviorGrid2 type={'bhv'} deviceId={this.props.match.params.id}/>
                                        </Tabs.TabPane>
                                }

                                <Tabs.TabPane tab={appStore.language.sms} key="sms">
                                    {/*<MyGrid type={'sms'} sort={'-timestamp'} deviceId={this.props.match.params.id}/>*/}
                                    <SmsGrid type={'sms'} deviceId={this.props.match.params.id}/>
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeviceDetail;