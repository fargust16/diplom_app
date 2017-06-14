import React from 'react';
import Header from './Header.jsx'

import './App.less';

class App extends React.Component {

  	render() {
		return(
			<div className="App">
				<Header />
		        {/* добавили вывод потомков */}
		        {this.props.children}
			</div>
		)
	}
}

export default App;