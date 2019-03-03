import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, httpConfig, MessageHandle} from '../../common'
import {Input, Menu, Dropdown} from 'antd'
import Highlighter from 'react-highlight-words'
import appStore from '../../store/app_store'

@observer
class DeviceSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchType: 'mark',
            searchInfo: '',
            searchOutDevice: [],
        }
    }

    //模糊匹配
    searchDeviceOnChange = (e) => {
        const {value} = e.target;
        const reg = /^[0-9]\d*$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
                searchInfo: value
            })
            if (value) {
                axios.get(Api.searchDeviceByMark(value), httpConfig()).then(res => {
                    this.setState({searchOutDevice: res.data});
                }).catch(err => {
                    if (err.response && err.response.status !== 404) {
                        MessageHandle(err)
                    }
                })
            } else {
                this.setState({searchOutDevice: []});
            }
        } else {
            this.setState({searchOutDevice: []});
        }
    }


    render() {
        let matchInfo = this.state.searchInfo
        const addDevice = this.props.addDevice
        const SearchOutDevice = (
            <Menu onClick={addDevice}>
                {this.state.searchOutDevice.map(function (device) {
                    return <Menu.Item key={device.id} data-id={device.id} data-mark={device.mark}>
                        <div>
                            <Highlighter
                                highlightClassName='red'
                                searchWords={[matchInfo]}
                                autoEscape={true}
                                textToHighlight={device.mark.toString()}
                            />
                        </div>
                    </Menu.Item>
                })}
            </Menu>
        )

        return (
            <div>
                <Dropdown className={'xxx'} overlay={SearchOutDevice}
                          overlayStyle={{'height': this.state.searchInfo ? '200px' : 0, 'width': '155px'}}
                          trigger={['click']}>
                    {/*prefix={SearchPrefix}*/}
                    <Input.Search
                        onChange={this.searchDeviceOnChange.bind(this)}
                        value={this.state.searchInfo}
                        placeholder={appStore.language.enter_device_mark}
                        className="searchBox"
                    />
                </Dropdown>
            </div>
        )
    }
}

export default DeviceSearch