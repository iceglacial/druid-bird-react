/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/9 0009.
 */
import React from 'react'
import {observer} from 'mobx-react'
import axios from 'axios'
import {Api, MessageHandle, httpConfig} from '../../../common/index'
import {Row, Col, Button, Card, message, Modal, Pagination, Spin} from 'antd'
import {Link} from 'react-router-dom'
// import '../../../js/transform'
import Drawing from '../drawing'
import appStore from '../../../store/app_store'
import thisStore from './store'
import LoadingImg from '../../../common/loadingImg'

let map = null;
let geoFences = {}

@observer
class geoFence extends React.Component {
    constructor(props) {
        super(props)
        map = thisStore.map
        this.state = {
            geofenceAll: [],
            activeGeofence: '',
            geofencesDrawing: {},
            totalLength: 0,
            currentPage: 1
        }
        this.loadPage()
    }

    getAllGeofence() {
        axios.get(Api.geofence(), httpConfig('-updated_at')).then(res => {
            let fences = res.data
            for (var i = 0; i < fences.length; i++) {
                var fence = fences[i];
                var type = fence.type;
                // console.log(map.center.toString(),"map center");
                var tmp, mapBounds;
                if (type) {
                    type = type.toLowerCase();
                    if (type === "polygon") {
                        var bounds = fence.polygon.points;
                        tmp = Drawing.drawRectangle(bounds, thisStore.map);
                    } else if (type === "round") {
                        var circle = fence;
                        tmp = Drawing.drawCircle(circle, thisStore.map);
                    }
                    mapBounds = tmp.getBounds();
                    // // (i !== 0) && mapBounds.extend(map.center);
                    if (mapBounds) {
                        thisStore.setBounds(mapBounds)
                    }
                    geoFences[fence.id] = tmp;
                }
            }
            this.setState({
                geofenceAll: res.data,
                geofencesDrawing: geoFences
            })
            thisStore.set('loading', false)
        }).catch(err => {
            MessageHandle(err)
            thisStore.set('loading', false)
        })
    }

// 选中围栏-高亮效果
    highLightFence = (fence) => {
        thisStore.set('loading', true)
        var _fence = geoFences[fence.id];
        this.setState({
            activeGeofence: fence
        })
        // console.log(map.center.toString(),"map center");
        var bounds = _fence.getBounds();
        thisStore.setBounds(bounds)
        var colors = thisStore.colors;
        let geofencesValue = Object.values(geoFences)
        for (let i = 0; i < geofencesValue.length; i++) {
            geofencesValue[i].setOptions({strokeColor: colors.default, fillColor: colors.default, strokeWeight: 2});
        }
        _fence.setOptions({strokeColor: colors.highLight, fillColor: colors.highLight, strokeWeight: 3});
        setTimeout(thisStore.set('loading', false), 0)
        // marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);//polygon no setZIndex function
    }

// 查看围栏详情
    geofenceDetail = (fence) => {
        // console.log('going to detail', fence)
    }
    // 删除单个围栏
    deleteGeofence = (fence) => {
        // console.log('delete fence')
        thisStore.set('loading', true)
        let _this = this;
        Modal.confirm({
            title: appStore.language.delete_confirm,
            content: appStore.language.delete_fence_confirm(fence.area_name),
            okType: 'danger',
            iconType: 'geofence danger',
            okText: appStore.language.confirm,
            cancelText: appStore.language.cancel,
            onOk() {
                geoFences[fence.id].setMap(null)
                axios.delete(Api.geofence(fence.id), httpConfig()).then(res => {
                    message.success(appStore.language.delete_fence_success(fence.area_name));
                    let allFence = _this.state.geofenceAll
                    allFence.map(function (_fence, index) {
                        if (_fence.id === fence.id) {
                            allFence.splice(index, 1)
                        }
                    })
                    _this.setState({
                        geofenceAll: allFence
                    })
                    thisStore.set('loading', false)
                }).catch(err => {
                    MessageHandle(err)
                    thisStore.set('loading', false)
                })
            },
            onCancel() {
                // console.log(`取消删除围栏${fence.area_name}!`);
            },
        })
    }
    addFence = () => {
        // console.log('add Fence')
    }
    onChangePage = (page) => {
        // console.log(page)
        this.loadPage(page)
    }
    loadPage = (p) => {
        thisStore.set('loading', true)
        let page = p || 1
        let limit = appStore.pageSize;
        let offset = limit * (page - 1);
        // this.setState({
        //   selectedRowKeys: []
        // })
        // console.log(p,limit, offset,appStore.user)
        axios.get(Api.geofence(), httpConfig('-updated_at', limit, offset)).then(res => {
            let totalLength = res.headers['x-result-count']
            let fences = res.data
            for (var i = 0; i < fences.length; i++) {
                var fence = fences[i];
                var type = fence.type;
                // console.log(map.center.toString(),"map center");
                var tmp, mapBounds;
                if (type) {
                    type = type.toLowerCase();
                    if (type === "polygon") {
                        var bounds = fence.polygon.points;
                        tmp = Drawing.drawRectangle(bounds, thisStore.map);
                    } else if (type === "round") {
                        var circle = fence;
                        tmp = Drawing.drawCircle(circle, thisStore.map);
                    }
                    mapBounds = tmp.getBounds();
                    // // (i !== 0) && mapBounds.extend(map.center);
                    if (mapBounds) {
                        thisStore.setBounds(mapBounds)
                    }
                    geoFences[fence.id] = tmp;
                }
            }
            this.setState({
                geofenceAll: res.data,
                geofencesDrawing: geoFences,
                totalLength,
                currentPage: page
            })
            thisStore.set('loading', false)
        }).catch(err => {
            MessageHandle(err)
            thisStore.set('loading', false)
        })
    }

