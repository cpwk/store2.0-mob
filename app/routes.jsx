import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'

import Signin from './component/page/Signin';

import HomeWrap from './component/HomeWrap';

import ServiceCenter from './component/page/ServiceCenter';
import ProductDetail from './component/page/ProductDetail';

import Profile from './component/page/Profile';
import ProductShares from './component/page/ProductShares';

import Payments from './component/page/Payments';
import CardUpload from './component/page/CardUpload';
import InfoEdit from './component/page/InfoEdit';
import AgreementPreview from './component/page/AgreementPreview';
import SignatureDraw from './component/page/SignatureDraw';
import Succ from './component/page/Succ';

const routes = (
    <HashRouter>
        <Switch>

            <Redirect exact from='/' to='/profile'/>

            <Route path='/signin' exact component={Signin}/>

            <Route path='/product-detail/:id' component={ProductDetail}/>
            <Route path='/product-shares' component={ProductShares}/>

            <Route path='/payments' component={Payments}/>
            <Route path='/card-upload' component={CardUpload}/>
            <Route path='/info-edit' component={InfoEdit}/>
            <Route path='/agreement-preview' component={AgreementPreview}/>
            <Route path='/signature-draw' component={SignatureDraw}/>
            <Route path='/succ' component={Succ}/>

            <Route path='/' children={() => (
                <HomeWrap>
                    <Switch>

                        <Route path='/service' component={ServiceCenter}/>

                        <Route path='/profile' component={Profile}/>

                    </Switch>
                </HomeWrap>
            )}>
            </Route>

        </Switch>
    </HashRouter>
);


export default routes;
