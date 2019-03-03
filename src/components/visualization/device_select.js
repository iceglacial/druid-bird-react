import React from 'react'
import {observer} from 'mobx-react'
import {Button, Icon} from 'antd'
import DeviceSearch from './device_search'
import thisStore from './store'
import appStore from '../../store/app_store'


@observer
class DeviceSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectMode: props.selectMode,
            searchBoxVisible: true,
            newSelected: [],
            useless: true//用来强制render
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.setState({newSelected: []});
    }

    clear = () => {
        this.setState({newSelected: []});
        thisStore.set('devices', []);
    }

    /*
    * 显示搜索框
    * */
    showSearch = () => {
        this.setState({searchBoxVisible: true})
    }

    /*
    * 隐藏搜索框
    * */
    hideSearch = () => {
        this.setState({searchBoxVisible: false})
    }

    /*
    * 添加新设备
    * */
    addDevice = (event) => {
        let id = event.item.props['data-id'];
        for (let i = 0; i < this.state.newSelected.length; i++) {
            if (this.state.newSelected[i].id === id) {
                return
            }
        }
        //设备数量限制
        if (thisStore.deviceType === 'single' && this.state.newSelected.length >= 1) {
            return
        }
        if (thisStore.deviceType === 'multiple' && this.state.newSelected.length >= 5) {
            return
        }

        let mark = event.item.props['data-mark'];
        this.state.newSelected.push({id, mark});
        thisStore.set('devices', this.state.newSelected);
        this.hideSearch();
        this.setState({useless: true});
    }
    /*
    * 设备切换
    * */
    deviceSwitching = (event) => {
        let id = event.item.props['data-id'];
        console.log(id);
    }

    /*
    * 移除选中的设备
    * */
    removeDevice = (e) => {
        if (thisStore.deviceType === 'single') {
            return
        }
        let id = e.target.dataset.id;

        for (let i = 0; i < this.state.newSelected.length; i++) {
            if (this.state.newSelected[i].id === id) {
                this.state.newSelected.splice(i, 1);
                this.setState({useless: true});
                return;
            }
        }
    }

    replaceDevice = () => {
        this.clear();
        this.showSearch();
    }

    render() {
        return (
            <div className="selectDevice">
                <div>
                    {this.state.newSelected.map(device =>
                        <Button data-id={device.id} key={device.mark}
                                className={'deviceBtn'} onClick={this.removeDevice}>
                            {device.mark + '   '}
                        </Button>
                    )}
                </div>
                <div>
                    {this.state.searchBoxVisible ?
                        <DeviceSearch history={window.history}
                                      finish={this.hideSearch}
                                      addDevice={this.addDevice}/> :
                        <Button onClick={thisStore.deviceType === 'multiple' ? this.showSearch : this.replaceDevice}
                                className="plus"
                                disabled={thisStore.deviceType === 'multiple' && thisStore.devices.length === 5}>
                            {thisStore.deviceType === 'multiple' ?
                                <i className="anticon anticon-plus"/> :
                                <Icon type="swap"/>}
                        </Button>}
                </div>
                {thisStore.deviceType === 'multiple' && thisStore.devices.length === 5 &&
                <p className={'selectDevice__notice'}>{appStore.language.you_can_choose_up_to_5_creatures}</p>}
            </div>
        )
    }
}

export default DeviceSelect;