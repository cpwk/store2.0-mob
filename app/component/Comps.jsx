import React from 'react'
import PropTypes from 'prop-types';
import '../assets/css/comps.scss'
import {Carousel} from 'antd-mobile';
import {App} from "../common";
import Draggable from 'react-draggable';

class NoData extends React.Component {
    static propTypes = {
        loaded: PropTypes.bool,//
        type: PropTypes.string,
        loadTime: PropTypes.number,
        initContent: PropTypes.node,
    };

    state = {
        type: this.props.type || '',
        loaded: this.props.loaded || false,
        loadTime: this.props.loadTime || 15000,
        initContent: this.props.initContent,
    };

    componentWillReceiveProps(newProps) {
        if (newProps.loaded !== undefined) {
            this.setState({
                loaded: newProps.loaded,
            });
        }
    }

    componentDidMount() {
        this.loadedTimer = setTimeout(() => {
            this.setState({
                loaded: true,
            });
        }, this.state.loadTime);
        this.loadTimer = setTimeout(() => {
            this.setState({
                load: true,
            });
        }, 60);
    }

    componentWillUnmount() {
        clearTimeout(this.loadedTimer);
        clearTimeout(this.loadTimer);
    }

    render() {
        let {loaded, initContent, load} = this.state;
        if (loaded) {
            return initContent ||
                <div className="nodata"><img src={require('../assets/image/common/nodata.png')}/><p>暂无内容</p></div>;
        } else {
            return load ? <LoadMore/> : null;
        }
    }
}

class LoadMore extends React.Component {
    render() {
        return (
            <div className="load-container center-block margin-vertical-lg">
                <div className="load-1"></div>
                <div className="load-2"></div>
                <div className="load-3"></div>
                <div className="load-4"></div>
                <div className="load-5"></div>
            </div>
        );
    }
}

class Banners extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list
        };
    }

    render() {

        let {list = []} = this.state;

        return <Carousel autoplay={list.length > 1} dots={list.length > 0} infinite className="banner-carousel">
            {list.map((banner, index) => {
                return <div key={index}><img src={banner.img}/></div>;
            })}
        </Carousel>
    }
}

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({list: nextProps.list});
    }

    render() {

        let {list = []} = this.state;

        return <ul className="ul-product-list">
            {list.map((product, index) => {
                let {id, img, name, price} = product;
                return <li key={index} onClick={() => App.go(`/product-detail/${id}`)}>
                    <img src={img} className='img'/>
                    <div className='info'>
                        <div className='title'>{name}</div>
                        <div className='price'>¥{price}</div>
                    </div>
                </li>
            })}

            <div className='clearfix'/>
        </ul>
    }
}

class HomeIcon extends React.Component {

    render() {
        return <Draggable bounds="body">
            <div className="float-home-icon" onClick={() => App.go('/')}/>
        </Draggable>;
    }
}

class CrossTitle extends React.Component {

    render() {
        return <div className="cross-title">
            <div className="block">
                <div className="txt">{this.props.title}</div>
            </div>
        </div>;
    }
}

class ShareGuide extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
    }


    render() {

        let {visible} = this.state;

        if (visible) {
            return <div className='guide-modal' onClick={() => {
                this.setState({visible: false});
                document.body.style.overflow = 'auto';
            }}>
                <div className='bg'/>
                <img src={require('../assets/image/common/guide_share.png')} className='share'/>
            </div>
        } else {
            return <React.Fragment/>
        }
    }
}


export {NoData, LoadMore, Banners, ProductList, HomeIcon, CrossTitle, ShareGuide}