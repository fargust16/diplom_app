import React from 'react';
import update from 'react-addons-update';
import moment from 'moment'
import mongoose from 'mongoose';
import Reactable from 'reactable';

import './ModerateParticipants.less';

var Table = Reactable.Table,
	Thead = Reactable.Thead,
    Th = Reactable.Th,
    Tr = Reactable.Tr,
    Td = Reactable.Td;


function ConfirmDelete(props) {
	const isPartDelete = props.state.isPartDelete;
	const deletePartId = props.state.deletePartId;

	if (isPartDelete) {
		if(deletePartId == props.participant.id){ 
		return <div className="PartsList-part__footer">
					<span className="PartsList-part__footer-delete_title">Вы уверены?</span>
					<button
						className="PartsList-part__footer-btnDelete"
						onClick={props.handlePartDeleteConfirm.bind(null, deletePartId)}
						title='Удалить'
					>
					Да
					</button>
					<button
						className="PartsList-part__footer-btnDelete"
						onClick={props.handlePartDeleteReject}
						title='Удалить'
					>
					Нет
					</button>
				</div>;
		}
	}
	return <div className="PartsList-part__footer">
				<button
					className="PartsList-part__footer-btnDelete"
					onClick={props.handlePartDelete.bind(null, props.participant.id)}
					title='Удалить'
				>
				Удалить
				</button>
			</div>;
}


export default class ModerateParticipants extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			isPartDelete: false,
			deletePartId: ''
		}

	    this.handlePartAdd = this.handlePartAdd.bind(this);
	    this.handleAddPartCancel = this.handleAddPartCancel.bind(this);

	    this.handlePartDelete = this.handlePartDelete.bind(this);
	    this.handlePartDeleteReject = this.handlePartDeleteReject.bind(this);
	    this.handlePartDeleteConfirm = this.handlePartDeleteConfirm.bind(this);
	}

	handlePartAdd(participant) {   //-----------------------------отправка сообщений на почту, чтобы уведомить пользователя, что его заявка была принята!

		// ---------------------------- !Важно ---------------------- Отправка будет работать только на подтверждённом домене! SPF DKIM! иначе "reject reason unsigned mandrill"

		const part_id = participant.id;
		const part_email = participant.email;
		//const api_key = 'wIzT6Y5A1Px58qsnsNv5eA'; // api-key  смотреть на сайте https://mandrill.com/signup/

		const that = this;

		/*let xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.open('POST', 'https://mandrillapp.com/api/1.0/messages/send.json');
		xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4) {
		        if(xmlhttp.status == 200) {
		        	alert('Mail sended!')
		        	that.props.onPartConfirmed(part_id)
		        }
		        else if(xmlhttp.status == 500) alert('Check apikey')
		        else alert('Request error');
		    }
		}
		xmlhttp.send(JSON.stringify({'key': api_key,
		   'message': {
		       'from_email': 'mr.sociofob@gmail.com',
		       'to': [{'email': part_email, 'type': 'to'}],
		       'autotext': 'true',
		       'subject': 'Yeah!',
		       'html': '<h1>Ваша заявка на конкурс была принята!</h1>'
		    }}));
		*/

		that.props.onPartConfirmed(part_id)
        
    }

    handleAddPartCancel(){
    	this.props.onPartUpsertClick();
    }

    handlePartDeleteConfirm(part_id){
    	this.props.onPartDelete(part_id);
    }

    handlePartDeleteReject(){
    	this.setState({isPartDelete: false, deletePartId: ''})
    }

    handlePartDelete(part_id){
		this.setState({isPartDelete: true, deletePartId: part_id})
    }


	render(){

		const parts = this.props.participants;
		let partsTemp = [];
		let j = 0;
		
		for (var i = parts.length - 1; i >= 0; i--) {
			if(parts[i].competition == this.props.competition.name) {
				partsTemp[j] = {};
				for(let key in parts[i]){
					partsTemp[j][key] = parts[i][key];
				}

				if(parts[i].confirmed) partsTemp[j].confirmed = 'Подтверждён';
				else partsTemp[j].confirmed = <div className="PartsList-part__footer">
												<button
													className="PartsList-part__footer-btnConfirm"
													onClick={this.handlePartAdd.bind(null, parts[i])}
													title='Подтвердить'
												>
												Подтвердить
												</button>
											</div>;
				partsTemp[j].removeBtn = <ConfirmDelete 
											state={this.state}
											handlePartDelete={this.handlePartDelete}
											handlePartDeleteConfirm={this.handlePartDeleteConfirm}
											handlePartDeleteReject={this.handlePartDeleteReject}
											participant={parts[i]}
										/>;
			j++;	
			}
		}

		return(
			<div className="PartsList">
			<Table cellSpacing="2px" className="table" data={partsTemp}  
			sortable={[
			    'id',
			    'confirmed'
			]}
			defaultSort={{column: 'id', direction: 'asc'}}
			itemsPerPage={3} pageButtonLimit={10}
			previousPageLabel='<<'
			nextPageLabel='>>'
			>
			<Thead>
				<Th column="preview">
	        		<strong className="preview-header">Превью</strong>
	        	</Th>
	        	<Th column="fio">
	        		<strong className="fio-header">Ф И О</strong>
	        	</Th>
	        	<Th column="work_name">
	        		<strong className="work_name-header">Название работы</strong>
	        	</Th>
	        	<Th column="description">
	        		<strong className="description-header">Описание</strong>
	        	</Th>
	        	<Th column="nomination">
	        		<strong className="nomination-header">Номинация</strong>
	        	</Th>
	        	<Th column="email">
	        		<strong className="email-header">E-mail</strong>
	        	</Th>
	        	<Th column="confirmed">
	        		<strong className="confirmed-header">Статус</strong>
	        	</Th>
	        	<Th column="removeBtn">
	        		<strong className="confirmed-header">Удалить</strong>
	        	</Th>
	        </Thead>
			</Table>

				<div className='PartsList-footer'>
					<button
						className="PartsList-footer-btnCancel"
						onClick={this.handleAddPartCancel}
						title='Готово'
					>
					Готово
					</button>
				</div>
			</div>
		)
	}
}