import React from 'react';

import './PreviewWork.less';

class PreviewWork extends React.Component {

	constructor(props) {
	    super(props);
	}


  	render() {
        const work = this.props.work;

        let marks = null;

		return(
            <div className="PreviewWork">
                <div className="PreviewWork__nav">
                    <span className="PreviewWork__nav-right">❯</span>
                    <span className="PreviewWork__nav-left">❮</span>
                </div>
                <div className="PreviewWork__work">
                    <span className="PreviewWork__work-btnClose">x</span>
                    <img className="PreviewWork__work-img" src={'../../../images/'+work.path}/>
                    <div className="PreviewWork__work-info">
                        <h2>{work.name}</h2>
                        <span>{work.desc}</span>
                    </div>
                    <div className="PreviewWork__work-marks">
                        {marks}
                    </div>
                </div>
            </div>
		)
	}
}

export default PreviewWork;