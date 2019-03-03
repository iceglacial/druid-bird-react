import React from 'react'
import {observer} from 'mobx-react'
import Header from './header'
import Chart from './chart';
import {Spin} from 'antd';
import './visualization.less'
import thisStore from './store'

@observer
class Visualization extends React.Component {
    componentDidMount() {
    }
    componentWillUnmount(){
        thisStore.clearData();
    }

    render() {
        return (
            <div id={'Visualization'} className={'Visualization'}>
                <Header/>
                <Chart/>
            </div>
        )
    }
}

export default Visualization

