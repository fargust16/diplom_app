import React from 'react';
import update from 'react-addons-update';
import moment from 'moment'
import mongoose from 'mongoose';

import './AddParticipant.less';

export default class AddParticipant extends React.Component {
	constructor(props){
		super(props);

		this.state = {
	    	fio: '',
            competition: this.props.competition.name,
            nomination: 'default',
            work_name: '',
            desc: '',
            preview: '',
            email: ''
	    };

	    this.handleOnChangeFIO = this.handleOnChangeFIO.bind(this);
	    this.handleOnChangeDesc = this.handleOnChangeDesc.bind(this);
	    this.handleOnChangeNomination = this.handleOnChangeNomination.bind(this);
	    this.handleOnChangeWorkName = this.handleOnChangeWorkName.bind(this);
	    this.handleOnChangePreview = this.handleOnChangePreview.bind(this);
	    this.handlePartAdd = this.handlePartAdd.bind(this);
	    this.handleAddPartCancel = this.handleAddPartCancel.bind(this);
	    this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
	}

	handleOnChangeFIO(e){
		this.setState({fio: e.target.value});
	}

	handleOnChangeDesc(e){
		this.setState({desc: e.target.value});
	}

	handleOnChangeNomination(e){
		this.setState({nomination: e.target.value});
	}

	handleOnChangeWorkName(e){
		this.setState({work_name: e.target.value});
	}

	handleOnChangePreview(e){
		this.setState({preview: e.target.value});
	}

	handleOnChangeEmail(e) {
		this.setState({email: e.target.value});
	}

	handlePartAdd() {
        const newPart = {
        	id: mongoose.Types.ObjectId(),
            fio: this.state.fio,
            competition: this.state.competition,
            desc: this.state.desc,
            nomination: this.state.nomination,
            work_name: this.state.work_name,
            preview: this.state.preview,
            email: this.state.email
        };

        this.props.onPartUpsert(newPart);
        this.props.onPartUpsertClick();
        this.setState({ fio: '', nomination: 'default', competition: '' , work_name: '', desc: '', preview: '', email: ''});
    }

    handleAddPartCancel(){
    	this.props.onPartUpsertClick();
    }

	render(){

		return(
			<div className="Competition AddPart">
				<h4 className='Competition__name'>Название конкурса: {this.props.competition.name}</h4>

				<label htmlFor='fio' className='AddPart__field'>ФИО 
					<input
						type='text'
						id='fio'
						placeholder='Введите ФИО участника'
						value={this.state.fio}
						onChange={this.handleOnChangeFIO}
					/>
				</label>

				<label htmlFor='work_name' className='AddPart__field'>Название работы
					<input
						type='text'
						id='work_name'
						placeholder='Введите название работы'
						value={this.state.work_name}
						onChange={this.handleOnChangeWorkName}
					/>
				</label>

				<label htmlFor='desc' className='AddPart__field'>Описание 
					<textarea
						id='desc'
						className='AddPart__desc'
						onChange={this.handleOnChangeDesc}
						value={this.state.desc}
					>
					</textarea>
				</label>

				<label htmlFor='preview' className='AddPart__field'>Выберите номинацию
					<br /><select 
						name="nomination"
						onChange={this.handleOnChangeNomination}
						value={this.state.nomination}
					>
					<option value='default' disabled>Выберите номинацию</option>
				    {this.props.competition.nominates.map ((nomination, i) =>
				    	<option
				    		key= {i}
				    		value={nomination}
				    	>
				    		{nomination}
				    	</option>
				    )}
					</select>
				</label>

				<label htmlFor='preview' className='AddPart__field'>Ссылка на работу в Интернете
					<input
						type='text'
						id='preview'
						placeholder='Вставьте ссылку на вашу работу'
						value={this.state.preview}
						onChange={this.handleOnChangePreview}
					/>
				</label>

				<label htmlFor='email' className='AddPart__field'>E-mail 
					<input
						type='text'
						id='email'
						placeholder='Введите ваш e-mail '
						value={this.state.email}
						onChange={this.handleOnChangeEmail}
					/>
				</label>
				
				<div className='AddPart__footer'>
					<button
						className="AddPart__footer-button Save"
						onClick={this.handlePartAdd}
						disabled={!this.state.fio || !this.state.work_name || !this.state.nomination}
						title='Сохранить'
					>
					Сохранить
					</button>

					<button
						className="AddPart__footer-button Cancel"
						onClick={this.handleAddPartCancel}
						title='Отмена'
					>
					Отмена
					</button>
				</div>
			</div>
		)
	}
}