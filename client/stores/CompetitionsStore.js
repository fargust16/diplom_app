import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/vkr_Dispatcher';
import AppConstants from '../constants/vkr_Constants';

const CHANGE_EVENT = 'change';

let _competitions = [];
let _participants = [];
let _experts = [];
let _voteData = {};
let _voteResults = [];
let _loadingError = null;
let _isLoading = true;

function formatCompetition(comp) {
    return {
        id: comp._id,
        name: comp.name,
        description: comp.description,
        dateOfBegin: comp.dateOfBegin,
        daysToVote: comp.daysToVote,
        jury: comp.jury,
        nominates: comp.nominates,
        stages: comp.stages
    };
}

function formatParticipant(part) {
    return {
        id: part._id,
        fio: part.fio,
        competition: part.competition,
        nomination: part.nomination,
        work_name: part.work_name,
        description: part.description,
        preview: part.preview,
        confirmed: part.confirmed,
        email: part.email
    };
}

function formatExpert(expert) {
    return {
        id: expert._id,
        comp_id: expert.comp_id,
        fio: expert.fio,
        email: expert.email,
        dateOfRegister: expert.dateOfRegister,
        recConfirm: expert.recConfirm,
        confirmed: expert.confirmed,
        alreadyVoted: expert.alreadyVoted
    };
}

function formatVoteData(expert) {
    return {
        id: expert._id,
        cryptoKey: expert.cryptoKey,
        salt: expert.salt,
        alreadyVoted: expert.alreadyVoted
    };
}

function formatVoteResult(votesData) {
    return {
        id: votesData._id,
        experts: votesData.experts,
        marks: votesData.marks,
        points: votesData.points
    };
}

const TasksStore = Object.assign({}, EventEmitter.prototype, {
    isLoading() {
        return _isLoading;
    },

    getCompetitions() {
        return _competitions;
    },

    getParticipants() {
        return _participants;
    },

    getExperts() {
        return _experts;
    },

    getVoteData() {
        return _voteData;
    },

    getVoteResults() {
        return _voteResults;
    },

    getError() {
        return _loadingError;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function(action) {
    switch(action.type) {
        case AppConstants.LOAD_COMPETITIONS_REQUEST: {
            _isLoading = true;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.LOAD_COMPETITIONS_SUCCESS: {
            _isLoading = false;
            _competitions = action.competitions.map( formatCompetition );
            _loadingError = null;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.LOAD_PARTICIPANTS_SUCCESS: {
            _isLoading = false;
            _participants = action.participants.map( formatParticipant );
            _loadingError = null;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.LOAD_EXPERTS_SUCCESS: {
            _isLoading = false;
            _experts = action.experts.map( formatExpert );
            _loadingError = null;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.AUTH_EXPERT_SUCCESS: {
            _isLoading = false;
            _voteData = formatVoteData(action.expert);
            _loadingError = null;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.LOAD_VOTERESULTS_SUCCESS: {
            _isLoading = false;
            _voteResults = action.voteResults.map( formatVoteResult );
            _loadingError = null;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.LOAD_COMPETITIONS_FAIL: {
            _loadingError = action.error;

            TasksStore.emitChange();
            break;
        }

        default: {
            console.log('No such handler');
        }
    }
});

export default TasksStore;