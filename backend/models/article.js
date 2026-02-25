import mongoose from 'mongoose';


const articleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        tags: [String],
        lang: { type: String, default: 'en' }
    },
    { timestamps: true }
);


articleSchema.index({ title: 'text', body: 'text', tags: 1 });


export default mongoose.model('Article', articleSchema);