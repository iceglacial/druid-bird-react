/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/12/2 0002.
 */
import React from 'react'
import { Radio, Switch,Row,Col} from 'antd'
import {observer} from 'mobx-react'
import appStore from '../../../store/app_store'
import thisStore from './store'

@observer
class RangeSearch extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount() {
    thisStore.init()
  }

  onChangeRangeSearchType = (e) => {
    let type = e.target ? e.target.value : e.key ? e.key : e
    thisStore.setRangeSearchType(type)
    // console.log(!thisStore.isRangeSearching)
    if(!thisStore.isRangeSearching){
      thisStore.initDrawingManager(true)
      // console.log(thisStore.isRangeSearching)
    }
  }
  /**
   * 范围搜索
   * @returns {XML}
   */
  toggleSearchRange = (show) => {
    thisStore.initDrawingManager(show)
  }

  render() {
      return (
        <div>
          <div className="title">
            <Row type='flex' justify='space-between'>
              <Col>{appStore.language.search_range}</Col>
              <Col><Switch onChange={this.toggleSearchRange} checked={thisStore.isRangeSearching}/></Col>
            </Row>
          </div>
          {/*<div className="wrap text-center">*/}
            {/*<Button type={thisStore.isRangeSearching ? 'danger' : 'primary'} onClick={this.toggleSearchRange}>{ thisStore.isRangeSearching ? appStore.language.cancel : appStore.language.search_range}</Button>*/}
          {/*</div>*/}
          <Radio.Group onChange={this.onChangeRangeSearchType}
                       defaultValue={thisStore.rangeSearchType}>
            {
              thisStore.enableSearchTypes.map(type => (
                <Radio.Button value={type} key={Math.random()}>{appStore.language[type]}</Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
      )
  }
}
export default RangeSearch