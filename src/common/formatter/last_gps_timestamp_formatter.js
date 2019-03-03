/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import Filters from '../filters'

const {unitFilter} = Filters
class LastValidGpsTimestampFormatter extends React.Component{
  constructor(props){
    super(props)
    // console.log(props);
  }
  render(){
    const lastValidGps = this.props.value || {};
    return(
      <div>{unitFilter(lastValidGps.timestamp,'timestamp')}</div>
    )
  }
}
export default LastValidGpsTimestampFormatter