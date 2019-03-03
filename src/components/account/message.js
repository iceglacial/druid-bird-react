/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/17 0017.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, httpConfig, MessageHandle, Filters} from '../../common'
import moment from 'moment'
import thisStore from './store'
import {Table, Button, Pagination, Tooltip, Icon, message, Spin} from 'antd'
import appStore from '../../store/app_store'
import TableRender from './table.render'
import {Link} from 'react-router-dom'
import LoadingImg from '../../common/loadingImg'

const {unitFilter} = Filters
const {MSGContentRender, MSGTypeRender} = TableRender
@observer
class MessageTable extends React.Component {
  constructor() {
    super()
    this.loadPage()
  }

  state = {
    messages: [],
    totalLength: 0,
    selectedRowKeys: [], // Check here to configure the default column
    tableHeight: 300,
    currentPage: 1
  };

  componentWillMount() {
    this.resize();
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  loadPage = (p) => {
    thisStore.set('loading', true)
    let page = p || 1
    let limit = appStore.pageSize;
    let offset = limit * (page - 1);
    this.setState({
      selectedRowKeys: []
    })
    axios.get(Api.message, httpConfig('', limit, offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      thisStore.setMessage(res.data, totalLength);
      this.setState({
        currentPage: page,
        messages: res.data,
        totalLength: totalLength
      })
      this.resize();
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  }
  /**
   * 批量标记已选为已读
   */
  setSelectedRead = () => {
    thisStore.set('loading', true)
    let selectedMsg = this.state.selectedRowKeys
    let data = {id: selectedMsg};
    let _message = this.state.messages;
    if (selectedMsg.length) {
      axios.put(Api.message, data, httpConfig()).then(res => {
        appStore.set('updateUnreadMessage',true)
        _message = _message.map((msg) => {
          if (selectedMsg.indexOf(msg.id) > -1) {
            return Object.assign(msg, {readed_at: moment.utc().toISOString()})
          } else {
            return msg
          }
        })
        thisStore.setMessage(_message)
        this.setState({
          selectedRowKeys: [],
          messages: _message,
        })
        thisStore.set('loading', false)
      }).catch(err => {
        MessageHandle(err)
        thisStore.set('loading', false)
      })
    }else{
      thisStore.set('loading', false)
    }
  }
  //批量删除消息
  deleteSelectedMsg = () => {
    thisStore.set('loading', true)
    let selectedMsg = this.state.selectedRowKeys
    let data = {id: selectedMsg};//[id...]
    let _message = this.state.messages;
    if (selectedMsg.length) {
      axios.put(Api.deleteMessage(), data, httpConfig()).then(res => {
        message.success(appStore.language.delete_message_success)
        appStore.set('updateUnreadMessage',true)
        _message = _message.filter((msg) => selectedMsg.indexOf(msg.id) == -1)
        thisStore.setMessage(_message)
        this.setState({
          selectedRowKeys: [],
          messages: _message,
        })
        this.loadPage(this.state.currentPage)
        thisStore.set('loading', false)
      }).catch(err => {
        MessageHandle(err)
        thisStore.set('loading', false)
      })
    }else{
      thisStore.set('loading', false)
    }
  }
  resize = () => {
    // console.log(this.refs.tableMesasage)
    let tableDiv = this.refs.tableMesasage;
    if (tableDiv) {
      this.setState({tableHeight: tableDiv.offsetHeight - 53 - 60 - 48});
    }
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
  /**
   * 标记消息为已读
   * @param row
   */
  setRead = (row) => {
    thisStore.set('loading', true)
    // console.log('set readed', row.readed_at)
    if (!row.readed_at) {
      let _message = this.state.messages;
      let data = {
        id: [row.id]
      }
      axios.put(Api.message, data, httpConfig()).then(res => {
        appStore.set('updateUnreadMessage',true)
        _message.map(function (msg, index) {
          if (msg.id === row.id) {
            _message[index].readed_at = moment().toISOString()
          }
        });
        // thisStore.setMessage(_message)
        this.setState({
          messages: _message,
        })
        // console.log('成功标记一条消息为已读。')
        thisStore.set('loading', false)
      }).catch(err => {
        MessageHandle(err)
        thisStore.set('loading', false)
      })
    }
  }
  /**
   * 删除单个消息
   * @param row
   */
  deleteMsg = (row) => {
    thisStore.set('loading', true)
    let _message = this.state.messages;
    // console.log(_message.length)
    axios.delete(Api.deleteMessage(row.id), httpConfig()).then(res => {
      appStore.set('updateUnreadMessage',true)
      _message.map(function (msg, index) {
        if (msg.id === row.id) {
          _message.splice(index, 1)
        }
      });
      // thisStore.setMessage(_message)
      this.setState({
        messages: _message,
      })
      message.success(appStore.language.delete_message_success)
      this.loadPage(this.state.currentPage)
      thisStore.set('loading', false)
    }).catch(err => {
      MessageHandle(err)
      thisStore.set('loading', false)
    })
  }
  toggleRow = (row) => {
    let rows = this.state.messages
    rows.map((_row, index) => {
      if (_row.id === row.id) {
        rows[index].show_all_target = !_row.show_all_target
        // console.log(_row)
      }
    })
    this.setState({
      messages: rows
    })
  }

  render() {
    const {selectedRowKeys} = this.state;
    let lang = appStore.language.id
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      selections: [
        {
          key: 'all-data',
          text: appStore.language.select_all,
          onSelect: () => {
            this.setState({
              selectedRowKeys: [...this.state.messages.map(msg => msg.id)], // 0...45
            });
          },
        },
        {
          key: 'unread',
          text: appStore.language.select_unread_message,
          onSelect: (changableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (this.state.messages[index].readed_at) {
                return false;
              }
              return true;
            });
            // console.log([...newSelectedRowKeys])
            this.setState({selectedRowKeys: newSelectedRowKeys});
          },
        },
        {
          key: 'read',
          text: appStore.language.select_read_message,
          onSelect: (changableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (this.state.messages[index].readed_at) {
                return true;
              }
              return false;
            });
            this.setState({selectedRowKeys: newSelectedRowKeys});
          },
        }
      ],
      onSelection: this.onSelection,
    };
    const toggleRow = this.toggleRow
    /**
     * 消息详情操作
     * @param value
     * @param row
     * @returns {XML}
     * @constructor
     */
    const MSGActionRender = (value, row) => {
      return <div key={Math.random() * 1000000} className={`message-act-wrap ${row.readed_at ? 'read' : ''}`}>
        <div className="text-right flex-row">
          <div className="flex-box">
            <span>{unitFilter(row.timestamp, 'timestamp')}</span>
          </div>
          <Tooltip title={row.readed_at ? unitFilter(row.readed_at, 'readed_at') : ''}>
            <div className="flex-box act" onClick={() => this.setRead(row)}>
              <Icon type="msg" className={`${row.readed_at ? 'grey' : 'yellow'}`}/>
            </div>
          </Tooltip>
          <div className="flex-box act danger" onClick={() => this.deleteMsg(row)}>
            <Icon type="delete"/>
          </div>
          {/*<Link to={`${msgLink}`}>【{appStore.language.view_detail}】</Link>*/}
        </div>
      </div>
    }
    const columnsMessage = [
      // antd-table
      {
        title: `${appStore.language.message_type}`,
        dataIndex: 'msg_type',
        key: 'msg_type',
        render: MSGTypeRender,
        width: 90
      },
      {
        title: `${appStore.language.message_content}`,
        dataIndex: 'msg_cn',
        render: MSGContentRender,
        key: 'msg_content'
      },
      {
        title: `${appStore.language.operate}`,
        dataIndex: 'level',
        key: 'msg_action',
        render: MSGActionRender,
        width: 220
      },
      // react-data-grid
      // { key: 'msg_type', name: '消息类型', width: 90 },
      // { key: 'msg_cn', name: '消息内容',  },
      // { key: 'level', name: '操作', minWidth: 200, width: 200 },
    ]
    return (
      <div className="wrap-full message-wrap">
        <Spin spinning={thisStore.loading} indicator={LoadingImg}>
          <div className="wrap-overlay">
            <div className="wrap-head">
              <Button onClick={this.setSelectedRead}>{appStore.language.mark_as_read}</Button>
              <Button type="danger" onClick={this.deleteSelectedMsg}>{appStore.language.delete}</Button>
            </div>
            <div className="wrap-body" ref="tableMesasage">
              <Table rowSelection={rowSelection}
                     rowKey={record => record.id }
                     columns={columnsMessage}
                     dataSource={this.state.messages}//thisStore.message
                     scroll={{y: this.state.tableHeight}}
                     expandRowByClick={true}
                     expandedRowRender={record => {
                       let targets = record.target_str || []
                       let _targetType = record ? ((record.type === 1) && `${appStore.language.username}: `)
                         // || ((record.type === 2) && `${appStore.language.username}: `)
                         || ((record.type === 2) && `${appStore.language.device}: `)//3
                         || ((record.type === 5) && `${appStore.language.biological}: `)
                         || ((record.type === 6) && `${appStore.language.fence_name}: `)
                         : '';
                       return <div>
                         {_targetType}
                         {

                           targets.map(function (value, index) {
                             let _value = value;
                             if (index > 0) {
                               _value = ',   ' + (value === '0' ? '-' : value);
                             }
                             if (record.type === 1) {
                               return <span key={Math.random() * 1000000} className="highlight"><Link
                                 to={`/user-manage/${record.target[index]}`}>{_value}</Link></span>
                             } else if (record.type === 2) {
                               return <span key={Math.random() * 1000000} className="highlight"><Link
                                 to={`/device/${record.target[index]}`}>{_value}</Link></span>
                             }else {
                                 return <span key={Math.random() * 1000000} className="highlight"><Link
                                     to={`/geofence/id/${record.target[index]}`}>{_value}</Link></span>
                             }
                           })
                         }
                         </div>
                     }}
                     pagination={false}
                     bordered
                     footer={ () => (<Pagination current={this.state.currentPage} showQuickJumper
                                                 showTotal={total => appStore.language.total_count(total)}
                                                 onChange={this.onChangePage}
                                                 total={this.state.totalLength}//thisStore.messageTotalLength
                                                 pageSize={appStore.pageSize}
                                                 onShowSizeChange={this.onShowSizeChange}
                                                 pageSizeOptions={[...appStore.pageSizeOptions.map(size => (size + ''))]}
                                                 showSizeChanger
                                                 bordered
                     />)
                     }/>
            </div>
          </div>
        </Spin>
        {/*pagination={false}*/}

        {/*<div>*/}
        {/*<ReactDataGrid*/}
        {/*columns={thisStore.columnsMessage}*/}
        {/*rowGetter={this.rowGetter}*/}
        {/*rowsCount={thisStore.message.length}*/}
        {/*rowHeight={40}*/}
        {/*minHeight={500}*/}
        {/*emptyRowsView={EmptyRowsView}*/}
        {/*/>*/}
        {/*</div>*/}
      </div>
    )
  }
}
export default MessageTable