    render() {
        const geofenceDetail = this.geofenceDetail
        const deleteGeofence = this.deleteGeofence
        const highLightFence = this.highLightFence
        const addFence = this.addFence
        const activeGeofence = this.state.activeGeofence
        const geofenceLength = this.state.geofenceAll ? this.state.geofenceAll.length : 0
        return (
            <Spin spinning={thisStore.loading} indicator={LoadingImg}>
                <div className="geofence-menu has-header flex-box">
                    <header className="fence-head">
                        <span className="title-style">{appStore.language.fence_list(geofenceLength)}</span>
                        <Link to={`/geofence/add`}>
                            <Button onClick={addFence}>{appStore.language.create_fence}</Button>
                        </Link>
                    </header>
                    <div className="fence-body flex-full">
                        {
                            this.state.geofenceAll.map(function (fence, index) {
                                return <Card key={fence.id} title={fence.area_name}
                                             onClick={() => highLightFence(fence)}
                                             className={fence.id === activeGeofence.id ? 'active' : ''}>
                                    <div className="sub-title">
                                        <Row>
                                            <Col span={10}>
                                                {appStore.language.fence_device_count(fence.device_id ? fence.device_id.length : 0)}
                                            </Col>
                                            <Col span={14}>
                                                {appStore.language.fence_notification_type(fence.msg_type)}
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="action-list">
                                        <div className="item">
                                            <Button shape='circle' icon='delete' className='btn-delete'
                                                    onClick={() => deleteGeofence(fence)}/>
                                        </div>
                                        <div className="item">
                                            <Link to={`/geofence/id/${fence.id}`}><Button shape='circle' icon='edit'
                                                                                          className='btn-edit'
                                                                                          onClick={() => geofenceDetail(fence)}/></Link>
                                        </div>
                                    </div>
                                </Card>
                            })
                        }
                    </div>
                    <div className="wrap text-center">
                        <Pagination current={this.state.currentPage}
                                    simple
                                    showTotal={total => appStore.language.total_count(total)}
                                    onChange={this.onChangePage}
                                    total={this.state.totalLength}//accountStore.messageTotalLength
                                    pageSize={appStore.pageSize}
                                    bordered
                        />
                    </div>
                </div>
            </Spin>
        )
    }
}

export default geoFence