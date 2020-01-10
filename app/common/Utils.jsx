import React from 'react';
import ReactDOM from 'react-dom';
import {ShareGuide} from "../component/Comps";
import base64decode from "./base64Decode";

let Utils = (function () {

    let _setCurrentPage = (key, pageno) => {
        sessionStorage.setItem(key, pageno);
    };

    let _getCurrentPage = (key) => {
        return sessionStorage.getItem(key) ? parseInt(sessionStorage.getItem(key)) : 1
    };

    let common = (() => {
        let closeModalContainer = (id_div) => {
            let e = document.getElementById(id_div);
            if (e) {
                document.body.removeChild(e);
            }
        };

        let createModalContainer = (id_div) => {
            //强制清理同名div，render会重复创建modal
            closeModalContainer(id_div);
            let div = document.createElement('div');
            div.setAttribute('id', id_div);
            document.body.appendChild(div);
            return div;
        };

        let scrollTop = function () {

            let x = document.body.scrollTop || document.documentElement.scrollTop;
            let timer = setInterval(function () {
                x = x - 100;
                if (x < 100) {
                    x = 0;
                    window.scrollTo(x, x);
                    clearInterval(timer);
                }
                window.scrollTo(x, x);
            }, 20);
        };

        return {
            closeModalContainer, createModalContainer, scrollTop
        }
    })();

    let guide = (() => {
        let shareGuide = () => {
            let div = document.createElement('div');
            document.body.appendChild(div);
            ReactDOM.render(<ShareGuide/>, div);
            document.body.style.overflow = 'hidden';
        };

        return {shareGuide}

    })();

    let company = (() => {

        let getCompanyIdFromUrl = () => {
            let url = window.location.pathname;
            let offset = url.indexOf('/');
            let offset2 = url.indexOf('?', offset + 1);
            if (offset2 === -1) {
                offset2 = url.indexOf('#', offset + 1);
                if (offset2 === -1) {
                    offset2 = url.length;
                }
            }
            let base64 = url.substring(offset + 1, offset2);
            return base64decode(base64);
        };

        return {getCompanyIdFromUrl}

    })();

    let mobile = /^1[3456789]\d{9}$/;

    return {
        common, guide, company, mobile
    };

})();

export default Utils;
