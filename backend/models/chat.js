import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role:    { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
}, { timestamps: true, _id: false });


const chatSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title:  { type: String, default: 'New Chat' },
        messages: { type: [messageSchema], default: [] },
        // Snapshot of farmerProfile at chat creation time
        context: {
            language:   String,
            farmerName: String,
            country:    String,
            state:      String,
            crop:       String,
            soilType:   String,
            irrigation: String,
            experience: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);
