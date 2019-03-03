/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import {Progress} from 'antd'

class ActivityIntensityFormatter extends React.Component{
  constructor(props){
    super(props)
    // this.data = this.props.dependentValues;
    // console.log(props);
  }
  render(){
    let data = this.props.dependentValues
    // console.log(data);
    const note = (data.activity_time < 100)
      ? (Math.round(data.activity_time * 0.01 * data.total_expend) + '/' + data.total_expend + '('+ data.activity_time +'%)')
      : (data.total_expend + '(100%)');
    return(
      <Progress className="test" percent={this.props.dependentValues.activity_time} strokeWidth={5} format={() => `${note}`} />
    )
  }
}
export default ActivityIntensityFormatter