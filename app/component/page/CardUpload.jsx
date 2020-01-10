import React from 'react'
import {Toast} from 'antd-mobile'
import '../../assets/css/page/card-upload.scss'
import UserProfile from "../common/UserProfile";
import {App, CTYPE, U} from "../../common";
import ImgEditor from "../../common/ImgEditor";
import OSSWrap from "../../common/OSSWrap";

export default class CardUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            uploading: false,
            showConfirm: true,
            showImgEditor: false
        }
    }

    componentDidMount() {

        U.setWXTitle('上传身份证');
        UserProfile.get().then((profile) => {
            let {user = {}} = profile;
            this.setState({user});
        })
    }

    // handleNewImage = (e, key) => {
    //
    //     let {uploading, user = {}} = this.state;
    //     let img = e.target.files[0];
    //
    //     if (!img || img.type.indexOf('image') < 0) {
    //         Toast.fail('文件类型不正确,请选择图片类型');
    //         this.setState({
    //             uploading: false
    //         });
    //         return;
    //     }
    //
    //     if (uploading) {
    //         Toast.loading('上传中');
    //         return;
    //     }
    //
    //     this.setState({uploading: true});
    //
    //     OSSWrap.upload(img, 'file').then((result) => {
    //         let {verify = {}} = user;
    //         verify[key] = result.url;
    //         this.setState({
    //             user: {
    //                 ...user,
    //                 verify
    //             },
    //             uploading: false
    //         });
    //     }).catch((err) => {
    //         Toast.fail(err);
    //     });
    //
    // };

    // handleNewImage = (key, url) => {
    //     let {user = {}} = this.state;
    //     let {verify = {}} = user;
    //     verify[key] = url;
    //     this.setState({
    //         user: {
    //             ...user,
    //             verify
    //         }
    //     });
    // };

    handleNewImage = (e, key) => {

        let {uploading, user = {}} = this.state;
        let file = e.target.files[0];

        if (!file || file.type.indexOf('image') < 0) {
            Toast.fail('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }

        if (uploading) {
            Toast.loading('上传中');
            return;
        }

        Toast.loading('图片压缩中...', 0, null, false);

        this.setState({uploading: true});

        let _this = this;

        let img = new Image();
        img.onload = function () {

            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            let targetWidth = 800;
            let targetHeight = (targetWidth / this.width) * this.height;

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            context.clearRect(0, 0, targetWidth, targetHeight);
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            let base64 = canvas.toDataURL('image/png', 0.8);

            _this.setState({uploading: true});
            Toast.loading('上传中...', 0, null, null);

            let _img = U.base64.getBlobBydataURI(base64, 'image/jpeg');
            _img.name = "canvasfile_" + Date.parse(new Date()) + ".png";

            OSSWrap.upload(_img).then((result) => {
                Toast.hide();

                let {verify = {}} = user;
                verify[key] = result.url;
                _this.setState({
                    user: {
                        ...user,
                        verify
                    },
                    uploading: false
                });

            }).catch((err) => {
                Toast.fail(err);
            });
        };

        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (e) => {
            img.src = e.target.result;
        };
    };

    submit = () => {

        let {user = {}} = this.state;
        let {verify = {}} = user;

        let {face, back} = verify;

        if (face && back) {
            Toast.loading('上传中...', 0, null, false);
            App.api('usr/user/upload_card', {card: JSON.stringify({face, back})}).then(() => {
                Toast.hide();
                Toast.success('身份证图片已上传');
                UserProfile.clear();
                setTimeout(() => {
                    App.go('/info-edit');
                }, 1000);
            });
        }
    };

    showConfirm = (val) => {
        this.setState({showConfirm: val})
    };

    showImgEditor = (val) => {
        this.setState({showImgEditor: val})
    };


    render() {

        let {user = {}, showConfirm = true, showImgEditor = false, img_type = 'face'} = this.state;

        let {verify = {}} = user;

        let {face, back} = verify;

        let go = U.str.isNotEmpty(face) && U.str.isNotEmpty(back);

        return <div className='card-upload-page'>

            <div className='tip'>请上传您的身份证正反面照片</div>

            {/*<div className='card' onClick={() => {*/}
            {/*this.setState({showImgEditor: true, img_type: 'face'})*/}
            {/*}}>*/}
            {/*/!*<input className="file" type='file'*!/*/}
            {/*/!*onChange={(e) => this.handleNewImage(e, 'face')}/>*!/*/}

            {/*{face && <img src={face}/>}*/}
            {/*{!face && <div className='btn'>点击上传</div>}*/}
            {/*</div>*/}

            {/*<div className='card card-back' onClick={() => {*/}
            {/*this.setState({showImgEditor: true, img_type: 'back'})*/}
            {/*}}>*/}
            {/*/!*<input className="file" type='file'*!/*/}
            {/*/!*onChange={(e) => this.handleNewImage(e, 'back')}/>*!/*/}
            {/*{back && <img src={back}/>}*/}
            {/*{!back && <div className='btn'>点击上传</div>}*/}
            {/*</div>*/}

            <div className='card'>
                <input className="file" type='file' accept="image/*"
                       onChange={(e) => this.handleNewImage(e, 'face')}/>

                {face && <img src={face}/>}
                {!face && <div className='btn'>点击上传</div>}
            </div>

            <div className='card card-back'>
                <input className="file" type='file' accept="image/*"
                       onChange={(e) => this.handleNewImage(e, 'back')}/>
                {back && <img src={back}/>}
                {!back && <div className='btn'>点击上传</div>}
            </div>


            <div className='btm'/>

            {!go && <div className='btn btn-disabled'>下一步</div>}
            {go && <div className='btn' onClick={this.submit}>下一步</div>}

            {showConfirm && <div>
                <div className='overlay'/>
                <div className='modal-confirm-alert'>
                    <div className='title'>实名认证</div>
                    <p>请先进行实名认证</p>
                    <div className='blocked-btn' onClick={() => {
                        this.showConfirm(false);
                    }}>立即完善
                    </div>
                </div>
            </div>}

            {showImgEditor &&
            <ImgEditor showImgEditor={this.showImgEditor} type={img_type}
                       aspectRatio={CTYPE.imgeditorscale.identity}
                       handleImgSaved={(type, url) => {
                           this.handleNewImage(type, url)
                       }}/>}

        </div>

    }
}

