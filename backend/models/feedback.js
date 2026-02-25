import mongoose from 'mongoose';


const feedbackSchema = new mongoose.Schema(
{
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
vote: { type: String, enum: ['up', 'down'], required: true },
note: String
},
{ timestamps: true }
);


export default mongoose.model('Feedback', feedbackSchema);