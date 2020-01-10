import React from 'react'
import '../../assets/css/page/info-edit.scss'
import UserProfile from "../common/UserProfile";
import {App, U} from "../../common";
import {List, Picker, Toast} from 'antd-mobile';
import UserUtils from "../UserUtils";

export default class InfoEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            company: {}
        }
    }

    componentDidMount() {
        U.setWXTitle('完善信息');
        UserProfile.get().then((profile) => {
            let {user = {}, company = {}} = profile;
            this.setState({user, company});
        })
    }

    inputChange = (k, e) => {
        this.setState({
            [k]: e.target.value,
        });
    };

    submit = () => {
        let {user = {}} = this.state;

        let {name, sex, identity, accountNo, bankName} = user;

        if (U.str.isEmpty(name)) {
            Toast.fail('请填写姓名');
            return;
        }
        if (U.str.isEmpty(sex)) {
            user.sex = 1;
        }

        if (!U.str.isIdentity(identity)) {
            Toast.fail('身份证号错误');
            return;
        }

        if (U.str.isEmpty(accountNo)) {
            Toast.fail('请输入银行卡号');
            return;
        }

        if (U.str.isEmpty(bankName)) {
            Toast.fail('请选择开户行');
            return;
        }

        App.api('usr/user/update', {user: JSON.stringify(user)}).then(() => {
            Toast.success('信息已保存');
            UserProfile.clear();
            setTimeout(() => {
                App.go('/agreement-preview?type=sign');
            }, 1000);
        });

    };

    viewImgs = (url, imgs) => {
        // if (window.WeixinJSBridge) {
        //     WeixinJSBridge.invoke('imagePreview', {
        //         current: url,
        //         urls: imgs
        //     });
        // } else {
        //     Toast.info('当前不支持查看');
        // }
    };

    render() {


        let {user = {}, company = {}} = this.state;

        let {name, mobile, sex = 1, identity = '', accountNo = '', bankName = ''} = user;


        return <div className="info-edit-page">

            <div className='brief-info'>
                <p>{company.name}</p>
            </div>

            <ul>
                <li>
                    <span>真实姓名</span>
                    <input
                        type="text" className="input" value={name}
                        onChange={(e) => {
                            this.setState({
                                user: {
                                    ...user,
                                    name: e.target.value
                                }
                            })
                        }}
                    />
                </li>
                <li>
                    <span>性别</span>
                    <label>{parseInt(sex) === 2
                        ? '女'
                        : '男'}</label>
                    <div className="hiddeninput">
                        <Picker
                            cols={1}
                            data={[
                                {
                                    label: '男',
                                    value: 1,
                                },
                                {
                                    label: '女',
                                    value: 2,
                                },
                            ]}
                            value={[sex]}
                            onChange={(v) => {
                                this.setState({user: {...user, sex: v[0]}});
                            }}>
                            <List.Item arrow="horizontal"/>
                        </Picker>
                    </div>
                    <i/>
                </li>
                <li>
                    <span>手机号码</span>
                    <label>{U.str.trimChinaMobile(mobile)}</label>
                </li>
                <li>
                    <span>身份证号</span>
                    <input
                        type="text" className="input" value={identity}
                        onChange={(e) => {
                            this.setState({user: {...user, identity: e.target.value}});
                        }}
                    />
                </li>
            </ul>

            <ul>
                <li>
                    <span>银行卡号</span>
                    <input placeholder='请输入'
                           type="text" className="input" value={accountNo}
                           onChange={(e) => {
                               this.setState({
                                   user: {
                                       ...user,
                                       accountNo: e.target.value.replace(/[^\d]/g, '')
                                   }
                               })
                           }}
                    />
                </li>
                <li>
                    <span>开户行</span>
                    <label>{bankName || '请选择'}</label>
                    <div className="hiddeninput">
                        <Picker
                            cols={1}
                            data={UserUtils.banks}
                            value={[sex]}
                            onChange={(v) => {
                                this.setState({user: {...user, bankName: v[0]}});
                            }}>
                            <List.Item arrow="horizontal"/>
                        </Picker>
                    </div>
                    <i/>
                </li>

            </ul>


            <div className='btn-ok' onClick={this.submit}>我确认信息填写正确</div>

        </div>

    }
}

