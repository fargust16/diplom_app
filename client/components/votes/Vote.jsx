import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import VotesHeader from './VotesHeader.jsx';
import VotesPage from './VotesPage.jsx';

import { NavLink } from 'react-router-dom'

import './Vote.less';

function isEmptyObject(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

class Vote extends React.Component {

    static get propTypes() {
        cookies: instanceOf(Cookies).isRequired
    }

	constructor(props) {
	    super(props);
	}

    componentWillMount() {
        //console.log('willMount Vote')
        const { cookies } = this.props;
        
        let checkCook = cookies.get('expertCook') || false;

        if(checkCook === false && !isEmptyObject(this.props.expert)) {
            let d = new Date();
            let minutes = 360;
            d.setTime(d.getTime() + (minutes*60*1000));

            cookies.set('expertCook', this.props.expert, {path: '/', expires: d})
            cookies.set('expertCookTime', d.toISOString(), {path: '/', expires: d})
        } 
    }

  	render() {
        const competitions = this.props.competitions;
        const participants = this.props.participants;

        let content = null;
        var participantsTemp = [];

        let j = 0;

        let comp = {}

        for (var i = competitions.length - 1; i >= 0; i--) {
            if(competitions[i].id == this.props.compID) {
                comp = competitions[i];
            }
        }

        if(!isEmptyObject(comp)){
            for (let i = participants.length - 1; i >= 0; i--) {
                if(participants[i].competition == comp.name && participants[i].confirmed) {
                    participantsTemp[j] = participants[i];
                    j++;
                }
            }

            content = <VotesPage 
                competition={comp} 
                stages={comp.stages} 
                participants={participantsTemp} 
                onExitClick={this.props.onExitClick} 
                onConfirmVote={this.props.onConfirmVote}
            />
        }
        else content = <h2>Comp not found</h2>;

  		return (
            <div className="Vote">
                {content}
            </div>
        )
  	}
}

export default withCookies(Vote);
