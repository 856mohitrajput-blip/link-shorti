import mongoose from 'mongoose';

const linksSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true, // ✅ LEGITIMATE: Each shortUrl must be globally unique
    },
    alias: {
        type: String,
        required: false,
        unique: true, // ✅ LEGITIMATE: Each alias must be globally unique when provided
        sparse: true, // Allows multiple null/undefined values (only enforces uniqueness for non-null)
    },
    clicks: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Compound index for efficient queries (not unique)
linksSchema.index({ userEmail: 1, createdAt: -1 });

const Links = mongoose.models.Links || mongoose.model('Links', linksSchema);

export default Links;