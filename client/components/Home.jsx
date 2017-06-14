import React from 'react';

import './Home.less';

class Home extends React.Component {

	constructor(props) {
	    super(props);
	}

  	render() {
		return(
			<div className="Home">
				<h2>Главная страница сайта /</h2>
			</div>
		)
	}
}

export default Home;