import React from 'react';
import { NavLink } from 'react-router-dom'

import './Footer.less';

class Footer extends React.Component {

	constructor(props) {
	    super(props);
	}

  	render() {

		return(
			<div className="Footer">
				<ul className="Footer__nav">
				  <li><NavLink activeClassName="active" exact to='/' className="Footer__nav_h2" >Логотип</NavLink></li>
		          <li><NavLink activeClassName="active" to='#info'>info@mail.ru</NavLink></li>
		        </ul>
			</div>
		)
	}
}

export default Footer;
