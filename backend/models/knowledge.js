// server/models/Knowledge.js
import mongoose from "mongoose";

const KnowledgeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// For basic text search in RAG
KnowledgeSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.model("Knowledge", KnowledgeSchema);
