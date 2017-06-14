import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

import Home from './components/Home.jsx';
import NoMatch from './components/NoMatch.jsx';
import Competitions from './components/competitions/Competitions.jsx';

import MembersConfirm from './components/MembersConfirm.jsx';
import VoteList from './components/votes/VoteList.jsx';
import StartVote from './components/votes/StartVote.jsx';
import VoteResults from './components/competitions/VoteResults.jsx';

import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

ReactDOM.render(
	<CookiesProvider>
   		<Router>
   		  <div className='rootDiv'>
   		  	<Header />
			<Route strict path="/vote:compID" component={StartVote}/>
		    <Route exact path="/" component={Home} />
		    <Route path="/competitions" component={Competitions} />
		    <Route path="/allVotes" component={VoteList} />
		    <Route path="/members:memberID" component={MembersConfirm} />
		    <Route path="/resultsVote" component={VoteResults} />
		    <Footer />
		  </div>
		</Router>
	</CookiesProvider>,
	document.getElementById('entry-point')
);