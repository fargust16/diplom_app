import React from 'react';

import CompetitionsActions from '../actions/vkr_Actions';
import CompetitionsStore from '../stores/CompetitionsStore';

import './MembersConfirm.less';

function getStateFromFlux() {
	return {
		isLoading: CompetitionsStore.isLoading(),
		experts: CompetitionsStore.getExperts()
	};
}

class MembersConfirm extends React.Component {

	constructor(props) {
	    super(props);

	    this.handleConfirmExpert = this.handleConfirmExpert.bind(this);
	    this._onChange = this._onChange.bind(this);
	}

	componentDidMount() {
        CompetitionsStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        CompetitionsStore.removeChangeListener(this._onChange);
    }

	componentWillMount(){

		this.setState(getStateFromFlux());

		CompetitionsActions.loadListOfExperts();
	}

	_onChange(){
		this.setState(getStateFromFlux());
	}

	handleConfirmExpert(expert_id){
		CompetitionsActions.confirmExpert(expert_id);
	}

  	render() {
  		//console.log(this.state)
  		const experts = this.state.experts

  		let content = null;

  		if(this.state.isLoading) {
  			content = <h2>Загрузка</h2>;
  		} else if (!this.props.match.params) {
  			content = <h2>Неверная ссылка!</h2>;
  		} else {
  			for (let i = experts.length - 1; i >= 0; i--) {
  				if(this.props.match.params.memberID == experts[i].id) {
  					if(experts[i].confirmed) {
  						content = <h2>Участие подтверждено!</h2>;
  						break;
  					}
  					else {
  						content = <div>
								<h2 key={experts[i].id}>Ув. {experts[i].fio}, чтобы подтвердить участие в конкурсе нажмите на кнопку ниже</h2>
								<button onClick={this.handleConfirmExpert.bind(null, experts[i].id)}>
								подтвердить
								</button>
							</div>;
						break;
  					}					
  				}
  				else content = <h2>Пользователь с таким id не найден!</h2>;
  			}
  		}

  		return (
  			<div className="MembersConfirm">
  			{content}
  			</div>
  		)
  	}
}

export default MembersConfirm;