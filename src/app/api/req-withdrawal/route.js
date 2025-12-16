import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig'; 
import Withdrawal from '@/models/Withdrawal';

export async function POST(request) {
    try {
        await connectDB();

        const { userEmail, amount } = await request.json(); 

        if (!userEmail || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }
        
        const MIN_WITHDRAWAL = 5.00;

        const withdrawalDoc = await Withdrawal.findOne({ userEmail });

        if (!withdrawalDoc) {
            return NextResponse.json({ error: 'Withdrawal account not found' }, { status: 404 });
        }
        
        const details = withdrawalDoc.withdrawalDetails;
        const method = details?.selectedMethod;
        let accountSummary = null;
        let methodDetails = {};

        if (!method) {
            return NextResponse.json({ error: 'No withdrawal method selected' }, { status: 400 });
        }

        let detailsKey = method.toLowerCase().replace(' ', '');
        if (method === 'Bank Transfer') {
            detailsKey = 'bank';
        }
        const detailsData = details[detailsKey];
        if (!detailsData) {
             return NextResponse.json({ error: `Details for ${method} not saved` }, { status: 400 });
        }

        switch (method) {
            case 'PayPal':
                methodDetails = detailsData;
                accountSummary = detailsData.email;
                if (!accountSummary) return NextResponse.json({ error: 'PayPal email not set' }, { status: 400 });
                break;
            case 'UPI':
                methodDetails = detailsData;
                accountSummary = detailsData.id;
                if (!accountSummary) return NextResponse.json({ error: 'UPI ID not set' }, { status: 400 });
                break;
            case 'Bank Transfer':
                methodDetails = detailsData;
                accountSummary = detailsData.accountNumber;
                if (!accountSummary || !detailsData.ifscCode || !detailsData.accountHolderName || !detailsData.bankName) {
                    return NextResponse.json({ error: 'Full bank details not set' }, { status: 400 });
                }
                break;
            default:
                return NextResponse.json({ error: 'Unsupported withdrawal method' }, { status: 400 });
        }

        if (withdrawalDoc.availableBalance < MIN_WITHDRAWAL || withdrawalDoc.availableBalance < amount) {
            return NextResponse.json({ 
                error: `Insufficient available balance for withdrawal. Required: ${MIN_WITHDRAWAL}`, 
                available: withdrawalDoc.availableBalance 
            }, { status: 403 });
        }
        
        const withdrawalAmount = withdrawalDoc.availableBalance; 

        const newHistoryItem = {
            withdrawalId: `WID-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date(),
            status: 'Pending',
            publisherEarnings: withdrawalAmount,
            referralEarnings: 0,
            totalAmount: withdrawalAmount,
            withdrawalMethod: method, 
            withdrawalAccount: accountSummary,
            methodDetails: methodDetails,
        };

        withdrawalDoc.availableBalance -= withdrawalAmount;
        withdrawalDoc.pendingBalance += withdrawalAmount;
        withdrawalDoc.history.unshift(newHistoryItem);

        // Mark the history array as modified to ensure Mongoose saves it
        withdrawalDoc.markModified('history');
        
        const savedDoc = await withdrawalDoc.save();
        
        console.log('Withdrawal saved:', {
            userEmail,
            historyLength: savedDoc.history.length,
            pendingBalance: savedDoc.pendingBalance
        });

        return NextResponse.json({ 
            message: 'Withdrawal request submitted successfully.', 
            updatedWithdrawal: savedDoc 
        }, { status: 201 });

    } catch (error) {
        console.error('Error processing withdrawal request:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}