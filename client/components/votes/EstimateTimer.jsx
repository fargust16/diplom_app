import React from 'react';
import { instanceOf } from 'prop-types';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';

import moment from 'moment';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

import './EstimateTimer.less';

class EstimateTimer extends React.Component {

    static get propTypes() {
        cookies: instanceOf(Cookies).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            eTime: ''
        }

        this.handleGetEstimateTime = this.handleGetEstimateTime.bind(this);
    }

    componentDidMount() {
        this.setInterval(
            () => { this.handleGetEstimateTime() },
            1000
        );
    }

    componentWillMount() {
        const { cookies } = this.props;

        this.state = {
            eTime: '',
            expierTime: cookies.get('expertCookTime') || false
        }
    }

    handleGetEstimateTime() {
        if(!this.state.expierTime) return;

        const eTime = this.state.expierTime;
        let currDate = new Date();
        currDate = new Date(currDate.toUTCString());
        currDate = moment(currDate);
        let eTimeTemp = moment(eTime);

        //console.log(eTimeTemp.format('LTS') + '\n' + currDate.format('LTS') + '\n' + moment(eTimeTemp.diff(currDate)).format('LTS'));

        let diffTime = eTimeTemp.diff(currDate);

        if(diffTime <= 1) this.props.onExitClick();
        else {
            this.setState({
                eTime: diffTime
            })
        }
    }

    render() {
        moment.locale('ru');
        let eTime = this.state.eTime;

        if(eTime != '')
            eTime = moment.utc(eTime);
        else 
            eTime = moment.utc(0);

        //console.log(this.state.expertData);

        return (
            <span className="Estimate">
                <span className="Estimate-intro">до завершения этапа осталось</span>
                <span className="Estimate-time">{eTime.format('LTS')}</span>
            </span> 
        )
    }
}

reactMixin(EstimateTimer.prototype, TimerMixin);

export default withCookies(EstimateTimer);