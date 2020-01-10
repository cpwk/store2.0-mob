import React from 'react';
import {App, CTYPE, U} from '../../common/index';

import Tloader from '../common/loader/react-touch-loader.jsx';
import {NoData} from '../Comps.jsx';

import '../../assets/css/page/payments.scss'

export default class Payments extends React.Component {

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
        U.setWXTitle('打款记录');
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
        App.api('usr/finance/payment_items', {
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
        App.api('usr/finance/payment_items', {
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

        return <div className="payments-page">

            {length === 0 && <NoData loaded={initializing === 2}/>}
            {length > 0 && <Tloader
                className="main"
                autoLoadMore
                onRefresh={this.refresh} onLoadMore={this.loadMore} hasMore={hasMore}
                initializing={initializing}>

                <ul className="ul-payments">
                    {list.map((payment, index) => {
                        let {payTime, amount} = payment;

                        return <li key={index}>
                            <div className='time'>{U.date.format(new Date(payTime), 'yyyy/MM/dd HH:mm')}</div>
                            <div className="amount">
                                工资到账
                                <span>{U.str.formatMoney(amount)}</span>元
                            </div>
                        </li>;
                    })}</ul>

            </Tloader>}
            <div className="clear"/>

        </div>;

    }
}

