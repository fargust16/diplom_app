import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import CompetitionsActions from '../../actions/vkr_Actions';
import CompetitionsStore from '../../stores/CompetitionsStore';

import VoteResultsList from './VoteResultsList.jsx';

import './Competitions.less';

function getStateFromFlux() {
	return {
		isLoading: CompetitionsStore.isLoading(),
		voteResults: CompetitionsStore.getVoteResults(),
		competitions: CompetitionsStore.getCompetitions()
	};
}


function unique(arr) {
    let obj = {};

    for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}

class VoteResults extends React.Component {

	constructor(props) {
	    super(props);

	    this._onChange = this._onChange.bind(this);
	}

	componentWillMount() {
		const { cookies } = this.props;

		this.state = {
			rules: cookies.get('rulesInCook') || ''
		}

	    this.setState(getStateFromFlux());

	    CompetitionsActions.loadListOfComp();
		CompetitionsActions.listOfVoteResults();
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
  		const voteResults = this.state.voteResults;
  		const competitions = this.state.competitions;

  		let compNames = [];
  		let endCompsName = [];
  		let stageNames = [];

  		let c = 0;

  		for (let i = competitions.length - 1; i >= 0; i--) {
            if(competitions[i].stages[0].endVote) {
                endCompsName[c] = {}
                endCompsName[c].compName = competitions[i].name;
                endCompsName[c].stageName = competitions[i].stages[0].stageName;
                c++;
            }
  		}

		return(
			<div className="Competitions">
				<h2 className='Competitions__header'>Результаты конкурсов</h2>
				<VoteResultsList 
					rules={this.state.rules}
					voteResults={voteResults}
					endComps={endCompsName}
				/>
			</div>
		)
	}
}

export default withCookies(VoteResults);

        /*for (let i = voteResults.length - 1; i >= 0; i--) {
            compNames[i] = voteResults[i].id.compName;
            stageNames[i] = voteResults[i].id.stage;
        }

        let uniqComps = unique(compNames);
        let uniqStages = unique(stageNames);


        console.log(endCompsName);
        let showComps = [];

        for (let i = uniqComps.length - 1; i >= 0; i--) {
            for (let j = endCompsName.length - 1; j >= 0; j--) {
                if(uniqComps[i] == endCompsName[j])
                    showComps[i] = uniqComps[i];
            }
        }
        */