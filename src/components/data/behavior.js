/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, DataFormatter, httpConfig,Formatter,MessageHandle} from '../../common'
import dataStore from './store'
import ReactDataGrid from 'react-data-grid'
import EmptyRowsView from './empty_rows_show'
import appStore from '../../store/app_store'
import {Pagination} from 'antd'

const {ActivityIntensity,ActivityPercent} = Formatter
const {BhvDataFormatter} = DataFormatter
@observer
class BehaviorGrid extends React.Component {
  constructor() {
    super()
    this.loadPage()
  }

  rowGetter(i) {
    return dataStore.gridBehavior[i];
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
    axios.get(Api.behavior(), httpConfig('-updated_at,-timestamp', limit, offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      this.setState({
        currentPage: p,
        totalLength: totalLength
      })
      dataStore.setGridBehavior(BhvDataFormatter(res.data));
    }).catch(err => {
      MessageHandle(err)
    })
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
    const columnsBehavior = [
      { key: 'mark', name: `${appStore.language.getKeyName('mark')}`, locked: true, width: 80 },
      { key: 'uuid', name: `${appStore.language.getKeyName('uuid')}`, locked: true, width: 210 },
      { key: 'updated_at', name: `${appStore.language.getKeyName('updated_at','behavior')}`},
      { key: 'timestamp', name: `${appStore.language.getKeyName('timestamp','behavior')}` },
      { key: 'activity_expend', name: `${appStore.language.getKeyName('activity_expend')}`, formatter: ActivityPercent, getRowMetaData: (row) => row },
      { key: 'activity_intensity', name: `${appStore.language.getKeyName('activity_intensity')}`, formatter: ActivityIntensity, getRowMetaData: (row) => row},
      { key: 'firmware_version', name: `${appStore.language.getKeyName('firmware_version')}` },
    ]
    return (
      <div className="wrap wrap-full flex-box">
        <div className="wrap-full">
          <ReactDataGrid
            ref="grid"
            columns={columnsBehavior}
            rowGetter={this.rowGetter}
            rowsCount={dataStore.gridBehavior.length}
            minHeight={1000}
            rowHeight={45}
            minColumnWidth={200}
            emptyRowsView={EmptyRowsView}/>
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
export default BehaviorGrid