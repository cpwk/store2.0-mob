import React from 'react';
import {Link} from 'react-router-dom';

let to = window.location.hash.split('#')[1];
window.addEventListener('hashchange', (e) => {
    to = window.location.hash.split('#')[1];
});
const NavLink = (props) => <Link
    onClick={() => {
        if (!to || (to && to !== props.to)) {
            to = props.to;
        }
    }} {...props} className={to === props.to ? 'cur' : props.className}
/>;

export default NavLink;
