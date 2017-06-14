import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import CompetitionsActions from '../../actions/vkr_Actions';
import CompetitionsStore from '../../stores/CompetitionsStore';

import CompetitionsList from './CompetitionsList.jsx';
import CompetitionsListForPart from './CompetitionsListForPart.jsx';

import './Competitions.less';



function getStateFromFlux() {
	return {
		isLoading: CompetitionsStore.isLoading(),
		competitions: CompetitionsStore.getCompetitions(),
		participants: CompetitionsStore.getParticipants(),
		experts: CompetitionsStore.getExperts()
	};
}

class Competitions extends React.Component {

	constructor(props) {
	    super(props);

	    this.handleUpsertComp = this.handleUpsertComp.bind(this);
	    this.handleStartVote = this.handleStartVote.bind(this);
	    this.handleDeleteComp = this.handleDeleteComp.bind(this);

	    this.handleUpsertPart = this.handleUpsertPart.bind(this);
	    this.handleConfirmedPart = this.handleConfirmedPart.bind(this);
	    this.handleDeletePart = this.handleDeletePart.bind(this);

	    this.handleUpsertExpert = this.handleUpsertExpert.bind(this);
	    this.handleRequestExpertConfirm = this.handleRequestExpertConfirm.bind(this);
	    //this.handleConfirmExpert = this.handleConfirmExpert.bind(this);
	    this.handleDeleteExpert = this.handleDeleteExpert.bind(this);

	    this._onChange = this._onChange.bind(this);
	}

	componentWillMount() {
		const { cookies } = this.props;

		this.state = {
			rules: cookies.get('rulesInCook') || ''
		}

	    this.setState(getStateFromFlux());

		CompetitionsActions.loadListOfComp();
		CompetitionsActions.loadListOfPart();
		CompetitionsActions.loadListOfExperts();
    }

    componentDidMount() {
        CompetitionsStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        CompetitionsStore.removeChangeListener(this._onChange);
    }

	handleUpsertComp(data){
		CompetitionsActions.addNewComp(data);
	}

	handleStartVote(compID, stages){
		CompetitionsActions.startVote(compID, stages);
	}

	handleDeleteComp(competition){
		CompetitionsActions.deleteComp(competition.id);
	}

	//--------part

	handleUpsertPart(data){
		CompetitionsActions.addNewPart(data);
	}

	handleConfirmedPart(part_id){
		CompetitionsActions.confirmedPart(part_id);
	}

	handleDeletePart(part_id){
		CompetitionsActions.deletePart(part_id);
	}

	//--------experts

	handleUpsertExpert(data){
		CompetitionsActions.addNewExpert(data);
	}

	handleRequestExpertConfirm(expert_id){
		CompetitionsActions.requestConfirm(expert_id);
	}

	handleConfirmExpert(expert_id){
		CompetitionsActions.confirmExpert(expert_id);
	}

	handleDeleteExpert(expert_id){
		CompetitionsActions.deleteExpert(expert_id);
	}

	_onChange(){
		this.setState(getStateFromFlux());
	}

  	render() {
  		//console.log(this.state.experts)
		return(
			<div className="Competitions">
				<h2 className='Competitions__header'>Все конкурсы</h2>
				{
					this.state.rules === 'sponsor'

					?

					<CompetitionsList 
						competitions={this.state.competitions}
						participants={this.state.participants}
						experts={this.state.experts}

						onAppCompUpsert={this.handleUpsertComp}
						onCompDelete={this.handleDeleteComp}
						onVoteStart={this.handleStartVote} 

						onAppExpertUpsert={this.handleUpsertExpert}
						onRequestExpertConfirmSend={this.handleRequestExpertConfirm}
						onAppExpertDelete={this.handleDeleteExpert}

						onPartConfirmed={this.handleConfirmedPart}
						onPartDelete={this.handleDeletePart}
					/>

					:

					<CompetitionsListForPart 
						competitions={this.state.competitions}
						experts={this.state.experts} 
						
						onAppPartUpsert={this.handleUpsertPart}
					/>
				}
			</div>
		)
	}
}

export default withCookies(Competitions);