import React from 'react'
import '../../assets/css/page/agreement-preview.scss'
import {App, U} from "../../common";
import {Checkbox, Toast} from 'antd-mobile';

const AgreeItem = Checkbox.AgreeItem;

const agreements = ['http://taxx.oss-cn-hangzhou.aliyuncs.com/assets/%E5%B0%8F%E9%94%A4%E4%B9%8B%E6%98%9F%E4%B8%AA%E4%BA%BA%E5%90%88%E5%90%8C%E6%A8%A1%E7%89%88/1.jpg', 'http://taxx.oss-cn-hangzhou.aliyuncs.com/assets/%E5%B0%8F%E9%94%A4%E4%B9%8B%E6%98%9F%E4%B8%AA%E4%BA%BA%E5%90%88%E5%90%8C%E6%A8%A1%E7%89%88/2.jpg', 'http://taxx.oss-cn-hangzhou.aliyuncs.com/assets/%E5%B0%8F%E9%94%A4%E4%B9%8B%E6%98%9F%E4%B8%AA%E4%BA%BA%E5%90%88%E5%90%8C%E6%A8%A1%E7%89%88/3.jpg', 'http://taxx.oss-cn-hangzhou.aliyuncs.com/assets/%E5%B0%8F%E9%94%A4%E4%B9%8B%E6%98%9F%E4%B8%AA%E4%BA%BA%E5%90%88%E5%90%8C%E6%A8%A1%E7%89%88/4.jpg', 'http://taxx.oss-cn-hangzhou.aliyuncs.com/assets/%E5%B0%8F%E9%94%A4%E4%B9%8B%E6%98%9F%E4%B8%AA%E4%BA%BA%E5%90%88%E5%90%8C%E6%A8%A1%E7%89%88/5.jpg', 'http://taxx.oss-cn-hangzhou.aliyuncs.com/assets/%E5%B0%8F%E9%94%A4%E4%B9%8B%E6%98%9F%E4%B8%AA%E4%BA%BA%E5%90%88%E5%90%8C%E6%A8%A1%E7%89%88/6.jpg'];

export default class SignatureDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'view',
            agreements: []
        };
    }

    componentDidMount() {
        let type = U.getHashParameter('type');
        this.setState({type});
        U.setWXTitle(type === 'view' ? '查看合同' : '签署合同');
        this.loadData();
    }

    loadData = () => {
        Toast.loading('加载中...', 0, null, false);
        App.api('usr/user/agreement').then((ret) => {
            Toast.hide();
            this.setState({agreements: ret.images});
        })
    };

    viewImgs = (url, urls) => {
        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('imagePreview', {
                'current': url,
                'urls': urls,
            });
        } else {
            Toast.info('当前不支持查看');
        }
    };

    render() {

        let {type = 'view', agreements = []} = this.state;

        return <div className="agreement-preview-page">
            <div className='preview'>
                {agreements.map((img, index) => {
                    return <img src={img} key={index} onClick={() => {
                        this.viewImgs(img, agreements);
                    }}/>
                })}
            </div>
            {type === 'sign' && <div className='btm'>
                <div className='agreement-chk'>
                    <AgreeItem checked={true}>我已完整阅读并同意以上协议</AgreeItem>
                </div>
                <div className='btn' onClick={() => {
                    App.go('/signature-draw');
                }}>立即签署
                </div>
            </div>}

            {type === 'view' && <div className='btm'>
                <div className='btn' style={{marginTop: '20px'}} onClick={() => {
                    window.history.back();
                }}>返回个人中心
                </div>
            </div>}

        </div>
    }
}

