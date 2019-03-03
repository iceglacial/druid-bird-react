/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import EmptyRowsView from './empty_rows_show'
import axios from 'axios'
import {Api, MessageHandle, DataFormatter, httpConfig, Formatter, DataGridColumns} from '../../common'
import {Modal, Pagination, Spin, message} from 'antd'
import appStore from './../../store/app_store'
import DeviceBioForm from './device.biological.form'
import DeviceSettingForm from './device.setting.form'
import DescriptionForm from './description.form'
import thisStore from './store'
import {observer} from 'mobx-react'
import ReactDataGrid from 'react-data-grid'
import DeviceListHead from './device_list.head'
import DeviceActionFormatter from './device_action_formatter'
import mobx from 'mobx'

import MyGrid from '../grid/mygrid'
import AppStore from '../../store/app_store'
import LoadingImg from '../../common/loadingImg'


const {Data: {Selectors}} = require('react-data-grid-addons')
const {DeviceDataFormatter} = DataFormatter;
// const {DeviceState, Location} = Formatter
const {getColumns} = DataGridColumns

@observer
class AppDevice extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: true,
      deviceAll: [],
      devices: [],
      device: {},
      biological: {},
      user: appStore.user,
      data: [],
      modalSettingVisible: false,
      modalBioVisible: false,
      show_data: [],
      downloadDedviceGps: false,
      currentPage: 1,
      totalLength: 0,
      gridWidth: 500,
      // sort
      rows: [],
      filters: {},
      sortColumn: null,
      sortDirection: null,
      // new
      descriptionModalVisible: false,
      onEditDevice: {},
    }
  }

  componentDidMount() {
    // console.log(appStore.pageSize)
    this.loadPage()
  }

  rowGetter = (rowIdx) => {
    const rows = this.getRows();
    return rows[rowIdx];
    // return thisStore.deviceAll[i];
  }
  getRows = () => {
    // console.log(Selectors.getRows(this.state))
    return Selectors.getRows(this.state);
  };
  getSize = () => {
    return this.getRows().length;
  };
  onRowClick = (rowIdx, row) => {
    let devices = this.state.rows
    if (thisStore.downloadDeviceGpsState && row) {
      let rows = devices;//thisStore.deviceAll;
      rows[rowIdx] = Object.assign({}, row, {isSelected: !row.isSelected});
      this.setState({rows});
      thisStore.setDownloadDeviceGps(row.id)
      // thisStore.setDeviceAll(rows);
    }
  }

  onKeyDown = (e) => {
    const devices = this.state.rows
    if (thisStore.downloadDeviceGpsState) {
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();

        let rows = [];
        devices.forEach((r) => {
          rows.push(Object.assign({}, r, {isSelected: true}));
        })
        this.setState({rows});

        // thisStore.deviceAll.forEach((r) => {
        //   rows.push(Object.assign({}, r, {isSelected: true}));
        // });
        // thisStore.setDeviceAll(rows);
      }
    }
  }

  modeOnChange = (e) => {
    // console.log(e.target.value)
    let mode = e.target.value
    let deviceParams
    deviceParams = thisStore.settingDevice
    if (mode !== 'custom') {
      Object.assign(deviceParams, thisStore.defaultMode[mode])
      thisStore.set('modeDisabled',true)
    } else {
      thisStore.set('modeDisabled',false)
      let keys = Object.keys(thisStore.defaultMode['realtime'])
      keys.map(key => {
        deviceParams[key] = thisStore.settingDeviceBackup[key]
      })
      // console.log(keys,thisStore.settingDeviceBackup)
    }
    thisStore.setSettingModalDevice(deviceParams)
  }

  handleGridSort = (sortColumn, sortDirection) => {
    this.setState({sortColumn: sortColumn, sortDirection: sortDirection});
  };

  onChangePage = (page) => {
    // console.log(page)
    this.setState({
      loading: true
    })
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
    // this.setState({
    //   selectedRowKeys: []
    // })
    // console.log(p,limit, offset,appStore.user)
    let url = Api.device()
    if (this.props.search) {
      let mark = Object.values(this.props.search)[0]
      // console.log(this.props.search)
      url = Api.searchDeviceByMark(mark)
    }
    axios.get(url, httpConfig('-updated_at', limit, offset)).then(res => {
      let totalLength = res.headers['x-result-count']
      let deviceAll = DeviceDataFormatter(res.data)
      this.setState({
        rows: deviceAll,
        deviceAll,
        totalLength,
        currentPage: page,
        loading: false
      })
      // thisStore.setDeviceAll(deviceAll);
    }).catch(err => {
      MessageHandle(err)
      this.setState({
        loading: false
      })
    })
  }

  cancelExport = () => {
    thisStore.set('cancelExport', false)
    let rows = [];
    this.state.rows.forEach((r) => {
      rows.push(Object.assign({}, r, {isSelected: false}));
    });
    this.setState({rows})
    thisStore.set('downloadDeviceGps', [])
  }

  selectAll = () => {
    thisStore.set('toggleSelectAll', false)
    let rows = [];
    let state = thisStore.selectAllState
    let id = []
    this.state.rows.forEach((r) => {
      state && (id.push(r.id))
      rows.push(Object.assign({}, r, {isSelected: state}));
    });
    this.setState({rows})
    thisStore.set("downloadDeviceGps", id)
  }

  handleGridRowsUpdated = ({fromRow, toRow, updated}) => {
    let rows = this.state.rows;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = React.addons.update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.setState({rows});
  }
  editDevice = (device) => {
    this.setState({
      onEditDevice: device,
      descriptionModalVisible: true
    })
  }
  setDescriptionForm = (form) => {
    this.descriptionForm = form
  }
  hideDescriptionModal = () => {
    this.setState({
      descriptionModalVisible: false
    })
  }
  saveDescriptionModal = () => {
    if (appStore.user.role !== 'guest') {
      let _this = this
      let form = this.descriptionForm
      let device = this.state.onEditDevice
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let data = {
          description: values.description
        }
        axios.put(Api.device(device.id), data, httpConfig())
          .then(res => {
            message.success(appStore.language.description_updated)
            _this.hideDescriptionModal()
            let devices = _this.state.rows
            devices.map((item, index) => {
              if (device.id === item.id) {
                devices[index].description = data.description
              }
            })
            _this.setState({
              rows: devices
            })
            form.resetFields();
          })
          .catch(err => {
            MessageHandle(err)
            // console.log(err)
          })
      })
    } else {
      message.info(appStore.language.statusMessage[403]);
      thisStore.biologicalModalVisible = false;
    }
  }
  // 表格操作
  getCellActions = (column, row) => {
    if(appStore.user.role !== 'guest'){
      if (column.key === 'description') {//修改备注
        return [
          {
            icon: 'anticon anticon-edit',
            callback: () => {
              let device = row;
              this.setState({
                onEditDevice: device,
                descriptionModalVisible: true
              });
            },
            // actions: [
            //   {
            //    icon: '',
            //     text: <Button>测试</Button>,
            //     callback: () => {
            //       alert('Navigating to camapign linking');
            //     }
            //   }
            // ]
          },
        ];
      }
    }
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
    if (thisStore.cancelExport) {
      this.cancelExport()
    }
    if (thisStore.toggleSelectAll) {
      this.selectAll()
    }

    const columnsDevice = getColumns('device');
    // console.log(columnsDevice)
    return (
      <div className="wrap app-device">
        <Spin spinning={this.state.loading} indicator={LoadingImg}>
          <div className="flex-box wrap-full">
            {/*<div onClick={this.resizeGrid}>reload</div>*/}
            <DeviceListHead history={this.props.history}/>
            <div className="wrap-full">
              {/*<DeviceAllGrid/>*/}
                {this.rowGetter(0)?
                    <ReactDataGrid
                        rowKey="id"
                        ref="grid"
                        onGridSort={this.handleGridSort}
                        columns={columnsDevice}
                        rowGetter={this.rowGetter}
                        rowsCount={this.getSize()}
                        minHeight={1000}
                        rowHeight={45}
                        // enableCellSelect={true}
                        // enableRowSelect={true}
                        minColumnWidth={200}
                        rowSelection={{
                            showCheckbox: false,
                            selectBy: {
                                isSelectedKey: 'isSelected'
                            }
                        }}
                        onRowClick={this.onRowClick}
                        onGridKeyDown={this.onKeyDown}
                        emptyRowsView={EmptyRowsView}
                        onGridRowsUpdated={this.handleGridRowsUpdated}
                        getCellActions={this.getCellActions}
                    />
                    :''}

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

            {/*<MyGrid type={'device'} sort={'-updated_at'}/>*/}
          </div>
        </Spin>

        {/*设备配置弹窗*/}
        <Modal
          visible={thisStore.settingModalVisible}
          title={appStore.language.device_set}
          onCancel={thisStore.hideSettingModal}
          onOk={thisStore.saveSettingModal}
          width={680}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          wrapClassName="vertical-center-modal"
          maskClosable={false}
        >
          <DeviceSettingForm ref={thisStore.setSettingForm} modeOnChange={this.modeOnChange}/>
        </Modal>
        {/*生物信息弹窗*/}
        <Modal
          visible={thisStore.biologicalModalVisible}
          title={appStore.language.organism_info}
          onCancel={thisStore.hideBiologicalModal}
          onOk={thisStore.saveBiologicalModal}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          wrapClassName="vertical-center-modal"
          width={600}
          maskClosable={false}
        >
          <DeviceBioForm ref={thisStore.setBiologicalForm} biologicalInfo={thisStore.biologicalDevice}/>
        </Modal>
        {/*设备备注*/}
        <Modal
          visible={this.state.descriptionModalVisible}
          title={appStore.language.getKeyName('description')}
          onCancel={this.hideDescriptionModal}
          onOk={this.saveDescriptionModal}
          okText={appStore.language.confirm}
          cancelText={appStore.language.cancel}
          wrapClassName="vertical-center-modal"
          width={600}
          maskClosable={false}
        >
          <DescriptionForm ref={this.setDescriptionForm} device={this.state.onEditDevice}/>
        </Modal>
      </div>
    )
  }
}

export default AppDevice