import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
	fio: { type: String, required: true },
	competition: { type: String },
	nomination: { type: String, required: true },
	work_name: { type: String, required: true },
	description: { type: String },
	preview: { type: String },
	confirmed: { type: Boolean, default: false },
	email: { type: String }
});

mongoose.model('participants', ParticipantSchema);