/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import Filters from '../../common/filters'

const {unitFilter} = Filters
class SampleIntervalFormatter extends React.Component{
  constructor(props){
    super(props)
    // console.log(props);
  }
  render(){
    return(
      <div>{unitFilter(this.props.value,'freq')}</div>
    )
  }
}
export default SampleIntervalFormatter