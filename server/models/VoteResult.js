import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const VoteResultSchema = new Schema({
	pseudonim: { type: String, required: true },
	compName: { type: String, required: true },
	stageName: { type: String, required: true },
	votes: [{ 
		workName: { type: String, required: true },
		nomination: { type: String },
		mark: { type: Number, default: 1},
		choosed: { type: Number, default: 0, min: 0, max: 1 }
	}]
});

mongoose.model('voteResults', VoteResultSchema);