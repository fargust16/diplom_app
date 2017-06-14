import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import PartWork from './PartWork.jsx'
import EstimateTimer from './EstimateTimer.jsx';

import './FinalStage.less';

function OpenPreview(props) {
    const works = props.works;
    const workID = props.workID
    const show = props.isShow;
    const marks = props.marks;

    let partMark = '';
    let part = null;

    for (var i = works.length - 1; i >= 0; i--) {
        if(works[i].id == workID) {
            part = works[i];
        }
    }

    for (let i = marks.length - 1; i >= 0; i--) {
        if(marks[i].partID == workID)
            partMark = marks[i].mark;
    }

    let marksPivot = [];
    for (let i = 5; i >= 1; i--) {
        marksPivot[i] = <span key={i} className={i <= partMark ? "marksPivot painted" : "marksPivot"} id={i} onClick={props.handleChangeMark.bind(this, part)}>{i}</span>;
    }

    let content = null;

    content = works.map((work, i) => {
        if(work.id == workID){
            return <div className="PreviewWork" key={i}>
                <div className="PreviewWork__nav">
                    <span className="PreviewWork__nav-right" onClick={props.getNextWorkID.bind(null, {workID: workID, send: 1})} >❯</span>
                    <span className="PreviewWork__nav-left" onClick={props.getNextWorkID.bind(null, {workID: workID, send: -1})} >❮</span>
                </div>
                <div className="PreviewWork__work">
                    <span className="PreviewWork__work-btnClose" onClick={props.closePreview}>×</span>
                    <img className="PreviewWork__work-img" src={'../../../images/'+work.preview}/>
                    <div className="PreviewWork__work-info">
                        <h2 className="PreviewWork__work-info_h2">{work.work_name}</h2>
                        <span className="PreviewWork__work-info_desc">{work.description}</span>
                    </div>
                    <div className="PreviewWork__work-marks">
                        {marksPivot}
                    </div>
                </div>
            </div>
        }
    })

    if(!show) {
        return <div className="PreviewWork" style={{display: "none"}}></div>
    } else {
        return <div>{content}</div>
    }
}

class FinalStage extends React.Component {
  
    static get propTypes() {
        cookies: instanceOf(Cookies).isRequired
    }

	constructor(props) {
	    super(props);

	    this.handleChangePseudo = this.handleChangePseudo.bind(this);
	    this.handleChangeNomination = this.handleChangeNomination.bind(this);
	    this.handleMarkPartWork = this.handleMarkPartWork.bind(this);
        this.handleChangeMark = this.handleChangeMark.bind(this);
        this.handleConfirmVote = this.handleConfirmVote.bind(this);
        this.handleOpenFullWork = this.handleOpenFullWork.bind(this);
        this.handleNextWork = this.handleNextWork.bind(this);
	}

    componentWillMount() {
        const { cookies } = this.props;

        this.state = {
            pseudonim: '',
            isFullWork: false,
            workID: '',
            nomination: this.props.nominations[0],
            voteMarks: cookies.get('voteMarksCookie') || [],
            expierTime: cookies.get('expertCookTime') || false
        }
    }

	handleChangePseudo(e) {
		this.setState({pseudonim: e.target.value})
	}

	handleChangeNomination(e) {
    	this.setState({nomination: e.target.value})
    }

    handleNextWork(data) {
        const participants = this.props.participants;
        let workID = null;

        for (var i = participants.length - 1; i >= 0; i--) {
            if(data.workID == participants[i].id) {
                if(i == 0 && data.send < 0) workID = participants[i].id;
                else if(i == participants.length - 1 && data.send > 0) workID = participants[i].id;
                else workID = participants[i + data.send].id;
            }
        }
        this.setState({workID: workID});
    }

    handleChangeMark(part, e) {
        this.handleMarkPartWork(part.id, e.target.id, part.nomination);
    }

    handleMarkPartWork(partID, mark, nom) {
        const { cookies } = this.props;
    	let voteMarksTemp = this.state.voteMarks;
    	let exist = false;
        let d = new Date(this.state.expierTime);

    	for (var i = this.state.voteMarks.length - 1; i >= 0; i--) {
    		if(partID == voteMarksTemp[i].partID) {
    			voteMarksTemp[i].mark = mark;
    			exist = true;
    		}
    	}

    	if(exist) {
    		this.setState({
	    		voteMarks: voteMarksTemp
	    	})
    	} else {
    		voteMarksTemp = voteMarksTemp.concat({partID: partID, mark: mark, nom: nom});

    		this.setState({
	    		voteMarks: voteMarksTemp
	    	})
    	}

    	cookies.set('voteMarksCookie', voteMarksTemp, { path: '/', expires: d });
    }

