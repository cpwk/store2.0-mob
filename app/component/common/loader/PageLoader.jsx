import React from 'react';
import Tloader from './react-touch-loader.jsx';

export default class PageLoader extends React.Component {
    constructor(props) {
        super(props);
        let keys = [
            'component',
            'stateKey',
            'dataLoader',
        ];
        keys.forEach((key) => {
            this[key] = props[key];
        });
    }

    loadData = (marker) => {
        let _this = this;
        let comp = this.component;
        this.dataLoader.call(comp, marker)
            .then((data) => {
                let oldData = comp.state[_this.stateKey] || {};
                data.list = (oldData.list || []).concat(data.list);
                data._loadState = 2;
                let newState = {};
                newState[_this.stateKey] = data;
                comp.setState(newState);
            });
    };

    doRefresh = (resolve, reject) => {
        let comp = this.component;
        setTimeout(() => {
            comp.state[this.stateKey] = {};
            this.loadData(null);
            resolve();
        }, 1000);
    };

    doLoadMore = (resolve) => {
        let comp = this.component;
        let oldData = comp.state[this.stateKey] || {};
        setTimeout(() => {
            this.loadData(oldData.marker);
            resolve();
        }, 1000);
    };

    render() {
        let _this = this;
        let comp = this.component;
        let data = comp.state[this.stateKey];
        if (!data) {
            data = {
                _loadState: 1,
                hasMore: false,
            };
        }
        return <Tloader
            className="main"
            hideFooter={!_this.props.children}
            autoLoadMore
            onRefresh={_this.doRefresh}
            onLoadMore={_this.doLoadMore}
            hasMore={data.hasMore}
            initializing={data._loadState || 1}
            customNoData={_this.props.customNoData}
        >
            {_this.props.children}
        </Tloader>;
    }
}
