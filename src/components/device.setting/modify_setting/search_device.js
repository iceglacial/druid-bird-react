/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, httpConfig, MessageHandle} from '../../../common'
import SearchStore from '../../search/store'
import {Input, Menu, Dropdown, Button} from 'antd'
import Highlighter from 'react-highlight-words'
import appStore from '../../../store/app_store'
import settingStore from '../store'

@observer
class SearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchType: 'mark',
      searchInfo: '',

    }
    // console.log(props)
  }

  onBlur = () => {
    const {value, onBlur, onChange} = this.props;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange({value: value.slice(0, -1)});
    }
    if (onBlur) {
      onBlur();
    }
  }

  //模糊匹配
  searchDeviceOnChange = (e) => {
    // console.log(e.target.value);
    const {value} = e.target;
    const reg = /^[0-9]\d*$/;
    if ((!isNaN(value) && reg.test(value)) || value === '') {
      this.setState({
        searchInfo: value
      })
      if (value) {
        axios.get(Api.searchDeviceByMark(value), httpConfig()).then(res => {
          //此处筛掉mark号小于1000的设备，因为后台不想写新接口
          for(let i=0;i<res.data.length;i++){
            if(res.data[i].mark<1000){
              res.data.splice(i,1);
              i--
            }
          }
          SearchStore.setSearchOutDevice(res.data);
        }).catch(err => {
          if (err.response && err.response.status != '404') {
            MessageHandle(err)
          }
        })
      } else {
        SearchStore.setSearchOutDevice([]);
      }
    } else {
      SearchStore.setSearchOutDevice([]);
    }
  }

  searchDeviceList = (value) => {
    console.log(value)
    if (value) {
      let search = '?mark=' + value
      this.props.history.push({
        pathname: `/search_out/device/redirect`,
        search: search,
        state: value
      })
    }
  }


  render() {
    let matchInfo = this.state.searchInfo
    const addDevice = this.props.addDevice
    const SearchOutDevice = (
      <Menu onClick={addDevice}>
        {SearchStore.searchOutDevice.map(function (device) {
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
    // const SearchPrefix = SearchStore.searchType;
    // const searchType = this.state.searchType
    return (
      <div >
        <Dropdown overlay={SearchOutDevice} overlayStyle={{'height': this.state.searchInfo ? '200px' : 0}}>
          {/*prefix={SearchPrefix}*/}
          <Input.Search
            onChange={this.searchDeviceOnChange.bind(this)}
            value={this.state.searchInfo}
            // enterButton={appStore.language.search}
            onSearch={(value) => this.searchDeviceList(value)}
            placeholder={appStore.language.search_device_add}
            className="searchBox"
          />
        </Dropdown>
        <Button onClick={this.props.finish}>{appStore.language.done}</Button>
      </div>
    )
  }
}
export default SearchBox