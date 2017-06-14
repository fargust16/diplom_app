import React from 'react';

import moment from 'moment';

import './CompDescription.less';

class CompDescription extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	mark: 0
	    }

	    this.handleChangeMark = this.handleChangeMark.bind(this);
	}

	handleChangeMark(e) {
		this.setState({mark: e.target.id})
	}

  	render() {
        moment.locale('ru');
  		const comp = this.props.competition;

		return(
            <div className="CompDescription">
                <div className="CompDescription__content">
                    <h2 className="CompDescription__content_h2">{comp.name}</h2>
                    <div className="CompDescription__content-header">
                        <h2 className="CompDescription__content-header_h2">Описание</h2>
                        <span className="CompDescription__content-header_desc">{comp.description}</span>
                    </div>
                    <div className="CompDescription__content-nominates">
                        <h2 className="CompDescription__content-nominate_h2">Номинации</h2>
                        <div className="CompDescription__content-nominates_cont">
                            <div className="CompDescription__content-nominates_cont-nom">
                                {comp.nominates.map((nom, i) => 
                                    <span key={i}>{nom}<br /></span> 
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="CompDescription__content-stages">
                        <h2 className="CompDescription__content-stages_h2">Голосование пройдёт в <br /> {comp.stages == 1 ? '1 этап' : '2 этапа'}</h2>
                        <span className="CompDescription__content-stages_data">{moment(comp.dateOfBegin).format('LL')} - {moment(comp.dateOfBegin).add(comp.daysToVote, 'days').format('LL')}</span>
                    </div>
                </div>                    
            </div>
		)
	}
}

export default CompDescription;