import React from 'react';
import createReactClass from 'create-react-class';
import moment from 'moment'

import Expert from './Expert.jsx'
import AddExpert from './AddExpert.jsx'

import './Competition.less';

class Competition extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            isExpertEdit: false,
            expertId: ''
        }

        this.handleCompUpdate = this.handleCompUpdate.bind(this);
        this.handleModerPart = this.handleModerPart.bind(this);
        this.handleExpertEdit = this.handleExpertEdit.bind(this);
        this.handleExpertCancel = this.handleExpertCancel.bind(this);
        this.handleExpertAdd = this.handleExpertAdd.bind(this);
        this.handleStartVote = this.handleStartVote.bind(this);
        this.handleEndVote = this.handleEndVote.bind(this);
    }
    
    handleCompUpdate() {
        this.props.onCompUpdate(this.props.competition.id)
    }

    handleModerPart() {
        this.props.onModerate(this.props.competition)
    }

    handleExpertAdd(){
        this.setState({
            isExpertEdit: true,
            expertId: ''
        })
    }

    handleExpertEdit(expert_id){
        this.setState({
            isExpertEdit: true,
            expertId: expert_id
        })
    }

    handleExpertCancel(){
        this.setState({
            isExpertEdit: false,
            expertId: ''
        })
    }

    handleStartVote(data) {
        //console.log(data.partsCount == data.parts.length);
        if(data.partsCount == data.parts.length) return;
        const comp = this.props.competition;

        let stagesTemp = {};
        for (var i = comp.stages.length - 1; i >= 0; i--) {
            if(comp.stages[i]._id == data.stageID) {
                stagesTemp.startVote = true;
                stagesTemp.stageName = comp.stages[i].stageName;
            }
        }

        this.props.onVoteStart(comp.id, stagesTemp)
    }

    handleEndVote(stageID) {
        const comp = this.props.competition;

        let stagesTemp = {};
        for (var i = comp.stages.length - 1; i >= 0; i--) {
            if(comp.stages[i]._id == stageID) {
                stagesTemp.endVote = true;
                stagesTemp.stageName = comp.stages[i].stageName;
            }
        }

        this.props.onVoteStart(comp.id, stagesTemp)
    }

	render(){
        moment.locale('ru');

        const parts = this.props.participants;
        const comp = this.props.competition;
        const experts = this.props.experts;
        let partsTemp = [];
        let unConfirmedPartsCount = 0;
        let expertsTemp = [];
        let allExpertsVoted = true;

        parts.map(participant => {
            if(participant.competition == comp.name){
                if(!participant.confirmed) unConfirmedPartsCount++;
                partsTemp = partsTemp.concat(participant);
            }
        });

        experts.map(jury => {
            if(jury.comp_id == comp.id){
                expertsTemp = expertsTemp.concat(jury)
            }
        });

        for (var i = expertsTemp.length - 1; i >= 0; i--) {
            if(!expertsTemp[i].alreadyVoted) {
                allExpertsVoted = false;
                break;
            }
        }

        let button = null;

        if (this.state.isExpertEdit && this.state.expertId == '') {             // ---------------если была нажата кнопка добавить конкурс, то открывается чистая форма
          button = <AddExpert 
                            competition={comp}
                            onExpertUpsert={this.props.onExpertUpsert}
                            onExpertUpsertCancel={this.handleExpertCancel}
                        />;
        } else {
          button = <div className="AddExpert__view">
                        <button
                            className="AddExpert__footer-btnAddExpert"
                            onClick={this.handleExpertAdd}
                            title='Добавить эксперта'
                        >
                        Добавить эксперта
                        </button>
                    </div>;
        }

        let stageButtons = null;

        stageButtons = comp.stages.map((stage, i) => {
            if(stage.startVote) {
                if(allExpertsVoted) {
                    return (
                        <button 
                            key={i}
                            className="Competition-footer__startVote-btnStart"
                            data-set-id={stage._id}
                            onClick={this.handleEndVote.bind(null, stage._id)}
                        >
                            {stage.stageName}
                            <br />
                            завершить
                        </button>
                    )
                } else {
                    return(
                        <button 
                            key={i}
                            className="Competition-footer__startVote-btnStart"
                            disabled={true}
                        >
                            {stage.stageName}
                            <br />
                            в процессе
                        </button>
                    )
                }
            } else if(stage.endVote) {
                return (
                    <button 
                        key={i}
                        className="Competition-footer__startVote-btnStart"
                        disabled={true}
                    >
                        {stage.stageName}
                        <br />
                        завершен
                    </button>
                )
            } else {
                return(
                    <button 
                        key={i}
                        className="Competition-footer__startVote-btnStart"
                        data-set-id={stage._id}
                        onClick={this.handleStartVote.bind(null, {stageID: stage._id, partsCount: unConfirmedPartsCount, parts: partsTemp})}
                    >
                        {stage.stageName}
                    </button>
                )
            }
        })

        //console.log(allExpertsVoted)
		return(			
            <div className="Competition">
                <span className='Competition__change-icon' onClick={this.handleCompUpdate} title='Редактировать'> редактировать </span>
                <span className='Competition__part-icon' onClick={this.handleModerPart} title='Модерация участников'> участники </span>
				<span className='Competition__del-icon' onClick={this.props.onCompDelete} title='Удалить конкурс'> × </span>
                <h4 className='Competition__name'>Название: {this.props.competition.name}</h4>
                <div className='Competition__desc'>Описание: {this.props.competition.description}</div>
                <hr/>
                <div className='Competition__dateOfBegin'>Дата начала голосования: {moment(this.props.competition.dateOfBegin).format('LL')}</div>
                <div className='Competition__dateOfEnd'>Дата завершения голосования: {moment(this.props.competition.dateOfBegin).add(this.props.competition.daysToVote, 'days').format('LL')}</div><br/>
                <div className='Competition__info'>
                    <fieldset className='Competition__nominates'><legend>Номинации конкурса</legend>
                    {this.props.competition.nominates.map((man, i) =>
                        <p key={i}>
                            {man}
                        </p>
                    )}
                    </fieldset>

                    <fieldset className='Competition__jury'><legend>Приглашенные эксперты</legend>
                    {
                        expertsTemp.map(jurysman => {
                            if(this.state.isExpertEdit && this.state.expertId == jurysman.id){
                                return <AddExpert
                                    key={jurysman.id} 
                                    competition={comp}
                                    expert={jurysman}
                                    onExpertUpsert={this.props.onExpertUpsert}
                                    onExpertUpsertCancel={this.handleExpertCancel}
                                /> 
                            } else {
                                return <Expert
                                    key={jurysman.id}  
                                    expert={jurysman}
                                    competition={comp}

                                    onExpertDelete={this.props.onExpertDelete}
                                    onReqConfSend={this.props.onReqConfSend}
                                    onExpertEdit={this.handleExpertEdit}
                                />
                            }
                        })
                    }
                    {button}           
                    </fieldset>
                </div>
                <div className='Competition__footer'>
                    <div>
                        <div className='Competition-footer__stages'>{this.props.competition.stages.length > 1 ? 'Голосование пройдёт в два этапа' : 'Голосование пройдёт в один этап'}</div>
                        <p />
                        <div className='Competition-footer__participants-info'>Всего участников: {partsTemp.length}  Ожидающих модерации: {unConfirmedPartsCount}</div>
                    </div>
                    <div className='Competition-footer__startVote'>
                        {stageButtons}
                    </div>
                </div>
            </div>
		)
	}
}

export default Competition;