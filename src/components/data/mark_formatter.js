/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/10/18 0018.
 */
import React from 'react'

class MarkFormatter extends React.Component{
  constructor(props){
    super(props)
    // console.log(props);
  }
  render(){
    const value = this.props.value;
    return(
      <div>{value>0 ? value : '-'}</div>
    )
  }
}
export default MarkFormatter