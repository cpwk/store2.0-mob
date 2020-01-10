import React from 'react'
import {Toast} from 'antd-mobile';
import '../../assets/css/page/signin.scss'
import {App, U} from "../../common";

export default class Signin extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            user: {},
            key: ''
        };
    }

    componentDidMount() {
        U.setWXTitle('登录');
        this.genValCode()
    }

    genValCode = () => {
        let key = new Date().getTime();
        this.setState({key: key});
        this.setState({
            img_src: App.API_BASE + '/support/vcode/vcode?key=' + key,
            valCode: {key, code: ''}
        });
    };

    componentWillUnmount() {
        clearInterval(this.countDownTimerId);
    }

    submit = () => {
        let {user = {}, valCode = {}} = this.state;
        let {key, code} = valCode;
        let {unknown, password} = user;
        if (unknown === undefined || password === undefined) {
            Toast.fail('请输入登录信息');
            return;
        }

        App.api('user/sign_in', {
            unknown,
            password,
            vCode: JSON.stringify({
                key,
                code
            }),
        }).then(res => {
            Toast.success('登录成功');
            App.saveCookie('admin-token', res.userSession.token);
            setTimeout(() => {
                App.go('/page/Home');
            }, 1000);

        });
    };

    render() {

        let {img_src} = this.state;
        let {user = {}, valCode = {}} = this.state;
        let {unknown, password} = user;
        let {code = ''} = valCode;

        return <div className='signin-page'>

            <div className='logo'/>

            <div className='form' style={{height: '180px'}}>

                <div className='line'>
                    <div className='icon icon-mobile'/>
                    <input type='number' placeholder='请输入手机号或者邮箱或昵称' value={unknown}
                           onChange={(e) => {
                               this.setState({
                                   user: {
                                       ...user,
                                       unknown: e.target.value
                                   }
                               });
                           }}/>
                </div>

                <div className='clearfix-h20'/>

                <div className='line'>
                    <div className='icon icon-pwd'/>
                    <input type='password' placeholder='请输入密码' value={password}
                           onChange={(e) => {
                               this.setState({
                                   user: {
                                       ...user,
                                       password: e.target.value
                                   }
                               });
                           }}/>
                </div>

                <div className='clearfix-h20'/>

                <div className='vcode-line'>
                    <div className='line-wrap'>
                        <div className='line'>
                            <div className='icon icon-code'/>
                            <input type='number' className='input-vcode' maxLength={6} placeholder='请输入验证码' value={code}
                                   onChange={(e) => {
                                       this.setState({
                                           valCode: {
                                               ...valCode,
                                               code: e.target.value
                                           }
                                       });
                                   }}/>
                        </div>
                    </div>
                    <img src={img_src} className='yzm'
                         onClick={this.genValCode}/>
                </div>
            </div>
            <div className='down'>
                <div className='zi'>
                    <a style={{marginLeft: '10px'}} onClick={() => App.go('/SignUp')}>前往注册</a>
                    <a style={{float: 'right', marginRight: '10px'}}>找回密码</a></div>
                <div className='btn' onClick={() => this.submit()}>登录</div>
            </div>
        </div>
    }
}