    handleConfirmVote(){
        //console.log(this.state.pseudonim == '' || this.state.partsAdded.length == 0);
        if(this.state.pseudonim == '' || this.state.voteMarks.length == 0) return;

        const parts = this.props.participants;
        let partsAdd = this.state.voteMarks;
        let voteRes = [];

        for (let i = parts.length - 1; i >= 0; i--) {
            voteRes[i] = {};
            voteRes[i].workName = parts[i].work_name;
            voteRes[i].nomination = parts[i].nomination;
            for (let j = partsAdd.length - 1; j >= 0; j--) {
                if(parts[i].id == partsAdd[j].partID) {
                    voteRes[i].mark = partsAdd[j].mark;
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
            voteMarks: [],
            pseudonim: '',
            nomination: this.props.nominations[0]
        })
    }

    handleOpenFullWork(data) {
        this.setState({
            isFullWork: data.state,
            workID: data.workID
        })
    }

  	render() {
  		const participants = this.props.participants;
  		const nominations = this.props.nominations;
  		const pseudo = this.props.pseudo;
  		const voteMarks = this.state.voteMarks;
        const stage = this.props.stageState;

        //console.log(voteMarks);

  		let totalParts = []
  		let votedParts = [];

  		for (var i = nominations.length - 1; i >= 0; i--) {
  			totalParts[i] = 0;
  			for (var j = participants.length - 1; j >= 0; j--) {
  				if(participants[j].nomination == nominations[i]) {
  					totalParts[i]++;
  				}
  			}
  		}

  		for (var i = nominations.length - 1; i >= 0; i--) {
  			votedParts[i] = 0;
  			for (var j = voteMarks.length - 1; j >= 0; j--) {
  				if(voteMarks[j].nom == nominations[i]) {
  					votedParts[i]++;
  				}
  			}
  		}

        let fullPreview = null;

        fullPreview = <OpenPreview
            works={participants}
            workID={this.state.workID}
            marks={voteMarks}
            isShow={this.state.isFullWork}
            closePreview={this.handleOpenFullWork.bind(null, false)}
            getNextWorkID={this.handleNextWork}
            handleChangeMark={this.handleChangeMark}
        />;

        //console.log(stage);

        if(!stage.startVote || stage.endVote) {
            return(
                <div className="tab-3">
                    <div className="tabs-body__content">
                        <div className="tabs-body__content-header">
                            <span>
                                Не началось или закончилось
                            </span>
                        </div>
                    </div>
                </div>
            )
        } else
		return(
             <div className={this.state.isFullWork ? "FinalStage fadeUp" : "FinalStage"} >
                <div className="FinalStage__content">
                    <div className="FinalStage__content-header">
                        <div className="FinalStage__content-header__top">
                            <h2 className="FinalStage__content-header_h2">{this.props.compName}</h2>
                            <select 
                                name="preview"
                                onChange={this.handleChangeNomination}
                                value={this.state.nomination}
                                className="FinalStage__content-header__top-nominate"
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
                        <div className="FinalStage__content-header__info">
                            <span className="FinalStage__content-info__intro">Оцените по 5-ти бальной шкале</span>
                            {/*<span className="FinalStage__content-info__instr">как голосовать?</span>*/}
                        </div>
                    </div>

                    <div className='FinalStage__content-works'>
                        {participants.map(part => {
                            if(this.state.nomination == part.nomination)
                                return <PartWork key={part.id} participant={part} openPreview={this.handleOpenFullWork} onMarkChange={this.handleMarkPartWork} marks={voteMarks}/>
                        })}
                    </div>
                    <div className="FinalStage__content-footer">
                            <input 
                                name="pseudo"
                                onChange={this.handleChangePseudo}
                                value={this.state.pseudonim}
                                placeholder="Придумайте себе псевдоним"
                                className='FinalStage__content-footer__field'
                            />
                        <button 
                            className="FinalStage__content-footer__btnVote"
                            onClick={this.handleConfirmVote}
                        >
                            Голосовать
                        </button>
                    </div>
                </div>
                <div className={this.state.isFullWork ? "FinalStage_pos fadeUp" : "FinalStage_pos"}>
                    {fullPreview}
                </div>
            </div>
		)
	}
}

export default withCookies(FinalStage);