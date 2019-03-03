import React from 'react'
import {observer} from 'mobx-react'
import {Card, Spin} from 'antd'
import thisStore from './store'
import appStore from '../../store/app_store'


@observer
class Chart extends React.Component {
    state = {}

    componentDidMount() {

    }


    render() {
        return (
            <div id={'Chart'} className={'Chart ' + thisStore.chartFullScreen} onMouseMove={thisStore.handleMouseMove}>
                {
                    thisStore.showCharts ?
                        <Card>
                            {thisStore.allowChartSplitting ? <button className={'chart__top-btn'} onClick={thisStore.chartSplitToggle}>
                                {thisStore.chartSplit?appStore.language.chart_merging:appStore.language.chart_splitting}
                            </button> : ''}
                            {/*<button onClick={thisStore.toggleChartFullScreen}>全屏</button>*/}
                            {thisStore.chartList.map((v) => {
                                return <div key={v} id={'chartContainer-' + v} className={'chart-container'}
                                            style={{
                                                width: '100%',
                                                height: 100 / thisStore.chartList.length + '%',
                                            }}/>
                            })}
                        </Card> : ''
                }
            </div>
        )
    }
}

export default Chart

