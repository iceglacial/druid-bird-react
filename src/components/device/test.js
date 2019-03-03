/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import './index.less'
import {Row,Col,Button,Icon,message} from 'antd'
import axios from '../../common/axios.default'
import {Api,Token,Filters} from '../../common'
import { Grid,List, WindowScroller } from 'react-virtualized'
import {observer} from 'mobx-react'
import deviceStore from './store'
const {
  stateFilter,
  unitFilter,
} = Filters

// List data as an array of strings
const config = {
  headers: {
    'x-druid-authentication': Token.getLocalToken(),
  }
}
const list = [
  ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */ ],
  ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */ ],
    ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */ ]
];

function cellRenderer ({ columnIndex, key, rowIndex, style }) {
  console.log(key,columnIndex,rowIndex,style);
  return (
    <div
      key={key}
      style={style}
    >
      {list[rowIndex][columnIndex]}
    </div>
  )
}
@observer
class DeviceTop extends React.Component{
  render(){
    return (
      <Row type="flex" justify="space-between" className='mg-bottom'>
        <Col>
          <Button type="primary">设备分配</Button>
        </Col>
        <Col>
          <Button type="primary">设备位置</Button>
        </Col>
      </Row>
    )
  }
}
class AppDevice extends React.Component {
  constructor(props) {
    super(props)
    axios.get(Api.device()).then(res=>{
      deviceStore.setDeviceAll(res.data);
    })
  }
  render() {
    return (
      <div className="app-device">
        <Grid
          cellRenderer={cellRenderer}
          columnCount={list[0].length}
          columnWidth={100}
          height={300}
          rowCount={list.length}
          rowHeight={30}
          width={300}
        />
      </div>
    )
  }
}
export default AppDevice