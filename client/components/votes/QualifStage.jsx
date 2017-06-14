import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import EstimateTimer from './EstimateTimer.jsx';

import './QualifStage.less';

function AddButtonView(props) {
	const partID = props.partID;
	const addParts = props.addParts;

	for (var i = addParts.length - 1; i >= 0; i--) {
		if(partID == addParts[i]) {
			return <div className="QualifStage__preview-content__work-btnDelete" onClick={props.onWorkDelete.bind(null, partID)}>
	                    –
	                </div>;
		}
	}
	return <div className="QualifStage__content-works__work-btnAdd" onClick={props.onWorkAdd.bind(null, partID)}>
	            +
	        </div>;
}


class QualifStage extends React.Component {

    static get propTypes() {
        cookies: instanceOf(Cookies).isRequired
    }

	constructor(props) {
	    super(props);

	    this.handleChangePseudo = this.handleChangePseudo.bind(this);
	    this.handleChangeNomination = this.handleChangeNomination.bind(this);
	    this.handleWorkAdd = this.handleWorkAdd.bind(this);
	    this.handleWorkDelete = this.handleWorkDelete.bind(this);
	    this.handleConfirmVote = this.handleConfirmVote.bind(this);
	}

    componentWillMount() {
        const { cookies } = this.props;

        this.state = {
            pseudonim: '',
            nomination: this.props.nominations[0],
            partsAdded: cookies.get('partsAddedCookie') || [],
            expierTime: cookies.get('expertCookTime') || false
        }
    }

	handleChangePseudo(e){
        this.setState({pseudonim: e.target.value})
    }

    handleChangeNomination(e) {
    	this.setState({nomination: e.target.value})
    }

    handleWorkAdd(partID) {
        const { cookies } = this.props;
        let d = new Date(this.state.expierTime);

        let partsAddedTemp = this.state.partsAdded.concat(partID);

    	this.setState({partsAdded: partsAddedTemp});

        cookies.set('partsAddedCookie', partsAddedTemp, { path: '/', expires: d });
    }

    handleWorkDelete(partID) {
        const { cookies } = this.props;
		const works = this.state.partsAdded;
        let d = new Date(this.state.expierTime);

		for (var i = works.length - 1; i >= 0; i--) {
			if(works[i] == partID){
				works.splice(i, 1);
			}
		}

	    // update state
	    this.setState({
	        partsAdded: works
	    });

        cookies.set('partsAddedCookie', works, { path: '/', expires: d });
    }

    handleConfirmVote(){
        //console.log(this.state.pseudonim == 'default' || this.state.partsAdded.length == 0);
    	if(this.state.pseudonim == '' || this.state.partsAdded.length == 0) return;

        const parts = this.props.participants;
        let partsAdd = this.state.partsAdded;
        let voteRes = [];

        for (let i = parts.length - 1; i >= 0; i--) {
            voteRes[i] = {};
            voteRes[i].workName = parts[i].work_name;
            voteRes[i].nomination = parts[i].nomination;
            for (let j = partsAdd.length - 1; j >= 0; j--) {
                if(parts[i].id == partsAdd[j]) {
                    voteRes[i].choosed = 1;
                }
            }
        }
        
        const voteResult = {
            expertID: this.props.expertData.id,
            compName: this.props.compName,
            stageName: this.props.stageState.stageName,
            pseudonim: this.state.pseudonim,
            votes: voteRes
        };

        this.props.onConfirmVote(voteResult);

    	this.setState({
    		partsAdded: [],
    		pseudonim: '',
    		nomination: this.props.nominations[0]
    	})
    }

  	render() {
  		const nominations = this.props.nominations;
  		const participants = this.props.participants;
  		const pseudo = this.props.pseudo;
        const stage = this.props.stageState

  		let partsAdd = [];

  		for (var i = participants.length - 1; i >= 0; i--) {
  			for (var j = this.state.partsAdded.length - 1; j >= 0; j--) {
  				if(participants[i].id == this.state.partsAdded[j]){
  					partsAdd = partsAdd.concat(participants[i]);
  				}
  			}
  		}
        //console.log(stage);

        if(!stage.startVote || stage.endVote) {
            return(
                <div className="QualifStage">
                    <div className="QualifStage-content">
                        <div className="QualifStage__content-header">
                            <span>
                                Не началось или закончилось
                            </span>
                        </div>
                        <div className="QualifStage-preview">
                            
                        </div>
                    </div>
                </div>
            )
        } else
        return(
           <div className="QualifStage">
                <div className="QualifStage__content">
                    <div className="QualifStage__content-header">
                        <div className="QualifStage__content-header__top">
                            <select 
                                name="preview"
                                onChange={this.handleChangeNomination}
                                value={this.state.nomination}
                                className="QualifStage__content-header__top-nominate"
                            >
                            <option value='default' disabled>Выберите номинацию</option>
                            {nominations.map((nom, i) =>
                                <option
                                    key= {i}
                                    value={nom}
                                >
                                    {nom}
                                </option>
                            )}
                            </select>

                            <EstimateTimer onExitClick={this.props.onExitClick}/>
                        </div>
                        <div className="QualifStage__content-header__info">
                            <span className="QualifStage__content-info__intro">Выберите 10 работ, которые пройдут в финальный этап голосования</span>
                            {/*<span className="QualifStage__content-info__instr">как голосовать?</span>*/}
                        </div>

                    </div>
                    <div className="QualifStage__content-works">

                    {participants.map(part => {
                    	if(part.nomination == this.state.nomination) {
                    		return <div key={part.id} className="QualifStage__content-works__work">
		                            <img src={'../../../images/'+part.preview} className="QualifStage__content-works__work-img"/>
		                                <div className="QualifStage__content-works__work-desc">
		                                    <h2 className="QualifStage__content-works__work-desc__h2">{part.work_name}</h2>
		                                    <span className="QualifStage__content-works__work-desc__span">{part.description}</span>
		                                </div>
		                            
		                            <AddButtonView onWorkAdd={this.handleWorkAdd} onWorkDelete={this.handleWorkDelete} partID={part.id} addParts={this.state.partsAdded}/>

		                        </div>
                    	}
                    })}
                    </div>
                </div>

                <div className="QualifStage__preview">
                    <div className="QualifStage__preview-header">
                        <h2 className="QualifStage__preview-header_h2">{this.props.compName}</h2>
                        <input 
                            name="preview"
                            onChange={this.handleChangePseudo}
                            value={this.state.pseudonim}
                            className='QualifStage__preview-header__field'
                            placeholder="Придумайте себе псевдоним"
                        />
                    </div>
                    <span className="QualifStage__preview__intro">Вы выбрали следующие работы</span>
                    <div className="QualifStage__preview-content">
                         {partsAdd.map(part =>
	                        <div key={part.id} className="QualifStage__preview-content__work">
	                            <img src={part.preview} className="QualifStage__preview-content__work-img"/>
	                                <div className="QualifStage__preview-content__work-desc">
	                                    <h2 className="QualifStage__preview-content__work-desc__h2">{part.work_name}</h2>
	                                    <span className="QualifStage__preview-content__work-desc__span">{part.description}</span>
	                                </div>
	                            
	                            <div className="QualifStage__preview-content__work-btnDelete" onClick={this.handleWorkDelete.bind(null, part.id)}>
	                                –
	                            </div>
	                        </div>
	                    )}
                    </div>

                    <div className="QualifStage__preview-footer">
                        <button onClick={this.handleConfirmVote}>
                            Голосовать
                        </button>
                    </div>
                </div>
            </div>
		)
	}
}

export default withCookies(QualifStage);