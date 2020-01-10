import React from 'react'
import U from "../../common/U";
import '../../assets/css/page/succ.scss'
import {App} from "../../common";


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {}
        }
    }

    componentDidMount() {
        U.setWXTitle('电签成功');
    }

    render() {

        return <div className='succ-page'>

            <div className='icon'/>
            <div className='tip'>恭喜您电签成功</div>

            <div className='btn-ok' onClick={() => App.go('/')}>进入首页</div>

        </div>

    }
}

