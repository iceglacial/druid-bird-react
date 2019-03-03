/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import {Progress} from 'antd'

class ActivityPercentFormatter extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    let data = parseFloat(this.props.value) || 0;//NaN
    return(
      <Progress percent={data} strokeWidth={5} format={percent => `${percent} %`}/>
    )
  }
}
export default ActivityPercentFormatter