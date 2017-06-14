import React from 'react';

import ResForUsers from './ResForUsers.jsx';
import ResForExperts from './ResForExperts.jsx';

import './VoteResultsList.less';

function ViewResForUsers(props) {
	return <ResForUsers votes={props.votes} compName={props.compName} stageName={props.stageName}/>;
}

function ViewResForExperts(props) {
	return <ResForExperts votes={props.votes} />;
}

function Results(props) {
	const voteResults = props.voteResults;
	const compShow = props.compShow;

	let content = null;

	//console.log(props.stageName)

	if(compShow == props.compName) {
		content = <div className="Results-comp">
			<h2 className="Results-comp__header">
				<span>{props.compName}</span>
				<span 
					className="Results-comp__cont" 
					onClick={props.showCompResult.bind(null, '')}
				>
				❯
				</span>
			</h2>
			<ViewResForUsers votes={props.voteResults} compName={props.compName} stageName={props.stageName}/>
		</div>;
	} else {
		content = <div className="Results-comp">
			<h2 className="Results-comp__header">
				<span>{props.compName}</span>
				<span 
					className="Results-comp__cont" 
					onClick={props.showCompResult.bind(null, props.compName)}
				>
				❮
				</span>
			</h2>
		</div>;
	}

	return <div className="Results Competition">
		{content}
	</div>
}

class VoteResultsList extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	compShow: ''
	    }

	    this.handleShowCompResult = this.handleShowCompResult.bind(this);
	}

	handleShowCompResult(comp) {
		this.setState({compShow: comp})
	}

  	render() {
  		const showComps = this.props.endComps;
  		const voteResults = this.props.voteResults;
  		const competitions = this.props.competitions;

  		//console.log(voteResults);
  		//console.log(showComps);
  		if(showComps.length == 0) return (
  			<div className="ListOfResults">
  				<div className="Results Competition">
  					<h3>Нет завершённых конкурсов</h3>
  				</div>
  			</div>
  		);
  		else return(
			<div className="ListOfResults">
				{
					showComps.map((comp, i) =>
						<Results
							key={i}
							voteResults={voteResults}
							compName={comp.compName}
							stageName={comp.stageName}
							compShow={this.state.compShow}
							rules={this.props.rules}
							showCompResult={this.handleShowCompResult}
						/>
					)
				}
			</div>
		)
	}
}

export default VoteResultsList;