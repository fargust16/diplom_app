import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CompetitionSchema = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String },
	dateOfBegin: { type: Date, required: true },
	daysToVote: { type: Number, min: 2, max: 14, default: 7 },
	jury: { type: [String] },
	nominates: { type: [String] },
	stages: [{
		stageName: { type: String },
		startVote: { type: Boolean, default: false },
		endVote: { type: Boolean, default: false }
	}]
});

mongoose.model('competitions', CompetitionSchema);