/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, httpConfig, DataFormatter, MessageHandle} from '../../common'
import ReactDataGrid from 'react-data-grid'
import EmptyRowsView from './empty_rows_show'
// import dataStore from './store'
import appStore from '../../store/app_store'
import {Pagination, Spin,Button} from 'antd'
import MarkFormatter from './mark_formatter'
import SampleIntervalFormatter from './sampling_nterval_formatter'
import {Link} from 'react-router-dom'
import deviceStore from './store'
import settingStore from '../device.setting/store'
import LoadingImg from '../../common/loadingImg'

const {Toolbar, Data: {Selectors}} = require('react-data-grid-addons')
const {SettingDataFormatter} = DataFormatter
@observer
class GpsGrid extends React.Component {
  constructor() {
    super()
    this.loadPage()
    this.onRowSelect=this.onRowSelect.bind(this)
    settingStore.selectedDevices=[];
    settingStore.newSelectedDevices=[];
  }
  state = {
    loading: true,
    currentPage: 1,
    totalLength: 0,
    // sort
    rows: [],
    filters: {},
    sortColumn: null,
    sortDirection: null
  }
  rowGetter=(rowIdx)=> {
    const rows = this.getRows();
    return rows[rowIdx];
    // return dataStore.gridDeviceSetting[i];
  }
  getRows = () => {
    return Selectors.getRows(this.state);
  };
  getSize = () => {
    return this.getRows().length;
  };
  handleGridSort = (sortColumn, sortDirection) => {
    this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
  };

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
    this.setState({
      loading: true
    })
    let page = p || 1
    let limit = appStore.pageSize;
    let offset = limit * (page - 1);
    axios.get(Api.setting(), httpConfig('-updated_at', limit, offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      this.setState({
        rows: SettingDataFormatter(res.data),
        currentPage: page,
        totalLength: totalLength,
        loading: false
      })
      // dataStore.setGridDeviceSetting(SettingDataFormatter(res.data));
    }).catch(err => {
      MessageHandle(err)
      this.setState({
        loading: false
      })
    })
  }
  resizeGrid = () => {
    // console.log('reload grid')
    this.refs.grid && this.refs.grid.updateMetrics();
    // appStore.setReloadGrid(false)
  }

  /*
  * 勾选中的设备
  * */
  onRowSelect(rows) {
    deviceStore.selectedDevices=rows;
  }

  render() {
    if (appStore.reloadGrid) {
      setTimeout(this.resizeGrid, 200)
    }
    const columnsDeviceSetting = [
      {key: 'mark', name: `${appStore.language.getKeyName('mark')}`, formatter: MarkFormatter, locked: true, sortable: true, width: 80},
      {key: 'uuid', name: `${appStore.language.getKeyName('uuid')}`, locked: true, width: 210},
      {key: 'updated_at', name: `${appStore.language.getKeyName('updated_at', 'device_set')}`,sortable: true, width: 180},
      {key: 'downloaded_at', name: `${appStore.language.getKeyName('downloaded_at')}`,sortable: true, width: 180},
      {key: 'behavior_sampling_mode', name: `${appStore.language.getKeyName('behavior_sampling_mode')}`, width: 150},
      {key: 'behavior_sampling_freq', name: `${appStore.language.getKeyName('behavior_sampling_freq')}`,formatter: SampleIntervalFormatter, sortable: true, width: 180},
      {key: 'behavior_voltage_threshold', name: `${appStore.language.getKeyName('behavior_voltage_threshold')}`,sortable: true, width: 180},
      {key: 'env_sampling_mode', name: `${appStore.language.getKeyName('env_sampling_mode')}`, width: 180},
      {key: 'env_sampling_freq', name: `${appStore.language.getKeyName('env_sampling_freq')}`,formatter: SampleIntervalFormatter,sortable: true, width: 180},
      {key: 'env_voltage_threshold', name: `${appStore.language.getKeyName('env_voltage_threshold')}`,sortable: true, width: 180},
      {key: 'gprs_mode', name: `${appStore.language.getKeyName('gprs_mode')}`, width: 150},
      {key: 'gprs_freq', name: `${appStore.language.getKeyName('gprs_freq')}`,formatter: SampleIntervalFormatter,sortable: true, width: 150},
      {key: 'gprs_voltage_threshold', name: `${appStore.language.getKeyName('gprs_voltage_threshold')}`,sortable: true, width: 200},
      {key: 'gprs_version', name: `${appStore.language.getKeyName('gprs_version')}`,sortable: true, width: 190},
      {key: 'ota_voltage_threshold', name: `${appStore.language.getKeyName('ota_voltage_threshold')}`,sortable: true, width: 180},
      // {key: 'sp_number', name: `${appStore.language.getKeyName('sp_number')}`,sortable: true, width: 150},
    ]
    return (
      <div className="wrap wrap-full">
        <Spin spinning={this.state.loading} indicator={LoadingImg}>
          <div className="wrap-full flex-box">
            <Link to="modify_setting" className={'modifySettingBtn'}>
              <Button className="" type="primary">{appStore.language.modify_setting}</Button>
            </Link>
            <div className="wrap-full">
                {this.rowGetter(0)?
                    <ReactDataGrid
                        ref="grid"
                        enableRowSelect={true}
                        onGridSort={this.handleGridSort}
                        columns={columnsDeviceSetting}
                        rowGetter={this.rowGetter}
                        rowsCount={this.getSize()}
                        minHeight={1000}
                        rowHeight={45}
                        emptyRowsView={EmptyRowsView}
                        onRowSelect={this.onRowSelect}
                    />
                    :""}

            </div>
            <div className="wrap text-right">
              <Pagination current={this.state.currentPage} showQuickJumper
                          showTotal={total => appStore.language.total_count(total)}
                          onChange={this.onChangePage}
                          total={this.state.totalLength || 0}//accountStore.messageTotalLength
                          pageSize={appStore.pageSize}
                          onShowSizeChange={this.onShowSizeChange}
                          pageSizeOptions={[...appStore.pageSizeOptions.map(size => (size + ''))]}
                          showSizeChanger
                          bordered
              />
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}
export default GpsGrid