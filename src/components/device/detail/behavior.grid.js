/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import EmptyRowsView from '../empty_rows_show'
import axios from 'axios'
import {Api, DataFormatter, httpConfig, Formatter, MessageHandle, DataGridColumns} from '../../../common'
import thisStore from './store'
import {observer} from 'mobx-react'
import ReactDataGrid from 'react-data-grid'
import appStore from '../../../store/app_store'
import {Pagination} from './detail_pagination'
import mobx from "mobx/lib/mobx";
import LoadingImg from '../../../common/loadingImg'
import {Spin} from 'antd'

const {defaultFields, disabledFields, dataGridColumns} = DataGridColumns
const {BhvDataFormatter} = DataFormatter

// const {ActivityIntensity, ActivityPercent} = Formatter
@observer
class AppDevice extends React.Component {
    constructor(props) {
        super(props)
        this.isEnd = this.isEnd.bind(this)
    }

    componentDidMount() {
        this.loadPage()
        this.getCount()
    }

    // loadData = () => {
    //   thisStore.setReload(false);
    //   let config = httpConfig('-updated_at')
    //   let rangeDate = thisStore.rangeDate
    //   if (rangeDate.begin && rangeDate.end) {
    //     config.params = rangeDate
    //   }
    //   axios.get(Api.behavior(this.props.deviceId), httpConfig('-updated_at')).then(res => {
    //     thisStore.setBehaviorData(BhvDataFormatter(res.data));
    //   }).catch(err => {
    //     MessageHandle(err)
    //   })
    // }

    rowGetter(i) {
        return thisStore.behaviorData[i];
    }

    state = {
        currentPage: 1,
        totalLength: 0,
        firstTime: '',
        lastTime: '',
        currentPageLength: 0,
    }
    onChangePage = (page, direction) => {
        thisStore.set('direction', direction)
        this.loadPage(page, direction)
    }
    onShowSizeChange = (current, pagesize, direction) => {
        appStore.setPageSize(pagesize)
        // this.loadPage(null, direction)
    }
    getCount = () => {
        axios.get(Api.behavior2Count(this.props.deviceId), httpConfig()).then(res => {
            this.setState({
                totalLength: res.data,
            })
        }).catch(e => {
            console.log(e);
        })
    }
    loadPage = (p, direction, firstPage) => {
        thisStore.set('loading', true)
        if (p) {
            this.child.btnDisabled(true);
        }
        if (firstPage && this.child) {
            this.child.setFirstPage();
        }
        thisStore.setReload(false);
        let page = p || 1
        let limit = appStore.pageSize;
        let offset = limit * (page - 1);
        let rangeDate = thisStore.rangeDate
        let config = httpConfig('-timestamp', limit, offset)
        if (rangeDate.begin && rangeDate.end) {
            config.params = rangeDate
        }
        /*
        //旧分页方式暂时封存
        axios.get(Api.behavior(this.props.deviceId), config).then(res => {
          // #2466 错误时间的数据过滤
          for (let i = 0; i < res.data.length; i++) {
            if (!(appStore.isDateBetween(res.data[i].timestamp, new Date(2015,0,0), new Date()) &&
              appStore.isDateBetween(res.data[i].updated_at, new Date(2015,0,0), new Date()))) {
              res.data.splice(i, 1);
              i--;
            }
          }
          let totalLength = res.headers['x-result-count']
          this.setState({
            currentPage: page,
            totalLength: totalLength
          })
          thisStore.setBehaviorData(BhvDataFormatter(res.data));
        }).catch(err => {
          MessageHandle(err)
        })
        */
        //新分页
        let criticalTime = ''
        let sort = thisStore.datePickDirection ? '-timestamp' : 'timestamp'//默认：逆序/顺序
        let needRevers = false;
        let begin = '', end = '';
        if (direction) {
            criticalTime = direction === 'left' ? this.state.firstTime : this.state.lastTime;
            if (thisStore.datePickDirection) {
                sort = direction === 'left' ? 'timestamp' : '-timestamp';
            } else {
                sort = direction === 'right' ? 'timestamp' : '-timestamp';
            }
            needRevers = direction === 'left';//往前翻页皆需倒序
        } else {
            //不翻页才发送begin与end
            begin = thisStore.datePickDirection ? '' : rangeDate.begin;
            end = thisStore.datePickDirection ? rangeDate.end : '';
        }
        //按时间筛选
        let config2 = httpConfig(sort, limit)
        axios.get(Api.behavior2(this.props.deviceId, criticalTime, begin, end), config2).then(res => {
            if (needRevers) {
                res.data.reverse();
            }
            // #2466 错误时间的数据过滤
            for (let i = 0; i < res.data.length; i++) {
                if (!(appStore.isDateBetween(res.data[i].timestamp, new Date(2015, 0, 0), new Date()) &&
                    appStore.isDateBetween(res.data[i].updated_at, new Date(2015, 0, 0), new Date()))) {
                    res.data.splice(i, 1);
                    i--;
                }
            }
            this.setState({
                currentPage: page,
                currentPageLength: res.data.length,
                firstTime: res.data[0] && res.data[0].timestamp,
                lastTime: res.data[res.data.length - 1] && res.data[res.data.length - 1].timestamp,
            })
            thisStore.setBehaviorData(BhvDataFormatter(res.data));
            this.child.btnDisabled(false);
            thisStore.set('loading', false)
        }).catch(err => {
            MessageHandle(err)
            thisStore.set('loading', false)
        })
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

    isEnd() {
        return appStore.pageSize > this.state.currentPageLength;
    }

    onRef = (ref) => {
        this.child = ref;
    }

    render() {
        if (thisStore.reload && thisStore.gridType === this.props.type) {
            this.loadPage(null, null, true)
        }
        if (appStore.reloadGrid) {
            setTimeout(this.resizeGrid, 200)
        }
        const gridColumns = this.getColumns()
        return (
            <Spin spinning={thisStore.loading} indicator={LoadingImg}>
                <div className="wrap-full flex-box">
                    <div className="wrap-full">
                        {
                            thisStore.loading ?
                                '' :
                                <ReactDataGrid
                                    rowKey="id"
                                    ref="grid"
                                    columns={gridColumns}
                                    rowGetter={this.rowGetter}
                                    rowsCount={thisStore.behaviorData.length}
                                    minHeight={1000}
                                    rowHeight={45}
                                    emptyRowsView={EmptyRowsView}
                                />
                        }
                    </div>

                    <div className="pd-top text-right">
                        <Pagination current={this.state.currentPage} showQuickJumper
                                    showTotal={total => appStore.language.total_count(total)}
                                    onChange={this.onChangePage}
                                    total={this.state.totalLength}//accountStore.messageTotalLength
                                    pageSize={appStore.pageSize}
                                    onRef={this.onRef}
                                    isEnd={this.isEnd}//新分页判断是否到达尽头
                                    onShowSizeChange={this.onShowSizeChange}
                                    pageSizeOptions={[...appStore.pageSizeOptions.map(size => (size + ''))]}
                                    showSizeChanger
                                    bordered
                        />
                    </div>

                </div>
            </Spin>
        )
    }
}

export default AppDevice