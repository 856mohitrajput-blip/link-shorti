import mongoose from 'mongoose';

const paypalDetailsSchema = new mongoose.Schema({
    email: { type: String, trim: true,},
}, { _id: false });

const upiDetailsSchema = new mongoose.Schema({
    id: { type: String, trim: true, }, 
}, { _id: false });

const bankDetailsSchema = new mongoose.Schema({
    bankName: { type: String, trim: true }, 
    accountNumber: { type: String, trim: true }, 
    ifscCode: { type: String, trim: true }, 
    accountHolderName: { type: String, trim: true }, 
}, { _id: false });

const withdrawalHistorySchema = new mongoose.Schema({
    withdrawalId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Complete', 'Cancelled', 'Returned'],
        default: 'Pending',
    },
    publisherEarnings: {
        type: Number,
        required: true,
    },
    referralEarnings: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    withdrawalMethod: {
        type: String,
        enum: ['PayPal', 'UPI', 'Bank Transfer'], 
        required: true,
    },
    withdrawalAccount: {
        type: String, 
        required: true,
    },
    methodDetails: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
    }
}, { _id: false });

const withdrawalSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    availableBalance: {
        type: Number,
        default: 0,
        min: 0,
    },
    pendingBalance: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalWithdrawn: {
        type: Number,
        default: 0,
        min: 0,
    },
    withdrawalDetails: {
        type: new mongoose.Schema({
            selectedMethod: {
                type: String,
                enum: ['PayPal', 'UPI', 'Bank Transfer', ''],
                default: '', 
            },
            paypal: { type: paypalDetailsSchema },
            upi: { type: upiDetailsSchema },
            bank: { type: bankDetailsSchema },
        }, { _id: false }), 
        default: () => ({})
    },
    history: [withdrawalHistorySchema],
}, { timestamps: true });

const Withdrawal = mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;