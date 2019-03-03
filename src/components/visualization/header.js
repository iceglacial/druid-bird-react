import React from 'react'
import {observer} from 'mobx-react'
import {Card, Divider, message} from 'antd'
import DeviceSelect from './device_select'
import TimeSelect from './time_select'
import DataTypeSelect from './data_type_select'
import thisStore from './store'
import appStore from '../../store/app_store'

const tabList = [{
    key: 'single',
    tab: appStore.language.single,
}, {
    key: 'multiple',
    tab: appStore.language.multiple,
}];


@observer
class Header extends React.Component {
    state = {
        key: 'tab1',
        contentKey: 'single',
    }

    onTabChange = (key, type) => {
        thisStore.deviceType = key;
        this.child.clear();
        if (key === 'multiple') {
            thisStore.set('mode', 'freeChoiceMode')
        }
        this.child.showSearch();
        this.setState({[type]: key});
    }

    onRef = (ref) => {
        this.child = ref
    }

    //根据传入的单、多类型生成tab页内容
    contentGeneration = (type) => {
        return <div className={type}>
            <div className={'select-block device-select'}>
                <div className={'select-block__title'}>
                    {appStore.language.device}
                </div>
                <DeviceSelect onRef={this.onRef} selectMode={type}/>
            </div>
            <div className={'select-block data-type-select'}>
                <div className={'select-block__title'}>
                    {appStore.language.data}
                </div>
                <DataTypeSelect selectMode={type}/>
            </div>
            <div className={'select-block time-range-select'}>
                <div className={'select-block__title'}>
                    {appStore.language.date}
                </div>
                <TimeSelect/>
            </div>
            <Divider/>
            <p className={'header__bottom'}>
                <button className={'header__bottom-btn'}
                        onClick={this.generateChart}>{appStore.language.generating_chart}</button>
            </p>
        </div>
    }

    componentDidMount() {

    }

    //生成图表
    generateChart = () => {

        //设备与模式判空
        if (!thisStore.devices.length) {
            message.warning(appStore.language.please_select_a_device);
            return;
        } else if (thisStore.mode === 'freeChoiceMode' && thisStore.modes.length === 0) {
            message.warning(appStore.language.please_select_the_type_of_data_you_want_to_display);
            return;
        }

        //时间判空
        if(thisStore.timeRange==='week'&&thisStore.week===''){
            message.warning(appStore.language.select_week);
            return;
        }
        if(thisStore.timeRange==='month'&&thisStore.month===''){
            message.warning(appStore.language.select_month);
            return;
        }

        //根据情况生成div
        let length = 1, arr = [];
        if (thisStore.mode === 'freeChoiceMode' || !thisStore.modeList[thisStore.mode].singleChart) {
            length = thisStore.devices.length + thisStore.modes.length - 1;
        }
        for (let i = 0; i < length; i++) {
            arr.push(i)
        }
        thisStore.set('chartList', arr)

        //显示chart容器
        thisStore.set('showCharts', true);

        //collapse
        let chartEle = document.getElementById('Chart');
        if (chartEle) {
            chartEle.scrollIntoView();
        }

        let ids = [];
        if (thisStore.deviceType === 'single') {
            ids = [thisStore.devices[0].id];
        } else {
            for (let i = 0; i < thisStore.devices.length; i++) {
                ids.push(thisStore.devices[i].id);
            }
        }
        thisStore.getChartData(ids, thisStore.modes, thisStore.timeRange);
    }

    //收起筛选框
    collapse = () => {
        let chartEle = document.getElementById('Chart');
        if (chartEle) {
            chartEle.scrollIntoView();
        }
    }

    render() {
        return (
            <header className={'header'}>
                <Card
                    style={{width: '100%'}}
                    tabList={tabList}
                    // extra={<p className={'header__top-collapse'} onClick={this.collapse}>收起筛选框</p>}
                    activeTabKey={this.state.contentKey}
                    onTabChange={(key) => {
                        this.onTabChange(key, 'contentKey');
                    }}
                >
                    {this.contentGeneration(this.state.contentKey)}
                </Card>
            </header>
        )
    }
}

export default Header
