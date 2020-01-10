import React from 'react'
import '../../assets/css/page/profile.scss'
import UserProfile from "../common/UserProfile";
import {App, U} from "../../common";
import {Toast} from 'antd-mobile';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company: {},
            user: {},
            taxWebsite: '',
            showMobileEdit: false,

            mobile: '',
            code: '',
            count: 60,
            disabled: 0, // 0.默认 1.活动状态 2.倒计时,
            showBankEdit: false
        };
        this.countDownTimerId = null;
    }

    componentDidMount() {

        U.setWXTitle('个人中心');

        UserProfile.get().then((profile) => {

            let {user = {}} = profile;

            this.setState({user});
        })
    }

    componentWillUnmount() {
        clearInterval(this.countDownTimerId);
    }

    send = () => {
        let {mobile} = this.state;

        if (!U.str.isChinaMobile(mobile)) {
            Toast.info('请输入正确的手机号码');
            return;
        }

        this.setState({disabled: 1});

        App.api('/support/vcode/vcode', {
            companyId: App.getCompanyId(),
            mobile,
            ...U.genCheckCode(mobile)
        }).then(() => {
            this.startTimer();
        }, () => {
            this.setState({
                disabled: 0
            });
        });
    };

    startTimer = () => {
        this.countDownTimerId = setInterval(() => {

            const newCount = this.state.count - 1;

            if (newCount <= 0) {
                this.setState({
                    disabled: 0,
                    count: 60
                });
                clearInterval(this.countDownTimerId);
            } else {
                this.setState({
                    disabled: 2,
                    count: newCount
                });
            }
        }, 1000);
    };

    modMobile = () => {
        let {mobile, code} = this.state;

        if (!U.str.isChinaMobile(mobile)) {
            Toast.fail('手机号码不正确');
            return;
        }
        if (U.str.isEmpty(code) || code.length !== 6) {
            Toast.fail('验证码错误');
            return;
        }

        App.api('/usr/modMobile', {
                mobile, vcode: code
            }
        ).then(() => {
            Toast.success('修改成功');
            this.showMobileEdit(false);
            this.reloadProfile();
        })
    };

    reloadProfile = () => {
        UserProfile.clear();
        App.api('/user/profile').then((profile) => {
            let {user = {}} = profile;
            this.setState({user, showBankEdit: false});
        });
    };

    showMobileEdit = (val) => {
        this.setState({showMobileEdit: val});
    };


    render() {

        let {user = {}, showMobileEdit = false, mobile, code, disabled, count} = this.state;

        let {nick} = user;

        return <div className="profile-page">

            <ul>
                <li>
                    <div className='brief-info'>
                        <div className='left'>
                            <div className='name'>{nick}</div>
                        </div>
                    </div>
                </li>
                <li>
                    <div className='label' style={{flex: '0 0 120px'}}>电子合同</div>
                    <div className='value'/>
                    <span className='more'
                          onClick={() => App.go('/agreement-preview?type=view')}>查看 &gt;</span> : null}
                </li>
            </ul>
            <ul>
                <li>
                    <div className='label'>真实姓名</div>
                    <div className='value'>{nick}</div>
                </li>
                <li>
                    <div className='label'>手机号码</div>
                    <div className='value'>{U.str.trimChinaMobile(user.mobile)}</div>
                    <div className='more' onClick={() => this.showMobileEdit(true)}>修改</div>
                </li>
            </ul>
            {showMobileEdit && <div>
                <div className='overlay'/>
                <div className='modal-input-alert'>
                    <div className='title'>修改手机号
                        <div className='close' onClick={() => this.showMobileEdit(false)}/>
                    </div>

                    <div className='form'>

                        <div className='line'>
                            <div className='icon icon-mobile'/>
                            <input type='number' placeholder='请输入手机号' value={mobile} onChange={(e) => {
                                this.setState({mobile: e.target.value});
                            }}/>
                        </div>

                        <div className='clearfix-h20'/>

                        <div className='line'>
                            <div className='icon icon-pwd'/>
                            <input type='number' className='input-vcode' maxLength={6} placeholder='请输入验证码' value={code}
                                   onChange={(e) => {
                                       this.setState({code: e.target.value});
                                   }}/>
                            <span style={disabled === 0 ? null : {color: '#ccc'}}
                                  onClick={disabled === 0 ? this.send : null}>{disabled === 2 ? `${count}` : '获取验证码'}</span>
                        </div>
                    </div>

                    <div className='blocked-btn' onClick={() => {
                        this.modMobile();
                    }}>确认修改
                    </div>
                </div>
            </div>}
        </div>
    }
}

