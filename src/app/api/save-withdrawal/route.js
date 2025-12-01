import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Withdrawal from '@/models/Withdrawal';

export async function PUT(request) { 
    try {
        await connectDB();

        const { userEmail, details } = await request.json();

        if (!userEmail || !details) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        // First check if document exists
        let withdrawalDoc = await Withdrawal.findOne({ userEmail });

        if (withdrawalDoc) {
            // Update only withdrawalDetails, preserve other fields
            withdrawalDoc.withdrawalDetails = details;
            await withdrawalDoc.save();
        } else {
            // Create new document if doesn't exist
            withdrawalDoc = await Withdrawal.create({
                userEmail,
                withdrawalDetails: details,
                availableBalance: 0,
                pendingBalance: 0,
                totalWithdrawn: 0,
                history: []
            });
        }

        return NextResponse.json({ 
            message: 'Withdrawal details updated successfully.', 
            updatedWithdrawal: withdrawalDoc 
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating withdrawal details:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}