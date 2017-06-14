import React from 'react';
import createReactClass from 'create-react-class';

import Competition from './Competition.jsx';
import AddCompetition from './AddCompetition.jsx';
import AddParticipant from './AddParticipant.jsx';
import ModerateParticipants from './ModerateParticipants.jsx'

import './CompetitionsList.less'

//---------------------------------создаём компоненты, которые будут отображаться в зависимости от состояния системы

function AddCompetitionEl(props) {
	return <AddCompetition competition={props.competition} onCompUpsert={props.onCompUpsert} onCompUpsertClick={props.onCompUpsertClick}/>;
}

function PartModeration(props) {
	return <ModerateParticipants 
				competition={props.competition} 
				participants={props.participants} 

				onPartConfirmed={props.onPartConfirmed} 
				onPartUpsertClick={props.onPartUpsertClick}
				onPartDelete={props.onPartDelete}
			/>;
}

function ViewCompetition(props) {
	return <Competition
				competition={props.competition}
				participants={props.participants}
				experts={props.experts}

				onCompDelete={props.onCompDelete}
				onCompUpdate={props.onCompUpdate}
				onCompUpsert={props.onCompUpsert}
				onVoteStart={props.onVoteStart}

				onExpertUpsert={props.onExpertUpsert}
				onReqConfSend={props.onReqConfSend}
				onExpertDelete={props.onExpertDelete}

				onModerate={props.onModerate}
			/>;
}

// --------------------------------------функция, в которой объединяются созданные ранее компоненты и отрисовываются

function CompetitionsListView(props) {
	const isPartModerate = props.state.isPartModerate;
	const isCompUpsert = props.state.isCompUpsert;
	const compUpdateId = props.state.compUpdateId;

	if (isPartModerate) {
		if(compUpdateId == props.competition.id){            //------------- замена обычного отображения на модерацию участников
			return <PartModeration 
						competition={props.competition} 
						participants={props.participants} 

						onPartConfirmed={props.onPartsModerate} 
						onPartUpsertClick={props.onCompUpsertClick}
						onPartDelete={props.onPartDelete}
					/>;
		}
	}
	else if(isCompUpsert) {
		if(compUpdateId == props.competition.id){              //------------- замена обычного отображения на редактирование конкурсов
			return <AddCompetitionEl 
						competition={props.competition} 

						onCompUpsert={props.onCompUpsert} 
						onCompUpsertClick={props.onCompUpsertClick} 
					/>;
		}
	}
	return <ViewCompetition                            //------------- иначе вывод простого отображения блока конкурса
				competition={props.competition}
				participants={props.participants}
				experts={props.experts}

				onCompDelete={props.onCompDelete}
				onCompUpdate={props.onCompUpdate}
				onCompUpsert={props.onCompUpsert}
				onVoteStart={props.onVoteStart}

				onExpertUpsert={props.onExpertUpsert}
				onReqConfSend={props.onReqConfSend}
				onExpertDelete={props.onExpertDelete}

				onModerate={props.onModerate}
	 		/>;
}

//--------------------------------------------основной класс компонента

class CompetitionsList extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			isCompUpsert: false,
			isPartModerate: false,
			compUpdateId: ''
		};

		this.handleCompUpdate = this.handleCompUpdate.bind(this);
		this.handleCompUpsert = this.handleCompUpsert.bind(this);
		this.handleCompCancel = this.handleCompCancel.bind(this);
		this.handleCompAppUpsert = this.handleCompAppUpsert.bind(this);	

		this.handlePartsModerate = this.handlePartsModerate.bind(this);	
		this.handlePartConfirmed = this.handlePartConfirmed.bind(this);	
		this.handlePartDelete = this.handlePartDelete.bind(this);	

	}

    handleCompUpdate(data) {
    	this.setState({
    		isPartModerate: false, 
    		isCompUpsert: true, 
    		compUpdateId: data
    	})
    }

    handleCompUpsert(){
    	this.setState({
    		isPartModerate: false, 
    		isCompUpsert: true, 
    		compUpdateId: ''
    	})
    }

    handlePartsModerate(data) {
    	this.setState({
    		isPartModerate: true, 
    		isCompUpsert: false, 
    		compUpdateId: data.id
    	})
    }

    handleCompCancel() {
		this.setState({
			isPartModerate: false, 
			isCompUpsert: false, 
			compUpdateId: ''
		})
    }

    handleCompAppUpsert(data){
    	this.props.onAppCompUpsert(data)
    }

    handlePartConfirmed(part_id) {
    	this.props.onPartConfirmed(part_id)
    }

    handlePartDelete(part_id) {
    	this.props.onPartDelete(part_id)
    }

	render() {

		let button = null;

	    if (this.state.isCompUpsert && this.state.compUpdateId == '') {             // ---------------если была нажата кнопка добавить конкурс, то открывается чистая форма
	      button = <AddCompetition 
				      onCompUpsert={this.handleCompAppUpsert} 
				      onCompUpsertClick={this.handleCompCancel}
			       />;
	    } else {
	      button = <div className="Competition AddCompetition">
		            	<button
							className="AddCompetition__button"
							onClick={this.handleCompUpsert}
							title='Добавить конкурс'
						>
						Добавить конкурс
						</button>
		           	</div>;
	    }

		return(
			<div className='CompetitionsList'>
				{button}
				{
					this.props.competitions.map(competition => 
						<CompetitionsListView
							key={competition.id} 
							competition={competition}
							participants={this.props.participants}
							experts={this.props.experts} 

							state={this.state}

							onCompUpsert={this.props.onAppCompUpsert} 
							onCompUpsertClick={this.handleCompCancel}
							onVoteStart={this.props.onVoteStart}

							onCompDelete={this.props.onCompDelete.bind(null, competition)}
		                    onCompUpdate={this.handleCompUpdate}
		                    onCompUpsert={this.props.onAppCompUpsert}

		                    onExpertUpsert={this.props.onAppExpertUpsert}
		                    onReqConfSend={this.props.onRequestExpertConfirmSend}
		                    onExpertDelete={this.props.onAppExpertDelete}

		                    onModerate={this.handlePartsModerate}
		                    onPartsModerate={this.handlePartConfirmed}
		                    onPartDelete={this.handlePartDelete}
							/>
					)
				}
			</div>
		)
	}
}

export default CompetitionsList;