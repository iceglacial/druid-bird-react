/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, DataFormatter, httpConfig, MessageHandle, DataGridColumns} from '../../common'
import ReactDataGrid from 'react-data-grid'
import EmptyRowsView from './empty_rows_show'
import thisStore from './store'
import appStore from '../../store/app_store'
import {Pagination} from 'antd'
import mobx from "mobx/lib/mobx";

const {defaultFields, disabledFields, dataGridColumns} = DataGridColumns
const {dataFormat} = DataFormatter

@observer
class Grid extends React.Component {
  constructor(props) {
    super(props)
    console.log(props.type)
    this.state = {
      currentPage: 1,
      totalLength: 0,
    }
    this.loadPage()
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
    let page = p || 1;
    let limit = appStore.pageSize;
    let offset = limit * (page - 1);
    let sort = this.props.sort
    let url;
    let type = this.props.type
    if (type === 'device') {
      url = Api.device()
    } else if (type === 'env') {
      url = Api.gps(this.props.deviceId)
    }
    else if (type === 'bhv') {
      url = Api.behavior(this.props.deviceId)
    }
    else if (type === 'sms') {
      url = Api.sms(this.props.deviceId)
    }
    let _this = this;
    axios.get(url, httpConfig(sort, limit, offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      _this.setState({
        currentPage: page,
        totalLength: totalLength
      })
      thisStore.setGridData(dataFormat(type, res.data));
      // thisStore.setGridDataByType(type,dataFormat(type, res.data));
    }).catch(err => {
      MessageHandle(err)
    })
  }

  rowGetter=(i)=> {
    // let type = this.props.type
    // if(type === 'device'){
    //   return thisStore.devicesData[i];
    // }else if(type === 'env'){
    //   return thisStore.GPSData[i];
    // }else if(type === 'bhv'){
    //   return thisStore.BHVData[i];
    // }else if(type === 'sms'){
    //   return thisStore.SMSData[i];
    // }
    return thisStore.gridData[i];
  }

  resizeGrid = () => {
    // console.log('reload grid')
    this.refs.grid && this.refs.grid.updateMetrics();
    // appStore.setReloadGrid(false)
  }
  getColumns = (_type, items) => {
    let type = this.props.type;
    let columns = [];
    let colItems = mobx.toJS(appStore.userFields[type])
    if (colItems && colItems.length) {
      colItems = disabledFields[type].concat(colItems)
    } else {
      colItems = defaultFields[type]
    }
    colItems.map(item => {
      let column = dataGridColumns[type][item]
      column && columns.push(column)
    })
    if (type === 'device') {
      columns.push(dataGridColumns.device.setting)
    }
    return columns
  }

  render() {
    if (appStore.reloadGrid) {
      setTimeout(this.resizeGrid, 200)
    }
    const gridColumns = this.getColumns()
    return (
      <div className="wrap wrap-full flex-box">
        <div className="wrap-full">
          <ReactDataGrid
            ref="grid"
            columns={gridColumns}
            rowGetter={this.rowGetter}
            rowsCount={thisStore.gridData.length}
            minHeight={1000}
            rowHeight={45}
            emptyRowsView={EmptyRowsView}
            rowSelection={{
              showCheckbox: false,
              selectBy: {
                isSelectedKey: 'isSelected'
              }
            }}
            onRowClick={this.onRowClick}
            onGridKeyDown={this.onKeyDown}
            onGridRowsUpdated={this.handleGridRowsUpdated}
            getCellActions={this.getCellActions}
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

export default Grid