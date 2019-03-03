/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, DataFormatter, httpConfig, MessageHandle} from '../../common'
import ReactDataGrid from 'react-data-grid'
import EmptyRowsView from './empty_rows_show'
import dataStore from './store'
import appStore from '../../store/app_store'
import {Pagination} from 'antd'
import markFormatter from './mark_formatter'


const {GpsDataFormatter} = DataFormatter
@observer
class GpsGrid extends React.Component {
  constructor() {
    super()
    this.loadPage()
  }

  state = {
    currentPage: 1,
    totalLength: 0,
  }
  onChangePage = (page) => {
    // console.log(page)
    this.loadPage(page)
  }
  onShowSizeChange = (current, pagesize) => {
    // console.log(current,pagesize)
    appStore.setPageSize(pagesize)
    this.loadPage()
  }
  loadPage = (p) => {
    let page = p || 1
    let limit = appStore.pageSize;
    let offset = limit * (page - 1);
    axios.get(Api.gps(), httpConfig('-updated_at,-timestamp', limit, offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      this.setState({
        currentPage: page,
        totalLength: totalLength
      })
      dataStore.setGridGps(GpsDataFormatter(res.data));
    }).catch(err => {
      MessageHandle(err)
    })
  }

  rowGetter(i) {
    return dataStore.gridGps[i];
  }
  resizeGrid=()=>{
    // console.log('reload grid')
    this.refs.grid && this.refs.grid.updateMetrics();
    // appStore.setReloadGrid(false)
  }
  render() {
    if(appStore.reloadGrid){
      setTimeout(this.resizeGrid,200)
    }
    const columnsGps = [
      {key: 'mark', name: `${appStore.language.getKeyName('mark')}`,formatter: markFormatter, locked: true, width: 80},
      {key: 'uuid', name: `${appStore.language.getKeyName('uuid')}`, locked: true, width: 210},
      {key: 'updated_at', name: `${appStore.language.getKeyName('updated_at', 'gps')}`, width: 180},
      {key: 'timestamp', name: `${appStore.language.getKeyName('timestamp', 'gps')}`, width: 180},
      {key: 'longitude', name: `${appStore.language.getKeyName('longitude')}`, width: 100},
      {key: 'latitude', name: `${appStore.language.getKeyName('latitude')}`, width: 100},
      {key: 'altitude', name: `${appStore.language.getKeyName('altitude')}`, width: 80},
      {key: 'dimension', name: `${appStore.language.getKeyName('dimension')}`, width: 140},
      {key: 'horizontal', name: `${appStore.language.getKeyName('horizontal')}`, width: 120},
      {key: 'vertical', name: `${appStore.language.getKeyName('vertical')}`, width: 120},
      {key: 'course', name: `${appStore.language.getKeyName('course')}`, width: 80},
      {key: 'speed', name: `${appStore.language.getKeyName('speed')}`, width: 80},
      {key: 'used_star', name: `${appStore.language.getKeyName('used_star')}`, width: 80},
      {key: 'temperature', name: `${appStore.language.getKeyName('temperature')}`, width: 100},
      {key: 'humidity', name: `${appStore.language.getKeyName('humidity')}`, width: 140},
      {key: 'light', name: `${appStore.language.getKeyName('light')}`, width: 120},
      {key: 'pressure', name: `${appStore.language.getKeyName('pressure')}`, width: 100},
      {key: 'signal_strength', name: `${appStore.language.getKeyName('signal_strength')}`, width: 160},
      {key: 'battery_voltage', name: `${appStore.language.getKeyName('battery_voltage')}`, width: 120},
      {key: 'firmware_version', name: `${appStore.language.getKeyName('firmware_version')}`, width: 100},
    ]
    return (
      <div className="wrap wrap-full flex-box">
        <div className="wrap-full">
          <ReactDataGrid
            ref="grid"
            columns={columnsGps}
            rowGetter={this.rowGetter}
            rowsCount={dataStore.gridGps.length}
            minHeight={1000}
            rowHeight={45}
            emptyRowsView={EmptyRowsView}
          />
        </div>
        <div className="wrap text-right">
          <Pagination current={this.state.currentPage} showQuickJumper
                      showTotal={total => appStore.language.total_count(total)}
                      onChange={this.onChangePage}
                      total={this.state.totalLength}//accountStore.messageTotalLength
                      pageSize={appStore.pageSize}
                      onShowSizeChange={this.onShowSizeChange}
                      pageSizeOptions={[...appStore.pageSizeOptions.map(size => (size + ''))]}
                      showSizeChanger
                      bordered
          />
        </div>
      </div>
    )
  }
}
export default GpsGrid