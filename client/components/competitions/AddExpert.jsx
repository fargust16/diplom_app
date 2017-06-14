import React from 'react';
import update from 'react-addons-update';
import moment from 'moment'
import mongoose from 'mongoose';

import './AddExpert.less';

export default class AddCompetition extends React.Component {
	constructor(props){
		super(props);

		const expert = this.props.expert;

		expert

		? 

		this.state = {
			comp_id: this.props.competition.id,
	    	fio: expert.fio,
           	email: expert.email ? expert.email : ''
	    }

		:

		this.state = {
	    	comp_id: this.props.competition.id,
	    	fio: '',
           	email: ''
	    };

	    this.handleOnChangeFIO = this.handleOnChangeFIO.bind(this);
	    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
	    this.handleExpertUpsert = this.handleExpertUpsert.bind(this);
	}

	handleOnChangeFIO(e){
		this.setState({fio: e.target.value});
	}

	handleOnChangeEmail(e){
		this.setState({email: e.target.value});
	}

	handleExpertUpsert(){

		const newExpert = {
        	id: this.props.expert ? this.props.expert.id : mongoose.Types.ObjectId(),
        	comp_id: this.props.competition.id,
            fio: this.state.fio,
            email: this.state.email
        };

		this.props.onExpertUpsert(newExpert);
		this.props.onExpertUpsertCancel();
		this.setState({
			fio: '',
			email: ''
		})
	}

	render(){

		return(
			<div className="AddExpert">
				<div className="AddExpert__edit">
					<label htmlFor='fio' className='AddExpert__field'>ФИО: 
						<input
							type='text'
							id='fio'
							placeholder='Введите ФИО эксперта'
							value={this.state.fio}
							onChange={this.handleOnChangeFIO}
						/>
					</label>
					<label htmlFor='email' className='AddExpert__field'>E-mail: 
						<input
							type='text'
							id='email'
							placeholder='Введите email эксперта'
							value={this.state.email}
							onChange={this.handleOnChangeEmail}
						/>
					</label>
					<button
						className="AddExpert__footer-btnSave"
						onClick={this.handleExpertUpsert}
						disabled={!this.state.fio}
						title='Сохранить'
					>
					Сохранить
					</button>

					<button
						className="AddExpert__footer-btnCancel"
						onClick={this.props.onExpertUpsertCancel}
						title='Отмена'
					>
					Отмена
					</button>
				</div>
			</div>
		)
	}
}