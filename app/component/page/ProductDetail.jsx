import React from 'react'
import '../../assets/css/page/product-detail.scss'
import {App, U, Utils} from "../../common";
import {CrossTitle, HomeIcon} from "../Comps";
import UserProfile from "../common/UserProfile";


export default class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            product: {},

            withUser: false

        };
    }

    componentDidMount() {

        let {id} = this.state;
        App.api('usr/product/item', {productId: id}, {defaultErrorProcess: false}).then((product) => {
            U.setWXTitle('服务中心');
            this.setState({product});
        });

        let user = App.getUserProfile();
        if (user.id) {
            this.setState({withUser: true});
            UserProfile.get().then((profile) => {
                let {company = {}} = profile;
                this.setState({company});
            })
        }
    }

    share = (id, withUser) => {
        if (withUser) {
            App.api('usr/product/save_share', {productId: id}).then(() => {
                Utils.guide.shareGuide();
            });
        } else {
            Utils.guide.shareGuide();
        }
    };

    render() {

        let {product = {}, company = {}, withUser} = this.state;

        let {id, img, name, price, content} = product;

        return <div className="product-detail-page">

            <div className='img'>
                <img src={img}/>
                <HomeIcon/>
            </div>

            <div className='title'>
                <div className='price'>¥{price}</div>
                <p>{name}</p>
            </div>

            {withUser && <div className='company'>
                <img src={company.logo}/>
                <p>{company.name}</p>
            </div>}

            <div className='content'>
                <CrossTitle title='产品介绍'/>

                <div className='inner-content' dangerouslySetInnerHTML={{__html: content}}/>

            </div>

            <div className='btn-share' onClick={() => this.share(id, withUser)}>立即分享</div>


        </div>

    }
}

