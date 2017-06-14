import React from 'react';
import createReactClass from 'create-react-class';

import Competition from './CompetitionPart.jsx';
import AddParticipant from './AddParticipant.jsx';

import './CompetitionsList.less'

const CompetitionsListForPart = createReactClass({

	getInitialState(){
		return {
			compUpsertId: ''
		};
	},
	
	handlePartUpsert(compId) {
		this.setState({compUpsertId: compId})
    },

    handlePartCancel() {
		this.setState({compUpsertId: ''})
    },

    handlePartAppUpsert(data){
    	this.props.onAppPartUpsert(data)
    },

	render() {

		return(
			<div className='CompetitionsList'>
				{
					this.props.competitions ?

					this.props.competitions.map(competition => 
						this.state.compUpsertId == competition.id

			            ?

			            <AddParticipant key={competition.id} competition={competition} onPartUpsert={this.props.onAppPartUpsert} onPartUpsertClick={this.handlePartCancel}/>

			            :

		                <Competition
		                    key={competition.id}
		                   	competition={competition}
		                   	experts={this.props.experts}
		                    onPartUpsert={this.handlePartUpsert}
		                />
	            	)

	            	:

	            	null
	            }
			</div>
		)
	}
});

export default CompetitionsListForPart;