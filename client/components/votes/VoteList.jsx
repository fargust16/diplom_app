import React from 'react';

import { NavLink } from 'react-router-dom'

import CompetitionsActions from '../../actions/vkr_Actions';
import CompetitionsStore from '../../stores/CompetitionsStore';

import './VoteList.less';

function getStateFromFlux() {
	return {
		isLoading: CompetitionsStore.isLoading(),
		competitions: CompetitionsStore.getCompetitions(),
	};
}

class VoteList extends React.Component {

	constructor(props) {
	    super(props);

	    this._onChange = this._onChange.bind(this);
	}

	componentWillMount() {
		const { cookies } = this.props;

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

    _onChange(){
		this.setState(getStateFromFlux());
	}

  	render() {
  		const competitions = this.state.competitions;
  		let content = null;



  		if(this.state.isLoading) {
  			content = <h2>Загрузка</h2>;
  		} else {
  			content = <fieldset className='VoteList__nav'><legend>Активные голосования</legend>
	                    <ul>
	                    {competitions.map(comp => {
                    		return  <li key={comp.id}><NavLink activeClassName="active" exact to={'/vote' + comp.id} >
			                            {comp.name}
			                        </NavLink></li>
	                    }
	                    )}
	                    </ul>
	                </fieldset>;
  		}

		return(
			<div className="VoteList">
				{content}
			</div>
		)
	}
}

export default VoteList;