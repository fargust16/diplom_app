import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import CompetitionsActions from '../../actions/vkr_Actions';
import CompetitionsStore from '../../stores/CompetitionsStore';

import AuthToVote from './AuthToVote.jsx';
import Vote from './Vote.jsx';

import { NavLink } from 'react-router-dom'

import './Vote.less';

function getStateFromFlux() {
    return {
        isLoading: CompetitionsStore.isLoading(),
        expert: CompetitionsStore.getVoteData(),
        competitions: CompetitionsStore.getCompetitions(),
        participants: CompetitionsStore.getParticipants(),
        error: CompetitionsStore.getError()
    };
}

function isEmptyObject(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

class StartVote extends React.Component {

    static get propTypes() {
        cookies: instanceOf(Cookies).isRequired
    }

	constructor(props) {
	    super(props);

        this.handleAuthExpert = this.handleAuthExpert.bind(this);
        this.handleCookieClean = this.handleCookieClean.bind(this);
        this.handleConfirmVote = this.handleConfirmVote.bind(this);
	    this._onChange = this._onChange.bind(this);
	}

    componentWillMount() {
        const { cookies } = this.props;
        //console.log('willMount StartVote')
        this.setState(getStateFromFlux());



        CompetitionsActions.loadListOfComp();
        CompetitionsActions.loadListOfPart();
    }

    componentDidMount() {
        CompetitionsStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        CompetitionsStore.removeChangeListener(this._onChange);
    }

    handleAuthExpert(auth_data){
        CompetitionsActions.authExpert(auth_data);
    }

    handleConfirmVote(data) {
        CompetitionsActions.confirmVote(data);
        this.handleCookieClean();
    }

    handleCookieClean() {
        const { cookies } = this.props;

        this.state ={
            expert: {}
        }

        cookies.remove('expertCook');
        cookies.remove('partsAddedCookie');
        cookies.remove('expertCookTime');

        
        location.reload();
        this.props.history.push('/allVotes');

    }

    _onChange(){
        this.setState(getStateFromFlux());
    }

  	render() {
        const { cookies } = this.props;
        const competitions = this.state.competitions || [];
        const checkECook = cookies.get('expertCook') || this.state.expert;

        let content = null;        

        if(isEmptyObject(checkECook)) {
            content = <AuthToVote
                onExpertLogin={this.handleAuthExpert}
                error={this.state.error}
            />;
        } else if(!this.state.isLoading) {
            content = <Vote
                compID={this.props.match.params.compID}
                competitions={competitions}
                participants={this.state.participants}
                expert={this.state.expert}
                onExitClick={this.handleCookieClean}
                onConfirmVote={this.handleConfirmVote}
            />;
        } else content = <h2>Загрузка</h2>

  		return (
            <div className="StartVote">
                {content}
            </div>
        )
  	}
}

export default withCookies(StartVote);
