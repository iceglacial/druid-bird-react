import 'babel-polyfill';
import React from 'react'
import ReactDOM from 'react-dom'
import './index.less'
import App from './_app'
// import 'babel-plugin-transform-runtime'
// import registerServiceWorker from './register_service_worker'

// require('https://maps.googleapis.com/maps/api/js?key=AIzaSyCcgISWlofggfUPB7zmCQL8jl87Az524eg')//&callback=initMap

ReactDOM.render(<App/>, document.getElementById('root'))
// registerServiceWorker()

