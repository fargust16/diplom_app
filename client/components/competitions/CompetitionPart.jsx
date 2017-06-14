import React from 'react';
import createReactClass from 'create-react-class';
import moment from 'moment'

import './Competition.less';

const CompetitionPart = createReactClass({

    handlePartAdd(){
        this.props.onPartUpsert(this.props.competition.id)
    },
    
	render(){
        moment.locale('ru');

        const comp = this.props.competition;
        const experts = this.props.experts;

        let expertsTemp = [];

        experts.map(jury => {
            if(jury.comp_id == comp.id){
                expertsTemp = expertsTemp.concat(jury)
            }
        });

		return(			
            <div className="Competition">
                <h4 className='Competition__name'>Название: {comp.name}</h4>
                <div className='Competition__desc'>Описание: {comp.description}</div>
                <hr/>
                <div className='Competition__dateOfBegin'>Дата начала голосования: {moment(comp.dateOfBegin).format('LL')}</div>
                <div className='Competition__dateOfEnd'>Дата завершения голосования: {moment(comp.dateOfBegin).add(comp.daysToVote, 'days').format('LL')}</div><br/>
                <div className='Competition__info'>
                    <fieldset className='Competition__nominates'><legend>Номинации конкурса</legend>
                    {comp.nominates.map((man, i) =>
                        <p key={i}>
                            {man}
                        </p>
                    )}
                    </fieldset>

                    <fieldset className='Competition__jury'><legend>Приглашенные эксперты</legend>
                    {expertsTemp.map(jurysman => 
                        <p key={jurysman.id}>
                            {jurysman.fio}
                        </p>
                    )}
                    </fieldset>
                </div>
                <div className='Competition__stages'>{comp.stages > 1 ? 'Голосование пройдёт в два этапа' : 'Голосование пройдёт в один этап'}</div>
                <div className='Competition__footer'>
                    <button
                        className="Competition__footer-button"
                        onClick={this.handlePartAdd}
                        title='Подать заявку'
                    >
                    Подать заявку
                    </button>
                </div>
            </div>
		)
	}
});

export default CompetitionPart;