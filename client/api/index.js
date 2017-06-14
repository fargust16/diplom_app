import axios from 'axios';

import { apiPrefix } from '../../etc/config.json';

export default {
    listOfComp() {
        return axios.get(`${apiPrefix}/competitions`);
    },

    addComp(data) {
        return axios.post(`${apiPrefix}/competitions`, data);
    },

    startVote(comp_id, stageStart) {
        return axios.post(`${apiPrefix}/competitions/start${comp_id}`, stageStart);
    },

    deleteComp(comp_id) {
        return axios.delete(`${apiPrefix}/competitions/${comp_id}`);
    },

    listOfPart() {
        return axios.get(`${apiPrefix}/participants`);
    },

    addPart(data) {
        return axios.post(`${apiPrefix}/participants`, data);
    },

    confirmedPart(part_id) {
        return axios.post(`${apiPrefix}/participants/${part_id}`);
    },

    deletePart(part_id) {
        return axios.delete(`${apiPrefix}/participants/${part_id}`);
    },

    listOfExperts() {
        return axios.get(`${apiPrefix}/experts`);
    },

    authExpert(auth_data) {
        return axios.post(`${apiPrefix}/experts/auth`, auth_data);
    },

    addExpert(data) {
        return axios.post(`${apiPrefix}/experts`, data);
    },

    requestConfirm(expert_id) {
        return axios.post(`${apiPrefix}/experts/rec${expert_id}`);
    },

    confirmExpert(expert_id) {
        return axios.post(`${apiPrefix}/experts/conf${expert_id}`);
    },

    deleteExpert(expert_id) {
        return axios.delete(`${apiPrefix}/experts/${expert_id}`);
    },

    listOfVoteResults() {
        return axios.get(`${apiPrefix}/voteResults`);
    },

    confirmVote(data) {
        return axios.post(`${apiPrefix}/voteResults`, data);
    }
}