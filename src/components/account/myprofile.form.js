/**
 * Created by Iceglacial - (iceglacial@sina.com) on 2017/9/12 0012.
 */
import React from 'react'
import {observer} from 'mobx-react'
import {Select, Button, Form} from 'antd'
import appStore from './../../store/app_store'
import AccountStore from './store'

const selectItems = {
  language: appStore.languageOptions,
  timeZone: appStore.timeZoneOptions,
  pageSize: appStore.pageSizeOptions
}
@observer
class MyProfileFormDefine extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {form, saveMyProfile} = this.props;
    const {getFieldDecorator} = form;
    const profile = AccountStore.myInfo.profile || {};
    return (
      <div className="wrap">
        <Form layout="vertical">
          {/*<Form.Item label={appStore.language.language}>*/}
          {/*{getFieldDecorator('language', {*/}
          {/*initialValue: profile.language + '',*/}
          {/*rules: [{*/}
          {/*required: true,*/}
          {/*}],*/}
          {/*})(*/}
          {/*<Select*/}
          {/*placeholder={appStore.language.please_choose}*/}
          {/*optionFilterProp="children"*/}
          {/*>*/}
          {/*{selectItems.language.map(option =>*/}
          {/*<Select.Option key={option + ''}>{unitFilter(option, 'language')}</Select.Option>*/}
          {/*)}*/}
          {/*</Select>*/}
          {/*)}*/}
          {/*</Form.Item>*/}
          <Form.Item label={appStore.language.timezone}>
            {getFieldDecorator('time_zone', {
              initialValue: profile.time_zone != 'undefined' ? profile.time_zone + '' : '',
              rules: [{
                required: true,
              }],
            })(
              <Select
                placeholder={appStore.language.please_choose}
                optionFilterProp="children"
              >
                {selectItems.timeZone.map((option) => {
                    let timeZone = appStore.language.getTimezone(option)
                    return <Select.Option key={option + ''}>
                      <div>{timeZone.offset}</div>
                      <div className="small grey">{timeZone.name}</div>
                    </Select.Option>
                  }
                )}
              </Select>
            )}
          </Form.Item>
          <Form.Item label={appStore.language.pagination}>
            {getFieldDecorator('page_size', {
              initialValue: profile.page_size != 'undefined' ? profile.page_size + '' : '',
              rules: [{
                required: true,
              }],
            })(
              <Select
                placeholder={appStore.language.please_choose}
                optionFilterProp="children"
              >
                {selectItems.pageSize.map(option =>
                  <Select.Option key={option + ''}>
                    <div>{option}</div>
                  </Select.Option>
                )}
              </Select>
            )}
          </Form.Item>
        </Form>
        <div className="text-center">
          <Button.Group>
            <Button onClick={saveMyProfile}>{appStore.language.save}</Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}
;
const MyProfileForm = Form.create()(MyProfileFormDefine);

export default MyProfileForm