import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ExpertSchema = new Schema({
	comp_id: { type: String, required: true },
	fio: { type: String, required: true },
	email: { type: String, lowercase: true },
	password: { type: String },
	dateOfRegister: { type: Date },
	recConfirm: { type: Boolean, default: false },
	confirmed: { type: Boolean, default: false },
	cryptoKey: { type: String },
	salt: { type: String },
	alreadyVoted: { type: Boolean, default: false }
});

mongoose.model('experts', ExpertSchema);