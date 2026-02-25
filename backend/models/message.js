import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        question: String,
        answer: String,
        contextDocs: [
            {
                _id: false,
                id: String,
                title: String,
                score: Number
            }
        ]
    },
    { timestamps: true }
);


export default mongoose.model('Message', messageSchema);