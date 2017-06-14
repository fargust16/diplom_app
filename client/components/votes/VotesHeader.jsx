import React from 'react';
import { NavLink } from 'react-router-dom'

import './VotesHeader.less';

class VotesHeader extends React.Component {

	constructor(props) {
	    super(props)

	    this.handleExit = this.handleExit.bind(this);
	}

    handleExit() {
    	this.props.onExitClick();
    }

  	render() {

		return(
			<div className="Vote-header">
	            <div className="Vote-header__left">
	                <h2>{this.props.compName}</h2>
	            </div>	
	            <div className="Vote-header__right">			
		            <ul className="Vote-header__right-nav">
					  <li><NavLink activeClassName="active" to='#Attention' >Напомнить</NavLink></li>
			          <li><NavLink activeClassName="active" to='#Help'>Помощь</NavLink></li>
			          <li><NavLink activeClassName="active" to='#Exit' onClick={this.handleExit}>Выход</NavLink></li>
			        </ul>
			    </div>
			</div>
		)
	}
}

export default VotesHeader;