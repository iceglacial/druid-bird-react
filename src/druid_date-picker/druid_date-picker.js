import React from 'react'
import dp from 'react-datepicker'
import moment from 'moment'

"use strict"

export class DatePicker extends React.Component {
    constructor(props) {
        super(props)
    }

    defaultProps={
        type:'date',
    }

    state = {

    }

    render() {
        return (
            <div className={'druid-date-picker'}>
                {
                    this.props.type === 'range' && <div>range</div>
                }
                {
                    this.props.type === 'date' && <div>date</div>
                }
            </div>
        )
    }
}


/*
* 日期范围
* */
export const dateRange = {
    // 最近n天
    lastDay(n = 1) {
        return {
            start: moment().subtract(n, 'days').toISOString(),
            end: moment().toISOString()
        }
    },
    // 最近n周
    lastWeek(n = 1) {
        return {
            start: moment().subtract(n, 'weeks').toISOString(),
            end: moment().toISOString()
        }
    },
    // 最近n个月
    lastMonth(n = 1) {
        return {
            start: moment().subtract(n, 'months').toISOString(),
            end: moment().toISOString()
        }
    },
    // 最近n年
    lastYear(n = 1) {
        return {
            start: moment().subtract(n, 'years').toISOString(),
            end: moment().toISOString()
        }
    }

}

export default DatePicker;