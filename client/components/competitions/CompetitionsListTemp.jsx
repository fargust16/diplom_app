import React from 'react';
import createReactClass from 'create-react-class';

import Competition from './Competition.jsx';
import AddCompetition from './AddCompetition.jsx';
import AddParticipant from './AddParticipant.jsx';

import './CompetitionsList.less'


function AddCompetition(props) {
	return <AddCompetition key={props.competition.id} competition={props.competition} onCompUpsert={props.onCompUpsert} onCompUpsertClick={props.onCompUpsertClick}/>;
}

function PartModeration(props) {
	return <h1>Moderate participants for this Конкурс!</h1>;
}

function ViewCompetition(props) {
	return <Competition
				key={props.competition.id}
				competition={props.competition}
				onDelete={props.onDelete}
				onUpdate={props.onUpdate}
				onCompUpsert={props.onCompUpsert}
				onModerate={props.onModerate}
			/>;
}

function CompetitionsList(props) {
	const isPartModerate = props.isPartModerate;
	const isCompUpsert = props.isCompUpsert;

	if (isPartModerate) {
		return <PartModeration competition={props.competition}/>;
	}
	else if(isCompUpsert) {
		return <AddCompetition competition={props.competition} onCompUpsert={props.onCompUpsert} onCompUpsertClick={props.onCompUpsertClick} />;
	}
	return <ViewCompetition
				competition={props.competition}
				onDelete={props.onDelete}
				onUpdate={props.onUpdate}
				onCompUpsert={props.onCompUpsert}
				onModerate={props.onModerate}
	 		/>;
}

class CompetitionsList extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			isCompUpsert: false,
			isPartModerate: false,
			compModerId: '',
			compUpdateId: ''
		};

		this.handleCompUpsert = this.handleCompUpsert.bind(this);
		this.handleCompCancel = this.handleCompCancel.bind(this);

		this.handlePartsModerate = this.handlePartsModerate.bind(this);

		this.handleCompAppUpsert = this.handleCompAppUpsert.bind(this);		
	}

    handleCompUpsert(data = '') {
    	this.setState({isCompUpsert: true})

		this.setState({compUpdateId: data})
    }

    handlePartsModerate(data) {
		this.setState({isPartModerate: true})
		this.setState({compModerId: data})
    }

    handleCompCancel() {
		this.setState({isCompUpsert: false});
		this.setState({isPartModerate: false});

		this.setState({compModerId: ''});
		this.setState({compUpdateId: ''});
    }

    handleCompAppUpsert(data){
    	this.props.onAppCompUpsert(data)
    }

	render() {

		let 
		

		return(
			<div className='CompetitionsList'>
				{
					this.props.competitions ?

					this.props.competitions.map(competition => 
						this.state.compUpdateId == competition.id

			            ?

			            <AddCompetition key={competition.id} competition={competition} onCompUpsert={this.props.onAppCompUpsert} onCompUpsertClick={this.handleCompCancel}/>

			            :

		                <Competition
		                    key={competition.id}
		                    competition={competition}
		                    onDelete={this.props.onCompDelete.bind(null, competition)}
		                    onUpdate={this.handleCompUpsert}
		                    onCompUpsert={this.props.onAppCompUpsert}
		                    onModerate={this.props.onPartConfirmed}
		                />
		            )
		            :
		            null
				}
	            {

					this.state.isCompUpsert

		        	?

		            <AddCompetition onCompUpsert={this.handleCompAppUpsert} onCompUpsertClick={this.handleCompCancel}/>

		            :

		            <div className="Competition AddCompetition">
		            	<button
							className="AddCompetition__button"
							onClick={this.handleCompUpsert}
							title='Добавить конкурс'
						>
						Добавить конкурс
						</button>
		           	</div>
		        }
			</div>
		)
	}
}

export default CompetitionsList;