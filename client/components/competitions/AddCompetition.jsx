import React from 'react';
import createReactClass from 'create-react-class';
import update from 'react-addons-update';
import moment from 'moment'
import mongoose from 'mongoose';

import './AddCompetition.less';

export default class AddCompetition extends React.Component {
	constructor(props){
		super(props);

		const competition = this.props.competition;

		competition

		? 

		this.state = {
	    	name: competition.name,
            desc: competition.description ? competition.description : '',
            nominates: competition.nominates ? competition.nominates : [],
            dateOfBegin: moment(competition.dateOfBegin).format('YYYY-MM-DD'),
            daysToVote: competition.daysToVote ? competition.daysToVote : 2,
            stages: competition.stages ? competition.stages : [{stageName: ''}],
            nomCount: competition.nominates.length > 0 ? competition.nominates.length : 1,
            stageCount: competition.stages.length > 0 ? competition.stages.length : 1
	    }

		:

		this.state = {
	    	name: '',
            desc: '',
            nominates: [],
            dateOfBegin: '',
            daysToVote: 2,
            stages: [{stageName: ''}],
            nomCount: 1,
            stageCount: 1
	    };
	}
	
	_addNomField() {
		this.setState({ nomCount: this.state.nomCount + 1 });
	}

	_delNomField(e) {

		if(this.state.nomCount == 1 ) return;

		this.setState({ nomCount: this.state.nomCount - 1});

		let i = e.target.dataset.setId;
		const nominates = this.state.nominates;
	    nominates.splice(i, 1);

	    // update state
	    this.setState({
	        nominates,
	    });
	}

	_addStageField() {
		if(this.state.stageCount == 2) return;
		let stagesTemp = this.state.stages;
		stagesTemp[this.state.stageCount] = {"stageName": ''};

		this.setState({ 
			stageCount: this.state.stageCount + 1,
			stages: stagesTemp
		});
	}

	_delStageField(e) {

		if(this.state.stageCount == 1) return;

		this.setState({ stageCount: this.state.stageCount - 1});

		let i = e.target.dataset.setId;
		const stages = this.state.stages;
	    stages.splice(i, 1);

	    // update state
	    this.setState({
	        stages,
	    });
	}

	handleOnChangeName(e){
		this.setState({name: e.target.value});
	}

	handleOnChangeDesc(e){
		this.setState({desc: e.target.value});
	}

	handleOnChangeNominates(e){

		let i = e.target.dataset.setId;

	    const nominates = this.state.nominates;
	    nominates[i] = e.target.value;

	    // update state
	    this.setState({
	        nominates,
	    });
	}

	handleOnChangeStages(e){

		let i = e.target.dataset.setId;

	    const stages = this.state.stages;
	    stages[i] = { "stageName": e.target.value };

	    // update state
	    this.setState({
	        stages,
	    });
	}

	handleOnChangeDateOfBegin(e){
		this.setState({dateOfBegin: e.target.value});
	}

	handleOnChangeDaysToVote(e){
		this.setState({daysToVote: e.target.value});
	}

	handleCompAdd() {

		const comp = this.props.competition;

        const newComp = {
        	id: comp ? comp.id : mongoose.Types.ObjectId(),
            name: this.state.name,
            desc: this.state.desc,
            nominates: this.state.nominates,
            dateOfBegin: this.state.dateOfBegin,
            daysToVote: this.state.daysToVote,
            stages: this.state.stages
        };

        this.props.onCompUpsert(newComp);
        this.props.onCompUpsertClick();
        this.setState({ 
        	name: '', 
        	desc: '', 
        	nominates: [],
        	dateOfBegin: '', 
        	daysToVote: 2, 
        	stages: [{stageName: ''}], 
        	nomCount: 1,
        	stageCount: 1
        });
    }

    handleCompCancel(){
    	this.props.onCompUpsertClick();
    }

	render(){

		let nominates = [];
		let stages = [];

	    for (let i = 0; i < this.state.nomCount; i++) {
	    	nominates.push(
	    		<p key={i}>
	    		<input
		    		type='text' 
		    		className='AddComp__nominates' 
		    		placeholder='Введите название номинации' 
		    		value={this.state.nominates[i]} 
		    		onChange={this.handleOnChangeNominates.bind(this)}
		    		data-set-id={i}	
	    		/>
	    		<span onClick={this._addNomField.bind(this)}> +</span><span onClick={this._delNomField.bind(this)} data-set-id={i}> -</span>
	    		</p>
	    	);
	    }

	    for (let i = 0; i < this.state.stageCount; i++) {
	    	stages.push(
	    		<p key={i}>
	    		<input
		    		type='text' 
		    		className='AddComp__nominates' 
		    		placeholder='Введите название стадии'
		    		value={this.state.stages[i].stageName} 
		    		onChange={this.handleOnChangeStages.bind(this)}
		    		data-set-id={i}	
	    		/>
	    		<span onClick={this._addStageField.bind(this)}> +</span><span onClick={this._delStageField.bind(this)} data-set-id={i}> -</span>
	    		</p>
	    	);
	    }

		return(
			<div className="Competition AddComp">
				<label htmlFor='name' className='AddComp__field'>Название: 
					<input
						type='text'
						id='name'
						placeholder='Введите название'
						value={this.state.name}
						onChange={this.handleOnChangeName.bind(this)}
					/>
				</label>
				<label htmlFor='desc' className='AddComp__field'>Описание: 
					<p/>
					<textarea
						id='desc'
						className='AddComp__desc'
						onChange={this.handleOnChangeDesc.bind(this)}
						value={this.state.desc}
					>
					</textarea>
				</label>
				<fieldset className='AddComp__chField'>
					<legend>Номинации</legend>
					{nominates}
				</fieldset>

				<label htmlFor='dateOfBegin' className='AddComp__field'>Дата начала голосования: 
					<input
						type='date'
						id='dateOfBegin'
						className='AddComp__dateOfBegin'
						value={this.state.dateOfBegin}
						onChange={this.handleOnChangeDateOfBegin.bind(this)}
					/>
				</label>

				<label htmlFor='daysToVote' className='AddComp__field'>Количество дней на голосование: {this.state.daysToVote}
					<input
						type='range'
						min='2'
						max='14'
						step='1'
						id='daysToVote'
						className='AddComp__daysToVote'
						placeholder='Введите название номинации'
						value={this.state.daysToVote}
						onChange={this.handleOnChangeDaysToVote.bind(this)}
					/>
				</label>

				<fieldset className='AddComp__chField'>
					<legend>Стадии голосования</legend>
					{stages}
				</fieldset>

				<div className='AddComp__footer'>
					<button
						className="AddComp__button Save"
						onClick={this.handleCompAdd.bind(this)}
						disabled={!this.state.name || !this.state.dateOfBegin}
						title='Сохранить'
					>
					Сохранить
					</button>

					<button
						className="AddComp__button Cancel"
						onClick={this.handleCompCancel.bind(this)}
						title='Отмена'
					>
					Отмена
					</button>
				</div>
			</div>
		)
	}
}