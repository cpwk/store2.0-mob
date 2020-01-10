import React from 'react'
import '../../assets/css/page/service-center.scss'
import {App, CTYPE, U} from "../../common";
import {Banners, ProductList} from "../Comps";
import Tloader from '../common/loader/react-touch-loader.jsx';
import {NoData} from '../Comps.jsx';

export default class ServiceCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: [],

            list: [],
            marker: null,
            initializing: 1,
            hasMore: false
        };
    }

    componentDidMount() {
        U.setWXTitle('服务中心');
        this.loadBanners();
        this.loadData();
    }

    loadBanners = () => {
        App.api('usr/home/banners', {
            companyId: App.getCompanyId()
        }, {defaultErrorProcess: false}).then((banners) => {
            this.setState({banners});
        })
    };

    refresh = (resolve, reject) => {
        this.setState({
            marker: null,
            list: [],
            initializing: 1,
            hasMore: false
        }, () => this.loadData());
        resolve && resolve();
    };

    loadMore = (resolve) => {
        let {marker} = this.state;
        App.api('usr/product/items', {
            companyId: App.getCompanyId(),
            marker,
            limit: CTYPE.page_limit
        }, {defaultErrorProcess: false}).then(result => {
            let {list = []} = result;
            this.setState((prevState) => ({
                list: prevState.list.concat(list),
                marker: result.marker,
                initializing: 2,
                hasMore: result.hasMore
            }));

        });
        resolve && resolve();
    };

    loadData = () => {
        let {marker} = this.state;
        App.api('usr/product/items', {
            companyId: App.getCompanyId(),
            marker,
            limit: CTYPE.page_limit
        }, {defaultErrorProcess: false}).then(result => {
            let {list = []} = result;
            this.setState((prevState) => ({
                list: prevState.list.concat(list),
                marker: result.marker,
                initializing: 2,
                hasMore: result.hasMore
            }));
        });
    };

    render() {

        let {banners = [], list = [], initializing, hasMore} = this.state;

        let length = list.length;

        return <div className="service-center-page">

            {banners.length > 0 && <Banners list={banners}/>}

            {length === 0 && <NoData loaded={initializing === 2}/>}
            {length > 0 && <Tloader
                className="main"
                autoLoadMore
                onRefresh={this.refresh} onLoadMore={this.loadMore} hasMore={hasMore}
                initializing={initializing}>
                <ProductList list={list}/>
            </Tloader>}

        </div>

    }
}

