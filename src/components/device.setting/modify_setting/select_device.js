import React from 'react'
import {observer} from 'mobx-react'
import {Button} from 'antd'
import SearchBox from './search_device'
import settingStore from '../store'

@observer
export class SelectDevice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchBoxVisible: false,
      selected: settingStore.selectedDevices,//列表方式选中
      newSelected: [],//搜索方式选中
      useless: true
    }
    this.showSearch = this.showSearch.bind(this);
    this.hideSearch = this.hideSearch.bind(this);
    this.removeDevice = this.removeDevice.bind(this);
  }

  componentDidMount() {
  }

  /*
  * 显示搜索框
  * */
  showSearch() {
    this.setState({searchBoxVisible: true})
  }

  /*
  * 隐藏搜索框
  * */
  hideSearch() {
    this.setState({searchBoxVisible: false})
  }

  /*
  * 添加新设备
  * */
  addDevice = (event) => {
    let id = event.item.props['data-id'];
    for (let i = 0; i < this.state.newSelected.length; i++) {
      if (this.state.newSelected[i].id == id) {
        return
      }
    }
    for (let i = 0; i < this.state.selected.length; i++) {
      if (this.state.selected[i].device_id == id) {
        return
      }
    }
    let mark = event.item.props['data-mark'];
    this.state.newSelected.push({id, mark});
    this.setState({useless: true});
    settingStore.newSelectedDevices=this.state.newSelected;
  }

  /*
  * 移除选中的设备
  * */
  removeDevice(e) {
    let id = e.target.dataset.id;
    if (e.target.dataset.mark) {
      for (let i = 0; i < this.state.selected.length; i++) {
        if (this.state.selected[i].device_id == id) {
          this.state.selected.splice(i, 1);
          this.setState({useless:true});
          settingStore.selectedDevices=this.state.selected;
          return;
        }
      }
    } else {
      for (let i = 0; i < this.state.newSelected.length; i++) {
        if (this.state.newSelected[i].id == id) {
          this.state.newSelected.splice(i, 1);
          this.setState({useless:true});
          settingStore.newSelectedDevices=this.state.newSelected;
          return;
        }
      }
    }
  }

  render() {
    return (
      <div className="selectDevice">
        <div>
          {
            this.state.selected.map(device => <Button key={device.device_id} data-id={device.device_id}
                                                      data-mark={device.mark} className={'deviceBtn'}
                                                      onClick={this.removeDevice}>{device.mark+'   '}
                                                      <span className={'anticon anticon-close closeBtn'}/></Button>)
          }
          {
            this.state.searchBoxVisible ?
              <SearchBox history={window.history}
                         finish={this.hideSearch}
                         addDevice={this.addDevice}/>
              : <Button onClick={this.showSearch} className="plus">
                <i className="anticon anticon-plus"/>
              </Button>
          }
        </div>
        <div>
          {
            this.state.newSelected.map(device => <Button data-id={device.id}
                                                         className={'deviceBtn'}
                                                         onClick={this.removeDevice}>{device.mark+'   '}
              <span className={'anticon anticon-close closeBtn'}/></Button>)
          }
        </div>
      </div>
    )
  }
}

