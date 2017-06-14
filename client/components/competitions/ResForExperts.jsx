import React from 'react';

import './Competitions.less';

class ResForExperts extends React.Component {

	constructor(props) {
	    super(props);
	}

  	render() {
	  	const comp = this.props.votes;

		return (
			<div className="VoteResults-content">
				<h2>{comp.id.compName}</h2>
				<fieldset className="VoteResults-content__results">
					<legend>{comp.id.stage}</legend>
					<div className="VoteResults-content__results-view">
						<span>Название работы : {comp.id.workName}</span><br />
						<span>Выбрали : 
						{
							comp.id.stage == 'Отборочный этап'
							?
							comp.points.map((voice, i) => 
								<span key={i}> {voice} </span>
							)
							:
							comp.marks.map((mark, i) => 
								<span key={i}> {mark} </span>
							)
						} 
						</span>
					</div>
				</fieldset>
			</div>
		)
	}
}

export default ResForExperts;