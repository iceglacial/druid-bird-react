/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, DataFormatter, MessageHandle, Filters, httpConfig, Formatter} from '../../common'
import thisStore from './store'
import appStore from '../../store/app_store'
import {Spin} from 'antd'
import DeviceListGrid from './device_list'
import DeviceLocationStore from './../map/device.location/store'
import LoadingImg from '../../common/loadingImg'

const {Data: {Selectors}} = require('react-data-grid-addons')//Toolbar,
const {DeviceDataFormatter} = DataFormatter
const {unitFilter} = Filters
@observer
class SearchOutGpsGrid extends React.Component {
  constructor(props) {
    super(props)
    let searchData = props.location.search
    // let data = searchUrlToArray(searchData)
    let _search = searchData.split('=')[1]
    this.state = {
      searchData: {
        mark: _search
      },
      loading: true,
    }

    // console.log('search data:',props,JSON.stringify(data),searchUrlToArray(searchData))
    this.getSearchGps(searchData)
  }

  getSearchGps = (search) => {
    let data = search.split('=')[1]
    if (data !== '') {
      this.setState({
        loading: true
      })
      axios.get(Api.searchDeviceByMark(data), httpConfig()).then(res => {
        thisStore.set('searchOutDeviceList', {
          rows: DeviceDataFormatter(res.data),
          sortColumn: null,
          sortDirection: null
        });
        this.setState({
          loading: false
        })
      }).catch(err => {
        MessageHandle(err)
        this.setState({
          loading: false
        })
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }
  rowGetter = (rowIdx) => {
    const rows = this.getRows();
    return rows[rowIdx];
    // return DeviceStore.deviceAll[i];
  }
  getRows = () => {
    return Selectors.getRows(thisStore.searchOutDeviceList);
  };
  getSize = () => {
    return this.getRows().length;
  };
  handleGridSort = (sortColumn, sortDirection) => {
    let data = Object.assign({}, thisStore.searchOutDeviceList, {sortColumn: sortColumn, sortDirection: sortDirection})
    thisStore.set('searchOutDeviceList', data);
  };

  rowGetter(i) {
    return thisStore.searchOutDeviceList.rows[i];
  }

  resizeGrid = () => {
    // console.log('reload grid')
    this.refs.grid && this.refs.grid.updateMetrics();
    // appStore.setReloadGrid(false)
  }

  render() {
    if (appStore.reloadGrid) {
      setTimeout(this.resizeGrid, 200)
    }
    let searchData = this.state.searchData || {}
    return (
      <div className="wrap wrap-full">
        <Spin spinning={this.state.loading} indicator={LoadingImg}>
          <div className="flex-box wrap-full">
            <header className="wrap">
              <div className="small">{appStore.language.searchFilters}
                {
                  Object.keys(searchData).map((key, index) => {
                    let value = searchData[key]
                    let isObject = typeof(value) === 'object'
                    return <span key={Math.random() * 1000000}>{index !== 0 ? '; ' : ' '}<span
                      className="primary">{appStore.language.getKeyName(key)}</span>: {isObject ? unitFilter(value[0], key) + ' - ' + unitFilter(value[1], key) : unitFilter(value, key)}</span>
                  })
                }
              </div>
              <div>
                {appStore.language.search_result_count(this.getSize())}
              </div>
            </header>
            <div className="wrap-full">
              <DeviceListGrid search={this.state.searchData}/>
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}
export default SearchOutGpsGrid