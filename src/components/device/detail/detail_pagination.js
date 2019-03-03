import React from 'react'
import {observer} from 'mobx-react'
import {Button, Icon, Select} from 'antd'
import appStore from '../../../store/app_store'
import thisStore from './store'

const Option = Select.Option

@observer
export class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.current,
            pageSize: props.pageSize,
            disabled: false,
            topLeftDisabled: false,
            leftDisabled: false,
            rightDisabled: false,
        }
        this.right = this.right.bind(this);
        this.left = this.left.bind(this);
        this.topLeft = this.topLeft.bind(this);
        this.onShowSizeChange = this.onShowSizeChange.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    //翻页按钮
    paging() {
        this.state.leftDisabled = thisStore.datePicking ?
            (thisStore.direction === 'left' ? this.props.isEnd() : false) :
            this.state.current === 1;
        this.state.topLeftDisabled = !thisStore.datePicking && this.state.leftDisabled || thisStore.datePicking;
        this.state.rightDisabled = thisStore.datePicking ?
            (thisStore.direction === 'right' ? this.props.isEnd() : false) :
            this.props.isEnd();
        return <div>
            <Button onClick={this.topLeft} disabled={this.state.disabled || this.state.topLeftDisabled}><i
                className="anticon anticon-verticle-left"/></Button>
            <Button onClick={this.left} disabled={this.state.disabled || this.state.leftDisabled}><i
                className="anticon anticon-left"/></Button>
            <Button>{thisStore.datePicking ? '-' : this.state.current}</Button>
            <Button onClick={this.right} disabled={this.state.disabled || this.state.rightDisabled}><i
                className="anticon anticon-right"/></Button>
        </div>
    }

    //下一页
    right() {
        if (!this.props.isEnd() || thisStore.datePicking) {
            this.props.onChange(this.state.current + 1, 'right');
            this.setState((prevState) => {
                return {current: prevState.current + 1}
            })
        }

    }

    //上一页
    left() {
        if (this.state.current > 1 || thisStore.datePicking) {
            this.props.onChange(this.state.current - 1, 'left');
            this.setState({current: this.state.current - 1});
        }
    }

    //第一页
    topLeft() {
        this.setState({current: 1});
        this.props.onChange(1);
    }

    onShowSizeChange(pageSize, id) {
        this.props.onShowSizeChange(this.state.current, pageSize, id);
        this.setState({pageSize: pageSize});
        this.topLeft();
    }

    // 总数
    countItems() {
        return <div>
            {appStore.language.total_count(this.props.total)}
        </div>
    }

    //页容量
    select() {
        return <div>
            <Select defaultValue={this.state.pageSize + ''} onChange={this.onShowSizeChange}>
                {this.props.pageSizeOptions.map((item) =>
                    <Option value={item} key={item}>{item + appStore.language.page_size}</Option>
                )}
            </Select>
        </div>
    }

    btnDisabled(bool) {
        this.setState({disabled: bool});
    }

    setFirstPage = () => {
        this.setState({current: 1});
    }

    render() {
        return (
            <div className='pagination'>
                {this.select()}
                {this.paging()}
                {this.countItems()}
            </div>
        )
    }
}

Pagination.defaultProps = {
    current: 1,
    defaultCurrent: 1,
    total: 1,
    onShowSizeChange: null,
    onChange: null,
    pageSizeOptions: [appStore.pageSize],
    pageSize: appStore.pageSize
};

