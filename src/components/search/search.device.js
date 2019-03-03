/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, httpConfig, MessageHandle} from '../../common'
import SearchStore from './store'
import {Input, Menu, Dropdown, Button} from 'antd'
import {Link} from 'react-router-dom'
import Highlighter from 'react-highlight-words'
import appStore from '../../store/app_store'

@observer
class SearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchType: 'mark',
      searchInfo: ''
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
  viewDevice = (device) => {
    // console.log(this.props, device)
    let search = device.id
    let data = {
      id: device.id
    }
    this.props.history.push({
      pathname: `/device/redirect/${device.id}`,
      // search: search,
      state: data
    })
  }


  render() {
    let matchInfo = this.state.searchInfo
    const viewDevice = this.viewDevice
    const SearchOutDevice = (
      <Menu>
        {SearchStore.searchOutDevice.map(function (device) {
          return <Menu.Item key={`searchOutDevice${device.id}`}>
            <Link to={`/device/redirect/${device.id}`}>
              <div >
                {/*onClick={() => viewDevice(device)}*/}
                <Highlighter
                  highlightClassName='red'
                  searchWords={[matchInfo]}
                  autoEscape={true}
                  textToHighlight={device.mark.toString()}
                />
              </div>
            </Link>
          </Menu.Item>
        })}
      </Menu>
    )
    // const SearchPrefix = SearchStore.searchType;
    // const searchType = this.state.searchType
    return (
      <div >
        <Dropdown overlay={SearchOutDevice} trigger={['click']} overlayStyle={{'height': this.state.searchInfo ? '200px' : 0}}>
          {/*prefix={SearchPrefix}*/}
          <Input.Search
            placeholder={appStore.language.search_range_device}
            onChange={this.searchDeviceOnChange.bind(this)}
            value={this.state.searchInfo}
            enterButton={appStore.language.search}
            onSearch={(value) => this.searchDeviceList(value)}/>
          {/*onSearch={(value) => this.searchDeviceOnSearch(value)}*/}
        </Dropdown>
      </div>
    )
  }
}
export default SearchBox