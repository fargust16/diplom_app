import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';
import { NavLink } from 'react-router-dom'

import './Header.less';

class Header extends React.Component {

	static get propTypes() {
		cookies: instanceOf(Cookies).isRequired
	}

	constructor(props) {
	    super(props);

	    this.handleRuleSwitch = this.handleRuleSwitch.bind(this);
	    this.handleVoteStart = this.handleVoteStart.bind(this);
	}

	componentWillMount() {
		const { cookies } = this.props;

	    this.state = {
	      rules: cookies.get('rulesInCook') || '',
	      voteStart: cookies.get('voteStart') || ''
	    };
    }

    handleVoteStart(stateV) {
		const { cookies } = this.props;
    	this.setState({voteStart: stateV})

    	let d = new Date();
        let minutes = 360;
        d.setTime(d.getTime() + (minutes*60*1000));

        cookies.set('voteStart', stateV, { path: '/', expires: d });
    }

    handleRuleSwitch(e) {
	    const { cookies } = this.props;
	    let d = new Date();
	    let minutes = 10;
  		d.setTime(d.getTime() + (minutes*60*1000));

	    const rulesEl = e.target.title.toLowerCase()

	    if(rulesEl == 'организатор'){
	    	this.setState({rules: 'sponsor'})
	    	cookies.set('rulesInCook', 'sponsor', { path: '/', expires: d });
	    } else {
	    	this.setState({rules: 'user'})
	    	cookies.set('rulesInCook', 'user', { path: '/', expires: d });
	    }

	    location.reload();
	}

  	render() {
  		//console.log(this.state.voteStart)
  		if(this.state.voteStart == 'true') {
  			return (
  				<div className="Header-vote">
					<div className="Header-content__vote">
						<ul className="Header-content__vote-nav">
						  <NavLink activeClassName="active" exact to='/' onClick={this.handleVoteStart.bind(null, 'false')}>Логотип</NavLink>
				          <li><NavLink activeClassName="active" to='#help'>помощь</NavLink></li>
				        </ul>
					</div>
				</div>
  			)
  		}
  		else {
  			return(
				<div className="Header">
					<div className="Header-content">
						<ul className="Header-content__nav">
						  <li><NavLink activeClassName="active" exact to='/' onClick={this.handleVoteStart.bind(null, 'false')}>Логотип</NavLink></li>
				          <li><NavLink activeClassName="active" to='/competitions'>Конкурсы</NavLink></li>
				          <li><NavLink activeClassName="active" to='/allVotes' onClick={this.handleVoteStart.bind(null, 'true')}>Голосования</NavLink></li>
				          <li><NavLink activeClassName="active" to='/members1'>Вручную</NavLink></li>
				          <li><NavLink activeClassName="active" to='/resultsVote'>Результаты</NavLink></li>
				        </ul>
				        <div className="Header-content__switcher">
							<button 
								className="Header-content__switcher-button"
								onClick={this.handleRuleSwitch}
								title='организатор'
								disabled={this.state.rules == 'sponsor'}
							>
							Орг
							</button>

							<button 
								className="Header-content__switcher-button"
								onClick={this.handleRuleSwitch}
								title='пользователь'
								disabled={this.state.rules != 'sponsor'}
							>
							Юз
							</button>
						</div>
					</div>
				</div>
			)
  		}
	}
}

export default withCookies(Header);
