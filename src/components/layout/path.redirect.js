/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/11/27 0027.
 */
import React from 'react'
import {Redirect} from 'react-router-dom'

class PathRedirect extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let pathname = this.props.location.pathname.replace('/redirect','')
    let location = this.props.location
    return (
      <Redirect to={
        {
          pathname: pathname,
          search: location.search,
          state: location.state
        }
      }/>
    )
  }
}

export default PathRedirect