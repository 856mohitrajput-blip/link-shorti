import mongoose from 'mongoose';

const statisticsSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true, // ✅ LEGITIMATE: One statistics record per user
    },
    totalImpressions: {
        type: Number,
        default: 0,
    },
    totalProperViews: {
        type: Number,
        default: 0,
    },
    totalEarnings: {
        type: Number,
        default: 0,
    },
    averageCPM: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Statistics = mongoose.models.Statistics || mongoose.model('Statistics', statisticsSchema);

export default Statistics;