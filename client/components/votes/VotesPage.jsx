import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import CompDescription from './CompDescription.jsx';
import QualifStage from './QualifStage.jsx';
import FinalStage from './FinalStage.jsx'

import './VotesPage.less';

var pseudo = [
    'Шапокляк',
    'Крокодил Гена',
    'Марио',
    'Чебурашка',
    'Колобок',
    'Гадкий утёнок'
];

function ViewDescription(props) {
    const comp = props.comp;

    return <CompDescription competition={comp} />;
}

function ViewFirstStage(props) {

    const participants = props.participants;
    let partsAdded = [];
    let nominations = [];
    nominations[0] = participants[0].nomination;
    let exist = false;

    for (var i = participants.length - 1; i >= 0; i--) {
        for (var j = nominations.length - 1; j >= 0; j--) {
            if(nominations[j] == participants[i].nomination) {
                exist = true;
                break;
            }
        }
        if(!exist) {
            nominations = nominations.concat(participants[i].nomination);
        }
        else exist = false;
    }
    //console.log(nominations);

    return <QualifStage 
        expertData={props.expertData}
        compName={props.compName}
        participants={participants} 
        nominations={nominations} 
        pseudo={pseudo} 
        stageState={props.stageState}
        onConfirmVote={props.onConfirmVote}
        onExitClick={props.onExitClick}
    />;
}

function ViewSecondStage(props) {

    const participants = props.participants;
    let nominations = [];
    nominations[0] = participants[0].nomination;
    let exist = false;

    for (var i = participants.length - 1; i >= 0; i--) {
        for (var j = nominations.length - 1; j >= 0; j--) {
            if(nominations[j] == participants[i].nomination) {
                exist = true;
                break;
            }
        }
        if(!exist) {
            nominations = nominations.concat(participants[i].nomination);
        }
        else exist = false;
    }

    //console.log(nominations);

    return <FinalStage
        expertData={props.expertData}
        compName={props.compName}
        participants={participants} 
        nominations={nominations} 
        pseudo={pseudo} 
        stageState={props.stageState}
        onConfirmVote={props.onConfirmVote}
        onExitClick={props.onExitClick}
    />;
}

// --------------------------------------функция, в которой объединяются созданные ранее компоненты и отрисовываются

function StagesView(props) {
    if(props.expertData.alreadyVoted) {
        return (
            <div className="Vote-tabs__body-content">
                <h2>Вы уже принимали участие в этом конкурсе!</h2>
            </div>
        )
    }

    const competition = props.competition;
    const pageShow = props.pageShow;
    const pseudo = props.pseudonim;
    const onChangePseudo = props.onChangePseudo;
    const stages = props.stages;

    for (var i = stages.length - 1; i >= 0; i--) {
        if (pageShow == 'Отборочный этап' && stages[i].stageName == 'Отборочный этап') {
            return <ViewFirstStage
                onExitClick={props.onExitClick}
                expertData={props.expertData}
                compName={competition.name} 
                participants={props.participants}
                pseudo={pseudo}
                onChangePseudo={onChangePseudo}
                stageState={stages[i]}
                onConfirmVote={props.onConfirmVote}
            />;
        }

        else if(pageShow == 'Финальный этап' && stages[i].stageName == 'Финальный этап') { 
            return <ViewSecondStage
                onExitClick={props.onExitClick}
                expertData={props.expertData}
                compName={competition.name} 
                participants={props.participants}
                pseudo={pseudo}
                onChangePseudo={onChangePseudo}
                stageState={stages[i]}
                onConfirmVote={props.onConfirmVote}
            />;
        }
    }

    return <ViewDescription comp={competition}/>;
}


class VotesPages extends React.Component {

    static get propTypes() {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        this.handleChangePseudo = this.handleChangePseudo.bind(this);
        this.handlePagesSelect = this.handlePagesSelect.bind(this);
    }

    componentWillMount() {
        const { cookies } = this.props;

        this.state = {
            pageShow: 'Описание',
            pseudonim: 'default',
            expertData: cookies.get('expertCook') || {}
        }
    }

    handleChangePseudo(e){
        this.setState({pseudonim: e.target.value})
    }
    
    handlePagesSelect(e) {
        "use strict"

        this.setState({pageShow: e})
    }

    render() {
        const comp = this.props.competition;
        const stages = this.props.stages;

        return (
            <div className="Vote-tabs">
                <div className="Vote-tabs__header-bg">
                    <div className="Vote-tabs__header">
                        <div className="Vote-tabs__header-h2">
                            <h2>ГОЛОСОВАНИЕ</h2>
                        </div>
                        <div className="Vote-tabs__header-stages">
                            <div 
                                onClick={this.handlePagesSelect.bind(null, 'Описание')} 
                                id="1" 
                                className={this.state.pageShow == 'Описание' ? 'Vote-tabs__header-stages__tabs activeT' : 'Vote-tabs__header-stages__tabs'}
                            >
                                Информация<br />о конкурсе
                            </div>
                            {   stages
                                ?
                                stages.map(stage => 
                                    <div 
                                        onClick={this.handlePagesSelect.bind(null, stage.stageName)} 
                                        key={stage._id}
                                        className={this.state.pageShow == stage.stageName ? 'Vote-tabs__header-stages__tabs activeT' : 'Vote-tabs__header-stages__tabs'}
                                    >
                                        {stage.stageName}
                                    </div>
                                )
                                :
                                <h2>Грузим</h2>
                            }
                        </div>
                    </div>
                </div>

                <div className="Vote-tabs__body">
                    <StagesView 
                        competition={comp} 
                        participants={this.props.participants}
                        expertData={this.state.expertData}

                        pageShow={this.state.pageShow}
                        pseudonim={this.state.pseudonim}
                        stages={stages}

                        onChangePseudo={this.handleChangePseudo}
                        onConfirmVote={this.props.onConfirmVote}
                        onExitClick={this.props.onExitClick}
                        
                    />
                </div>
            </div>
        )
    }
}

export default withCookies(VotesPages);