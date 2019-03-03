/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'
import Filters from '../filters'

const {unitFilter} = Filters
class DateTimeFormatter extends React.Component{
  constructor(props){
    super(props)
    // console.log(props);
  }
  render(){
    return(
      <div>{unitFilter(this.props.value,'timestamp')}</div>
    )
  }
}
export default DateTimeFormatter