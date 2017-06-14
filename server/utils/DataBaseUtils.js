import mongoose from 'mongoose';
import pswd from 'password-generator';

import config from '../../etc/config.json';

import '../models/Competitions';
import '../models/Participants';
import '../models/Experts';
import '../models/VoteResult';

const Competition = mongoose.model('competitions');
const Participant = mongoose.model('participants');
const Expert = mongoose.model('experts');
const VoteResult = mongoose.model('voteResults');

export function setUpConnection(){
	mongoose.Promise = global.Promise;
	mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
}

//-------------------- queries for competitions

export function listOfComp(){
	return Competition.find();
}

export function addComp(data){

	const conditions = { _id: data.id }
	  , update = {
	  				$set: {
						name: data.name,
						description: data.desc,
						dateOfBegin: data.dateOfBegin,
						daysToVote: data.daysToVote,
						nominates: data.nominates,
						jury: data.jury,
						stages: data.stages
					}
				}
	  , options = { upsert: true, setDefaultsOnInsert: true };

	Competition.update(conditions, update, options, function(err, numAffected){
	    //console.log(numAffected); // numAffected is the number of updated documents (write a function then error)
	});

	return Competition.find();
}

export function startVote(comp_id, stageStart){

	/*const conditionsC = { _id: comp_id }
	  , updateC = {
	  				$set: {
						stages: stageStart
					}
				}
	  , optionsC = { upsert: false, setDefaultsOnInsert: true };

	Competition.update(conditionsC, updateC, optionsC, function(err, numAffected){
	    //console.log(numAffected); // numAffected is the number of updated documents (write a function then error)
	});*/

	Competition.findOne({ _id: comp_id }, function (err, doc){
		for (let i = doc.stages.length - 1; i >= 0; i--) {
			//console.log(doc.stages[i].stageName == stageStart.stageName);
			if(doc.stages[i].stageName == stageStart.stageName){
				doc.stages[i].endVote = stageStart.endVote || false;
				doc.stages[i].startVote = stageStart.startVote || false;
				doc.save();
			}
		}
	});

	const conditionsE = { comp_id: comp_id }
	  , updateE = {
	  				$set: {
						alreadyVoted: false
					}
				}
	  , optionsE = { upsert: false, setDefaultsOnInsert: true, multi: true };

	Expert.update(conditionsE, updateE, optionsE, function(err, numAffected){
	    //console.log(numAffected); // numAffected is the number of updated documents (write a function then error)
	});

	return Competition.find();
}

export function deleteComp(comp_id) {
	return Competition.findById(comp_id).remove();
}


// ----------------- queries for participants

export function listOfPart(){
	return Participant.find();
}

export function addPart(data){

	const conditions = { _id: data.id }
	  , update = {
	  				$set: {
						fio: data.fio,
						competition: data.competition,
						nomination: data.nomination,
						work_name: data.work_name,
						description: data.desc,
						preview: data.preview,
						email: data.email
					}
				}
	  , options = { upsert: true, setDefaultsOnInsert: true };

	Participant.update(conditions, update, options, function(err, numAffected){
	    //console.log(numAffected); // numAffected is the number of updated documents (write a function then error)
	});

	return Participant.find();
}

export function confirmedPart(part_id){

	const conditions = { _id: part_id }
	  , update = {
	  				$set: {
						confirmed: true
					}
				}
	  , options = { upsert: true, setDefaultsOnInsert: true };

	Participant.update(conditions, update, options, function(err, numAffected){
	    //console.log(numAffected, 'part_id: ', part_id); // numAffected is the number of updated documents (write a function then error)
	});

	return Participant.find();
}

export function deletePart(part_id) {
	return Participant.findById(part_id).remove();
}

// ---------------------------------- queries for experts

export function listOfExperts(){
	return Expert.find();
}

export function authExpert(data){
	return Expert.findOne({'email': data.login, 'password': data.pswd}, function(err, numAffected){
	    //console.log(numAffected);
	    if(numAffected == null) return err;// numAffected is the number of updated documents (write a function then error)
	});
}

export function addExpert(data){

	const conditions = { _id: data.id }
	  , update = {
	  				$set: {
	  					comp_id: data.comp_id,
						fio: data.fio,
						dateOfRegister: new Date(),
						stagesVoted: data.stagesVoted,
						email: data.email,
						confirmed: false,
						recConfirm: false,
						password: pswd(12, false, /\w/)
					}
				}
	  , options = { upsert: true, setDefaultsOnInsert: true };

	Expert.update(conditions, update, options, function(err, numAffected){
	    //console.log(numAffected); // numAffected is the number of updated documents (write a function then error)
	});

	return Expert.find();
}

export function requestConfirm(expert_id){

	const conditions = { _id: expert_id }
	  , update = {
	  				$set: {
						recConfirm: true
					}
				}
	  , options = { upsert: false, setDefaultsOnInsert: true };

	Expert.update(conditions, update, options, function(err, numAffected){
	    //console.log(numAffected, 'expert_id: ', expert_id); // numAffected is the number of updated documents (write a function then error)
	});

	return Expert.find();
}

//----------------------------вызывать функцию только после перехода по ссылке из подтвердительного письма отправленного на почту
export function confirmExpert(expert_id){

	const conditions = { _id: expert_id }
	  , update = {
	  				$set: {
						confirmed: true
					}
				}
	  , options = { upsert: false, setDefaultsOnInsert: true };

	Expert.update(conditions, update, options, function(err, numAffected){
	    //console.log(numAffected, 'expert_id: ', expert_id); // numAffected is the number of updated documents (write a function then error)
	});

	return Expert.find();
}

export function deleteExpert(expert_id) {
	return Expert.findById(expert_id).remove();
}


// ---------------------------------- queries for votes

export function listOfVoteResult(){

	const aggregatorOpts = [{
	        $unwind: "$votes"
	    },
	    {
	        $group: {
	            _id: { compName: "$compName", stage: "$stageName", nomination: "$votes.nomination", workName: "$votes.workName" },
	            experts: { $push: "$pseudonim" },
	            marks: { $push: "$votes.mark" },
           		points: { $push: '$votes.choosed' }
	        }
	    }
	]

	return VoteResult.aggregate(aggregatorOpts).exec(function(err, numAffected){
	    //console.log(numAffected); // numAffected is the number of updated documents (write a function then error)
	});
}

export function confirmVote(data){
	console.log(data.expertID)

	const conditions = { _id: data.expertID }
	  , update = {
	  				$set: {
						alreadyVoted: true
					}
				}
	  , options = { upsert: false, setDefaultsOnInsert: true };

	Expert.update(conditions, update, options, function(err, numAffected){
	    //console.log(numAffected, 'expertID: ' + data.expertID); // numAffected is the number of updated documents (write a function then error)
	});

	const vote = new VoteResult({
		pseudonim: data.pseudonim,
		compName: data.compName,
		stageName: data.stageName,
		votes: data.votes
	});

	return vote.save();
}

/*

const aggregatorOpts = [{
	        $unwind: "$votes"
	    },
	    {
	        $group: {
	            _id: { compName: "$compName", stage: "$stageName", nomination: "$votes.nomination", workName: "$votes.workName" },
	            experts: { $push: "$pseudonim" },
	            marks: { $push: "$votes.mark" },
           		points: { $push: '$votes.choosed' }
	        }
	    }
	]

*/