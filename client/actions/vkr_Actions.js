import AppDispatcher from '../dispatcher/vkr_Dispatcher';
import Constants from '../constants/vkr_Constants';

import api from '../api';

const CompetitionActions = {
	loadListOfComp(){
		AppDispatcher.dispatch({
            type: Constants.LOAD_COMPETITIONS_REQUEST
        });

        api.listOfComp()
        .then(({ data }) =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_COMPETITIONS_SUCCESS,
                competitions: data
            })
        )
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_COMPETITIONS_FAIL,
                error: err
            })
        );
	},

	addNewComp(competition){
		api.addComp(competition)
		.then(() => 
			this.loadListOfComp()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	startVote(comp_id, stageStart){
		api.startVote(comp_id, stageStart)
		.then(() => 
			this.loadListOfComp()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	deleteComp(comp_id){
		api.deleteComp(comp_id)
		.then(() => 
			this.loadListOfComp()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	// ---------------------------------part

	loadListOfPart(){
		AppDispatcher.dispatch({
            type: Constants.LOAD_COMPETITIONS_REQUEST
        });

        api.listOfPart()
        .then(({ data }) =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_PARTICIPANTS_SUCCESS,
                participants: data
            })
        )
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_COMPETITIONS_FAIL,
                error: err
            })
        );
	},

	addNewPart(part){
		api.addPart(part)
		.then(() => 
			this.loadListOfPart()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	confirmedPart(part_id){
		api.confirmedPart(part_id)
		.then(() => 
			this.loadListOfPart()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	deletePart(part_id){
		api.deletePart(part_id)
		.then(() => 
			this.loadListOfPart()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	// --------------------------------- Experts

	loadListOfExperts(){
		AppDispatcher.dispatch({
            type: Constants.LOAD_COMPETITIONS_REQUEST
        });

        api.listOfExperts()
        .then(({ data }) =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_EXPERTS_SUCCESS,
                experts: data
            })
        )
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_COMPETITIONS_FAIL,
                error: err
            })
        );
	},

	authExpert(auth_data = {}){
		AppDispatcher.dispatch({
            type: Constants.LOAD_COMPETITIONS_REQUEST
        });

        api.authExpert(auth_data)
        .then(({ data }) => {
        	if(data == '') {
        		AppDispatcher.dispatch({
	                type: Constants.LOAD_COMPETITIONS_FAIL,
	                error: true
	            })
        	} else {
        		AppDispatcher.dispatch({
	                type: Constants.AUTH_EXPERT_SUCCESS,
	                expert: data
	            })
        	}
        })
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_COMPETITIONS_FAIL,
                error: err
            })
        );
	},

	addNewExpert(part){
		api.addExpert(part)
		.then(() => 
			this.loadListOfExperts()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	requestConfirm(expert_id){
		api.requestConfirm(expert_id)
		.then(() => 
			this.loadListOfExperts()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	confirmExpert(expert_id){
		api.confirmExpert(expert_id)
		.then(() => 
			this.loadListOfExperts()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	deleteExpert(expert_id){
		api.deleteExpert(expert_id)
		.then(() => 
			this.loadListOfExperts()
		)
		.catch(err =>
			console.error(err)
		);	
	},

	listOfVoteResults(){
		AppDispatcher.dispatch({
            type: Constants.LOAD_COMPETITIONS_REQUEST
        });

        api.listOfVoteResults()
        .then(({ data }) =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_VOTERESULTS_SUCCESS,
                voteResults: data
            })
        )
        .catch(err =>
            AppDispatcher.dispatch({
                type: Constants.LOAD_COMPETITIONS_FAIL,
                error: err
            })
        );
	},

	confirmVote(voteResult){
		api.confirmVote(voteResult)
		.then(() => 
			this.loadListOfExperts()
		)
		.catch(err =>
			console.error(err)
		);	
	}
};

export default CompetitionActions;

