import React from 'react'
import {observer} from 'mobx-react'
import {message} from 'antd'

@observer
 class CopyBtn extends React.Component {
    constructor(props) {
        super(props)
        // this.data = props.dependentValues;
    }

    componentDidMount() {
    }

    copy = (txt) => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.className='hide';
        input.setAttribute('value', txt);
        input.select();
        document.execCommand("Copy");
        message.success('已复制到剪切板')
    }

    render() {
        // let data = this.props.dependentValues
        // console.log(data)
        return (
            <div style={{lineHeight:'22px'}}>
                {this.props.value}
                <span className={'fRight canClick'}>
                    <i className={'anticon anticon-icon-copy'} onClick={()=>{this.copy(this.props.value)}}></i>
                </span>
            </div>
        )
    }
}

export  default CopyBtn