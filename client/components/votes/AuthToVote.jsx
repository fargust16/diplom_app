import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import { NavLink } from 'react-router-dom'

import './AuthToVote.less';

class AuthToVote extends React.Component {

	constructor(props) {
	    super(props);

	    this.handleLoginChange = this.handleLoginChange.bind(this);
	    this.handleShowError = this.handleShowError.bind(this);
	    this.handlePasswordChange = this.handlePasswordChange.bind(this);

	    this.handleAuthClick = this.handleAuthClick.bind(this);
	}

	componentWillMount() {
		console.log('willMount Auth')
        const { cookies } = this.props; 

	    cookies.remove('expertCook');
        cookies.remove('partsAddedCookie');
        cookies.remove('voteMarksCookie');
        cookies.remove('expertCookTime');

		this.state = {
			login: '',
			password: '',
			showError: true,
			loader: false,
			error: true
		}
    }

    handleLoginChange(e) {
    	this.setState({
    		login: e.target.value,
    		showError: false
    	});
    }

    handlePasswordChange(e) {
    	this.setState({
    		password: e.target.value,
    		showError: false
    	})
    }

    handleShowError() {
    	if(this.props.error && this.state.error) {
    		this.setState({
    			showError: true,
    			loader: false
    		});
    	}
    }

    handleAuthClick(){
    	const login = this.state.login;
    	const pswd = this.state.password;
    	if(login == '' || pswd == '') return;

	    this.setState({loader: true});
	    this.props.onExpertLogin({login: login, pswd: pswd});

	    setTimeout(this.handleShowError, 1000);
    }

  	render() {
  		const error = this.props.error;
  		let errorMsg = null;
  		let loader = null;

  		if(this.state.loader === true) {
  			
  			loader = <div className="LoadResult">
  						<div id="floatingCirclesG">
							<div className="f_circleG" id="frotateG_01"></div>
							<div className="f_circleG" id="frotateG_02"></div>
							<div className="f_circleG" id="frotateG_03"></div>
							<div className="f_circleG" id="frotateG_04"></div>
							<div className="f_circleG" id="frotateG_05"></div>
							<div className="f_circleG" id="frotateG_06"></div>
							<div className="f_circleG" id="frotateG_07"></div>
							<div className="f_circleG" id="frotateG_08"></div>
						</div>
					</div>;
  		}

  		if(error === true) errorMsg = <span className={this.state.showError ? 'Authorization-form__error' : 'Authorization-form__error hideError'}>Неверное имя пользователя или пароль!</span>;

		return(
			<div className="Authorization">
				
				<h1 className='Authorization-h1'>Вход</h1>
				<fieldset className='Authorization-form'>
					{errorMsg}
					{loader}
	                <input 
	                	className='Authorization-form__login' 
	                	type="email" 
	                	required 
	                	placeholder="Логин"
	                	value={this.state.login}
	                	onChange={this.handleLoginChange}
	                />
	                <input 
	                	className='Authorization-form__password' 
	                	type="password" 
	                	required 
	                	placeholder="Пароль"
	                	value={this.state.password}
	                	onChange={this.handlePasswordChange}
	                />
	                <button
		                className='Authorization-form__button-auth'
		                onClick={this.handleAuthClick}
		                disabled={this.state.loader}
	                >
	                войти
	                </button>
		        </fieldset>
			</div>
		)
	}
}

export default withCookies(AuthToVote);