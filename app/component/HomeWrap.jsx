import React from 'react';
import NavLink from '../common/NavLink.jsx'

import '../assets/css/common.scss'
import '../assets/css/page/home-wrap.scss'
import {Utils} from "../common";

export default class HomeWrap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                Utils.common.scrollTop();
            }, 500);
        });
    }

    render() {
        return <div className='home-wrap'>
            <div className='inner-page'>
                {this.props.children}
            </div>
            <div className="menu-btm">
                <ul>
                    <li>
                        <NavLink to="/service">
                            <div className="icon"/>
                            <p>服务中心</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile">
                            <div className="icon"/>
                            <p>个人中心</p>
                        </NavLink>
                    </li>

                </ul>
            </div>

        </div>
    }
}