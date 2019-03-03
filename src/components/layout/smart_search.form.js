import React from 'react'
import {observer} from 'mobx-react'
import moment from 'moment'
import {Filters, DateRangePro} from '../../common'
import {Input, Button, Select, DatePicker, Form, Row, Col,message} from 'antd'
import LayoutStore from './store'
import appStore from '../../store/app_store'

const {unitFilter} = Filters
const {RangePicker} = DatePicker
@observer
class CollectionCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchData: [
        {
          name: 'uuid',
          value: ''
        }
      ]
    }
  }

  /**
   * 日期选择确定操作
   * @param date
   * @param dateStrings
   */
  rangeDateUpdatedAtOnOK = (date, dateStrings) => {
    const _range = [moment(date[0]).toISOString(), moment(date[1]).toISOString()];
    let searchData = this.state.searchData;
    searchData.map(function (data, index) {
      if (data.name === 'updated_at') {
        searchData[index].value = _range
      }
    })
    this.setState({
      searchData
    })
    LayoutStore.setSearchItemData(searchData)
  }
  rangeDateTimestampOnOK = (date, dateStrings, item) => {
    const _range = [moment(date[0]).toISOString(), moment(date[1]).toISOString()];
    let searchData = this.state.searchData;
    searchData.map(function (data, index) {
      if (data.name === 'timestamp') {
        searchData[index].value = _range
      }
    })
    this.setState({
      searchData
    })
    LayoutStore.setSearchItemData(searchData)
  }
  selectItemOnChange = (item, index) => {
    let searchData = this.state.searchData
    searchData[index].name = item;
    if (item !== 'uuid' && item != 'dimension') {
      searchData[index].value = []
    } else {
      searchData[index].value = ''
    }
    // console.log(JSON.stringify(searchData),searchData)
    this.setState({
      searchData
    })
    LayoutStore.setSearchItemData(searchData)
  }
  addSelectedItem = (item) => {
    let itemsAll = LayoutStore.smartSearchSelectItems.gps
    let searchData = this.state.searchData
    let itemKey = item;
    for (let i of itemsAll) {
      itemKey = i;
      for (let data of searchData) {
        if (data.name === i) {
          itemKey = false;
          break;
        }
      }
      if (itemKey) {
        break;
      }
    }
    // console.log(itemKey)
    let value = '';
    if (searchData.length < 3) {
      if (item !== 'uuid' && item != 'dimension') {
        value = []
      } else {
        value = ''
      }
      searchData.push({
        name: itemKey,
        value: value
      });
      this.setState({
        searchData
      })
      LayoutStore.setSearchItemData(searchData)
    } else {
      console.log('最多添加3个筛选项！')
    }
  }
  inputOnChange = (item, e, type) => {
    let searchData = this.state.searchData
    if (type) {
      let _index = (type === 'max') ? 1 : 0;
      searchData.map(function (data) {
        if (data.name === item) {
          data.value[_index] = e.target.value
        }
      })
    } else {
      searchData.map(function (data) {
        if (data.name === item) {
          data.value = e.target.value
        }
      })
    }
    this.setState({
      searchData
    })
    LayoutStore.setSearchItemData(searchData)
  }
  removeSelectedItem = (index) => {
    let searchData = this.state.searchData
    // 至少保留一项搜索
    if (searchData.length > 1) {
      searchData.splice(index, 1)
      this.setState({
        searchData
      })
      LayoutStore.setSearchItemData(searchData)
    } else {
      message.error(appStore.language.choose_at_least_one_data_type)
    }
  }
  selectDataOnChange = (value, key) => {
    let searchData = this.state.searchData
    searchData.map(function (data, index) {
      if (data.name === key) {
        searchData[index].value = value
      }
    })
    this.setState({
      searchData
    })
    LayoutStore.setSearchItemData(searchData)
  }

  render() {
    const {form} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    const selectItems = LayoutStore.smartSearchSelectItems.gps
    const addSelectedItem = this.addSelectedItem
    const inputOnChange = this.inputOnChange
    const removeSelectedItem = this.removeSelectedItem
    const searchType = {
      isString: ['uuid'],
      isSelect: ['dimension'],
      isDate: ['updated_at', 'timestamp']
    }
    const stringItem = (item) => {
      let itemKey = item.name
      if (searchType.isString.indexOf(itemKey) > -1) {
        return <Col span={13} offset={1}>
          <Form.Item className='text-center'>
            {getFieldDecorator(itemKey + '', {
              initialValue: '',
            })(
              <Input onChange={(e) => inputOnChange(itemKey, e)}/>
            )}
          </Form.Item>
        </Col>
      } else if (searchType.isDate.indexOf(itemKey) > -1) {
        let onChange
        if (itemKey === 'updated_at') {
          onChange = this.rangeDateUpdatedAtOnOK
        } else {
          onChange = this.rangeDateTimestampOnOK
        }
        return <Col span={13} offset={1}>
          <Form.Item className='text-center'>
            {getFieldDecorator(itemKey + '_min', {
              initialValue: '',
            })(
              <RangePicker
                disabledDate={DateRangePro.disabledDate}
                disabledTime={DateRangePro.disabledRangeTime}
                format="YYYY-MM-DD"
                onChange={onChange}
                //placeholder={[appStore.language.start_date,appStore.language.end_date]}
                // onOk={rangeDateOnOK}
                // getCalendarContainer={getCalendarContainer}
              />
            )}
          </Form.Item>
        </Col>
      } else if (searchType.isSelect.indexOf(itemKey) > -1) {
        let selectList = LayoutStore.smartSearchSelectItems[itemKey]
        return <Col span={13} offset={1}>
          <Select onChange={(value) => this.selectDataOnChange(value, itemKey)}>
            {
              selectList.map(function (key) {
                return <Select.Option key={key} value={key.toString()}>{appStore.language.getKeyName(key)}</Select.Option>
              })
            }
          </Select>
        </Col>
      } else {
        return <Col span={13} offset={1} className={`no-padding`}>
          <Col span={10}>
            <Form.Item className='text-center'>
              {getFieldDecorator(itemKey + '_min', {
                initialValue: '',
              })(
                <Input addonAfter={`${unitFilter('unit', itemKey)}`}
                       onChange={(e) => inputOnChange(itemKey, e, 'min')}/>
              )}
            </Form.Item>
          </Col>
          <Col span={4} className='text-center'>
            <Form.Item>
              {appStore.language.to}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item className='text-center'>
              {getFieldDecorator(itemKey + '_max', {
                initialValue: '',
              })(
                <Input addonAfter={`${unitFilter('unit', itemKey)}`}
                       onChange={(e) => inputOnChange(itemKey, e, 'max')}/>
              )}
            </Form.Item>
          </Col>
        </Col>
      }
    }
    const selectItemOnChange = this.selectItemOnChange
    const searchData = this.state.searchData
    return (
      <Form>
        {
          searchData.map(function (item, itemIndex) {
            return <Row key={`${itemIndex}_${item.name}`}>
              <Col span={6}>
                <Form.Item className='text-center'>
                  {getFieldDecorator(item.name + '_' + itemIndex, {
                    initialValue: item.name,
                  })(
                    <Select onChange={(item) => selectItemOnChange(item, itemIndex)}>
                      {
                        selectItems.map(function (key) {
                          let selected = JSON.stringify(searchData).indexOf(key) > -1
                          let isThis = key === item.name
                          let disabled = selected && !isThis;
                          if (!disabled) {
                            return <Select.Option key={key} value={key} disabled={disabled}>{appStore.language.getKeyName(key)}</Select.Option>
                          }
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {stringItem(item)}
              <Col span={4} className='text-right'>
                <Form.Item>
                  <a onClick={() => removeSelectedItem(itemIndex)}>{appStore.language.delete}</a>
                </Form.Item>
              </Col>
            </Row>
          })
        }
        <div className="text-right">
          <Button onClick={() => addSelectedItem()} disabled={this.state.searchData.length > 2}>+ {appStore.language.add_filter}</Button>
        </div>
      </Form>
    )
  }
}
const CollectionCreateForm = Form.create()(CollectionCreate)
export default CollectionCreateForm