/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, DataFormatter, MessageHandle, Filters, httpConfig} from '../../common'
import ReactDataGrid from 'react-data-grid'
import EmptyRowsView from './empty_rows_show'
import dataStore from './store'
import appStore from '../../store/app_store'
import {Spin} from 'antd'
import markFormatter from './mark_formatter'
import LoadingImg from '../../common/loadingImg'

const {Data: {Selectors}} = require('react-data-grid-addons')//Toolbar,
const {GpsDataFormatter} = DataFormatter
const {searchUrlToArray, unitFilter} = Filters
@observer
class SearchOutGpsGrid extends React.Component {
  constructor(props) {
    super(props)
    // this.getSearchOutGps();
    let searchData = props.location.search
    let data = searchUrlToArray(searchData)
    this.state = {
      searchData: data,
      loading: true,
    }

    // console.log('search data:',props,JSON.stringify(data),searchUrlToArray(searchData))
    this.getSearchGps(data)
  }

  getSearchGps = (data) => {
    if (data !== {}) {
      this.setState({
        loading: true
      })
      axios.post(Api.searchGps(), data, httpConfig()).then(res => {
        dataStore.setSearchOutGps({
          rows: GpsDataFormatter(res.data),
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
    return Selectors.getRows(dataStore.searchOutGps);
  };
  getSize = () => {
    return this.getRows().length;
  };
  handleGridSort = (sortColumn, sortDirection) => {
    let data = Object.assign({}, dataStore.searchOutGps, {sortColumn: sortColumn, sortDirection: sortDirection})
    dataStore.setSearchOutGps(data);
  };

  rowGetter(i) {
    return dataStore.searchOutGps.rows[i];
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
    const columnsGps = [
      {
        key: 'mark',
        name: `${appStore.language.getKeyName('mark')}`,
        formatter: markFormatter,
        sortable: true,
        locked: true,
        width: 80
      },
      {key: 'uuid', name: `${appStore.language.getKeyName('uuid')}`, sortable: true, locked: true, width: 210},
      {key: 'updated_at', name: `${appStore.language.getKeyName('updated_at', 'gps')}`, sortable: true, width: 180},
      {key: 'timestamp', name: `${appStore.language.getKeyName('timestamp', 'gps')}`, sortable: true, width: 180},
      {key: 'longitude', name: `${appStore.language.getKeyName('longitude')}`, sortable: true, width: 110},
      {key: 'latitude', name: `${appStore.language.getKeyName('latitude')}`, sortable: true, width: 110},
      {key: 'altitude', name: `${appStore.language.getKeyName('altitude')}`, sortable: true, width: 80},
      {key: 'dimension', name: `${appStore.language.getKeyName('dimension')}`, sortable: true, width: 140},
      {key: 'horizontal', name: `${appStore.language.getKeyName('horizontal')}`, sortable: true, width: 120},
      {key: 'vertical', name: `${appStore.language.getKeyName('vertical')}`, sortable: true, width: 120},
      {key: 'course', name: `${appStore.language.getKeyName('course')}`, sortable: true, width: 80},
      {key: 'speed', name: `${appStore.language.getKeyName('speed')}`, sortable: true, width: 80},
      {key: 'used_star', name: `${appStore.language.getKeyName('used_star')}`, sortable: true, width: 80},
      {key: 'temperature', name: `${appStore.language.getKeyName('temperature')}`, sortable: true, width: 100},
      {key: 'humidity', name: `${appStore.language.getKeyName('humidity')}`, sortable: true, width: 140},
      {key: 'light', name: `${appStore.language.getKeyName('light')}`, sortable: true, width: 120},
      {key: 'pressure', name: `${appStore.language.getKeyName('pressure')}`, sortable: true, width: 100},
      {key: 'signal_strength', name: `${appStore.language.getKeyName('signal_strength')}`, sortable: true, width: 160},
      {key: 'battery_voltage', name: `${appStore.language.getKeyName('battery_voltage')}`, sortable: true, width: 120},
      {
        key: 'firmware_version',
        name: `${appStore.language.getKeyName('firmware_version')}`,
        sortable: true,
        width: 100
      },
    ]
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
                {appStore.language.search_gps_result_count(this.getSize())}
              </div>
            </header>
            <div className="wrap-full">
              <ReactDataGrid
                ref="grid"
                onGridSort={this.handleGridSort}
                columns={columnsGps}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize()}
                minHeight={1000}
                emptyRowsView={EmptyRowsView}
              />
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}
export default SearchOutGpsGrid