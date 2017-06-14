import React from 'react';
import mongoose from 'mongoose'
import moment from 'moment'

import './Expert.less'


export default class Expert extends React.Component {

	constructor(props){
		super(props);

		this.handleExpertDelete = this.handleExpertDelete.bind(this);
		this.handleRecieveConfirm = this.handleRecieveConfirm.bind(this);
		this.handleExpertEdit = this.handleExpertEdit.bind(this);
		this.handleChangeText = this.handleChangeText.bind(this);
	}

	handleExpertDelete(expert_id){
		this.props.onExpertDelete(expert_id)
	}

	handleExpertEdit(expert_id){
		this.props.onExpertEdit(expert_id)
	}

	handleChangeText(text, e){
		e.target.innerHTML = text;
	}

	handleRecieveConfirm(expert){

		const expert_email = expert.email;

		this.props.onReqConfSend(expert.id);
		alert("Приглашение отправлено!")
		/*const api_key = 'wIzT6Y5A1Px58qsnsNv5eA'; // api-key  смотреть на сайте https://mandrill.com/signup/

		let xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.open('POST', 'https://mandrillapp.com/api/1.0/messages/send.json');
		xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4) {
		        if(xmlhttp.status == 200) {
		        	alert('Mail sended!');
		        }
		        else if(xmlhttp.status == 500) alert('Check apikey')
		        else alert('Request error');
		    }
		}
		xmlhttp.send(JSON.stringify({'key': api_key,
		   'message': {
		       'from_email': 'mr.sociofob@gmail.com',
		       'to': [{'email': expert_email, 'type': 'to'}],
		       'autotext': 'true',
		       'subject': 'Yeah!',
		       'html': '<h1>Тут будет GET-запрос на подтверждение участия</h1>'
		}}));
		*/
	}

	render(){
		const expert = this.props.expert;

		let button = null;
		if(expert.confirmed){
			button = <h2 className="Expert-confirmed">Подтверждён</h2>;
		} else if(expert.recConfirm){
			button = <button
						className="Expert-btn SendConf"
						onMouseOver={this.handleChangeText.bind(this, 'Отправить ещё')}
						onMouseOut={this.handleChangeText.bind(this, 'Отправлено')}
						onClick={this.handleRecieveConfirm.bind(null, expert)}
					>
					Отправлено
					</button>;
		} else {
			button = <button
						className="Expert-btn SendConf"
						onClick={this.handleRecieveConfirm.bind(null, expert)}
					>
					Отправить
					</button>;
		}

		return(
			<div className="Expert">
				<span className="Expert-fio"><strong></strong>{expert.fio}</span>
				<span className="Expert-email"><strong></strong>{expert.email}</span>
				{button}
				<button
					className="Expert-btn Edit"
					onClick={this.handleExpertEdit.bind(null, expert.id)}
				>
				Редактировать
				</button>
				<button
					className="Expert-btn Delete"
					onClick={this.handleExpertDelete.bind(null, expert.id)}
				>
				Удалить
				</button>
			</div>
		);
	}

}