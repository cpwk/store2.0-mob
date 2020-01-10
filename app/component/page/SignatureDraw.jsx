import React from 'react'
import {Toast} from 'antd-mobile'
import '../../assets/css/page/signature-draw.scss'
import {App, U} from "../../common";

import SignatureCanvas from 'react-signature-canvas'
import OSSWrap from "../../common/OSSWrap";
import UserProfile from "../common/UserProfile";

export default class SignatureDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showConfirm: false
        };
        this.sigPad = {};
    }

    componentDidMount() {
        U.setWXTitle('电签');
    }

    clear = () => {
        this.sigPad.clear();
    };

    submit = () => {

        let base64 = this.sigPad.getTrimmedCanvas().toDataURL('image/png');

        let img = U.base64.getBlobBydataURI(base64, 'image/jpeg');
        img.name = 'canvasfile_' + Date.parse(new Date()) + '.png';

        OSSWrap.upload(img).then(function (result) {
            App.api('usr/user/signature', {signature: result.url}).then(() => {
                Toast.success('签名已上传');
                UserProfile.clear();
                setTimeout(() => {
                    App.go('/succ');
                }, 1000);
            });
        }).catch(function (err) {
            Toast.fail(err);
        });
    };

    drawed = () => {
        let _canvas = document.getElementsByClassName("canvas-pad")[0];
        if (U.str.isCanvasBlank(_canvas)) {
            Toast.fail("请签名后再上传！");
            return false;
        }
        return true;
    };

    showConfirm = (val) => {
        this.setState({showConfirm: val});
    };

    render() {

        let {showConfirm = false} = this.state;

        let width = window.innerWidth;
        let height = window.innerHeight - 120;

        return <div className='signature-draw-page'>

            <SignatureCanvas penColor='black' ref={(ref) => {
                this.sigPad = ref
            }} canvasProps={{width, height, className: 'canvas-pad'}}/>

            <div className='btns'>
                <button className='btn-reset' onClick={this.clear}>清除</button>
                <button onClick={() => {
                    if (this.drawed()) {
                        this.showConfirm(true);
                    }
                }}>采用
                </button>
            </div>

            <div className='warn'>*只能绘制一个签名，采用后将不能修改</div>

            {showConfirm && <div>
                <div className='overlay'/>
                <div className='modal-confirm-alert'>
                    <div className='title'>确认采用签名</div>
                    <p>签名一经采用，将无法修改</p>
                    <div className='btm-btns'>
                        <div className='btn' onClick={() => this.showConfirm(false)}>取消</div>
                        <div className='btn' onClick={() => {
                            this.setState({agreeChecked: true}, () => {
                                this.submit();
                            });
                        }}>确认
                        </div>
                    </div>
                </div>
            </div>}

        </div>
    }
}

