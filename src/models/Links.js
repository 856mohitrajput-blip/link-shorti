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
        unique: true,
    },
    alias: {
        type: String,
        required: true,
        unique: true,  
    },
    clicks: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

linksSchema.index({ userEmail: 1, createdAt: -1 });

const Links = mongoose.models.Links || mongoose.model('Links', linksSchema);

export default Links;