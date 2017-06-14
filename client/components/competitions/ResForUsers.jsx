import React from 'react';
import Reactable from 'reactable';

import './ResForUsers.less';

var Table = Reactable.Table,
	Thead = Reactable.Thead,
    Th = Reactable.Th,
    Tr = Reactable.Tr,
    Td = Reactable.Td;

function sumPoints(arr, stage) {
	let sum = 0;
	let c = 0;

	if(stage == 'Отборочный этап') {
		for (let i = arr.points.length - 1; i >= 0; i--) {
			sum += arr.points[i];
		}
	} else {
		for (let i = arr.marks.length - 1; i >= 0; i--) {
			sum += arr.marks[i];
			c++;
		}
		sum = sum / c;
		sum = sum.toFixed(1);
	}

	return sum
}

function unique(arr) {
    let obj = {};

    for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}

class ResForUsers extends React.Component {

	constructor(props) {
	    super(props);

	    this.handleStageSwitch = this.handleStageSwitch.bind(this);
	}

	componentWillMount() {
		this.state = {
	    	stageShow: this.props.stageName
	    }
	}

	handleStageSwitch(stage) {
		this.setState({stageShow: stage});
	}

  	render() {
	  	const comp = this.props.votes;
	  	const compName = this.props.compName;
	  	const stageName = this.props.stageName;

	  	let content = null;
	  	let experts = [];
	  	let pseudoCont = null;
	  	let stageButtons = null;
	  	let marks = [];

	  	//console.log(comp)
	  	let stages = [];
	  	let c = 0;
	  	for (let i = comp.length - 1; i >= 0; i--) {
	  		if(comp[i].id.compName == compName) {
	  			stages[c] = comp[i].id.stage;
	  			c++;
	  		}
	  	}

	  	let stagesTemp = unique(stages);

	  	stageButtons = stagesTemp.map((stage, i) =>
	  		<button key={i} className="Results-comp__content-stages__btnSwitch" onClick={this.handleStageSwitch.bind(null, stage)}>{stage}</button>
	  	);

	  	for (let i = comp.length - 1; i >= 0; i--) {
	  		if(comp[i].id.compName == compName) {
	  			experts = comp[i].experts;
	  			break;
	  		}
	  	}

	  	for (let i = comp.length - 1; i >= 0; i--) {
	  		if(comp[i].id.compName == compName && comp[i].id.stage == this.state.stageShow) {
	  			experts = comp[i].experts;
	  			break;
	  		}
	  	}

	  	//console.log(stageName);

	  	pseudoCont = experts.map((pseudo, i) => 
	  		<span className="mark" key={i}>{pseudo}</span>
	  	);

		content = comp.map((work, i) => {
			if(work.id.compName == compName && work.id.stage == this.state.stageShow) {
				return <div key={i} className="Results-comp__content-results">
					<div className="Results-comp__content-results__header">{work.id.workName}</div>
					<div className="Results-comp__content-results__marks">
						{
							this.state.stageShow == 'Отборочный этап'
							?
							work.points.map((voice, i) => 
								<span key={i} className="mark"> {voice} </span>
							)
							:
							work.marks.map((mark, i) => 
								<span key={i} className="mark"> {mark} </span>
							)
						}
						<span className="mark">{sumPoints(work, this.state.stageShow)}</span> 
					</div>
				</div> 
			}
		})		

		return (
			<div className="Results-comp__content">
				<div className="Results-comp__content-stages">
					{stageButtons}
				</div>
				<div className="Results-comp__content-header">
					<div className="Results-comp__content-results__header">Название работы</div>
					<div className="Results-comp__content-results__marks">
						{pseudoCont}
						<span className="mark">Всего</span>
					</div>
				</div>
				<hr />
				{content}
			</div>
		)
	}
}

export default ResForUsers;