import React from 'react'
import '../../assets/css/page/product-shares.scss'
import {App, CTYPE, U} from "../../common";
import Tloader from '../common/loader/react-touch-loader.jsx';
import {NoData} from '../Comps.jsx';

export default class ProductShares extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            marker: null,
            initializing: 1,
            hasMore: false
        };
    }

    componentDidMount() {
        U.setWXTitle('我的动态');
        this.loadData();
    }

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
        App.api('usr/product/share_items', {
            marker,
            limit: CTYPE.page_limit
        }).then(result => {
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
        App.api('usr/product/share_items', {
            marker,
            limit: CTYPE.page_limit
        }).then(result => {
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

        let {list = [], initializing, hasMore} = this.state;

        let length = list.length;

        return <div className="product-shares-page">

            {length === 0 && <NoData loaded={initializing === 2}/>}
            {length > 0 && <Tloader
                className="main"
                autoLoadMore
                onRefresh={this.refresh} onLoadMore={this.loadMore} hasMore={hasMore}
                initializing={initializing}>

                <ul>

                    {list.map((item, index) => {
                        let {product = {}, createdAt} = item;
                        let {name} = product;

                        return <li key={index}>
                            <div className='title'>分享 {name}</div>
                            <div className='date'>{U.date.format(new Date(createdAt), 'yyyy-MM-dd')}</div>
                        </li>
                    })}

                </ul>
            </Tloader>}

            <div className='btn-back' onClick={() => App.go('/profile')}>返回个人中心</div>

        </div>

    }
}

