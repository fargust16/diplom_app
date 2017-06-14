import React from 'react';

import './PartWork.less';

class PartWork extends React.Component {

	constructor(props) {
	    super(props);

	    this.handleChangeMark = this.handleChangeMark.bind(this);
	}

	handleChangeMark(part, e) {
		this.props.onMarkChange(part.id, e.target.id, part.nomination);
	}

  	render() {
  		const part = this.props.participant;
  		const marks = this.props.marks;

  		let partMark = '';

  		for (let i = marks.length - 1; i >= 0; i--) {
  			if(marks[i].partID == part.id)
  				partMark = marks[i].mark;
  		}

	    let marksPivot = [];
	    for (let i = 5; i >= 1; i--) {
	        marksPivot[i] = <span key={i} className={i <= partMark ? "marksPivot painted" : "marksPivot"} id={i} onClick={this.handleChangeMark.bind(this, part)}>{i}</span>;
	    }

		return(
            <div className="FinalStage__content-works__work">
                <img 
                  src={'../../../images/'+part.preview} 
                  className="FinalStage__content-works__work-img"
                  onClick={this.props.openPreview.bind(null, {state: true, workID: part.id})}
                />
                    <div className="FinalStage__content-works__work-desc">
                        <h2>{part.work_name}</h2>
                        <span>{part.description}</span>
                    </div>
                
                <div className="FinalStage__content-works__work-mark">
                    {marksPivot}
                </div>
            </div>
		)
	}
}

export default PartWork;